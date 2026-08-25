import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--stf-page-bg)] px-6 text-center">
      <h1 className="text-2xl font-bold text-[var(--stf-text)]">Página não encontrada</h1>
      <p className="max-w-md text-sm text-[var(--stf-text-muted)]">
        O endereço acessado não existe neste gerenciador.
      </p>
      <Link to="/dashboard">
        <Button variant="outlinePrimary">Ir para o painel</Button>
      </Link>
    </div>
  );
}
