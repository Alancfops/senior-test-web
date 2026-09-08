import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { IconLock } from '@/components/icons/AuthIcons';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { IconTextInput } from '@/components/ui/IconTextInput';
import { resetTokenSchema } from '@/features/auth/passwordSchema';
import { verifyResetCode } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/errors';

const schema = z.object({
  token: resetTokenSchema,
});

type VerifyFormValues = z.infer<typeof schema>;

type LocationState = { email?: string };

export function ForgotPasswordVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as LocationState | null)?.email?.trim().toLowerCase();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { token: '' },
  });

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await verifyResetCode({ email, token: values.token });
      navigate('/forgot-password/reset', {
        replace: true,
        state: { email, token: values.token },
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível validar o código. Tente novamente.',
      );
    }
  });

  return (
    <AuthLayout>
      <div className="stf-card p-6 md:p-8">
        <h1 className="text-xl font-bold text-[var(--stf-text)]">Informar código</h1>
        <p className="mt-3 text-sm text-[var(--stf-text-muted)]">
          Digite o código de 6 dígitos enviado para{' '}
          <span className="font-medium text-[var(--stf-text)]">{email}</span>.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <IconTextInput
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Código de 6 dígitos"
            maxLength={6}
            leftIcon={<IconLock className="size-5" />}
            {...register('token')}
            error={errors.token?.message}
          />

          {error ? (
            <p role="alert" className="text-sm text-[var(--stf-error)]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link to="/login" className="w-full sm:w-auto">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Voltar ao login
              </Button>
            </Link>
            <Button type="submit" pill loading={isSubmitting} className="w-full sm:w-auto">
              Validar código
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
