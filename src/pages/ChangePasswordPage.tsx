import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { IconLock } from '@/components/icons/AuthIcons';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { IconTextInput } from '@/components/ui/IconTextInput';
import { useAuth } from '@/features/auth/AuthContext';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/features/auth/passwordSchema';
import { changePassword } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/errors';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const { updateUser, logout } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const newPasswordValue = watch('newPassword') ?? '';

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      updateUser({ mustChangePassword: false });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setApiError(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível alterar a senha. Tente novamente.',
      );
    }
  });

  return (
    <AuthLayout>
      <div className="stf-card p-4 sm:p-6 md:p-8">
        <h1 className="text-center text-2xl font-bold text-[var(--stf-primary-dark)] sm:text-left sm:text-xl">
          Alterar senha
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--stf-text-muted)] sm:text-left">
          Use a senha temporária do e-mail (válida por 5 minutos) e defina uma nova senha para acessar
          o painel.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <IconTextInput
            label="Senha temporária"
            type="password"
            placeholder="Senha recebida por e-mail"
            autoComplete="current-password"
            leftIcon={<IconLock className="size-5" />}
            {...register('currentPassword')}
            error={errors.currentPassword?.message}
            hint="É a senha que chegou no e-mail ao aprovar o acesso (válida por 5 minutos)."
          />

          <div className="space-y-2">
            <IconTextInput
              label="Nova senha"
              type="password"
              placeholder="Digite a nova senha"
              autoComplete="new-password"
              leftIcon={<IconLock className="size-5" />}
              {...register('newPassword')}
              error={errors.newPassword?.message}
            />
            <PasswordRequirements password={newPasswordValue} />
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

          {apiError ? (
            <p role="alert" className="text-sm text-[var(--stf-error)]">
              {apiError}
            </p>
          ) : null}

          <Button type="submit" fullWidth pill loading={isSubmitting} className="min-h-11">
            Salvar nova senha
          </Button>
        </form>

        <button
          type="button"
          onClick={logout}
          className="mt-4 flex min-h-11 w-full items-center justify-center text-sm font-medium text-[var(--stf-text-muted)] hover:text-[var(--stf-error)]"
        >
          Sair e voltar ao login
        </button>
      </div>
    </AuthLayout>
  );
}
