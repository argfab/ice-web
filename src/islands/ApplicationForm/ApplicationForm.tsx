import { useEffect, useRef } from 'react';
import {
  DESTINATION_CHIPS,
  GUEST_OPTIONS,
  INVESTMENT_OPTIONS,
  STEPS,
} from './fieldConfig';
import { Honeypot, RadioCards, TextArea, TextField } from './fields';
import { useApplicationForm } from './useApplicationForm';
import type { GuestCount, InvestmentTier } from './types';
import {
  buildStory,
  LOCATION_DESTINATION,
} from '../DreamWizard/wizardConfig';
import type { WizardSelections } from '../DreamWizard/wizardConfig';

export default function ApplicationForm() {
  const f = useApplicationForm();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the step heading whenever the step changes (accessibility).
  useEffect(() => {
    headingRef.current?.focus();
  }, [f.step]);

  // Pre-fill from Dream Builder wizard URL params on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('via') !== 'dream-builder') return;

    const selections: WizardSelections = {
      type: params.get('type') ?? '',
      location: params.get('loc') ?? '',
      style: params.get('style') ?? '',
      guests: params.get('guests') ?? '',
      timeline: params.get('when') ?? '',
    };

    if (!f.values.story) {
      f.setField('story', buildStory(selections));
    }

    const dest = LOCATION_DESTINATION[selections.location] ?? '';
    if (!f.values.destination && dest) {
      f.setField('destination', dest);
    }

    const validGuests = ['intimate', 'considered', 'grand', 'world'];
    if (!f.values.guestCount && validGuests.includes(selections.guests)) {
      f.setField('guestCount', selections.guests as GuestCount);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = STEPS[f.step];
  const isLast = f.step === f.lastStep;
  const submitting = f.status === 'submitting';

  return (
    <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
      {/* Progress — framed as the stages of an application */}
      <aside className="lg:sticky lg:top-12 lg:self-start">
        <p className="eyebrow">Private application</p>
        <p className="mt-4 font-display text-2xl text-crystal">
          Step {f.step + 1}
          <span className="text-silver-soft"> of {STEPS.length}</span>
        </p>
        <ol className="mt-8 space-y-4">
          {STEPS.map((s, i) => {
            const state = i === f.step ? 'current' : i < f.step ? 'done' : 'upcoming';
            return (
              <li
                key={s.id}
                className="flex items-center gap-4"
                aria-current={state === 'current' ? 'step' : undefined}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border text-xs ${
                    state === 'current'
                      ? 'border-champagne bg-champagne text-obsidian'
                      : state === 'done'
                        ? 'border-silver bg-silver text-obsidian'
                        : 'border-silver/25 text-silver-soft'
                  }`}
                >
                  {state === 'done' ? '✓' : i + 1}
                </span>
                <span
                  className={`text-sm ${
                    state === 'current'
                      ? 'text-crystal'
                      : state === 'done'
                        ? 'text-silver'
                        : 'text-silver-soft'
                  }`}
                >
                  {s.name}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-10 max-w-xs text-sm leading-relaxed text-silver">
          Every application is read personally by the house. We accept a limited number of
          celebrations each year.
        </p>
      </aside>

      {/* The step */}
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (isLast) void f.submit();
          else f.next();
        }}
      >
        <fieldset className="border-0 p-0">
          <legend className="sr-only">{current?.name}</legend>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-balance text-2xl leading-snug outline-none sm:text-3xl"
          >
            {current?.legend}
          </h2>
          {current?.hint && <p className="mt-3 text-sm text-silver-soft">{current.hint}</p>}

          <div className="mt-9 animate-fade-up">
            {f.step === 0 && (
              <TextArea
                label="Your celebration"
                name="story"
                rows={8}
                value={f.values.story}
                onChange={(v) => f.setField('story', v)}
                error={f.errors.story}
                placeholder="We imagine a barefoot ceremony at golden hour, somewhere the sea meets the cliffs…"
              />
            )}

            {f.step === 1 && (
              <div className="space-y-7">
                <TextField
                  label="Approximate date"
                  name="eventDate"
                  type="date"
                  value={f.values.eventDate}
                  onChange={(v) => f.setField('eventDate', v)}
                  error={f.errors.eventDate}
                />
                <div>
                  <TextField
                    label="Destination"
                    name="destination"
                    value={f.values.destination}
                    onChange={(v) => f.setField('destination', v)}
                    error={f.errors.destination}
                    placeholder="Where in the world?"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {DESTINATION_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        aria-label={`Use ${chip} as destination`}
                        onClick={() => f.setField('destination', chip)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 ease-luxe ${
                          f.values.destination === chip
                            ? 'border-champagne bg-champagne/10 text-crystal'
                            : 'border-silver/20 text-silver hover:border-silver/40'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {f.step === 2 && (
              <RadioCards<GuestCount>
                name="guestCount"
                options={GUEST_OPTIONS}
                value={f.values.guestCount}
                onChange={(v) => f.setField('guestCount', v)}
                error={f.errors.guestCount}
              />
            )}

            {f.step === 3 && (
              <RadioCards<InvestmentTier>
                name="investmentTier"
                options={INVESTMENT_OPTIONS}
                value={f.values.investmentTier}
                onChange={(v) => f.setField('investmentTier', v)}
                error={f.errors.investmentTier}
              />
            )}

            {f.step === 4 && (
              <div className="space-y-7">
                <TextField
                  label="Full name"
                  name="fullName"
                  autoComplete="name"
                  value={f.values.fullName}
                  onChange={(v) => f.setField('fullName', v)}
                  error={f.errors.fullName}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={f.values.email}
                  onChange={(v) => f.setField('email', v)}
                  error={f.errors.email}
                />
                <div className="grid gap-7 sm:grid-cols-2">
                  <TextField
                    label="Phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={f.values.phone}
                    onChange={(v) => f.setField('phone', v)}
                    error={f.errors.phone}
                  />
                  <TextField
                    label="WhatsApp"
                    name="whatsapp"
                    type="tel"
                    inputMode="tel"
                    optional
                    value={f.values.whatsapp}
                    onChange={(v) => f.setField('whatsapp', v)}
                  />
                </div>
                <TextField
                  label="Instagram"
                  name="instagram"
                  optional
                  placeholder="@"
                  value={f.values.instagram}
                  onChange={(v) => f.setField('instagram', v)}
                />
              </div>
            )}
          </div>
        </fieldset>

        <Honeypot value={f.values.company_website} onChange={(v) => f.setField('company_website', v)} />

        {f.submitError && (
          <p role="alert" className="mt-8 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {f.submitError}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4">
          {f.step > 0 ? (
            <button type="button" onClick={f.back} className="btn-outline" disabled={submitting}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn-gold" disabled={submitting}>
            {submitting ? 'Sending…' : isLast ? 'Submit Private Application' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}
