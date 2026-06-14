import { useRef, useState } from 'react';
import { applicationSchema } from './schema';
import type { FieldErrors, FormValues } from './types';

const INITIAL: FormValues = {
  story: '',
  eventDate: '',
  destination: '',
  guestCount: '',
  investmentTier: '',
  fullName: '',
  email: '',
  phone: '',
  whatsapp: '',
  instagram: '',
  company_website: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fields validated when leaving each step.
const STEP_FIELDS: (keyof FormValues)[][] = [
  ['story'],
  ['eventDate', 'destination'],
  ['guestCount'],
  ['investmentTier'],
  ['fullName', 'email', 'phone'],
];

export type SubmitStatus = 'idle' | 'submitting' | 'error';

export function useApplicationForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const meta = useRef<{ formRenderedAt: number; submissionId: string } | null>(null);
  if (meta.current === null) {
    meta.current = { formRenderedAt: Date.now(), submissionId: crypto.randomUUID() };
  }

  const lastStep = STEP_FIELDS.length - 1;

  function setField<K extends keyof FormValues>(name: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  }

  function validateFields(fields: (keyof FormValues)[]): FieldErrors {
    const next: FieldErrors = {};
    for (const f of fields) {
      const val = values[f].trim();
      switch (f) {
        case 'story':
          if (!val) next.story = 'Please share a little about your celebration';
          else if (val.length > 4000) next.story = 'Just a touch shorter, please';
          break;
        case 'eventDate': {
          if (!val) next.eventDate = 'A date helps us tailor your proposal';
          else {
            const t = Date.parse(val);
            if (Number.isNaN(t) || t <= Date.now())
              next.eventDate = 'Your celebration date should be in the future';
          }
          break;
        }
        case 'destination':
          if (!val) next.destination = 'Where in the world?';
          break;
        case 'guestCount':
          if (!val) next.guestCount = 'Please choose a gathering size';
          break;
        case 'investmentTier':
          if (!val) next.investmentTier = 'Please choose an investment level';
          break;
        case 'fullName':
          if (!val) next.fullName = 'Your name, please';
          break;
        case 'email':
          if (!val) next.email = 'An email is required';
          else if (!EMAIL_RE.test(val)) next.email = 'A valid email is required';
          break;
        case 'phone':
          if (!values.phone.trim() && !values.whatsapp.trim())
            next.phone = 'Please provide a phone or WhatsApp number so we can reach you';
          break;
        default:
          break;
      }
    }
    return next;
  }

  function validateStep(s: number): boolean {
    const stepErrors = validateFields(STEP_FIELDS[s] ?? []);
    setErrors((e) => ({ ...e, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  }

  function next() {
    if (validateStep(step)) {
      setSubmitError(null);
      setStep((s) => Math.min(s + 1, lastStep));
    }
  }

  function back() {
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!validateStep(lastStep)) return;
    setStatus('submitting');
    setSubmitError(null);

    const payload = {
      ...values,
      phone: values.phone.trim() || undefined,
      whatsapp: values.whatsapp.trim() || undefined,
      instagram: values.instagram.trim() || undefined,
      formRenderedAt: meta.current!.formRenderedAt,
      submissionId: meta.current!.submissionId,
    };

    const parsed = applicationSchema.safeParse(payload);
    if (!parsed.success) {
      const mapped: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues | undefined;
        if (key && !(key in mapped)) mapped[key] = issue.message;
      }
      setErrors(mapped);
      setStatus('error');
      // Send the user back to the earliest step that has an error.
      const firstBad = STEP_FIELDS.findIndex((group) => group.some((f) => mapped[f]));
      if (firstBad >= 0) setStep(firstBad);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        setStatus('error');
        setSubmitError('Something interrupted your application. Please try again in a moment.');
        return;
      }
      window.location.assign('/thank-you');
    } catch {
      setStatus('error');
      setSubmitError('We could not reach the house. Please check your connection and try again.');
    }
  }

  return {
    step,
    lastStep,
    values,
    errors,
    status,
    submitError,
    setField,
    next,
    back,
    submit,
  };
}
