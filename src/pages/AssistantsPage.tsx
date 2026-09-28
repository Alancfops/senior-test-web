import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { IconTrash } from '@/components/icons/ActionIcons';
import { DeleteTherapistModal } from '@/components/therapists/DeleteTherapistModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchInput } from '@/components/ui/SearchInput';
import { Spinner } from '@/components/ui/Spinner';
import { EllipsisText, TableMobileMeta, TablePrimaryText } from '@/components/ui/EllipsisText';
import { TableColGroup } from '@/components/ui/TableColGroup';
import { ActionButton, TableActions } from '@/components/ui/TableActions';
import { useAuth } from '@/features/auth/AuthContext';
import { useDeleteTherapist } from '@/features/therapists/useTherapistMutations';
import { useTherapists } from '@/features/therapists/useTherapists';
import { formatDateTime } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';

export function AssistantsPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN';
  const { data, isLoading, isError, error, refetch } = useTherapists({ role: 'ASSISTANT' });
  const deleteTherapist = useDeleteTherapist();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    fullName: string;
    patientCount: number;
  } | null>(null);
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

  return (
    <AppShell
      title="Ajudantes"
      description="Contas de ajudante com acesso ao painel web."
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
          <div className="overflow-x-hidden">
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
                      <TableMobileMeta>
                        {assistant.email}
                        {' · '}
                        {formatDateTime(assistant.createdAt)}
                      </TableMobileMeta>
                    </td>
                    <td className="stf-table-col-secondary text-[var(--stf-text-muted)]">
                      <EllipsisText text={assistant.email} maxLines={2} />
                    </td>
                    <td className="stf-table-col-secondary text-[var(--stf-text-muted)]">
                      {formatDateTime(assistant.createdAt)}
                    </td>
                    <td className="stf-table-col-actions">
                      <TableActions>
                        <ActionButton
                          variant="destructive"
                          icon={<IconTrash />}
                          onClick={() =>
                            setDeleteTarget({
                              id: assistant.id,
                              fullName: assistant.fullName,
                              patientCount: assistant.patientCount,
                            })
                          }
                        >
                          Excluir
                        </ActionButton>
                      </TableActions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <DeleteTherapistModal
        open={Boolean(deleteTarget)}
        therapistName={deleteTarget?.fullName ?? ''}
        patientCount={deleteTarget?.patientCount ?? 0}
        loading={deleteTherapist.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          setActionError(null);
          try {
            await deleteTherapist.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
            void refetch();
          } catch (err) {
            setActionError(err instanceof ApiError ? err.message : 'Erro ao excluir.');
          }
        }}
      />
    </AppShell>
  );
}
