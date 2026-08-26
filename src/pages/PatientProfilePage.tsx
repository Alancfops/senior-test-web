import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { IconEye } from '@/components/icons/ActionIcons';
import { ClassificationBadge } from '@/components/ui/ClassificationBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SimpleLineChart } from '@/components/ui/SimpleLineChart';
import { Spinner } from '@/components/ui/Spinner';
import { ActionLink } from '@/components/ui/TableActions';
import {
  usePatient,
  usePatientAssessments,
  useTimeseries,
} from '@/features/patients/usePatients';
import { formatDateTime, formatGender } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';
import { INSTRUMENT_LABELS, SCHOOLING_LABELS } from '@/types/api';

export function PatientProfilePage() {
  const { id = '' } = useParams();
  const { data: patient, isLoading, isError, error, refetch } = usePatient(id);
  const { data: assessmentsData, isLoading: loadingAssessments } = usePatientAssessments(id);

  const instruments = useMemo(() => {
    const codes = new Set(
      assessmentsData?.data.map((item) => item.instrumentCode) ?? [],
    );
    return Array.from(codes);
  }, [assessmentsData]);

  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const activeInstrument = selectedInstrument ?? instruments[0] ?? null;

  const { data: timeseries } = useTimeseries(id, activeInstrument);

  const errorMessage =
    error instanceof ApiError ? error.message : 'Não foi possível carregar o paciente.';

  return (
    <AppShell
      title={patient?.fullName ?? 'Paciente'}
      description="Perfil clínico e histórico de avaliações."
      breadcrumbs={
        <span>
          <Link to="/therapists" className="text-[var(--stf-primary)] no-underline hover:underline">
            Fisioterapeutas
          </Link>
          {' / '}
          {patient ? (
            <Link
              to={`/therapists/${patient.therapist.id}`}
              className="text-[var(--stf-primary)] no-underline hover:underline"
            >
              {patient.therapist.fullName}
            </Link>
          ) : (
            '…'
          )}
        </span>
      }
    >
      {isLoading ? <Spinner label="Carregando paciente…" /> : null}
      {isError ? <ErrorState message={errorMessage} onRetry={() => void refetch()} /> : null}

      {patient ? (
        <div className="space-y-6">
          <section className="stf-card grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-4">
            <InfoItem label="Idade" value={`${patient.age} anos`} />
            <InfoItem label="Sexo" value={formatGender(patient.gender)} />
            <InfoItem label="Contato" value={patient.contact} />
            <InfoItem
              label="Escolaridade"
              value={SCHOOLING_LABELS[patient.schoolingBand] ?? patient.schoolingBand}
            />
            <InfoItem label="Cadastro" value={formatDateTime(patient.createdAt)} />
            <InfoItem label="Fisioterapeuta" value={patient.therapist.fullName} />
          </section>

          <section className="stf-card overflow-hidden">
            <div className="border-b border-[var(--stf-border)] px-4 py-4 sm:px-5">
              <h2 className="text-base font-semibold text-[var(--stf-text)]">
                Histórico de avaliações
              </h2>
            </div>

            {loadingAssessments ? <Spinner label="Carregando avaliações…" /> : null}

            {!loadingAssessments && assessmentsData?.data.length === 0 ? (
              <EmptyState title="Nenhuma avaliação registrada" />
            ) : null}

            {!loadingAssessments && assessmentsData && assessmentsData.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="stf-table">
                  <thead>
                    <tr>
                      <th scope="col">Instrumento</th>
                      <th scope="col" className="stf-table-col-secondary">
                        Status
                      </th>
                      <th scope="col">Resultado</th>
                      <th scope="col" className="stf-table-col-secondary">
                        Classificação
                      </th>
                      <th scope="col" className="stf-table-col-tertiary">
                        Data
                      </th>
                      <th scope="col">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessmentsData.data.map((assessment) => (
                      <tr key={assessment.id}>
                        <td>
                          {INSTRUMENT_LABELS[assessment.instrumentCode] ??
                            assessment.instrumentCode}
                        </td>
                        <td className="stf-table-col-secondary">
                          {assessment.status === 'FINALIZED' ? 'Finalizada' : 'Rascunho'}
                        </td>
                        <td>{assessment.result?.rawLabel ?? '-'}</td>
                        <td className="stf-table-col-secondary">
                          {assessment.result ? (
                            <ClassificationBadge
                              label={assessment.result.classificationLabel}
                              meta={assessment.result.classificationMeta}
                            />
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="stf-table-col-tertiary text-[var(--stf-text-muted)]">
                          {formatDateTime(assessment.finalizedAt ?? assessment.startedAt)}
                        </td>
                        <td>
                          <ActionLink
                            to={`/patients/${id}/assessment/${assessment.id}`}
                            icon={<IconEye />}
                          >
                            Ver detalhe
                          </ActionLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>

          {instruments.length > 0 ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-[var(--stf-text)]">
                  Evolução por instrumento:
                </span>
                {instruments.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedInstrument(code)}
                    className={[
                      'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                      activeInstrument === code
                        ? 'bg-[var(--stf-primary)] text-[var(--stf-on-primary)]'
                        : 'border border-[var(--stf-border)] bg-[var(--stf-surface)] text-[var(--stf-text-muted)]',
                    ].join(' ')}
                  >
                    {INSTRUMENT_LABELS[code] ?? code}
                  </button>
                ))}
              </div>

              {timeseries?.canShowChart && timeseries.points.length >= 2 ? (
                <SimpleLineChart
                  title={`Evolução: ${INSTRUMENT_LABELS[timeseries.instrumentCode] ?? timeseries.instrumentCode}`}
                  points={timeseries.points}
                />
              ) : (
                <div className="stf-card px-5 py-4 text-sm text-[var(--stf-text-muted)]">
                  São necessárias pelo menos duas avaliações finalizadas do mesmo instrumento para
                  exibir o gráfico.
                </div>
              )}
            </section>
          ) : null}
        </div>
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
