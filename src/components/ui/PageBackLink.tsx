import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@/components/icons/NavIcons';

type PageBackLinkProps = {
  to?: string;
  label?: string;
};

export function PageBackLink({ to = '/dashboard', label = 'Voltar ao início' }: PageBackLinkProps) {
  return (
    <Link
      to={to}
      className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--stf-primary)] no-underline hover:underline"
    >
      <IconArrowLeft className="size-4 shrink-0" aria-hidden />
      {label}
    </Link>
  );
}
