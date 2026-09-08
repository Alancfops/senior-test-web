import type { ReactNode } from 'react';

type EllipsisTextProps = {
  text: string;
  className?: string;
  as?: 'span' | 'p';
  /** Limita linhas no desktop; no mobile o texto quebra livremente. */
  maxLines?: 2 | 3;
};

export function EllipsisText({
  text,
  className = '',
  as: Tag = 'span',
  maxLines,
}: EllipsisTextProps) {
  const clampClass =
    maxLines === 3
      ? 'md:line-clamp-3'
      : maxLines === 2
        ? 'md:line-clamp-2'
        : '';

  return (
    <Tag
      className={[
        'block min-w-0 break-words leading-snug hyphens-none',
        clampClass,
        className,
      ].join(' ')}
      title={text}
    >
      {text}
    </Tag>
  );
}

/** Nome ou título principal em células de tabela — até 2 linhas no tablet/desktop. */
export function TablePrimaryText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  return (
    <EllipsisText
      text={text}
      maxLines={2}
      className={['font-semibold text-[var(--stf-text)]', className].join(' ')}
    />
  );
}

/** Meta secundária abaixo do nome no mobile (email, stats, etc.). */
export function TableMobileMeta({ children }: { children: ReactNode }) {
  return (
    <span className="mt-1.5 block hyphens-none break-words text-xs font-normal leading-relaxed text-[var(--stf-text-muted)] md:hidden">
      {children}
    </span>
  );
}
