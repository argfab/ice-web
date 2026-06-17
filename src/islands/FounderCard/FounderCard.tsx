import { useState, useId, useCallback } from 'react';

export interface FounderCardProps {
  name: string;
  role: string;
  eyebrow: string;
  portraitLabel: string;
  image?: string;
  quote: string;
  bio: string[];
}

export default function FounderCard({
  name,
  role,
  eyebrow,
  portraitLabel,
  image,
  quote,
  bio,
}: FounderCardProps) {
  const [flipped, setFlipped] = useState(false);
  const panelId = useId();

  const toggle = useCallback(() => setFlipped((f) => !f), []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (flipped && e.key === 'Escape') setFlipped(false);
    },
    [flipped],
  );

  return (
    <div
      className="founder-card reveal-on-scroll"
      onKeyDown={onKeyDown}
    >
      <div className={`founder-card-inner ${flipped ? 'is-flipped' : ''}`}>
        {/* FRONT — portrait + invitation to read */}
        <div className="founder-face founder-face--front" aria-hidden={flipped}>
          <div className="founder-face-content founder-face-content--front">
            <div className="diamond-grid absolute inset-0 opacity-60" aria-hidden="true" />
            {image ? (
              <img
                src={image}
                alt={`Portrait of ${name}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span className="eyebrow absolute bottom-4 left-5 text-crystal">{portraitLabel}</span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" aria-hidden="true" />

            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="eyebrow text-champagne">{eyebrow}</p>
              <h2 className="mt-2 text-2xl text-crystal sm:text-3xl">{name}</h2>
              <p className="mt-1 font-display text-base italic text-champagne/90">{role}</p>

              <button
                type="button"
                onClick={toggle}
                aria-expanded={flipped}
                aria-controls={panelId}
                tabIndex={flipped ? -1 : 0}
                className="founder-seal group mt-6"
              >
                <span className="founder-seal-ring" aria-hidden="true" />
                <span className="relative z-10">Read {name.split(' ')[0]}&rsquo;s Story</span>
                <span className="founder-seal-glyph" aria-hidden="true">&#9670;</span>
              </button>
            </div>
          </div>
        </div>

        {/* BACK — the full write-up */}
        <div id={panelId} className="founder-face founder-face--back" aria-hidden={!flipped}>
          <div className="founder-face-content founder-face-content--back">
            <div className="flex h-full flex-col p-7 sm:p-9">
              <button
                type="button"
                onClick={toggle}
                tabIndex={flipped ? 0 : -1}
                className="link-underline inline-flex items-center gap-2 self-start font-sans text-xs tracking-widest text-champagne"
              >
                &larr; Back to portrait
              </button>

              <p className="eyebrow mt-6 text-champagne">{eyebrow}</p>
              <h2 className="mt-2 text-2xl text-crystal sm:text-3xl">{name}</h2>
              <p className="mt-1 font-display text-base italic text-champagne/90">{role}</p>

              <div className="founder-scroll mt-5 space-y-4 overflow-y-auto pr-1 leading-relaxed text-silver">
                {bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <figure className="mt-5 border-l border-burgundy-soft/45 pl-5">
                <blockquote className="font-display text-base leading-snug text-crystal">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
