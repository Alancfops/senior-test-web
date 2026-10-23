import type { ReactNode } from 'react';
import {
  classificationToneColor,
  type ClassificationTone,
} from '@/features/assessments/classificationTone';

/**
 * Lista em cards para telas < md. A tabela correspondente fica `hidden md:block`,
 * então tablet/desktop continuam com a tabela.
 */
export function MobileCardList({
  countLabel,
  label,
  children,
}: {
  /** Faixa com gradiente acima da lista (ex.: "2 avaliações"). */
  countLabel?: string;
  /** Nome acessível da lista. */
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="md:hidden">
      {countLabel ? (
        <p
          className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--stf-on-primary)]"
          style={{ background: 'var(--stf-header-gradient)' }}
        >
          {countLabel}
        </p>
      ) : null}
      <ul
        aria-label={label}
        className="divide-y divide-[color-mix(in_srgb,var(--stf-border)_60%,transparent)]"
      >
        {children}
      </ul>
    </div>
  );
}

export function MobileCard({
  title,
  subtitle,
  aside,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Badge e/ou ações no canto superior direito. */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li className="px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-base font-semibold leading-snug text-[var(--stf-text)]">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-0.5 break-words text-sm text-[var(--stf-text-muted)]">{subtitle}</p>
          ) : null}
        </div>
        {aside ? <div className="-mr-1.5 -mt-1 flex shrink-0 items-center gap-1">{aside}</div> : null}
      </div>
      {children}
    </li>
  );
}

/** Grade rótulo/valor com divisor acima — duas colunas, `full` ocupa a linha. */
export function MobileCardFields({ children }: { children: ReactNode }) {
  return (
    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[color-mix(in_srgb,var(--stf-border)_60%,transparent)] pt-3">
      {children}
    </dl>
  );
}

export function MobileCardField({
  label,
  children,
  full = false,
  strong = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
  strong?: boolean;
}) {
  return (
    <div className={['min-w-0', full ? 'col-span-2' : ''].join(' ')}>
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
        {label}
      </dt>
      <dd
        className={[
          'mt-0.5 break-words text-sm text-[var(--stf-text)]',
          strong ? 'font-semibold' : '',
        ].join(' ')}
      >
        {children}
      </dd>
    </div>
  );
}

function toneStyles(tone: ClassificationTone) {
  const color = classificationToneColor(tone);
  return {
    backgroundColor: `color-mix(in srgb, ${color} 18%, var(--stf-surface))`,
    color: `color-mix(in srgb, ${color} 45%, var(--stf-text))`,
  };
}

/** Pill com a cor da classificação (ex.: resultado "Estrato 0"). */
export function MobileToneBadge({ tone, children }: { tone: ClassificationTone; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={toneStyles(tone)}
    >
      {children}
    </span>
  );
}

/** Caixa colorida com a interpretação clínica vinda da API. */
export function MobileToneNote({ tone, children }: { tone: ClassificationTone; children: ReactNode }) {
  return (
    <p
      className="mt-3 flex items-start gap-2 rounded-stf-sm px-3 py-2.5 text-sm leading-snug"
      style={toneStyles(tone)}
    >
      <span
        className="mt-1.5 inline-block size-2 shrink-0 rounded-full"
        style={{ backgroundColor: 'currentColor' }}
        aria-hidden
      />
      <span className="min-w-0">{children}</span>
    </p>
  );
}
