type SpinnerProps = {
  label?: string;
  className?: string;
};

export function Spinner({ label = 'Carregando…', className = '' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center gap-3 py-8 ${className}`}
    >
      <span
        className="inline-block size-6 animate-spin rounded-full border-2 border-[var(--stf-primary)] border-r-transparent"
        aria-hidden
      />
      <span className="text-sm text-[var(--stf-text-muted)]">{label}</span>
    </div>
  );
}
