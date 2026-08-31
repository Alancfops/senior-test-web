import {
  classificationToneColor,
  resolveClassificationTone,
  type ClassificationTone,
} from '@/features/assessments/classificationTone';

type ClassificationBadgeProps = {
  label: string;
  code?: string;
  meta?: Record<string, unknown>;
  tone?: ClassificationTone;
};

export function ClassificationIndicator({
  tone,
  className = '',
}: {
  tone: ClassificationTone;
  className?: string;
}) {
  return (
    <span
      className={['inline-block size-2 shrink-0 rounded-full', className].filter(Boolean).join(' ')}
      style={{ backgroundColor: classificationToneColor(tone) }}
      aria-hidden
    />
  );
}

export function ClassificationBadge({ label, code, meta, tone }: ClassificationBadgeProps) {
  const resolvedTone = tone ?? resolveClassificationTone({ code, label, meta });

  return (
    <span
      className="inline-flex max-w-full items-start gap-2 rounded-full py-0.5 text-xs font-medium leading-snug text-[var(--stf-text)]"
      title={label}
    >
      <ClassificationIndicator tone={resolvedTone} className="mt-1.5" />
      <span className="min-w-0">{label}</span>
    </span>
  );
}
