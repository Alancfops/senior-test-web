import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { IconEye, IconTrash, IconTransfer } from '@/components/icons/ActionIcons';
import { DeletePatientModal } from '@/components/patients/DeletePatientModal';
import { TransferPatientModal } from '@/components/patients/TransferPatientModal';
import { DeleteTherapistModal } from '@/components/therapists/DeleteTherapistModal';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Spinner } from '@/components/ui/Spinner';
import { TableMobileMeta, TablePrimaryText } from '@/components/ui/EllipsisText';
import { ActionButton, ActionLink, TableActions } from '@/components/ui/TableActions';
import { TableColGroup } from '@/components/ui/TableColGroup';
import { useDeletePatient, useTransferPatient } from '@/features/patients/usePatients';
import { useDeleteTherapist, useTherapist } from '@/features/therapists/useTherapistMutations';
import { useTherapists } from '@/features/therapists/useTherapists';
import { formatDateTime, formatGender } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';

type PatientAction = {
  id: string;
  fullName: string;
};

export function TherapistDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useTherapist(id);
  const { data: therapistsList } = useTherapists();
  const deleteTherapist = useDeleteTherapist();
  const deletePatient = useDeletePatient();
  const transferPatient = useTransferPatient();

  const [deleteTherapistOpen, setDeleteTherapistOpen] = useState(false);
  const [deletePatientTarget, setDeletePatientTarget] = useState<PatientAction | null>(null);
  const [transferTarget, setTransferTarget] = useState<PatientAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const errorMessage =
    error instanceof ApiError ? error.message : 'Não foi possível carregar o fisioterapeuta.';

  const therapistOptions =
    therapistsList?.data
      .filter((therapist) => therapist.id !== id && therapist.role === 'THERAPIST')
      .map((therapist) => ({ value: therapist.id, label: therapist.fullName })) ?? [];

  return (
    <AppShell
      title={data?.fullName ?? 'Fisioterapeuta'}
      description={data?.email}
      backLink={{ to: '/therapists', label: 'Voltar para fisioterapeutas' }}
      breadcrumbs={
        <Link to="/therapists" className="text-[var(--stf-primary)] no-underline hover:underline">
          Fisioterapeutas
        </Link>
      }
      actions={
        data ? (
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={() => setDeleteTherapistOpen(true)}
          >
            <IconTrash />
            Excluir fisioterapeuta
          </Button>
        ) : null
      }
    >
      {actionError ? (
        <p role="alert" className="mb-4 text-sm text-[var(--stf-error)]">
          {actionError}
        </p>
      ) : null}

      <div className="stf-card overflow-hidden">
        {isLoading ? <Spinner label="Carregando detalhes…" /> : null}
        {isError ? <ErrorState message={errorMessage} onRetry={() => void refetch()} /> : null}

        {data ? (
          <>
            <div className="grid gap-4 border-b border-[var(--stf-border)] px-4 py-4 sm:px-5 md:grid-cols-3">
              <InfoItem label="Cadastro" value={formatDateTime(data.createdAt)} />
              <InfoItem label="Pacientes" value={String(data.meta.patientCount)} />
              <InfoItem label="Avaliações" value={String(data.meta.assessmentCount)} />
            </div>

            {data.patients.length === 0 ? (
              <EmptyState
                title="Nenhum paciente vinculado"
                description="Este fisioterapeuta ainda não possui pacientes cadastrados."
              />
            ) : (
              <div className="overflow-x-hidden">
                <table className="stf-table">
                  <TableColGroup variant="therapist-patients" />
                  <caption className="sr-only">
                    Pacientes vinculados ao fisioterapeuta
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className="stf-table-col-leading">Nome</th>
                      <th scope="col" className="stf-table-col-secondary">Idade</th>
                      <th scope="col" className="stf-table-col-secondary stf-cell-gender">
                        Sexo
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
                    {data.patients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="stf-table-col-leading font-medium text-[var(--stf-text)]">
                          <TablePrimaryText text={patient.fullName} />
                          <TableMobileMeta>
                            {patient.age} anos · {formatGender(patient.gender)}
                            {' · '}
                            {patient.assessmentCount} aval.
                            {patient.lastAssessmentAt
                              ? ` · ${formatDateTime(patient.lastAssessmentAt)}`
                              : ''}
                          </TableMobileMeta>
                        </td>
                        <td className="stf-table-col-secondary">{patient.age}</td>
                        <td className="stf-table-col-secondary stf-cell-gender">
                          {formatGender(patient.gender)}
                        </td>
                        <td className="stf-table-col-secondary">{patient.assessmentCount}</td>
                        <td className="stf-table-col-tertiary text-[var(--stf-text-muted)]">
                          {formatDateTime(patient.lastAssessmentAt)}
                        </td>
                        <td className="stf-table-col-actions">
                          <TableActions>
                            <ActionLink
                              to={`/patients/${patient.id}`}
                              state={{
                                backTo: `/therapists/${id}`,
                                backLabel: 'Voltar para o fisioterapeuta',
                              }}
                              icon={<IconEye />}
                            >
                              Ver perfil
                            </ActionLink>
                            <ActionButton
                              icon={<IconTransfer />}
                              onClick={() =>
                                setTransferTarget({
                                  id: patient.id,
                                  fullName: patient.fullName,
                                })
                              }
                            >
                              Transferir
                            </ActionButton>
                            <ActionButton
                              variant="destructive"
                              icon={<IconTrash />}
                              onClick={() =>
                                setDeletePatientTarget({
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
            )}
          </>
        ) : null}
      </div>

      {data ? (
        <DeleteTherapistModal
          open={deleteTherapistOpen}
          therapistName={data.fullName}
          patientCount={data.meta.patientCount}
          loading={deleteTherapist.isPending}
          onClose={() => setDeleteTherapistOpen(false)}
          onConfirm={async () => {
            setActionError(null);
            try {
              await deleteTherapist.mutateAsync(data.id);
              navigate('/therapists', { replace: true });
            } catch (err) {
              setActionError(err instanceof ApiError ? err.message : 'Erro ao excluir.');
            }
          }}
        />
      ) : null}

      <DeletePatientModal
        open={Boolean(deletePatientTarget)}
        patientName={deletePatientTarget?.fullName ?? ''}
        loading={deletePatient.isPending}
        onClose={() => setDeletePatientTarget(null)}
        onConfirm={async () => {
          if (!deletePatientTarget) return;
          setActionError(null);
          try {
            await deletePatient.mutateAsync(deletePatientTarget.id);
            setDeletePatientTarget(null);
            void refetch();
          } catch (err) {
            setActionError(err instanceof ApiError ? err.message : 'Erro ao excluir paciente.');
          }
        }}
      />

      {data && transferTarget ? (
        <TransferPatientModal
          open={Boolean(transferTarget)}
          patientName={transferTarget.fullName}
          fromTherapistName={data.fullName}
          therapistOptions={therapistOptions}
          loading={transferPatient.isPending}
          onClose={() => setTransferTarget(null)}
          onConfirm={async (targetTherapistId) => {
            setActionError(null);
            try {
              await transferPatient.mutateAsync({
                patientId: transferTarget.id,
                targetTherapistId,
              });
              setTransferTarget(null);
              void refetch();
            } catch (err) {
              setActionError(err instanceof ApiError ? err.message : 'Erro ao transferir.');
            }
          }}
        />
      ) : null}
    </AppShell>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--stf-text)]">{value}</p>
    </div>
  );
}
