/**
 * Experiment scatter (frame 1f): dots drop in one at a time the first time the
 * chart scrolls into view (once, never looped, ~2s at most), and hovering or tapping a dot
 * shows how many tracks it stands for. Reduced motion: the chart is shown complete.
 */
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-scatter]').forEach((fig) => {
  const svg = fig.querySelector('svg')!;
  const tip = fig.querySelector<HTMLElement>('.scatter__tip')!;
  const dots = [...fig.querySelectorAll<SVGCircleElement>('circle[data-tip]')];

  // Our tooltip replaces the native one.
  dots.forEach((d) => d.querySelector('title')?.remove());

  if (!reduced && 'IntersectionObserver' in window) {
    fig.classList.add('will-drop');
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        fig.classList.add('is-dropping');
        // Dots, then the highlight box drawing on and its label (ScatterChart.astro).
        const last = dots.length * Number(fig.dataset.step ?? 35) + 1250;
        window.setTimeout(() => fig.classList.remove('will-drop', 'is-dropping'), last);
      },
      { threshold: 0.3 },
    );
    io.observe(fig);
  }

  let active: SVGCircleElement | null = null;
  const show = (dot: SVGCircleElement) => {
    active?.classList.remove('is-active');
    active = dot;
    dot.classList.add('is-active');
    const box = dot.getBoundingClientRect();
    const host = fig.getBoundingClientRect();
    tip.textContent = dot.dataset.tip ?? '';
    tip.style.left = `${box.left + box.width / 2 - host.left}px`;
    tip.style.top = `${box.top - host.top}px`;
    tip.hidden = false;
  };
  const hide = () => {
    active?.classList.remove('is-active');
    active = null;
    tip.hidden = true;
  };

  svg.addEventListener('pointerover', (e) => {
    const dot = (e.target as Element).closest<SVGCircleElement>('circle[data-tip]');
    if (dot) show(dot);
  });
  svg.addEventListener('pointerout', (e) => {
    if ((e.target as Element).closest('circle[data-tip]')) hide();
  });
});

export {};
