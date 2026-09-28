/**
 * Crate interactions (frames 1b, 1i).
 *
 * State: crate.pulledId (the entry pulled forward) and crate.section (derived
 * from it). Desktop and mobile crates share one state so resizing keeps the
 * same record pulled.
 *
 * - Click a record: pull it forward. Click the pulled record (or "Open"): go to it.
 * - Divider tabs: jump to the first record of that section.
 * - Left/Right keys and mouse drag flip through the crate; swipe on mobile.
 * - Keyboard focus follows the pulled record (roving tabindex); Enter opens it.
 */
import { crateOffsets, crateMargins } from '../lib/crate';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Listener = (pulled: number, opts: { focus: boolean }) => void;

const store = {
  pulled: -1,
  listeners: [] as Listener[],
  set(pulled: number, opts: { focus: boolean } = { focus: false }) {
    if (pulled === this.pulled && !opts.focus) return;
    this.pulled = pulled;
    this.listeners.forEach((l) => l(pulled, opts));
  },
};

let entryCount = 0;
const clampEntry = (i: number) => Math.max(0, Math.min(entryCount - 1, i));

/** Suppress the click that ends a drag or swipe. */
let suppressClickUntil = 0;
document.addEventListener(
  'click',
  (e) => {
    if (Date.now() < suppressClickUntil && (e.target as Element).closest('[data-crate], [data-mcrate]')) {
      e.preventDefault();
      e.stopPropagation();
    }
  },
  true,
);

// ---------------------------------------------------------------- desktop

function initDesktop(root: HTMLElement) {
  const row = root.querySelector<HTMLElement>('[data-crate-row]')!;
  const items = [...row.children] as HTMLElement[];
  const widths = items.map((el) => Number(el.dataset.w));
  const rowIndexOf = new Map<number, number>();
  items.forEach((el, i) => {
    if (el.dataset.entry !== undefined) rowIndexOf.set(Number(el.dataset.entry), i);
  });
  const caption = root.querySelector<HTMLElement>('[data-crate-caption]')!;
  const capCat = caption.querySelector<HTMLElement>('[data-cap-cat]');
  const capText = caption.querySelector<HTMLElement>('[data-cap-text]')!;
  const capOpen = caption.querySelector<HTMLAnchorElement>('[data-cap-open]')!;
  const capSr = caption.querySelector<HTMLElement>('[data-cap-sr]')!;
  const ROW_LEFT = 24;

  function layout(pulled: number) {
    const p = rowIndexOf.get(pulled) ?? 0;
    const margins = crateMargins(widths, p);
    const xs = crateOffsets(widths, p);
    items.forEach((el, i) => {
      el.style.setProperty('--ml', `${margins[i]}px`);
      el.classList.toggle('is-pulled', i === p);
    });
    // Keep the pulled record and its caption inside the crate.
    const view = root.clientWidth;
    const x = ROW_LEFT + xs[p]!;
    const need = Math.max(x + widths[p]!, x + caption.offsetWidth) + ROW_LEFT;
    const shift = Math.min(0, view - need);
    row.style.setProperty('--shift', `${shift}px`);
    root.style.setProperty('--cap-x', `${x + shift}px`);
  }

  function render(pulled: number, { focus }: { focus: boolean }) {
    const el = items[rowIndexOf.get(pulled) ?? 0]!;
    const { name = '', meta = '', href = '#', cat = '' } = el.dataset;
    if (capCat) {
      capCat.textContent = cat;
      capCat.hidden = !cat;
    }
    capText.textContent = `${name} · ${meta}`;
    capOpen.href = href;
    capSr.textContent = ` ${name}`;
    items.forEach((it) => {
      const link = it.querySelector<HTMLAnchorElement>('a');
      if (link) link.tabIndex = it === el ? 0 : -1;
    });
    layout(pulled);
    if (focus && root.offsetParent !== null) el.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
  }
  store.listeners.push(render);

  const entryOf = (el: Element | null) => {
    const item = el?.closest<HTMLElement>('.crate-item');
    return item ? Number(item.dataset.entry) : undefined;
  };

  row.addEventListener('click', (e) => {
    const target = e.target as Element;
    const jump = target.closest<HTMLElement>('[data-jump]');
    if (jump) {
      const first = items.find((it) => it.dataset.entry !== undefined && it.dataset.section === jump.dataset.jump);
      if (first) store.set(Number(first.dataset.entry));
      return;
    }
    const i = entryOf(target);
    // Keyboard activation (detail 0) opens; a pointer click pulls first.
    if (i !== undefined && i !== store.pulled && (e as MouseEvent).detail > 0) {
      e.preventDefault();
      store.set(i);
    }
  });

  // Keyboard focus pulls the record; mouse focus is left to the click handler.
  row.addEventListener('focusin', (e) => {
    const target = e.target as Element;
    if (!target.matches(':focus-visible')) return;
    const i = entryOf(target);
    if (i !== undefined && i !== store.pulled) store.set(i);
  });

  root.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (step !== undefined) {
      e.preventDefault();
      store.set(clampEntry(store.pulled + step), { focus: true });
    } else if (e.key === 'Home' || e.key === 'End') {
      if (!(e.target as Element).closest('.crate-item')) return;
      e.preventDefault();
      store.set(e.key === 'Home' ? 0 : entryCount - 1, { focus: true });
    }
  });

  // Drag to flip: every 60px of horizontal travel flips one record.
  let startX: number | null = null;
  let dragged = false;
  root.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    startX = e.clientX;
    dragged = false;
  });
  window.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) < 60) return;
    dragged = true;
    root.classList.add('is-dragging');
    store.set(clampEntry(store.pulled + (dx < 0 ? 1 : -1)));
    startX = e.clientX;
  });
  window.addEventListener('pointerup', () => {
    if (dragged) suppressClickUntil = Date.now() + 50;
    startX = null;
    dragged = false;
    root.classList.remove('is-dragging');
  });
  root.addEventListener('dragstart', (e) => e.preventDefault());

  new ResizeObserver(() => layout(store.pulled)).observe(root);
}

