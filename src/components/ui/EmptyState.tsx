type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <p className="text-base font-semibold text-[var(--stf-text)]">{title}</p>
      {description ? (
        <p className="max-w-md text-sm text-[var(--stf-text-muted)]">{description}</p>
      ) : null}
    </div>
  );
}
