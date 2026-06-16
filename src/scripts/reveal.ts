// Scroll-reveal: adds `.is-visible` to `.reveal-on-scroll` elements as they enter
// the viewport. Marks <html> as `.js` (so CSS hides reveal elements only when JS is
// available — no-JS stays visible). Re-runs on every Astro view-transition navigation.
// Honours prefers-reduced-motion (reveals everything immediately).
//
// Stagger support: elements with `data-delay="0.15s"` have that delay applied to
// their transition before is-visible is added. Uses element.style (DOM API — always
// permitted; not affected by style-src CSP restrictions on static HTML attributes).
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
          const el = entry.target as HTMLElement;
          const delay = el.dataset.delay;
          if (delay) el.style.transitionDelay = delay;
          el.classList.add('is-visible');
          obs.unobserve(el);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

document.addEventListener('astro:page-load', setup);

export {};
