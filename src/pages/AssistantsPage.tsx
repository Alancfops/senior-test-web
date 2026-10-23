import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { IconUserMinus } from '@/components/icons/ActionIcons';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchInput } from '@/components/ui/SearchInput';
import { Spinner } from '@/components/ui/Spinner';
import { EllipsisText, TablePrimaryText } from '@/components/ui/EllipsisText';
import {
  MobileCard,
  MobileCardField,
  MobileCardFields,
  MobileCardList,
} from '@/components/ui/MobileCardList';
import { TableColGroup } from '@/components/ui/TableColGroup';
import { ActionButton, TableActions } from '@/components/ui/TableActions';
import { useAuth } from '@/features/auth/AuthContext';
import { useRevokeAssistant } from '@/features/therapists/useTherapistMutations';
import { useTherapists } from '@/features/therapists/useTherapists';
import { formatDateTime, formatCount } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';
import type { TherapistListItem } from '@/types/api';

export function AssistantsPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN';
  const { data, isLoading, isError, error, refetch } = useTherapists({ role: 'ASSISTANT' });
  const revokeAssistant = useRevokeAssistant();
  const [search, setSearch] = useState('');
  const [revokeTarget, setRevokeTarget] = useState<{ id: string; fullName: string } | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredAssistants = useMemo(() => {
    if (!data?.data) return [];
    const query = search.trim().toLowerCase();
    if (!query) return data.data;
    return data.data.filter(
      (assistant) =>
        assistant.fullName.toLowerCase().includes(query) ||
        assistant.email.toLowerCase().includes(query),
    );
  }, [data?.data, search]);

  if (!canManage) {
    return <Navigate to="/dashboard" replace />;
  }

  const errorMessage =
    error instanceof ApiError ? error.message : 'Verifique a conexão com a API STF.';

  const renderActions = (assistant: TherapistListItem) => (
    <TableActions>
      <ActionButton
        variant="destructive"
        icon={<IconUserMinus />}
        onClick={() => setRevokeTarget({ id: assistant.id, fullName: assistant.fullName })}
      >
        Revogar acesso
      </ActionButton>
    </TableActions>
  );

  return (
    <AppShell
      backLink={{ to: '/dashboard', label: 'Voltar ao início' }}
      title="Ajudantes"
      description="Alunos com conta no app que têm acesso de ajudante ao painel web."
      actions={
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar ajudante"
          label="Pesquisar ajudante"
        />
      }
    >
      {actionError ? (
        <p role="alert" className="mb-4 text-sm text-[var(--stf-error)]">
          {actionError}
        </p>
      ) : null}

      <div className="stf-card overflow-hidden">
        {isLoading ? <Spinner label="Carregando ajudantes…" /> : null}
        {isError ? <ErrorState message={errorMessage} onRetry={() => void refetch()} /> : null}

        {!isLoading && !isError && data?.data.length === 0 ? (
          <EmptyState title="Nenhum ajudante encontrado" />
        ) : null}

        {!isLoading && !isError && data && data.data.length > 0 && filteredAssistants.length === 0 ? (
          <EmptyState title="Nenhum resultado para a busca" />
        ) : null}

        {!isLoading && !isError && filteredAssistants.length > 0 ? (
          <>
            <MobileCardList
              label="Lista de ajudantes cadastrados"
              countLabel={formatCount(filteredAssistants.length, 'ajudante', 'ajudantes')}
            >
              {filteredAssistants.map((assistant) => (
                <MobileCard
                  key={assistant.id}
                  title={assistant.fullName}
                  aside={renderActions(assistant)}
                >
                  <MobileCardFields>
                    <MobileCardField label="E-mail" full>
                      {assistant.email}
                    </MobileCardField>
                    <MobileCardField label="Criado em" full>
                      {formatDateTime(assistant.createdAt)}
                    </MobileCardField>
                  </MobileCardFields>
                </MobileCard>
              ))}
            </MobileCardList>
            <div className="hidden overflow-x-hidden md:block">
              <table className="stf-table">
                <TableColGroup variant="access-requests" />
                <caption className="sr-only">Lista de ajudantes cadastrados</caption>
                <thead>
                  <tr>
                    <th scope="col" className="stf-table-col-leading">Nome</th>
                    <th scope="col" className="stf-table-col-secondary">
                      E-mail
                    </th>
                    <th scope="col" className="stf-table-col-secondary">
                      Criado em
                    </th>
                    <th scope="col" className="stf-table-col-actions">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssistants.map((assistant) => (
                    <tr key={assistant.id}>
                      <td className="stf-table-col-leading font-medium text-[var(--stf-text)]">
                        <TablePrimaryText text={assistant.fullName} />
                      </td>
                      <td className="stf-table-col-secondary text-[var(--stf-text-muted)]">
                        <EllipsisText text={assistant.email} maxLines={2} />
                      </td>
                      <td className="stf-table-col-secondary text-[var(--stf-text-muted)]">
                        {formatDateTime(assistant.createdAt)}
                      </td>
                      <td className="stf-table-col-actions">
                        {renderActions(assistant)}
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
        open={Boolean(revokeTarget)}
        title="Revogar acesso de ajudante"
        description={
          revokeTarget ? (
            <p>
              <strong className="font-semibold">{revokeTarget.fullName}</strong> perderá o acesso ao
              gerenciador web. A conta, os pacientes e as avaliações no app continuam
              normalmente. Para voltar a ser ajudante, será preciso uma nova solicitação.
            </p>
          ) : null
        }
        confirmLabel="Revogar acesso"
        destructive
        loading={revokeAssistant.isPending}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => {
          if (!revokeTarget) return;
          setActionError(null);
          revokeAssistant
            .mutateAsync(revokeTarget.id)
            .then(() => setRevokeTarget(null))
            .catch((err: unknown) => {
              setRevokeTarget(null);
              setActionError(
                err instanceof ApiError ? err.message : 'Não foi possível revogar o acesso.',
              );
            });
        }}
      />
    </AppShell>
  );
}
