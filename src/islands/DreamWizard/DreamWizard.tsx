import { useState, useEffect, useCallback } from 'react';
import type { WizardSelections } from './wizardConfig';
import {
  WIZARD_STEPS,
  TYPE_LABELS,
  LOCATION_LABELS,
  STYLE_LABELS,
  GUEST_LABELS,
  TIMELINE_LABELS,
  buildStory,
  buildApplyUrl,
} from './wizardConfig';

const TOTAL = WIZARD_STEPS.length;

export default function DreamWizard() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Partial<WizardSelections>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  const isSummary = step >= TOTAL;
  const currentStepCfg = WIZARD_STEPS[step];

  const choose = useCallback(
    (optionId: string) => {
      if (pendingId !== null) return;
      setPendingId(optionId);
      const delay = reducedMotion ? 80 : 380;
      setTimeout(() => {
        setSelections((prev) => ({
          ...prev,
          [currentStepCfg!.key]: optionId,
        }));
        setPendingId(null);
        setStep((s) => s + 1);
      }, delay);
    },
    [pendingId, currentStepCfg, reducedMotion]
  );

  const goBack = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const beginJourney = useCallback(() => {
    window.location.href = buildApplyUrl(selections as WizardSelections);
  }, [selections]);

  if (isSummary) {
    return (
      <SummaryScreen
        selections={selections as WizardSelections}
        onBack={() => setStep(TOTAL - 1)}
        onBegin={beginJourney}
      />
    );
  }

  const opts = currentStepCfg!.options;
  const is4col = opts.length === 4;

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Progress dots */}
      <div
        className="mb-10 flex items-center justify-center gap-2"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL}
        aria-label={`Step ${step + 1} of ${TOTAL}`}
      >
        {WIZARD_STEPS.map((_, i) => (
          <span
            key={i}
            className={`wizard-dot ${i < step ? 'wizard-dot-done' : i === step ? 'wizard-dot-current' : ''}`}
          />
        ))}
      </div>

      {/* Step content — key triggers re-mount → re-animation */}
      <div key={step} className="wizard-step">
        <p className="eyebrow text-center text-champagne">
          Step {step + 1} of {TOTAL}
        </p>
        <h2 className="mt-3 text-balance text-center text-2xl font-light leading-tight text-crystal sm:text-3xl">
          {currentStepCfg!.question}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-silver-soft">
          {currentStepCfg!.subtext}
        </p>

        {/* Option cards */}
        <div
          className={`mt-8 grid gap-3 ${
            is4col
              ? 'grid-cols-2 sm:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-3'
          }`}
        >
          {opts.map((opt) => {
            const isPending = pendingId === opt.id;
            const wasSelected =
              !isSummary && selections[currentStepCfg!.key] === opt.id;
            const isActive = isPending || wasSelected;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt.id)}
                disabled={pendingId !== null && !isPending}
                aria-pressed={isActive}
                className={`wizard-card ${isActive ? 'wizard-card-active' : ''}`}
              >
                <span
                  className="mb-1 block font-display text-2xl text-champagne"
                  aria-hidden="true"
                >
                  {isPending ? '✓' : opt.icon}
                </span>
                <span className="block text-sm font-medium leading-snug text-crystal sm:text-base">
                  {opt.label}
                </span>
                <span className="mt-1 block text-xs leading-snug text-silver-soft">
                  {opt.detail}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Back nav */}
      {step > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={goBack}
            className="btn-ghost-light text-sm"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

function SummaryScreen({
  selections,
  onBack,
  onBegin,
}: {
  selections: WizardSelections;
  onBack: () => void;
  onBegin: () => void;
}) {
  const story = buildStory(selections);

  const items = [
    { label: 'Celebration', value: TYPE_LABELS[selections.type] ?? selections.type },
    { label: 'Location', value: LOCATION_LABELS[selections.location] ?? selections.location },
    { label: 'Aesthetic', value: STYLE_LABELS[selections.style] ?? selections.style },
    { label: 'Gathering', value: GUEST_LABELS[selections.guests] ?? selections.guests },
    { label: 'Timeline', value: TIMELINE_LABELS[selections.timeline] ?? selections.timeline },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4">
      {/* Progress — show all complete */}
      <div className="mb-10 flex items-center justify-center gap-2" aria-hidden="true">
        {WIZARD_STEPS.map((_, i) => (
          <span key={i} className="wizard-dot wizard-dot-done" />
        ))}
      </div>

      <div className="wizard-step">
        <p className="eyebrow text-center text-champagne">Your Vision · Complete</p>
        <h2 className="mt-3 text-balance text-center text-2xl font-light leading-tight text-crystal sm:text-3xl">
          Here is what you have told us.
        </h2>

        {/* Vision card */}
        <div className="wizard-summary-card mt-8">
          <ul className="divide-y divide-silver/10">
            {items.map((item) => (
              <li
                key={item.label}
                className="flex items-baseline justify-between gap-4 py-3.5"
              >
                <span className="eyebrow text-silver-soft">{item.label}</span>
                <span className="text-right text-sm text-crystal">{item.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-silver/10 pt-5 text-sm leading-relaxed text-silver italic">
            &ldquo;{story}&rdquo;
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onBegin}
            className="btn-gold sheen w-full sm:w-auto"
          >
            Begin Your Journey
          </button>
          <button
            type="button"
            onClick={onBack}
            className="btn-ghost-light text-sm"
          >
            ← Edit selection
          </button>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-silver-soft">
          Your vision is transferred privately to your application. Nix and Tayne
          read every one personally, no obligations, no pressure.
        </p>
      </div>
    </div>
  );
}
