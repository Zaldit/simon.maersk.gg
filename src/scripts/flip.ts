/**
 * Inspection "Turn it over" (frame 1d). State: record.face = front | back.
 * Each card shows one face; the hidden face is inert so its links and text
 * are never reachable twice. CSS turns the sleeves (or cross-fades them under
 * reduced motion).
 */
const root = document.querySelector<HTMLElement>('[data-flip]');
const button = root?.querySelector<HTMLButtonElement>('[data-turn]');

if (root && button) {
  button.hidden = false;
  const cards = [...root.querySelectorAll<HTMLElement>('.card')];

  const apply = (face: 'front' | 'back') => {
    root.dataset.face = face;
    button.setAttribute('aria-pressed', String(face === 'back'));
    for (const card of cards) {
      const up = card.classList.contains('card--front-up') ? 'front' : 'back';
      const showing = face === 'front' ? up : up === 'front' ? 'back' : 'front';
      card.querySelectorAll<HTMLElement>('[data-face-of]').forEach((f) => {
        f.inert = f.dataset.faceOf !== showing;
      });
    }
  };

  button.addEventListener('click', () => apply(root.dataset.face === 'back' ? 'front' : 'back'));
}

export {};
