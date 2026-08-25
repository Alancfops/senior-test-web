import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { IconMail, IconShieldAlert } from '@/components/icons/AuthIcons';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { IconTextInput } from '@/components/ui/IconTextInput';
import { requestPasswordReset } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/errors';

const schema = z.object({
  email: z.string().trim().email('E-mail inválido.'),
});

type ForgotPasswordValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(values.email);
      navigate('/forgot-password/sent', { state: { email: values.email } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível enviar o e-mail.');
    } finally {
      setLoading(false);
    }
  });

  return (
    <AuthLayout>
      <div className="stf-card p-6 md:p-8">
        <h1 className="text-xl font-bold text-[var(--stf-text)]">Esqueci a senha</h1>

        <div className="mt-6 flex flex-col items-center gap-4 text-center">
          <IconShieldAlert className="size-14 text-[var(--stf-error)]" />
          <p className="text-sm text-[var(--stf-text-muted)]">
            Digite seu e-mail e clique em Enviar para receber instruções de redefinição de senha.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <IconTextInput
            type="email"
            placeholder="Digite seu e-mail"
            autoComplete="email"
            leftIcon={<IconMail className="size-5" />}
            {...register('email')}
            error={errors.email?.message}
          />

          {error ? (
            <p role="alert" className="text-sm text-[var(--stf-error)]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Link to="/login">
              <Button
                type="button"
                variant="outline"
                className="border-[var(--stf-error)] text-[var(--stf-error)] hover:bg-[color-mix(in_srgb,var(--stf-error)_6%,var(--stf-surface))]"
              >
                Cancelar
              </Button>
            </Link>
            <Button type="submit" pill loading={loading}>
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
