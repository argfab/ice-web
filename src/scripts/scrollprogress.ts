// Champagne scroll-progress bar — a 1px gold line that grows across the top of
// the viewport as the user scrolls. Uses scaleX transform (GPU-composited, zero
// layout cost). Respects prefers-reduced-motion. Re-registers on each Astro
// view-transition navigation.

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

function setup(): void {
  const bar = document.getElementById('scroll-progress');
  if (!bar || reduced.matches) return;

  let ticking = false;

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) {
      bar.style.transform = 'scaleX(1)';
      return;
    }
    const progress = Math.min(window.scrollY / scrollable, 1);
    bar.style.transform = `scaleX(${progress})`;
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
