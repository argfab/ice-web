import type { GuestCount, InvestmentTier } from './types';

export interface StepConfig {
  id: string;
  name: string;
  legend: string;
  hint?: string;
}

export const STEPS: StepConfig[] = [
  {
    id: 'story',
    name: 'Your Story',
    legend: 'Tell us about the celebration you envision.',
    hint: 'There are no wrong answers — write as little or as much as feels right.',
  },
  {
    id: 'when-where',
    name: 'When & Where',
    legend: 'When might it be, and where in the world?',
  },
  {
    id: 'gathering',
    name: 'The Gathering',
    legend: 'How many will share the day with you?',
  },
  {
    id: 'investment',
    name: 'Investment',
    legend: 'To tailor our proposal, the investment level you have in mind.',
    hint: 'Shared in confidence, only to help us serve you well.',
  },
  {
    id: 'contact',
    name: 'Introduce Yourself',
    legend: 'And finally, how we might reach you.',
  },
];

export interface CardOption<T extends string> {
  value: T;
  title: string;
  detail: string;
}

export const GUEST_OPTIONS: CardOption<GuestCount>[] = [
  { value: 'intimate', title: 'Intimate', detail: 'Up to 30 guests' },
  { value: 'considered', title: 'Considered', detail: '30 – 80 guests' },
  { value: 'grand', title: 'Grand', detail: '80 – 150 guests' },
  { value: 'world', title: 'A world of its own', detail: '150+ guests' },
];

export const INVESTMENT_OPTIONS: CardOption<InvestmentTier>[] = [
  { value: 'bespoke', title: 'Bespoke', detail: '$75,000 – $150,000' },
  { value: 'signature', title: 'Signature', detail: '$150,000 – $300,000' },
  { value: 'atelier', title: 'Atelier', detail: '$300,000 – $600,000' },
  { value: 'sans-limites', title: 'Sans Limites', detail: 'Beyond $600,000' },
  { value: 'discuss', title: 'Prefer to discuss privately', detail: 'We will explore it together' },
];

export const DESTINATION_CHIPS = [
  'Bali, Indonesia',
  'Cape Town & the Winelands',
  'Elsewhere in the world',
];
