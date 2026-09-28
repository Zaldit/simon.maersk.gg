/**
 * Side tabs on the opened record (frame 1e). State: record.side.
 * Without JS the tabs are links to each side's page. With JS they become an
 * ARIA tablist: switching swaps the panel, keeps the URL in step so reloads
 * and shares land on that side, and shows the side on the disc:
 *   - same disc (A↔B): the disc turns over on its Y axis, re-pressed edge-on
 *   - other disc of a double (A/B↔C/D): it slides off the sleeve, goes in
 *     through the opening, and the other disc comes out and is laid back down
 * Under reduced motion the disc is re-pressed in place.
 */
import { gapRadii } from '../lib/disc';

const SVG = 'http://www.w3.org/2000/svg';
const EASE_IN = 'cubic-bezier(0.5, 0, 0.9, 0.4)';
const EASE_IN_OUT = 'cubic-bezier(0.45, 0, 0.55, 1)';
const EASE_LIFT = 'cubic-bezier(0.2, 0.7, 0.2, 1)';

const root = document.querySelector<HTMLElement>('[data-sides]');
const list = root?.querySelector<HTMLElement>('[data-tablist]');

if (root && list) {
  const tabs = [...list.querySelectorAll<HTMLAnchorElement>('a[data-tab]')];
  const panels = new Map(
    [...root.querySelectorAll<HTMLElement>('[data-panel]')].map((p) => [p.dataset.panel!, p] as const),
  );
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const etchBase = root.dataset.etchBase ?? '';
  const deck = root.querySelector<HTMLElement>('[data-deck-disc]');
  const disc = deck?.querySelector<HTMLElement>(':scope > .disc');
  const gapRings = disc?.querySelector('[data-gaps]');

  list.setAttribute('role', 'tablist');
  tabs.forEach((tab) => {
    const side = tab.dataset.tab!;
    const panel = panels.get(side);
    tab.id = `tab-${side.toLowerCase()}`;
    tab.setAttribute('role', 'tab');
    tab.removeAttribute('aria-current');
    if (panel) {
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = -1;
    }
  });

  /** What's pressed into the disc for a side: label, runout etching and track-gap rings. */
  const press = (tab: HTMLAnchorElement) => {
    const side = tab.dataset.tab!;
    root.querySelectorAll('[data-label-side]').forEach((el) => (el.textContent = side));
    root.querySelectorAll('[data-label-count]').forEach((el) => (el.textContent = tab.dataset.count ?? ''));
    const etch = `${etchBase} · side ${side} ·`;
    root.querySelectorAll('[data-etch]').forEach((el) => (el.textContent = `${etch} ${etch}`));
    gapRings?.replaceChildren(
      ...gapRadii(Number(tab.dataset.tracks)).map((r) => {
        const c = document.createElementNS(SVG, 'circle');
        c.setAttribute('cx', '100');
        c.setAttribute('cy', '100');
        c.setAttribute('r', String(r));
        return c;
      }),
    );
  };

  /**
   * Behind the sleeve, the sleeve's front hides whatever part of the disc is
   * inside it. At rest the disc lies on top, over the sleeve's opening.
   */
  const inSleeve = (on: boolean) => deck?.classList.toggle('is-in-sleeve', on);

  type Step = { to: [string, string]; ms: number; easing: string; then?: () => void };
  const p = 'perspective(1400px)';
  const flipSteps = (dir: number, to: HTMLAnchorElement): Step[] => [
    { to: [`${p} rotateY(0deg)`, `${p} rotateY(${90 * dir}deg) scale(1.04)`], ms: 200, easing: EASE_IN, then: () => press(to) },
    { to: [`${p} rotateY(${-90 * dir}deg) scale(1.04)`, `${p} rotateY(0deg)`], ms: 260, easing: EASE_LIFT },
  ];
  // The disc is 560 wide and overlaps the sleeve by 140: +25% clears the
  // opening, -75% is all the way in.
  // A brief hold with the sleeve empty-looking reads as reaching for the other disc.
  const swapSteps = (to: HTMLAnchorElement): Step[] => [
    { to: ['translateX(0)', 'translateX(25%)'], ms: 280, easing: EASE_IN_OUT, then: () => inSleeve(true) },
    { to: ['translateX(25%)', 'translateX(-75%)'], ms: 520, easing: EASE_IN_OUT, then: () => press(to) },
    { to: ['translateX(-75%)', 'translateX(-75%)'], ms: 160, easing: 'linear' },
    { to: ['translateX(-75%)', 'translateX(25%)'], ms: 680, easing: EASE_LIFT, then: () => inSleeve(false) },
    { to: ['translateX(25%)', 'translateX(0)'], ms: 360, easing: EASE_IN_OUT },
  ];

  // Each step holds its end frame until the next takes over. A newer switch
  // cancels an older one mid-way, so only the latest one presses.
  let shown: HTMLAnchorElement | undefined;
  let turn = 0;
  const showOnDisc = async (from: HTMLAnchorElement | undefined, to: HTMLAnchorElement) => {
    const id = ++turn;
    disc?.getAnimations().forEach((a) => a.cancel());
    inSleeve(false);
    if (!disc || !from || from === to || reduced.matches) return press(to);

    const dir = tabs.indexOf(to) > tabs.indexOf(from) ? 1 : -1;
    const steps = from.dataset.disc === to.dataset.disc ? flipSteps(dir, to) : swapSteps(to);
    for (const step of steps) {
      const a = disc.animate(
        step.to.map((transform) => ({ transform })),
        { duration: step.ms, easing: step.easing, fill: 'forwards' },
      );
      try {
        await a.finished;
      } catch {
        return; // cancelled by a newer switch
      }
      if (id !== turn) return;
      disc.getAnimations().forEach((b) => b !== a && b.cancel());
      step.then?.();
    }
    // The last frame is the resting one, so letting go doesn't jump.
    disc.getAnimations().forEach((a) => a.cancel());
  };

  const select = (tab: HTMLAnchorElement, { focus = false, push = true } = {}) => {
    const side = tab.dataset.tab!;
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((panel, key) => {
      const was = panel.hidden;
      panel.hidden = key !== side;
      if (!panel.hidden && was && !reduced.matches) {
        panel.classList.remove('is-entering');
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }
    });
    showOnDisc(shown, tab);
    shown = tab;
    const h1 = panels.get(side)?.querySelector('h1');
    if (h1) document.title = document.title.replace(/^[^—]+—/, `${h1.textContent} —`);
    if (push && location.pathname !== new URL(tab.href).pathname) history.replaceState(null, '', tab.href);
    if (focus) tab.focus();
  };

  const current = tabs.find((t) => t.classList.contains('is-active')) ?? tabs[0];
  if (current) select(current, { push: false });

  list.addEventListener('click', (e) => {
    const tab = (e.target as Element).closest<HTMLAnchorElement>('a[data-tab]');
    if (!tab || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    select(tab);
  });

  list.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement as HTMLAnchorElement);
    if (i < 0) return;
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(tabs[(next + tabs.length) % tabs.length]!, { focus: true });
  });
}

export {};
