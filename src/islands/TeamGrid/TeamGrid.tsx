import { useState, useEffect, useRef, useCallback } from 'react';

export interface TeamMember {
  name: string;
  role: string;
  initial: string;
  image: string;
  caption: string;
  bio: string;
}

export default function TeamGrid({ members }: { members: TeamMember[] }) {
  const [active, setActive] = useState<TeamMember | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const open = useCallback((member: TeamMember, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setActive(member);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    setTimeout(() => triggerRef.current?.focus(), 10);
  }, []);

  useEffect(() => {
    if (!active) return;
    // Focus the close button when modal opens
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

  const top = members.slice(0, 2);
  const bottom = members.slice(2);

  return (
    <>
      {/* Top row — 2 cards centred */}
      <div className="mt-16 mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
        {top.map((m) => (
          <TeamCard key={m.name} member={m} onOpen={open} />
        ))}
      </div>

      {/* Bottom row — 3 cards full width */}
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        {bottom.map((m) => (
          <TeamCard key={m.name} member={m} onOpen={open} />
        ))}
      </div>

      {/* Modal overlay */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`About ${active.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-obsidian/85 backdrop-blur-md" aria-hidden="true" />

          {/* Panel */}
          <div
            className="team-modal relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-silver/10 bg-midnight-deep shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-silver/20 bg-obsidian/70 text-xl text-silver transition-colors duration-200 hover:border-silver/40 hover:text-crystal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              ×
            </button>

            <div className="flex flex-col sm:flex-row">
              {/* Photo column */}
              <div className="sm:w-56 shrink-0">
                {active.image ? (
                  <img
                    src={active.image}
                    alt={`Portrait of ${active.name}`}
                    className="h-64 w-full object-cover object-top sm:h-full sm:w-56 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
                  />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center bg-champagne/06 font-display text-6xl text-champagne sm:h-full sm:w-56 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
                    {active.initial}
                  </div>
                )}
              </div>

              {/* Content column */}
              <div className="flex flex-col gap-5 p-7 sm:p-8">
                <div>
                  <p className="eyebrow text-champagne">{active.role}</p>
                  <h3 className="mt-2 font-display text-2xl text-crystal">{active.name}</h3>
                </div>
                <p className="font-display text-base italic leading-snug text-champagne/90">
                  &ldquo;{active.caption}&rdquo;
                </p>
                <div className="h-px w-10 bg-champagne/30" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-silver">{active.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TeamCard({
  member,
  onOpen,
}: {
  member: TeamMember;
  onOpen: (m: TeamMember, el: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Read about ${member.name}`}
      onClick={(e) => onOpen(member, e.currentTarget)}
      className="team-card group w-full text-left"
    >
      {/* Image / placeholder — portrait aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-champagne/06 font-display text-6xl text-champagne transition-colors duration-300 group-hover:bg-champagne/10">
            {member.initial}
          </div>
        )}

        {/* Gradient overlay — always present for legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent"
          aria-hidden="true"
        />

        {/* "Read story" pill — appears on hover */}
        <div
          className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-champagne/40 bg-obsidian/70 px-3 py-1 text-xs text-champagne opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        >
          ◆ Read story
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="eyebrow text-champagne/80">{member.role}</p>
          <h3 className="mt-1 text-lg font-medium text-crystal">{member.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-silver/80">
            {member.caption}
          </p>
        </div>
      </div>
    </button>
  );
}
