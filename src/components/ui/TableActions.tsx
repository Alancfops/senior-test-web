import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type ActionVariant = 'primary' | 'destructive';

const variantClasses: Record<ActionVariant, string> = {
  primary:
    'text-[var(--stf-primary)] hover:text-[var(--stf-primary-dark)] focus-visible:text-[var(--stf-primary-dark)]',
  destructive:
    'text-[var(--stf-error)] hover:text-[color-mix(in_srgb,var(--stf-error)_85%,#000)] focus-visible:text-[color-mix(in_srgb,var(--stf-error)_85%,#000)]',
};

const baseClasses =
  'inline-flex size-9 shrink-0 items-center justify-center rounded-stf-sm no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--stf-primary)_8%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--stf-primary)] focus-visible:ring-offset-1';

type ActionLinkProps = LinkProps & {
  icon: ReactNode;
  variant?: ActionVariant;
  children: ReactNode;
};

export function ActionLink({
  icon,
  variant = 'primary',
  children,
  className = '',
  ...rest
}: ActionLinkProps) {
  const label = typeof children === 'string' ? children : undefined;
  return (
    <Link
      className={[baseClasses, variantClasses[variant], className].join(' ')}
      aria-label={label}
      title={label}
      {...rest}
    >
      {icon}
      <span className="sr-only">{children}</span>
    </Link>
  );
}

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  variant?: ActionVariant;
  children: ReactNode;
};

export function ActionButton({
  icon,
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  ...rest
}: ActionButtonProps) {
  const label = typeof children === 'string' ? children : undefined;
  return (
    <button
      type={type}
      className={[baseClasses, variantClasses[variant], className].join(' ')}
      aria-label={label}
      title={label}
      {...rest}
    >
      {icon}
      <span className="sr-only">{children}</span>
    </button>
  );
}

type TableActionsProps = {
  children: ReactNode;
};

export function TableActions({ children }: TableActionsProps) {
  return (
    <div className="stf-table-actions inline-flex flex-nowrap items-center justify-start gap-0">
      {children}
    </div>
  );
}
