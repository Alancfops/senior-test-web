import { forwardRef, type InputHTMLAttributes } from 'react';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ label, error, hint, id, className = '', ...rest }, ref) {
    const inputId = id ?? rest.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--stf-text)]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [error ? `${inputId}-error` : undefined, hint ? `${inputId}-hint` : undefined]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={[
            'h-[var(--stf-row-height)] rounded-stf border bg-[var(--stf-surface)] px-3 text-sm text-[var(--stf-text)]',
            'placeholder:text-[var(--stf-placeholder)]',
            'focus:border-[var(--stf-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stf-primary)_25%,transparent)]',
            error ? 'border-[var(--stf-error)]' : 'border-[var(--stf-border)]',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--stf-text-muted)]">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-[var(--stf-error)]"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
