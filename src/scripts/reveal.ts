// Scroll-reveal: adds `.is-visible` to `.reveal-on-scroll` elements as they enter
// the viewport. Marks <html> as `.js` (so CSS hides reveal elements only when JS is
// available — no-JS stays visible). Re-runs on every Astro view-transition navigation.
// Honours prefers-reduced-motion (reveals everything immediately).
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

document.documentElement.classList.add('js');

function setup(): void {
  const els = document.querySelectorAll<HTMLElement>('.reveal-on-scroll:not(.is-visible)');
  if (reduced.matches) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

document.addEventListener('astro:page-load', setup);

export {};
