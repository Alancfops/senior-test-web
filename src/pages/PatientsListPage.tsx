import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { IconEye } from '@/components/icons/ActionIcons';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchInput } from '@/components/ui/SearchInput';
import { Spinner } from '@/components/ui/Spinner';
import { ActionLink } from '@/components/ui/TableActions';
import { usePatientsList } from '@/features/patients/usePatients';
import { formatDateTime, formatGender } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';

export function PatientsListPage() {
  const { data, isLoading, isError, error, refetch } = usePatientsList();
  const [search, setSearch] = useState('');

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
          <div className="overflow-x-auto">
            <table className="stf-table">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Idade</th>
                  <th scope="col" className="stf-table-col-secondary">
                    Sexo
                  </th>
                  <th scope="col">Fisioterapeuta</th>
                  <th scope="col" className="stf-table-col-secondary">
                    Avaliações
                  </th>
                  <th scope="col" className="stf-table-col-tertiary">
                    Última avaliação
                  </th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="font-medium text-[var(--stf-text)]">{patient.fullName}</td>
                    <td>{patient.age}</td>
                    <td className="stf-table-col-secondary">{formatGender(patient.gender)}</td>
                    <td>
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
                    <td>
                      <ActionLink to={`/patients/${patient.id}`} icon={<IconEye />}>
                        Ver perfil
                      </ActionLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
