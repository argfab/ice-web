import { z } from 'zod';

/**
 * Client mirror of api/src/validate.ts — keep the two in sync. The server is the
 * source of truth; this gives immediate, friendly client-side feedback.
 */

export const GUEST_COUNTS = ['intimate', 'considered', 'grand', 'world'] as const;
export const INVESTMENT_TIERS = [
  'bespoke',
  'signature',
  'atelier',
  'sans-limites',
  'discuss',
] as const;

const optionalContact = z.string().trim().max(60).optional();

const noLineBreaks = (s: string) => !/[\r\n]/.test(s);

export const applicationSchema = z
  .object({
    story: z.string().trim().min(1, 'Please share a little about your celebration').max(4000),
    eventDate: z.string().trim().min(1, 'A date helps us tailor your proposal').max(40),
    destination: z
      .string()
      .trim()
      .min(1, 'Where in the world?')
      .max(200)
      .refine(noLineBreaks, 'Cannot contain line breaks'),
    guestCount: z.enum(GUEST_COUNTS),
    investmentTier: z.enum(INVESTMENT_TIERS),
    fullName: z
      .string()
      .trim()
      .min(1, 'Your name, please')
      .max(200)
      .refine(noLineBreaks, 'Cannot contain line breaks'),
    email: z.string().trim().toLowerCase().email('A valid email is required').max(320),
    phone: optionalContact,
    whatsapp: optionalContact,
    instagram: z.string().trim().max(120).optional(),
    company_website: z.string().max(200).optional(),
    formRenderedAt: z.number().int().nonnegative(),
    submissionId: z.string().uuid(),
  })
  .strict()
  .refine((d) => Boolean(d.phone?.trim() || d.whatsapp?.trim()), {
    message: 'Please provide a phone or WhatsApp number so we can reach you',
    path: ['phone'],
  })
  .refine(
    (d) => {
      const t = Date.parse(d.eventDate);
      return !Number.isNaN(t) && t > Date.now();
    },
    { message: 'Your celebration date should be in the future', path: ['eventDate'] },
  )
  .refine(
    (d) => {
      const now = Date.now();
      return d.formRenderedAt <= now + 10 * 60 * 1000 && d.formRenderedAt >= now - 24 * 60 * 60 * 1000;
    },
    { message: 'This form session has expired — please reload and try again', path: ['formRenderedAt'] },
  );

export type ApplicationInput = z.infer<typeof applicationSchema>;
