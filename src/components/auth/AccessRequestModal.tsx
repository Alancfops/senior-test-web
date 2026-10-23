import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconLock, IconMail, IconUser } from '@/components/icons/AuthIcons';
import { Button } from '@/components/ui/Button';
import { IconTextInput } from '@/components/ui/IconTextInput';
import { Modal } from '@/components/ui/Modal';
import { requestAdminAccess } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/errors';
import {
  adminAccessRequestSchema,
  type AdminAccessRequestFormValues,
} from '@/features/auth/passwordSchema';

const EMPTY_VALUES: AdminAccessRequestFormValues = { email: '', fullName: '', password: '' };

type AccessRequestModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AccessRequestModal({ open, onClose }: AccessRequestModalProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminAccessRequestFormValues>({
    resolver: zodResolver(adminAccessRequestSchema),
    defaultValues: EMPTY_VALUES,
  });

  const handleClose = () => {
    setSuccessMessage(null);
    setApiError(null);
    reset(EMPTY_VALUES);
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    try {
      const response = await requestAdminAccess(values);
      setSuccessMessage(
        response.message ||
          'Se os dados estiverem corretos, sua solicitação será analisada. Você receberá um e-mail quando houver uma resposta.',
      );
      reset(EMPTY_VALUES);
    } catch (error) {
      setApiError(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível enviar a solicitação. Tente novamente.',
      );
    }
  });

  return (
    <Modal
      open={open}
      title={successMessage ? 'Solicitação enviada' : 'Solicitar acesso'}
      onClose={handleClose}
      size="sm"
      footer={
        successMessage ? (
          <Button type="button" pill fullWidth className="sm:w-auto" onClick={handleClose}>
            Fechar
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="access-request-form"
              pill
              loading={isSubmitting}
              className="w-full sm:w-auto"
            >
              Enviar solicitação
            </Button>
          </>
        )
      }
    >
      {successMessage ? (
        <p className="text-sm text-[var(--stf-text)]" role="status">
          {successMessage}
        </p>
      ) : (
        <form
          id="access-request-form"
          className="space-y-4 text-left"
          onSubmit={onSubmit}
          noValidate
          autoComplete="off"
        >
          <p className="text-sm text-[var(--stf-text-muted)]">
            Para ser ajudante, você precisa ter uma conta no app Sênior Teste. Informe seus dados
            e a senha do app: a professora analisará o pedido e você receberá um e-mail com a
            resposta.
          </p>

          <IconTextInput
            type="text"
            placeholder="Nome completo"
            autoComplete="name"
            leftIcon={<IconUser className="size-5" />}
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          <IconTextInput
            type="email"
            placeholder="E-mail"
            autoComplete="off"
            leftIcon={<IconMail className="size-5" />}
            {...register('email')}
            error={errors.email?.message}
          />

          <IconTextInput
            type="password"
            placeholder="Senha do app"
            autoComplete="new-password"
            leftIcon={<IconLock className="size-5" />}
            hint="Use a mesma senha do app Sênior Teste."
            {...register('password')}
            error={errors.password?.message}
          />

          {apiError ? (
            <p role="alert" className="text-sm text-[var(--stf-error)]">
              {apiError}
            </p>
          ) : null}
        </form>
      )}
    </Modal>
  );
}
