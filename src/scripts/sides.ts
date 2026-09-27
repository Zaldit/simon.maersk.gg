/**
 * Side tabs on the opened record (frame 1e). State: record.side.
 * Without JS the tabs are links to each side's page. With JS they become an
 * ARIA tablist: switching swaps the panel, relabels the disc and its runout
 * etching, and keeps the URL in step so reloads and shares land on that side.
 */
const root = document.querySelector<HTMLElement>('[data-sides]');
const list = root?.querySelector<HTMLElement>('[data-tablist]');

if (root && list) {
  const tabs = [...list.querySelectorAll<HTMLAnchorElement>('a[data-tab]')];
  const panels = new Map(
    [...root.querySelectorAll<HTMLElement>('[data-panel]')].map((p) => [p.dataset.panel!, p] as const),
  );
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const etchBase = root.dataset.etchBase ?? '';

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
    root.querySelectorAll('[data-label-side]').forEach((el) => (el.textContent = side));
    root.querySelectorAll('[data-label-count]').forEach((el) => (el.textContent = tab.dataset.count ?? ''));
    const etch = `${etchBase} · side ${side} ·`;
    root.querySelectorAll('[data-etch]').forEach((el) => (el.textContent = `${etch} ${etch}`));
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
