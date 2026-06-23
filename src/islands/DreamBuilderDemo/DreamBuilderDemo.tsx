import { useState, useEffect, useRef } from 'react';

interface Feature {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  mockLines: string[];
  accentColor: string;
}

const FEATURES: Feature[] = [
  {
    id: 'canvas',
    icon: '◆',
    title: 'Dream Builder Canvas',
    tagline: 'Your vision, visualised in real time.',
    description:
      'An immersive planning canvas where your celebration takes form, mood boards, spatial layouts, design narrative, and aesthetic direction, all in one living document.',
    mockLines: [
      '◈  Ceremony · Cliffside at Uluwatu',
      '◈  Palette · Ivory · Champagne · Sage',
      '◈  Style · Organic Luxury · Barefoot',
      '◈  Florals · Tropical · Overflowing',
      '◈  Lighting · Candlelit · Golden Hour',
      '◈  Music · Live Quartet · Balinese',
    ],
    accentColor: '#D4B483',
  },
  {
    id: 'budget',
    icon: '◈',
    title: 'Budget Estimation Engine',
    tagline: 'Complete financial clarity from day one.',
    description:
      'Real-time, line-item budget estimation across every element of your celebration. No hidden costs, no surprises, complete confidence at every stage.',
    mockLines: [
      '  Venue & Estate Buyout   ████████  28%',
      '  Florals & Installation  █████     16%',
      '  Catering & Beverages    ███████   22%',
      '  Photography & Film      ████      14%',
      '  Entertainment           ██        8%',
      '  Production & Lighting   ███       12%',
    ],
    accentColor: '#E7D2A8',
  },
  {
    id: 'vendors',
    icon: '◉',
    title: 'Vendor Management',
    tagline: 'Bali\'s finest artisans, coordinated as one.',
    description:
      'Thirty years of relationships, made accessible through our platform. Every supplier is briefed, managed, and held to a single standard: extraordinary.',
    mockLines: [
      '✓  Floralist · Studio Manasa · Confirmed',
      '✓  Chef · Made Surya · Menu Approved',
      '✓  Cinematographer · Lens & Light · Live',
      '✓  Band · The Soul Collective · Briefed',
      '○  Styling Suite · Awaiting Approval',
      '○  Transport · Final Count Pending',
    ],
    accentColor: '#B8975F',
  },
  {
    id: 'portal',
    icon: '◇',
    title: 'Private Client Portal',
    tagline: 'Everything. One place. Always with you.',
    description:
      'A beautifully organised digital home for your celebration, timeline, contacts, design references, payment schedules, and a direct line to your ICE team.',
    mockLines: [
      '  Timeline         ●●●●●●○○  74% Complete',
      '  Payments         ●●●○○○○○  On Schedule',
      '  Guest List       248 / 300  Confirmed',
      '  Documents        12 files   All Signed',
      '  Messages         3 unread   From ICE',
      '  Next: Final walkthrough  Jun 14 · 10am',
    ],
    accentColor: '#F0D79B',
  },
];

export default function DreamBuilderDemo() {
  const [active, setActive] = useState<string>(FEATURES[0]!.id);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduced = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const currentFeature = FEATURES.find((f) => f.id === active) ?? FEATURES[0]!;

  // Expose the active accent as a CSS custom property via the CSSOM (CSP-safe:
  // no inline style attribute reaches the SSR'd markup). Children read var(--accent).
  useEffect(() => {
    rootRef.current?.style.setProperty('--accent', currentFeature.accentColor);
  }, [active]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayedLines([]);
    setTyping(true);

    if (reduced.current) {
      setDisplayedLines(currentFeature.mockLines);
      setTyping(false);
      return;
    }

    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      setDisplayedLines(currentFeature.mockLines.slice(0, i));
      if (i >= currentFeature.mockLines.length) {
        clearInterval(intervalRef.current!);
        setTyping(false);
      }
    }, 140);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  return (
    <div ref={rootRef} className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      {/* Feature selector */}
      <div className="flex flex-col gap-3">
        {FEATURES.map((f) => {
          const isActive = f.id === active;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={`glass-shimmer-card group flex items-start gap-5 rounded-2xl border p-5 text-left ${
                isActive
                  ? 'border-champagne/40 bg-midnight-deep/80 shadow-[0_0_30px_-8px_rgba(212,180,131,0.2)]'
                  : 'border-silver/10 bg-transparent'
              }`}
              aria-pressed={isActive}
            >
              <span
                className={`mt-0.5 flex-none font-display text-2xl transition-colors duration-300 ${
                  isActive ? 'accent-text' : 'text-silver/35'
                }`}
              >
                {f.icon}
              </span>
              <div>
                <p
                  className={`font-sans text-xs uppercase tracking-widest transition-colors duration-300 ${
                    isActive ? 'accent-text' : 'text-silver-soft/80'
                  }`}
                >
                  {isActive ? '● Active' : '○ Module'}
                </p>
                <h3
                  className={`mt-1 text-base transition-colors duration-300 ${
                    isActive ? 'text-crystal' : 'text-silver'
                  }`}
                >
                  {f.title}
                </h3>
                {isActive && (
                  <p className="mt-1 text-xs leading-relaxed text-silver/70">{f.tagline}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Live demo panel */}
      <div className="flex flex-col gap-5">
        {/* Description */}
        <div className="glass rounded-2xl p-7">
          <div className="flex items-center gap-3">
            <span className="accent-text font-display text-3xl">
              {currentFeature.icon}
            </span>
            <div>
              <p className="accent-text text-xs uppercase tracking-widest">
                {currentFeature.title}
              </p>
              <p className="mt-0.5 text-sm italic text-crystal">{currentFeature.tagline}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-silver">{currentFeature.description}</p>
        </div>

        {/* Simulated interface */}
        <div
          className="relative min-h-[240px] overflow-hidden rounded-2xl border border-silver/10 bg-obsidian/90 p-6 font-sans text-sm"
          aria-live="polite"
          aria-label={`${currentFeature.title} interface preview`}
        >
          {/* Window chrome */}
          <div className="mb-5 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-silver/20"></span>
            <span className="h-3 w-3 rounded-full bg-silver/20"></span>
            <span className="h-3 w-3 rounded-full bg-silver/20"></span>
            <span className="accent-text ml-3 text-xs uppercase tracking-widest">
              ICE · {currentFeature.title}
            </span>
          </div>

          {/* Animated lines */}
          <div className="space-y-2.5">
            {displayedLines.map((line, i) => (
              <p
                key={i}
                ref={(el) => { if (el) el.style.animationDelay = `${i * 0.04}s`; }}
                className="animate-fade-up text-silver/80"
              >
                {line}
              </p>
            ))}
            {typing && (
              <span
                className="accent-bg inline-block h-4 w-0.5 animate-pulse"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Subtle glow */}
          <div
            className="accent-glow pointer-events-none absolute inset-0 opacity-10"
            aria-hidden="true"
          />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between rounded-xl border border-silver/10 bg-midnight-deep/60 px-5 py-3">
          <p className="text-xs text-silver/60">
            Dream Builder · Exclusive to ICE couples
          </p>
          <span className="accent-text flex items-center gap-1.5 text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"></span>
            Live
          </span>
        </div>
      </div>
    </div>
  );
}
