import { Link, useLocation } from 'react-router-dom';
import { IconSend } from '@/components/icons/AuthIcons';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';

export function ForgotPasswordSentPage() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  return (
    <AuthLayout>
      <div className="stf-card p-6 text-center md:p-8">
        <h1 className="text-xl font-bold text-[var(--stf-text)]">Esqueci a senha</h1>

        <div className="mt-8 flex flex-col items-center gap-4">
          <IconSend className="size-14 text-[var(--stf-primary)]" />
          <p className="text-sm text-[var(--stf-text-muted)]">
            {email
              ? `Sua solicitação foi registrada. Se existir uma conta admin para ${email}, você receberá as instruções em instantes.`
              : 'Sua solicitação foi registrada. Se existir uma conta admin para este e-mail, você receberá as instruções em instantes.'}
          </p>
        </div>

        <Link to="/login" className="mt-8 inline-block">
          <Button variant="outlinePrimary" pill>
            Voltar ao login
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
