// Mobile <details> menu behaviour: close on link click, and on Escape (restoring
// focus to the toggle). Re-wires per Astro view-transition navigation. CSP-safe
// (bundled module; no inline handlers).
function setup(): void {
  const details = document.querySelector<HTMLDetailsElement>('header details');
  if (!details) return;
  details.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      details.open = false;
    }),
  );
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
