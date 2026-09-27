/**
 * Genre tabs on /playing (frame 1g). State: playing.genreIndex.
 * Switching slides the new sheet up out of the stack (300ms) and redraws its
 * speed line; under reduced motion the swap is instant. The URL hash follows
 * the active genre, so the no-JS anchors and shared links keep working.
 */
const root = document.querySelector<HTMLElement>('[data-playing]');
const list = root?.querySelector<HTMLElement>('[data-tablist]');

if (root && list) {
  const tabs = [...list.querySelectorAll<HTMLAnchorElement>('a[data-tab]')];
  const sheets = new Map(
    [...root.querySelectorAll<HTMLElement>('[data-sheet]')].map((s) => [s.dataset.sheet!, s] as const),
  );
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  root.classList.add('js-tabs');
  list.setAttribute('role', 'tablist');
  tabs.forEach((tab) => {
    const id = tab.dataset.tab!;
    const sheet = sheets.get(id)!;
    tab.id = `tab-${id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', id);
    sheet.setAttribute('role', 'tabpanel');
    sheet.setAttribute('aria-labelledby', tab.id);
  });

  const select = (tab: HTMLAnchorElement, { focus = false, animate = true } = {}) => {
    const id = tab.dataset.tab!;
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    sheets.forEach((sheet, key) => {
      const was = sheet.hidden;
      sheet.hidden = key !== id;
      if (!sheet.hidden && was && animate && !reduced.matches) {
        sheet.classList.remove('is-entering', 'is-drawing');
        void sheet.offsetWidth;
        sheet.classList.add('is-entering', 'is-drawing');
      }
    });
    if (animate) history.replaceState(null, '', `#${id}`);
    if (focus) tab.focus();
  };

  const fromHash = tabs.find((t) => `#${t.dataset.tab}` === location.hash);
  select(fromHash ?? tabs[0]!, { animate: false });
  // Arriving on a hash would otherwise scroll the sheet under the header.
  if (fromHash) window.scrollTo(0, 0);

  list.addEventListener('click', (e) => {
    const tab = (e.target as Element).closest<HTMLAnchorElement>('a[data-tab]');
    if (!tab) return;
    e.preventDefault();
    if (!tab.classList.contains('is-active')) select(tab);
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
