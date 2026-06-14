import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
}

/**
 * Diamond-dust canvas — slow-rising champagne/silver specks. Performance-budgeted:
 * particle count scales with width (capped), DPR clamped to 2, paused when offscreen
 * or the tab is hidden. Renders nothing under prefers-reduced-motion (a CSS gradient
 * shows through instead).
 */
export default function ParticleField({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.06,
      vy: -(Math.random() * 0.16 + 0.03),
      a: Math.random() * 0.5 + 0.18,
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w / 14) * density));
      particles = Array.from({ length: count }, spawn);
    };

    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) {
          p.y = h + 4;
          p.x = Math.random() * w;
        }
        if (p.x < -4) p.x = w + 4;
        else if (p.x > w + 4) p.x = -4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 180, 131, ${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running && !raf) frame();
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    frame();

    const onResize = () => resize();
    window.addEventListener('resize', onResize, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !document.hidden;
        if (running) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) start();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density]);

  return <canvas ref={ref} className="h-full w-full" aria-hidden="true" />;
}
