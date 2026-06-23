import { useState, useEffect, useRef, useCallback } from 'react';

export interface Promise_ {
  title: string;
  line: string;
}

const AUTO_ADVANCE_MS = 5000;

export default function HousePromise({ promises }: { promises: Promise_[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const select = useCallback((i: number) => {
    setActive(i);
    setPaused(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches || paused) return;
    timer.current = setInterval(() => {
      setActive((i) => (i + 1) % promises.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, promises.length]);

  return (
    <div
      className="house-promise mx-auto mt-14 max-w-3xl"
      onMouseEnter={() => setPaused(true)}
    >
      {/* Stage */}
      <div className="house-promise-stage glass-card relative flex min-h-[180px] flex-col items-center justify-center overflow-hidden px-8 py-12 text-center sm:min-h-[200px]">
        <div className="diamond-grid absolute inset-0 opacity-30" aria-hidden="true" />
        {promises.map((p, i) => (
          <div
            key={p.title}
            className="house-promise-panel absolute inset-x-0 px-8 opacity-0 transition-opacity duration-700 ease-luxe data-[active=true]:opacity-100"
            data-active={i === active}
            aria-hidden={i !== active}
          >
            <p className="font-display text-2xl text-crystal sm:text-3xl">{p.title}</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-silver sm:text-base">{p.line}</p>
          </div>
        ))}
      </div>

      {/* Selector nodes */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {promises.map((p, i) => (
          <button
            key={p.title}
            type="button"
            onClick={() => select(i)}
            aria-label={p.title}
            aria-pressed={i === active}
            className="house-promise-node group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs tracking-wide transition-all duration-400 ease-luxe sm:text-sm"
            data-active={i === active}
          >
            <span className="house-promise-glyph" aria-hidden="true">◆</span>
            {p.title}
          </button>
        ))}
      </div>
    </div>
  );
}
