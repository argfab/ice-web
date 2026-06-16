// Mobile <details> menu: close on link click, close on Escape (restoring focus).
// Overlay nav: transitions from transparent → frosted glass once the user scrolls
// past 60px, using a CSS class toggle (no inline styles). Re-wires per Astro
// view-transition navigation. CSP-safe (bundled module; no inline handlers).

function setup(): void {
  // ── Mobile menu ──────────────────────────────────────────────────────────────
  const details = document.querySelector<HTMLDetailsElement>('header details');
  if (details) {
    details.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', () => {
        details.open = false;
      }),
    );
  }

  // ── Overlay → glass transition on scroll ─────────────────────────────────────
  const header = document.querySelector<HTMLElement>('header[data-overlay]');
  if (!header) return;

  let ticking = false;

  const update = () => {
    header.classList.toggle('nav-is-scrolled', window.scrollY > 60);
    ticking = false;
  };

  window.addEventListener('scroll', update, { passive: true });
  update(); // run immediately (handles page-load when already scrolled)
}

document.addEventListener('astro:page-load', setup);

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const open = document.querySelector<HTMLDetailsElement>('header details[open]');
  if (open) {
    open.open = false;
    open.querySelector<HTMLElement>('summary')?.focus();
  }
});

export {};
