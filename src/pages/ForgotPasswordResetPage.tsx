import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { IconLock } from '@/components/icons/AuthIcons';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { IconTextInput } from '@/components/ui/IconTextInput';
import { passwordSchema } from '@/features/auth/passwordSchema';
import { resetPassword } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/errors';

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

type ResetFormValues = z.infer<typeof schema>;

type LocationState = { email?: string; token?: string };

export function ForgotPasswordResetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const email = state?.email?.trim().toLowerCase();
  const token = state?.token?.trim();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const passwordValue = watch('password') ?? '';

  if (!email || !token) {
    return <Navigate to="/forgot-password" replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await resetPassword({ email, token, password: values.password });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível redefinir a senha. Tente novamente.',
      );
    }
  });

  return (
    <AuthLayout>
      <div className="stf-card p-6 md:p-8">
        <h1 className="text-xl font-bold text-[var(--stf-text)]">Nova senha</h1>
        <p className="mt-3 text-sm text-[var(--stf-text-muted)]">
          Defina uma nova senha para a conta administrativa.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <IconTextInput
              label="Nova senha"
              type="password"
              placeholder="Digite a nova senha"
              autoComplete="new-password"
              leftIcon={<IconLock className="size-5" />}
              {...register('password')}
              error={errors.password?.message}
            />
            <PasswordRequirements password={passwordValue} />
          </div>

          <IconTextInput
            label="Confirmar nova senha"
            type="password"
            placeholder="Repita a nova senha"
            autoComplete="new-password"
            leftIcon={<IconLock className="size-5" />}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          {error ? (
            <p role="alert" className="text-sm text-[var(--stf-error)]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link to="/login" className="w-full sm:w-auto">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" pill loading={isSubmitting} className="w-full sm:w-auto">
              Redefinir senha
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