// ---------------------------------------------------------------- mobile

function initMobile(root: HTMLElement) {
  const stack = root.querySelector<HTMLElement>('[data-mcrate-stack]')!;
  const items = [...stack.querySelectorAll<HTMLElement>('.mitem')];
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-jump]')];
  const capName = root.querySelector<HTMLElement>('[data-cap-name]')!;
  const capMeta = root.querySelector<HTMLElement>('[data-cap-meta]')!;
  const capOpen = root.querySelector<HTMLAnchorElement>('[data-cap-open]')!;
  const capSr = root.querySelector<HTMLElement>('[data-cap-sr]')!;

  function render(pulled: number, { focus }: { focus: boolean }) {
    const current = items[pulled]!;
    const section = current.dataset.section;
    items.forEach((el, i) => {
      const d = pulled - i;
      const next =
        i === pulled ? 'pulled' : el.dataset.section === section && d >= 1 && d <= 3 ? `behind-${d}` : 'hidden';
      const was = el.dataset.state;
      el.dataset.state = next;
      el.querySelector('a')!.tabIndex = i === pulled ? 0 : -1;
      if (next === 'pulled' && was !== 'pulled' && !reduced()) {
        el.classList.remove('is-entering');
        void el.offsetWidth;
        el.classList.add('is-entering');
      }
    });
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.jump === section)));
    capName.textContent = current.dataset.name ?? '';
    capMeta.textContent = current.dataset.meta ?? '';
    capOpen.href = current.dataset.href ?? '#';
    capSr.textContent = ` ${current.dataset.name ?? ''}`;
    if (focus && root.offsetParent !== null) current.querySelector('a')?.focus({ preventScroll: true });
  }
  store.listeners.push(render);

  tabs.forEach((t) =>
    t.addEventListener('click', () => {
      const first = items.findIndex((el) => el.dataset.section === t.dataset.jump);
      if (first >= 0) store.set(first);
    }),
  );
  root.querySelectorAll<HTMLButtonElement>('[data-flip]').forEach((b) =>
    b.addEventListener('click', () => store.set(clampEntry(store.pulled + Number(b.dataset.flip)))),
  );

  // Tapping a strip behind the pulled record pulls it.
  stack.addEventListener('click', (e) => {
    const item = (e.target as Element).closest<HTMLElement>('.mitem');
    if (item && item.dataset.state !== 'pulled') {
      e.preventDefault();
      store.set(Number(item.dataset.entry));
    }
  });

  stack.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    store.set(clampEntry(store.pulled + step), { focus: true });
  });

  // Swipe: a mostly-horizontal move of 40px or more flips one record.
  let start: { x: number; y: number } | null = null;
  stack.addEventListener('pointerdown', (e) => {
    start = { x: e.clientX, y: e.clientY };
  });
  stack.addEventListener('pointerup', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    suppressClickUntil = Date.now() + 50;
    store.set(clampEntry(store.pulled + (dx < 0 ? 1 : -1)));
  });
  stack.addEventListener('pointercancel', () => (start = null));
}

// ---------------------------------------------------------------- intro

/**
 * End the first-visit intro (html.crate-intro) once it has played, or at once
 * on any input so it never gets in the way. Dropping the class also keeps a
 * later pull from replaying the sequence on the newly pulled record.
 */
function endIntroWhenDone() {
  const html = document.documentElement;
  if (!html.classList.contains('crate-intro')) return;
  const end = () => html.classList.remove('crate-intro');
  const finite = document
    .getAnimations()
    .filter((a) => a instanceof CSSAnimation && a.effect?.getComputedTiming().endTime !== Infinity);
  Promise.all(finite.map((a) => a.finished)).then(end, () => {});
  for (const type of ['pointerdown', 'keydown', 'touchstart']) {
    addEventListener(type, end, { once: true, capture: true, passive: true });
  }
}

// ---------------------------------------------------------------- boot

const desktop = document.querySelector<HTMLElement>('[data-crate]');
const mobile = document.querySelector<HTMLElement>('[data-mcrate]');
const initial = mobile?.querySelector<HTMLElement>('.mitem[data-state="pulled"]');
entryCount = mobile?.querySelectorAll('.mitem').length ?? desktop?.querySelectorAll('.crate-item').length ?? 0;
if (desktop) initDesktop(desktop);
if (mobile) initMobile(mobile);
store.set(initial ? Number(initial.dataset.entry) : 0);
endIntroWhenDone();
