import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { IconMail, IconLock } from '@/components/icons/AuthIcons';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { IconTextInput } from '@/components/ui/IconTextInput';
import { useAuth } from '@/features/auth/AuthContext';
import { loginSchema, type LoginFormValues } from '@/features/auth/loginSchema';
import { useLogin } from '@/features/auth/useLogin';
import { ApiError } from '@/lib/api/errors';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = useLogin();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);

    try {
      const response = await loginMutation.mutateAsync(values);
      login(response);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
        return;
      }
      setApiError('Não foi possível fazer login. Tente novamente.');
    }
  });

  return (
    <AuthLayout>
      <div className="stf-card p-4 sm:p-6 md:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <div className="mb-6 flex flex-col items-center sm:mb-8 lg:hidden">
          <img
            src="/logo-seniortest-wordmark.png"
            alt="SeniorTest Physio"
            width={200}
            height={60}
            className="h-10 w-auto sm:h-12"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[var(--stf-primary-dark)] sm:text-3xl">
            Fazer Login
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--stf-text)] sm:text-base">
            Conta exclusiva do painel web, sem vínculo com o app mobile.
          </p>

          <form className="mt-6 space-y-4 sm:mt-8" onSubmit={onSubmit} noValidate>
            <IconTextInput
              type="email"
              placeholder="E-mail"
              autoComplete="email"
              leftIcon={<IconMail className="size-5" />}
              {...register('email')}
              error={errors.email?.message}
            />

            <IconTextInput
              type="password"
              placeholder="Senha"
              autoComplete="current-password"
              leftIcon={<IconLock className="size-5" />}
              {...register('password')}
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between pt-1">
              <Link
                to="/forgot-password"
                className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-[var(--stf-primary)] no-underline hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            {apiError ? (
              <p role="alert" className="text-sm text-[var(--stf-error)]">
                {apiError}
              </p>
            ) : null}

            <Button
              type="submit"
              fullWidth
              pill
              loading={loginMutation.isPending}
              className="mt-2 min-h-11"
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
