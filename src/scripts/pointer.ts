// Mouse-reactive lighting: writes the pointer position (0–1) to the --mx/--my CSS
// custom properties on :root, which champagne light-wash gradients react to. Sets a
// CSS variable via the DOM API (not an inline style attribute) so strict CSP holds.
// Disabled for coarse pointers and reduced-motion. The listener persists across
// view-transition navigations (it's bound to the document, which is not swapped).
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarse = window.matchMedia('(pointer: coarse)');

if (!reduced.matches && !coarse.matches) {
  const root = document.documentElement;
  let frame = 0;
  let x = 0.5;
  let y = 0.4;

  window.addEventListener(
    'pointermove',
    (event) => {
      x = event.clientX / window.innerWidth;
      y = event.clientY / window.innerHeight;
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          root.style.setProperty('--mx', x.toFixed(3));
          root.style.setProperty('--my', y.toFixed(3));
          frame = 0;
        });
      }
    },
    { passive: true },
  );
}

export {};
