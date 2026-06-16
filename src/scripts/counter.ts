// Animated number counter — triggers when `.stat-counter` enters the viewport.
// Data attributes: data-target (number), data-suffix (e.g. '+', ' years').
// Respects prefers-reduced-motion: shows the final value instantly if motion is reduced.

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4;
}

function animateCounter(el: HTMLElement): void {
  const target = parseInt(el.dataset.target ?? '0', 10);
  const suffix = el.dataset.suffix ?? '';
  const duration = 1800;

  if (reduced.matches) {
    el.textContent = `${target}${suffix}`;
    return;
  }

  const start = performance.now();
  const frame = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutQuart(progress) * target);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function setup(): void {
  const counters = document.querySelectorAll<HTMLElement>('.stat-counter:not([data-counted])');
  if (!counters.length) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.dataset.counted = '1';
          animateCounter(el);
          obs.unobserve(el);
        }
      }
    },
    { threshold: 0.5 },
  );
  counters.forEach((el) => io.observe(el));
}

document.addEventListener('astro:page-load', setup);

export {};
