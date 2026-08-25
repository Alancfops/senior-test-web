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
  'inline-flex items-center gap-1.5 text-sm font-medium no-underline transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--stf-primary)] focus-visible:ring-offset-1 rounded-stf-sm px-0.5 -mx-0.5';

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
  return (
    <Link className={[baseClasses, variantClasses[variant], className].join(' ')} {...rest}>
      {icon}
      <span>{children}</span>
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
  return (
    <button
      type={type}
      className={[baseClasses, variantClasses[variant], className].join(' ')}
      {...rest}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

type TableActionsProps = {
  children: ReactNode;
};

export function TableActions({ children }: TableActionsProps) {
  return <div className="flex flex-wrap items-center gap-x-6 gap-y-2">{children}</div>;
}
