import type { CardOption } from './fieldConfig';

const inputBase =
  'mt-2 w-full rounded-xl border bg-white/5 px-4 py-3 text-crystal placeholder:text-silver-soft/60 outline-none transition-colors duration-300 ease-luxe';

interface TextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'url';
  optional?: boolean;
}

export function TextField({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
  optional,
}: TextFieldProps) {
  const errId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="flex items-baseline justify-between font-sans text-sm text-crystal">
        <span>{label}</span>
        {optional && <span className="text-xs text-silver-soft">Optional</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`${inputBase} ${error ? 'border-red-400/70' : 'border-silver/20 focus:border-champagne'}`}
      />
      {error && (
        <p id={errId} className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rows?: number;
  placeholder?: string;
}

export function TextArea({ label, name, value, onChange, error, rows = 6, placeholder }: TextAreaProps) {
  const errId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="block font-sans text-sm text-crystal">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`${inputBase} resize-y leading-relaxed ${
          error ? 'border-red-400/70' : 'border-silver/20 focus:border-champagne'
        }`}
      />
      {error && (
        <p id={errId} className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

interface RadioCardsProps<T extends string> {
  name: string;
  options: CardOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
  error?: string;
}

export function RadioCards<T extends string>({
  name,
  options,
  value,
  onChange,
  error,
}: RadioCardsProps<T>) {
  const errId = `${name}-error`;
  return (
    <div
      role="radiogroup"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errId : undefined}
      className="grid gap-3 sm:grid-cols-2"
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 ease-luxe ${
              selected
                ? 'border-champagne bg-champagne/10 ring-1 ring-champagne'
                : 'border-silver/20 hover:border-silver/40'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span className="flex items-center justify-between gap-3">
              <span className="font-display text-xl text-crystal">{opt.title}</span>
              <span
                aria-hidden="true"
                className={`h-3.5 w-3.5 flex-none rounded-full border ${
                  selected ? 'border-champagne bg-champagne' : 'border-silver/40'
                }`}
              />
            </span>
            <span className="mt-1 block text-sm text-silver">{opt.detail}</span>
          </label>
        );
      })}
      {error && (
        <p id={errId} className="text-sm text-red-300 sm:col-span-2">
          {error}
        </p>
      )}
    </div>
  );
}

interface HoneypotProps {
  value: string;
  onChange: (value: string) => void;
}

export function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="company_website">Company website</label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
