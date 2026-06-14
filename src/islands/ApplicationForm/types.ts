import type { GUEST_COUNTS, INVESTMENT_TIERS } from './schema';

export type GuestCount = (typeof GUEST_COUNTS)[number];
export type InvestmentTier = (typeof INVESTMENT_TIERS)[number];

/** Editable form fields (meta like submissionId is held separately). */
export interface FormValues {
  story: string;
  eventDate: string;
  destination: string;
  guestCount: GuestCount | '';
  investmentTier: InvestmentTier | '';
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  company_website: string; // honeypot — stays empty
}

export type FieldErrors = Partial<Record<keyof FormValues, string>>;
