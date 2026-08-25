import { Button } from '@/components/ui/Button';

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Não foi possível carregar os dados',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center"
    >
      <div>
        <p className="text-base font-semibold text-[var(--stf-text)]">{title}</p>
        <p className="mt-1 max-w-md text-sm text-[var(--stf-text-muted)]">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="outlinePrimary" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
