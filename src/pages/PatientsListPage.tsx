import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { IconEye, IconTrash } from '@/components/icons/ActionIcons';
import { DeletePatientModal } from '@/components/patients/DeletePatientModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchInput } from '@/components/ui/SearchInput';
import { Spinner } from '@/components/ui/Spinner';
import { ActionButton, ActionLink, TableActions } from '@/components/ui/TableActions';
import { useDeletePatient, usePatientsList } from '@/features/patients/usePatients';
import { formatDateTime, formatGender } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';

export function PatientsListPage() {
  const { data, isLoading, isError, error, refetch } = usePatientsList();
  const deletePatient = useDeletePatient();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; fullName: string } | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const errorMessage =
    error instanceof ApiError ? error.message : 'Não foi possível carregar os pacientes.';

  const filteredPatients = useMemo(() => {
    if (!data?.data) return [];
    const query = search.trim().toLowerCase();
    if (!query) return data.data;
    return data.data.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(query) ||
        patient.therapistName.toLowerCase().includes(query),
    );
  }, [data?.data, search]);

  return (
    <AppShell
      title="Pacientes"
      description="Todos os pacientes cadastrados. Visão transversal para o administrador."
      actions={
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar paciente"
          label="Pesquisar paciente"
        />
      }
    >
      {actionError ? (
        <p role="alert" className="mb-4 text-sm text-[var(--stf-error)]">
          {actionError}
        </p>
      ) : null}

      <div className="stf-card overflow-hidden">
        {isLoading ? <Spinner label="Carregando pacientes…" /> : null}
        {isError ? <ErrorState message={errorMessage} onRetry={() => void refetch()} /> : null}

        {!isLoading && !isError && data?.data.length === 0 ? (
          <EmptyState title="Nenhum paciente encontrado" />
        ) : null}

        {!isLoading && !isError && data && data.data.length > 0 && filteredPatients.length === 0 ? (
          <EmptyState title="Nenhum resultado para a busca" />
        ) : null}

        {!isLoading && !isError && filteredPatients.length > 0 ? (
          <div className="overflow-x-hidden">
            <table className="stf-table">
              <caption className="sr-only">Lista de pacientes do sistema</caption>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col" className="w-16">
                    Idade
                  </th>
                  <th scope="col" className="stf-table-col-secondary">
                    Sexo
                  </th>
                  <th scope="col" className="stf-table-col-secondary">
                    Fisioterapeuta
                  </th>
                  <th scope="col" className="stf-table-col-secondary">
                    Avaliações
                  </th>
                  <th scope="col" className="stf-table-col-tertiary">
                    Última avaliação
                  </th>
                  <th scope="col" className="stf-table-col-actions">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="font-medium text-[var(--stf-text)]">
                      <span className="block">{patient.fullName}</span>
                      <span className="mt-1 block text-xs font-normal leading-snug text-[var(--stf-text-muted)] md:hidden">
                        {formatGender(patient.gender)}
                        {' · '}
                        {patient.therapistName}
                        {' · '}
                        {patient.assessmentCount} aval.
                        {patient.lastAssessmentAt
                          ? ` · ${formatDateTime(patient.lastAssessmentAt)}`
                          : ''}
                      </span>
                    </td>
                    <td>{patient.age}</td>
                    <td className="stf-table-col-secondary">{formatGender(patient.gender)}</td>
                    <td className="stf-table-col-secondary">
                      <Link
                        to={`/therapists/${patient.therapistId}`}
                        className="text-[var(--stf-primary)] no-underline hover:underline"
                      >
                        {patient.therapistName}
                      </Link>
                    </td>
                    <td className="stf-table-col-secondary">{patient.assessmentCount}</td>
                    <td className="stf-table-col-tertiary text-[var(--stf-text-muted)]">
                      {formatDateTime(patient.lastAssessmentAt)}
                    </td>
                    <td className="stf-table-col-actions">
                      <TableActions>
                        <ActionLink to={`/patients/${patient.id}`} icon={<IconEye />}>
                          Ver perfil
                        </ActionLink>
                        <ActionButton
                          variant="destructive"
                          icon={<IconTrash />}
                          onClick={() =>
                            setDeleteTarget({
                              id: patient.id,
                              fullName: patient.fullName,
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

      <DeletePatientModal
        open={Boolean(deleteTarget)}
        patientName={deleteTarget?.fullName ?? ''}
        loading={deletePatient.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          setActionError(null);
          try {
            await deletePatient.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
            void refetch();
          } catch (err) {
            setActionError(
              err instanceof ApiError ? err.message : 'Erro ao excluir paciente.',
            );
          }
        }}
      />
    </AppShell>
  );
}
