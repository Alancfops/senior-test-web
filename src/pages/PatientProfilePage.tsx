import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { IconEye } from '@/components/icons/ActionIcons';
import { ClassificationBadge } from '@/components/ui/ClassificationBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EvolutionLineChart } from '@/components/ui/EvolutionLineChart';
import { SelectField } from '@/components/ui/SelectField';
import { Spinner } from '@/components/ui/Spinner';
import { EllipsisText, TableMobileMeta } from '@/components/ui/EllipsisText';
import { ActionLink } from '@/components/ui/TableActions';
import { TableColGroup } from '@/components/ui/TableColGroup';
import {
  CHART_EMPTY_MESSAGE,
  CHART_IMPROVEMENT_HINT,
  getChartMaxValue,
  isChartInstrumentCode,
  mapTimeseriesToChartPoints,
} from '@/features/assessments/chartConfig';
import {
  usePatient,
  usePatientAssessments,
  useTimeseries,
} from '@/features/patients/usePatients';
import { formatDateTime, formatGender } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';
import { INSTRUMENT_LABELS, SCHOOLING_LABELS } from '@/types/api';
import { readBackNavigation } from '@/lib/navigation/backNavigation';

export function PatientProfilePage() {
  const { id = '' } = useParams();
  const location = useLocation();
  const { data: patient, isLoading, isError, error, refetch } = usePatient(id);
  const { data: assessmentsData, isLoading: loadingAssessments } = usePatientAssessments(id);

  const finalizedAssessments = useMemo(
    () => assessmentsData?.data.filter((item) => item.status === 'FINALIZED') ?? [],
    [assessmentsData],
  );

  const instruments = useMemo(() => {
    const codes = new Set(finalizedAssessments.map((item) => item.instrumentCode));
    return Array.from(codes);
  }, [finalizedAssessments]);

  const [historyInstrument, setHistoryInstrument] = useState<string>('all');
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const activeInstrument = selectedInstrument ?? instruments[0] ?? null;

  const filteredHistory = useMemo(() => {
    if (historyInstrument === 'all') return finalizedAssessments;
    return finalizedAssessments.filter((item) => item.instrumentCode === historyInstrument);
  }, [finalizedAssessments, historyInstrument]);

  const historyInstrumentOptions = useMemo(
    () => [
      { value: 'all', label: 'Todos os instrumentos' },
      ...instruments.map((code) => ({
        value: code,
        label: INSTRUMENT_LABELS[code] ?? code,
      })),
    ],
    [instruments],
  );

  const { data: timeseries, isLoading: loadingTimeseries } = useTimeseries(id, activeInstrument);

  const chartPoints = useMemo(
    () => (timeseries ? mapTimeseriesToChartPoints(timeseries.points) : []),
    [timeseries],
  );

  const chartMaxValue = useMemo(() => {
    if (!activeInstrument || !isChartInstrumentCode(activeInstrument)) {
      const peak = chartPoints.length > 0 ? Math.max(...chartPoints.map((p) => p.value)) : 10;
      return Math.max(10, Math.ceil(peak * 1.2));
    }
    return getChartMaxValue(activeInstrument, chartPoints);
  }, [activeInstrument, chartPoints]);

  const chartExplanation =
    activeInstrument && isChartInstrumentCode(activeInstrument)
      ? CHART_IMPROVEMENT_HINT[activeInstrument]
      : undefined;

  const errorMessage =
    error instanceof ApiError ? error.message : 'Não foi possível carregar o paciente.';

  const backNav = readBackNavigation(location.state, {
    backTo: patient ? `/therapists/${patient.therapist.id}` : '/patients',
    backLabel: patient ? 'Voltar para o fisioterapeuta' : 'Voltar para pacientes',
  });

  return (
    <AppShell
      title={patient?.fullName ?? 'Paciente'}
      description="Perfil clínico e histórico de avaliações."
      backLink={{ to: backNav.backTo, label: backNav.backLabel }}
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
            <InfoItem label="Fisioterapeuta" value={patient.therapist.fullName} truncate />
          </section>

          <section className="stf-card overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-[var(--stf-border)] px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
              <h2 className="text-base font-semibold text-[var(--stf-text)]">
                Histórico de avaliações
              </h2>
              {instruments.length > 0 ? (
                <div className="w-full sm:max-w-xs">
                  <SelectField
                    label="Filtrar instrumento"
                    options={historyInstrumentOptions}
                    value={historyInstrument}
                    onChange={(event) => setHistoryInstrument(event.target.value)}
                  />
                </div>
              ) : null}
            </div>

            {loadingAssessments ? <Spinner label="Carregando avaliações…" /> : null}

            {!loadingAssessments && finalizedAssessments.length === 0 ? (
              <EmptyState title="Nenhuma avaliação finalizada" />
            ) : null}

            {!loadingAssessments &&
            finalizedAssessments.length > 0 &&
            filteredHistory.length === 0 ? (
              <EmptyState title="Nenhuma avaliação para o filtro selecionado" />
            ) : null}

            {!loadingAssessments && filteredHistory.length > 0 ? (
              <div className="overflow-x-hidden">
                <table className="stf-table">
                  <TableColGroup variant="patient-assessments" />
                  <caption className="sr-only">
                    Histórico de avaliações finalizadas do paciente
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className="stf-table-col-leading">Instrumento</th>
                      <th scope="col" className="stf-table-col-secondary">Resultado</th>
                      <th scope="col" className="stf-table-col-secondary">Classificação</th>
                      <th scope="col" className="stf-table-col-secondary">
                        Data
                      </th>
                      <th scope="col" className="stf-table-col-actions">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((assessment) => (
                      <tr key={assessment.id}>
                        <td className="stf-table-col-leading">
                          <span className="block break-words font-medium leading-snug text-[var(--stf-text)]">
                            {INSTRUMENT_LABELS[assessment.instrumentCode] ??
                              assessment.instrumentCode}
                          </span>
                          <TableMobileMeta>
                            {assessment.result?.rawLabel ?? '-'}
                            {assessment.result?.classificationLabel
                              ? ` · ${assessment.result.classificationLabel}`
                              : ''}
                            {' · '}
                            {formatDateTime(assessment.finalizedAt ?? assessment.startedAt)}
                          </TableMobileMeta>
                        </td>
                        <td className="stf-table-col-secondary">
                          {assessment.result?.rawLabel ?? '-'}
                        </td>
                        <td className="stf-table-col-secondary text-center">
                          {assessment.result ? (
                            <ClassificationBadge
                              label={assessment.result.classificationLabel}
                              code={assessment.result.classificationCode}
                              meta={assessment.result.classificationMeta}
                            />
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="stf-table-col-secondary text-[var(--stf-text-muted)]">
                          {formatDateTime(assessment.finalizedAt ?? assessment.startedAt)}
                        </td>
                        <td className="stf-table-col-actions">
                          <ActionLink
                            to={`/patients/${id}/assessment/${assessment.id}`}
                            state={{
                              backTo: `/patients/${id}`,
                              backLabel: 'Voltar para o paciente',
                            }}
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
                    aria-pressed={activeInstrument === code}
                    className={[
                      'min-h-11 rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                      activeInstrument === code
                        ? 'bg-[var(--stf-primary)] text-[var(--stf-on-primary)]'
                        : 'border border-[var(--stf-border)] bg-[var(--stf-surface)] text-[var(--stf-text-muted)]',
                    ].join(' ')}
                  >
                    {INSTRUMENT_LABELS[code] ?? code}
                  </button>
                ))}
              </div>

              {loadingTimeseries ? <Spinner label="Carregando gráfico…" /> : null}

              {!loadingTimeseries &&
              timeseries?.canShowChart &&
              chartPoints.length >= 2 ? (
                <EvolutionLineChart
                  title={`Evolução: ${INSTRUMENT_LABELS[timeseries.instrumentCode] ?? timeseries.instrumentCode}`}
                  points={chartPoints}
                  maxValue={chartMaxValue}
                  explanation={chartExplanation}
                />
              ) : null}

              {!loadingTimeseries &&
              !(timeseries?.canShowChart && chartPoints.length >= 2) ? (
                <div className="stf-card px-5 py-4 text-sm text-[var(--stf-text-muted)]">
                  {CHART_EMPTY_MESSAGE}
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      ) : null}
    </AppShell>
  );
}

function InfoItem({
  label,
  value,
  truncate = false,
}: {
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
        {label}
      </p>
      {truncate ? (
        <EllipsisText
          text={value}
          as="p"
          className="mt-1 text-sm font-medium text-[var(--stf-text)]"
        />
      ) : (
        <p className="mt-1 text-sm font-medium text-[var(--stf-text)]">{value}</p>
      )}
    </div>
  );
}
