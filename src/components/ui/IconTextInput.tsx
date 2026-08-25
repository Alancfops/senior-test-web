import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { IconEye, IconEyeOff } from '@/components/icons/AuthIcons';

type IconTextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  type?: 'text' | 'email' | 'password' | 'search';
};

export const IconTextInput = forwardRef<HTMLInputElement, IconTextInputProps>(
  function IconTextInput(
    {
      label,
      error,
      hint,
      leftIcon,
      id,
      type = 'text',
      className = '',
      ...rest
    },
    ref,
  ) {
    const inputId = id ?? rest.name;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--stf-text)]">
            {label}
          </label>
        ) : null}

        <div className="relative">
          {leftIcon ? (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--stf-text-muted)]">
              {leftIcon}
            </span>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            aria-invalid={Boolean(error)}
            aria-describedby={
              [error ? `${inputId}-error` : undefined, hint ? `${inputId}-hint` : undefined]
                .filter(Boolean)
                .join(' ') || undefined
            }
            className={[
              'h-[var(--stf-row-height)] w-full rounded-stf-lg border bg-[var(--stf-surface)] text-sm text-[var(--stf-text)] shadow-stf',
              'placeholder:text-[var(--stf-placeholder)]',
              'focus:border-[var(--stf-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stf-primary)_20%,transparent)]',
              error ? 'border-[var(--stf-error)]' : 'border-[var(--stf-border)]',
              leftIcon ? 'pl-10' : 'px-3',
              isPassword ? 'pr-10' : 'pr-3',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />

          {isPassword ? (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--stf-text-muted)] hover:text-[var(--stf-text)]"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <IconEyeOff className="size-5" /> : <IconEye className="size-5" />}
            </button>
          ) : null}
        </div>

        {hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--stf-text-muted)]">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-[var(--stf-error)]">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
