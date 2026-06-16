// Magnetic button — on desktop, `.btn-gold` and `.btn-outline` elements pull
// slightly toward the cursor when hovered, snapping back on leave. Uses
// transform: translate (GPU, zero layout impact). Strength tapers quadratically
// so it feels like attraction, not stickiness. Disabled for coarse pointers and
// reduced-motion. Safe: sets element.style directly (not a CSP-restricted inline
// attribute — DOM API style access is always permitted).

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarse = window.matchMedia('(pointer: coarse)');

const STRENGTH = 0.32; // 0–1, fraction of cursor offset applied
const EASE_OUT = 0.18; // lerp factor per frame for release

type MagEl = { el: HTMLElement; tx: number; ty: number; raf: number };
const active = new Set<MagEl>();

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function animate(m: MagEl) {
  m.tx = lerp(m.tx, 0, EASE_OUT);
  m.ty = lerp(m.ty, 0, EASE_OUT);
  m.el.style.transform = `translate(${m.tx.toFixed(2)}px, ${m.ty.toFixed(2)}px)`;
  if (Math.abs(m.tx) < 0.05 && Math.abs(m.ty) < 0.05) {
    m.el.style.transform = '';
    active.delete(m);
    cancelAnimationFrame(m.raf);
  } else {
    m.raf = requestAnimationFrame(() => animate(m));
  }
}

function setup(): void {
  if (reduced.matches || coarse.matches) return;

  const buttons = document.querySelectorAll<HTMLElement>('.btn-gold, .btn-outline, .btn-ghost-light');

  buttons.forEach((el) => {
    let mag: MagEl | null = null;

    el.addEventListener('mouseenter', () => {
      if (mag) {
        cancelAnimationFrame(mag.raf);
        active.delete(mag);
      }
      mag = { el, tx: 0, ty: 0, raf: 0 };
      active.add(mag);
    });

    el.addEventListener('mousemove', (e) => {
      if (!mag) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mag.tx = (e.clientX - cx) * STRENGTH;
      mag.ty = (e.clientY - cy) * STRENGTH;
      el.style.transform = `translate(${mag.tx.toFixed(2)}px, ${mag.ty.toFixed(2)}px)`;
    });

    el.addEventListener('mouseleave', () => {
      if (!mag) return;
      cancelAnimationFrame(mag.raf);
      mag.raf = requestAnimationFrame(() => animate(mag!));
    });
  });
}

document.addEventListener('astro:page-load', setup);

export {};
