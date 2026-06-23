export interface WizardOption {
  id: string;
  icon: string;
  label: string;
  detail: string;
}

export interface WizardStep {
  key: keyof WizardSelections;
  question: string;
  subtext: string;
  options: WizardOption[];
}

export interface WizardSelections {
  type: string;
  location: string;
  style: string;
  guests: string;
  timeline: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    key: 'type',
    question: 'What kind of celebration?',
    subtext: 'Choose the one that resonates most with your vision.',
    options: [
      { id: 'destination-wedding', icon: '◆', label: 'Destination Wedding', detail: 'A world built around your vows' },
      { id: 'indian-wedding', icon: '◉', label: 'Indian Wedding', detail: 'Multi-day cultural celebration' },
      { id: 'multi-day', icon: '◈', label: 'Multi-Day Experience', detail: 'A weekend or more, composed as one' },
      { id: 'private-estate', icon: '◇', label: 'Private Villa', detail: 'Exclusive use, complete privacy' },
      { id: 'proposal', icon: '♦', label: 'Proposal', detail: 'One perfect, unforgettable moment' },
      { id: 'corporate', icon: '▷', label: 'Corporate Event', detail: 'Brand experiences & private dinners' },
    ],
  },
  {
    key: 'location',
    question: 'Where do you imagine it?',
    subtext: 'The countries we specialise in.',
    options: [
      { id: 'uluwatu', icon: '◆', label: 'Uluwatu, Bali', detail: 'Clifftop ceremonies above the Indian Ocean' },
      { id: 'ubud', icon: '◆', label: 'Ubud, Bali', detail: 'Jungle sanctuaries & rice terrace villas' },
      { id: 'seminyak', icon: '◆', label: 'Seminyak, Bali', detail: 'Beach estates & sunset receptions' },
      { id: 'sidemen', icon: '◆', label: 'Sidemen, Bali', detail: 'Hidden valley settings & lantern nights' },
      { id: 'international', icon: '◈', label: 'International', detail: 'Tuscany, Rajasthan, Cape Town & beyond' },
      { id: 'open', icon: '◇', label: 'Open to Ideas', detail: 'Surprise us — we love a blank map' },
    ],
  },
  {
    key: 'style',
    question: 'How should it feel?',
    subtext: 'Your aesthetic direction — the emotional tone of the day.',
    options: [
      { id: 'barefoot-luxury', icon: '◆', label: 'Barefoot Luxury', detail: 'Organic, sensual, naturally opulent' },
      { id: 'grand-opulence', icon: '◉', label: 'Grand Opulence', detail: 'Maximalist, dramatic, unforgettable' },
      { id: 'intimate-editorial', icon: '◈', label: 'Intimate & Editorial', detail: 'Refined, quiet, deeply personal' },
      { id: 'cultural-fusion', icon: '◇', label: 'Cultural Fusion', detail: 'Traditions woven into modern luxury' },
      { id: 'modern-minimalist', icon: '♦', label: 'Modern Minimalist', detail: 'Architecture, light, and restraint' },
      { id: 'tropical-grandeur', icon: '▷', label: 'Tropical Grandeur', detail: 'Lush, vibrant, full of life' },
    ],
  },
  {
    key: 'guests',
    question: 'How many loved ones?',
    subtext: 'The gathering size shapes everything we design.',
    options: [
      { id: 'intimate', icon: '◇', label: 'Intimate', detail: 'Up to 30 guests' },
      { id: 'considered', icon: '◆', label: 'Considered', detail: '30 – 80 guests' },
      { id: 'grand', icon: '◉', label: 'Grand', detail: '80 – 150 guests' },
      { id: 'world', icon: '◈', label: 'A world of its own', detail: '150+ guests' },
    ],
  },
  {
    key: 'timeline',
    question: 'When are you thinking?',
    subtext: 'We plan well in advance — the finest dates fill early.',
    options: [
      { id: 'within-6-months', icon: '◆', label: 'Within 6 months', detail: "Let's move quickly" },
      { id: '6-12-months', icon: '◈', label: '6 – 12 months', detail: 'A comfortable runway' },
      { id: '1-2-years', icon: '◉', label: '1 – 2 years', detail: 'Time to compose something extraordinary' },
      { id: 'still-dreaming', icon: '◇', label: 'Still dreaming', detail: 'No date yet — just exploring' },
    ],
  },
];

