import { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  rot: number;
}

/**
 * A cursor trail of small champagne diamond-sparkles that fade out — ties into the
 * starry/diamond theme. Replaces the old cursor spotlight. Performance-budgeted:
 * capped sparks, DPR ≤2, animation idles when no sparks exist and pauses when the
 * canvas is offscreen or the tab is hidden. Disabled for reduced-motion and touch.
 */
export default function StarTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let onscreen = true;
    const sparks: Spark[] = [];
    let lastX = 0;
    let lastY = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // A small four-point sparkle (additive blend → glint).
    const drawSpark = (x: number, y: number, size: number, alpha: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(240, 215, 155, ${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        const tipX = Math.cos(a) * size;
        const tipY = Math.sin(a) * size;
        const inX = Math.cos(a + Math.PI / 4) * size * 0.3;
        const inY = Math.sin(a + Math.PI / 4) * size * 0.3;
        if (i === 0) ctx.moveTo(tipX, tipY);
        else ctx.lineTo(tipX, tipY);
        ctx.lineTo(inX, inY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const frame = () => {
      if (!onscreen) {
        raf = 0;
        return;
      }
      ctx.clearRect(0, 0, w, h);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]!;
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.012;
        const t = s.life / s.max;
        if (t >= 1) {
          sparks.splice(i, 1);
          continue;
        }
        drawSpark(s.x, s.y, s.size * (1 - t * 0.5), (1 - t) * 0.9, s.rot);
      }
      if (sparks.length === 0) {
        raf = 0; // idle until the next pointer move
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf && onscreen) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > w || y > h) return;
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist < 5) return;
      const count = Math.min(3, 1 + Math.floor(dist / 16));
      for (let k = 0; k < count; k++) {
        sparks.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.12,
          life: 0,
          max: 34 + Math.random() * 32,
          size: 1.6 + Math.random() * 2.4,
          rot: Math.random() * Math.PI,
        });
      }
      if (sparks.length > 90) sparks.splice(0, sparks.length - 90);
      lastX = x;
      lastY = y;
      kick();
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry!.isIntersecting && !document.hidden;
        if (onscreen) kick();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      onscreen = !document.hidden;
      if (onscreen) kick();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      onscreen = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden="true" />;
}
