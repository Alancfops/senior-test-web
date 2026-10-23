import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EllipsisText, TablePrimaryText } from '@/components/ui/EllipsisText';
import {
  MobileCard,
  MobileCardField,
  MobileCardFields,
  MobileCardList,
} from '@/components/ui/MobileCardList';
import { Spinner } from '@/components/ui/Spinner';
import { TableColGroup } from '@/components/ui/TableColGroup';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/AuthContext';
import {
  useAccessRequests,
  useApproveAccessRequest,
  useRejectAccessRequest,
} from '@/features/access-requests/useAccessRequests';
import { formatDateTime, formatCount } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';
import type { AccessRequestItem } from '@/types/api';

type PendingAction = {
  type: 'approve' | 'reject';
  request: AccessRequestItem;
};

export function AccessRequestsPage() {
  const { user } = useAuth();
  const canManage = Boolean(user?.canManageAccessRequests);
  const { data, isLoading, isError, error, refetch } = useAccessRequests({
    status: 'PENDING',
    enabled: canManage,
  });
  const approveMutation = useApproveAccessRequest();
  const rejectMutation = useRejectAccessRequest();
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!canManage) {
    return <Navigate to="/dashboard" replace />;
  }

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : 'Não foi possível carregar as solicitações.';

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  const handleConfirm = async () => {
    if (!pending) return;
    setActionError(null);
    setActionNotice(null);
    try {
      const result =
        pending.type === 'approve'
          ? await approveMutation.mutateAsync(pending.request.id)
          : await rejectMutation.mutateAsync(pending.request.id);
      if (!result.notificationSent) {
        setActionNotice(
          `Ação concluída, mas o e-mail de aviso para ${pending.request.fullName} não pôde ser enviado.`,
        );
      }
      setPending(null);
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível concluir a ação. Tente novamente.',
      );
      setPending(null);
    }
  };

  const renderActions = (request: AccessRequestItem) => (
    <>
      <Button
        type="button"
        variant="outlinePrimary"
        className="min-h-10 w-full px-3 text-xs sm:w-auto"
        onClick={() => setPending({ type: 'approve', request })}
      >
        Aprovar
      </Button>
      <Button
        type="button"
        variant="outline"
        className="min-h-10 w-full border-[var(--stf-error)] px-3 text-xs text-[var(--stf-error)] hover:bg-[color-mix(in_srgb,var(--stf-error)_6%,var(--stf-surface))] sm:w-auto"
        onClick={() => setPending({ type: 'reject', request })}
      >
        Rejeitar
      </Button>
    </>
  );

  return (
    <AppShell
      title="Solicitações de acesso"
      description="Pedidos de alunos com conta no app para atuar como ajudante no painel web."
      backLink={{ to: '/dashboard', label: 'Voltar ao início' }}
    >
      {actionError ? (
        <p role="alert" className="mb-4 text-sm text-[var(--stf-error)]">
          {actionError}
        </p>
      ) : null}

      {actionNotice ? (
        <p role="status" className="mb-4 text-sm text-[var(--stf-text-muted)]">
          {actionNotice}
        </p>
      ) : null}

      <div className="stf-card overflow-hidden">
        {isLoading ? <Spinner label="Carregando solicitações…" /> : null}
        {isError ? <ErrorState message={errorMessage} onRetry={() => void refetch()} /> : null}

        {!isLoading && !isError && data?.data.length === 0 ? (
          <EmptyState title="Nenhuma solicitação pendente" />
        ) : null}

        {!isLoading && !isError && data && data.data.length > 0 ? (
          <>
            <MobileCardList
              label="Solicitações de acesso administrativo pendentes"
              countLabel={formatCount(data.data.length, 'solicitação', 'solicitações')}
            >
              {data.data.map((request) => (
                <MobileCard key={request.id} title={request.fullName}>
                  <MobileCardFields>
                    <MobileCardField label="E-mail" full>
                      {request.email}
                    </MobileCardField>
                    <MobileCardField label="Data" full>
                      {formatDateTime(request.createdAt)}
                    </MobileCardField>
                  </MobileCardFields>
                  <div className="mt-3 grid grid-cols-2 gap-2">{renderActions(request)}</div>
                </MobileCard>
              ))}
            </MobileCardList>
            <div className="hidden overflow-x-hidden md:block">
              <table className="stf-table">
                <TableColGroup variant="access-requests" />
                <caption className="sr-only">Solicitações de acesso administrativo pendentes</caption>
                <thead>
                  <tr>
                    <th scope="col" className="stf-table-col-leading">
                      Nome
                    </th>
                    <th scope="col" className="stf-table-col-secondary">
                      E-mail
                    </th>
                    <th scope="col" className="stf-table-col-secondary">
                      Data
                    </th>
                    <th scope="col" className="stf-table-col-actions">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((request) => (
                    <tr key={request.id}>
                      <td className="stf-table-col-leading font-medium text-[var(--stf-text)]">
                        <TablePrimaryText text={request.fullName} />
                      </td>
                      <td className="stf-table-col-secondary text-[var(--stf-text-muted)]">
                        <EllipsisText text={request.email} maxLines={2} />
                      </td>
                      <td className="stf-table-col-secondary text-[var(--stf-text-muted)]">
                        {formatDateTime(request.createdAt)}
                      </td>
                      <td className="stf-table-col-actions">
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                          {renderActions(request)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>

      <ConfirmModal
        open={pending?.type === 'approve'}
        title="Aprovar solicitação"
        description={
          pending ? (
            <p>
              A conta do app de <strong className="font-semibold">{pending.request.fullName}</strong> (
              {pending.request.email}) passará a ter acesso de{' '}
              <strong className="font-semibold">ajudante</strong> ao gerenciador web, com a mesma
              senha do app. Um e-mail avisará sobre a aprovação.
            </p>
          ) : null
        }
        confirmLabel="Aprovar"
        loading={isMutating}
        onConfirm={() => void handleConfirm()}
        onClose={() => setPending(null)}
      />

      <ConfirmModal
        open={pending?.type === 'reject'}
        title="Rejeitar solicitação"
        description={
          pending ? (
            <p>
              Confirma a rejeição do pedido de{' '}
              <strong className="font-semibold">{pending.request.fullName}</strong> (
              {pending.request.email})? Um e-mail avisará que a solicitação não foi aceita. A conta
              no app continua funcionando normalmente.
            </p>
          ) : null
        }
        confirmLabel="Rejeitar"
        destructive
        loading={isMutating}
        onConfirm={() => void handleConfirm()}
        onClose={() => setPending(null)}
      />
    </AppShell>
  );
}
