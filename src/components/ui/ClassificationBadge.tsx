type ClassificationBadgeProps = {
  label: string;
  meta?: Record<string, unknown>;
};

export function ClassificationBadge({ label, meta }: ClassificationBadgeProps) {
  const color =
    typeof meta?.color === 'string' ? meta.color : 'var(--stf-secondary)';

  return (
    <span
      className="inline-flex max-w-full items-start gap-2 rounded-full py-0.5 text-xs font-medium leading-snug text-[var(--stf-text)]"
      title={label}
    >
      <span
        className="mt-1.5 inline-block size-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="min-w-0">{label}</span>
    </span>
  );
}
