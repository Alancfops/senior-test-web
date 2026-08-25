import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'outlinePrimary' | 'destructive' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  pill?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--stf-primary)] text-[var(--stf-on-primary)] hover:bg-[var(--stf-primary-dark)] active:bg-[var(--stf-primary-pressed)]',
  outline:
    'border border-[var(--stf-border)] bg-[var(--stf-surface)] text-[var(--stf-text)] hover:bg-[color-mix(in_srgb,var(--stf-primary)_4%,var(--stf-surface))]',
  outlinePrimary:
    'border border-[var(--stf-primary)] bg-[var(--stf-surface)] text-[var(--stf-primary)] hover:bg-[color-mix(in_srgb,var(--stf-primary)_6%,var(--stf-surface))]',
  destructive:
    'bg-[var(--stf-error)] text-[var(--stf-on-primary)] hover:brightness-95 active:brightness-90',
  ghost:
    'bg-transparent text-[var(--stf-text-muted)] hover:bg-[color-mix(in_srgb,var(--stf-primary)_6%,var(--stf-surface))] hover:text-[var(--stf-text)]',
};

export function Button({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  pill = false,
  disabled,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        'inline-flex min-h-[var(--stf-row-height)] items-center justify-center gap-2 rounded-stf px-4 text-sm font-semibold transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-55',
        fullWidth ? 'w-full' : '',
        pill ? 'rounded-full' : '',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading ? (
        <span
          className="inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden
        />
      ) : null}
      {children}
    </button>
  );
}