// Labels for the summary screen and story generation
export const TYPE_LABELS: Record<string, string> = {
  'destination-wedding': 'Destination Wedding',
  'indian-wedding': 'Indian Wedding',
  'multi-day': 'Multi-Day Experience',
  'private-estate': 'Private Villa Wedding',
  'proposal': 'Proposal',
  'corporate': 'Corporate Event',
};

export const LOCATION_LABELS: Record<string, string> = {
  'uluwatu': 'Uluwatu, Bali',
  'ubud': 'Ubud, Bali',
  'seminyak': 'Seminyak, Bali',
  'sidemen': 'Sidemen, Bali',
  'international': 'International',
  'open': 'Open to Ideas',
};

export const LOCATION_DESTINATION: Record<string, string> = {
  'uluwatu': 'Bali, Indonesia',
  'ubud': 'Bali, Indonesia',
  'seminyak': 'Bali, Indonesia',
  'sidemen': 'Bali, Indonesia',
  'international': 'Worldwide',
  'open': 'Open to Ideas',
};

export const STYLE_LABELS: Record<string, string> = {
  'barefoot-luxury': 'Barefoot Luxury',
  'grand-opulence': 'Grand Opulence',
  'intimate-editorial': 'Intimate & Editorial',
  'cultural-fusion': 'Cultural Fusion',
  'modern-minimalist': 'Modern Minimalist',
  'tropical-grandeur': 'Tropical Grandeur',
};

export const GUEST_LABELS: Record<string, string> = {
  'intimate': 'Intimate · Up to 30',
  'considered': 'Considered · 30–80',
  'grand': 'Grand · 80–150',
  'world': '150+ guests',
};

export const TIMELINE_LABELS: Record<string, string> = {
  'within-6-months': 'Within 6 months',
  '6-12-months': '6–12 months',
  '1-2-years': '1–2 years',
  'still-dreaming': 'Still dreaming',
};

/** Builds a natural-language story narrative from wizard selections */
export function buildStory(s: WizardSelections): string {
  const parts: string[] = [];
  const type = TYPE_LABELS[s.type] ?? s.type;
  const loc = LOCATION_LABELS[s.location] ?? s.location;
  const style = STYLE_LABELS[s.style] ?? s.style;
  const guests = GUEST_LABELS[s.guests] ?? s.guests;
  const when = TIMELINE_LABELS[s.timeline] ?? s.timeline;

  if (type) parts.push(`We are dreaming of a ${type.toLowerCase()}`);
  if (loc && loc !== 'Open to Ideas') parts.push(`in ${loc}`);
  if (style) parts.push(`with a ${style.toLowerCase()} aesthetic`);
  if (guests) parts.push(`welcoming ${guests.toLowerCase()} loved ones`);
  if (when && when !== 'Still dreaming') parts.push(`— ${when.toLowerCase()} from now`);

  return (
    parts.join(', ') +
    ". We'd love to explore what ICE could create for us."
  );
}

/** Builds the URL params string for the /apply page */
export function buildApplyUrl(s: Partial<WizardSelections>): string {
  const params = new URLSearchParams({ via: 'dream-builder' });
  if (s.type) params.set('type', s.type);
  if (s.location) params.set('loc', s.location);
  if (s.style) params.set('style', s.style);
  if (s.guests) params.set('guests', s.guests);
  if (s.timeline) params.set('when', s.timeline);
  return `/apply?${params.toString()}`;
}
