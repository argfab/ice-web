import { useState, useEffect, useRef, useCallback } from 'react';

export interface CoupleStory {
  names: string;
  images: { src: string; alt: string }[];
}

export interface FeaturedTile {
  coupleIndex: number;
  src: string;
  alt: string;
  caption: string;
  span?: string;
}

export default function CoupleGallery({
  couples,
  featured,
}: {
  couples: CoupleStory[];
  featured: FeaturedTile[];
}) {
  const [active, setActive] = useState<CoupleStory | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const open = useCallback((couple: CoupleStory, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setActive(couple);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    setTimeout(() => triggerRef.current?.focus(), 10);
  }, []);

  useEffect(() => {
    if (!active) return;
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close]);

  return (
    <>
      <div className="mt-16 grid auto-rows-[220px] grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {featured.map((tile) => {
          const couple = couples[tile.coupleIndex];
          return (
            <button
              key={tile.src}
              type="button"
              aria-label={`View photos from ${couple.names}'s celebration`}
              onClick={(e) => open(couple, e.currentTarget)}
              className={`portfolio-tile group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-silver/15 p-6 text-left outline-none transition-transform duration-500 ease-luxe hover:-translate-y-2 hover:border-champagne/40 focus-visible:-translate-y-2 focus-visible:border-champagne/40 ${tile.span ?? ''}`}
            >
              <img
                src={tile.src}
                alt={tile.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent"
                aria-hidden="true"
              />
              <div className="relative z-[2]">
                <p className="eyebrow text-champagne/80">{tile.caption}</p>
                <p className="mt-1 text-lg font-medium text-crystal">{couple.names}</p>
              </div>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.names}, photos`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          onClick={close}
        >
          <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-md" aria-hidden="true" />

          <div
            className="couple-modal relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border border-silver/10 bg-midnight-deep p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-silver/20 bg-obsidian/70 text-xl text-silver transition-colors duration-200 hover:border-burgundy-soft/60 hover:text-crystal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              ×
            </button>

            <p className="eyebrow text-champagne">A Love Story</p>
            <h3 className="mt-2 font-display text-2xl text-crystal sm:text-3xl">{active.names}</h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {active.images.map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
