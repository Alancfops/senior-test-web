import { useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { IconEye, IconTrash } from '@/components/icons/ActionIcons';
import { DeleteTherapistModal } from '@/components/therapists/DeleteTherapistModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchInput } from '@/components/ui/SearchInput';
import { Spinner } from '@/components/ui/Spinner';
import { EllipsisText, TableMobileMeta, TablePrimaryText } from '@/components/ui/EllipsisText';
import { TableColGroup } from '@/components/ui/TableColGroup';
import { ActionButton, ActionLink, TableActions } from '@/components/ui/TableActions';
import { useDeleteTherapist } from '@/features/therapists/useTherapistMutations';
import { useTherapists } from '@/features/therapists/useTherapists';
import { formatDateTime } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';

export function TherapistsListPage() {
  const { data, isLoading, isError, error, refetch } = useTherapists();
  const deleteTherapist = useDeleteTherapist();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    fullName: string;
    patientCount: number;
  } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const errorMessage =
    error instanceof ApiError ? error.message : 'Verifique a conexão com a API STF.';

  const filteredTherapists = useMemo(() => {
    if (!data?.data) return [];
    const query = search.trim().toLowerCase();
    if (!query) return data.data;
    return data.data.filter(
      (therapist) =>
        therapist.fullName.toLowerCase().includes(query) ||
        therapist.email.toLowerCase().includes(query),
    );
  }, [data?.data, search]);

  return (
    <AppShell
      title="Fisioterapeutas"
      description="Equipe cadastrada no sistema."
      actions={
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar fisioterapeuta"
          label="Pesquisar fisioterapeuta"
        />
      }
    >
      {actionError ? (
        <p role="alert" className="mb-4 text-sm text-[var(--stf-error)]">
          {actionError}
        </p>
      ) : null}

      <div className="stf-card overflow-hidden">
        {isLoading ? <Spinner label="Carregando fisioterapeutas…" /> : null}
        {isError ? <ErrorState message={errorMessage} onRetry={() => void refetch()} /> : null}

        {!isLoading && !isError && data?.data.length === 0 ? (
          <EmptyState title="Nenhum fisioterapeuta encontrado" />
        ) : null}

        {!isLoading && !isError && data && data.data.length > 0 && filteredTherapists.length === 0 ? (
          <EmptyState title="Nenhum resultado para a busca" />
        ) : null}

        {!isLoading && !isError && filteredTherapists.length > 0 ? (
          <div className="overflow-x-hidden">
            <table className="stf-table">
              <TableColGroup variant="therapists-list" />
              <caption className="sr-only">Lista de fisioterapeutas cadastrados</caption>
              <thead>
                <tr>
                  <th scope="col" className="stf-table-col-leading">Nome</th>
                  <th scope="col" className="stf-table-col-secondary">
                    E-mail
                  </th>
                  <th scope="col" className="stf-table-col-secondary">
                    Pacientes
                  </th>
                  <th scope="col" className="stf-table-col-secondary">
                    Avaliações
                  </th>
                  <th scope="col" className="stf-table-col-tertiary">
                    Última atividade
                  </th>
                  <th scope="col" className="stf-table-col-actions">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTherapists.map((therapist) => (
                  <tr key={therapist.id}>
                    <td className="stf-table-col-leading font-medium text-[var(--stf-text)]">
                      <TablePrimaryText text={therapist.fullName} />
                      <TableMobileMeta>
                        {therapist.email}
                        {' · '}
                        {therapist.patientCount} pac. · {therapist.assessmentCount} aval.
                        {therapist.lastActivityAt
                          ? ` · ${formatDateTime(therapist.lastActivityAt)}`
                          : ''}
                      </TableMobileMeta>
                    </td>
                    <td className="stf-table-col-secondary text-[var(--stf-text-muted)]">
                      <EllipsisText text={therapist.email} maxLines={2} />
                    </td>
                    <td className="stf-table-col-secondary">{therapist.patientCount}</td>
                    <td className="stf-table-col-secondary">{therapist.assessmentCount}</td>
                    <td className="stf-table-col-tertiary text-[var(--stf-text-muted)]">
                      {formatDateTime(therapist.lastActivityAt)}
                    </td>
                    <td className="stf-table-col-actions">
                      <TableActions>
                        <ActionLink to={`/therapists/${therapist.id}`} icon={<IconEye />}>
                          Ver detalhe
                        </ActionLink>
                        <ActionButton
                          variant="destructive"
                          icon={<IconTrash />}
                          onClick={() =>
                            setDeleteTarget({
                              id: therapist.id,
                              fullName: therapist.fullName,
                              patientCount: therapist.patientCount,
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
