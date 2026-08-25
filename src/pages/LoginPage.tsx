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
import { isMockMode } from '@/lib/api/config';
import { ApiError } from '@/lib/api/errors';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = useLogin();
  const [apiError, setApiError] = useState<string | null>(null);
  const prototypeMode = isMockMode();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const completeLogin = async (values: LoginFormValues) => {
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
  };

  const onSubmit = handleSubmit(completeLogin);

  const onPrototypeEnter = () => {
    void completeLogin({ email: 'admin@clinica.exemplo', password: 'prototype' });
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex flex-col items-center lg:hidden">
        <img
          src="/logo-seniortest-physio.png"
          alt="SeniorTest Physio"
          width={112}
          height={112}
          className="rounded-full shadow-stf ring-2 ring-[color-mix(in_srgb,var(--stf-primary)_12%,var(--stf-surface))]"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-[var(--stf-primary-dark)]">Entrar</h1>
        <p className="mt-2 text-base font-medium text-[var(--stf-text)]">
          {prototypeMode
            ? 'Modo protótipo — clique em Entrar para acessar o painel.'
            : 'Conta exclusiva do painel web — sem vínculo com o app mobile.'}
        </p>

        {prototypeMode ? (
          <div className="mt-8 space-y-4">
            {apiError ? (
              <p role="alert" className="text-sm text-[var(--stf-error)]">
                {apiError}
              </p>
            ) : null}

            <Button
              type="button"
              fullWidth
              pill
              loading={loginMutation.isPending}
              onClick={onPrototypeEnter}
            >
              Entrar
            </Button>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
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
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--stf-primary)] no-underline hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            {apiError ? (
              <p role="alert" className="text-sm text-[var(--stf-error)]">
                {apiError}
              </p>
            ) : null}

            <Button type="submit" fullWidth pill loading={loginMutation.isPending} className="mt-2">
              Entrar
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
