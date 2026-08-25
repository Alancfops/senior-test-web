type ClassificationBadgeProps = {
  label: string;
  meta?: Record<string, unknown>;
};

export function ClassificationBadge({ label, meta }: ClassificationBadgeProps) {
  const color =
    typeof meta?.color === 'string' ? meta.color : 'var(--stf-secondary)';

  return (
    <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium text-[var(--stf-text)]">
      <span
        className="inline-block size-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </span>
  );
}
