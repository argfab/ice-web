// Scroll parallax — sets --parallax-offset (px string) on the root for any
// element using the `.parallax-slow` class. The image moves at 30% of scroll
// speed, creating subtle depth without affecting layout. GPU-composited
// (transform only). Disabled for reduced-motion and coarse (touch) pointers
// since parallax adds no value on touch and can cause nausea.

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarse = window.matchMedia('(pointer: coarse)');

function setup(): void {
  const targets = document.querySelectorAll<HTMLElement>('.parallax-slow');
  if (!targets.length || reduced.matches || coarse.matches) return;

  let ticking = false;

  const update = () => {
    const offset = `${(window.scrollY * 0.28).toFixed(1)}px`;
    targets.forEach((el) => {
      el.style.transform = `translate3d(0, ${offset}, 0)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

document.addEventListener('astro:page-load', setup);

export {};
