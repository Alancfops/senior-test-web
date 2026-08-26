import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { IconDownload, IconEye } from '@/components/icons/ActionIcons';
import { IconFile } from '@/components/icons/NavIcons';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchInput } from '@/components/ui/SearchInput';
import { SelectField } from '@/components/ui/SelectField';
import { Spinner } from '@/components/ui/Spinner';
import { useAuditLogs } from '@/features/audit/useAuditLogs';
import { usePatientAssessments, usePatientsList } from '@/features/patients/usePatients';
import {
  downloadAssessmentReport,
  triggerBlobDownload,
} from '@/lib/api/patients';
import { ApiError } from '@/lib/api/errors';
import { formatDateTime } from '@/lib/format';
import { INSTRUMENT_LABELS } from '@/types/api';

export function ReportsPage() {
  const queryClient = useQueryClient();
  const { data: patientsData, isLoading: loadingPatients } = usePatientsList();
  const {
    data: auditData,
    isLoading: loadingAudit,
    isError: auditError,
    error: auditErr,
    refetch: refetchAudit,
  } = useAuditLogs({ action: 'DOWNLOAD_REPORT', limit: 50 });

  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const patientsWithAssessments = useMemo(() => {
    const list = patientsData?.data ?? [];
    return list.filter((patient) => patient.assessmentCount > 0);
  }, [patientsData?.data]);

  const filteredPatients = useMemo(() => {
    const query = patientSearch.trim().toLowerCase();
    if (!query) return patientsWithAssessments;
    return patientsWithAssessments.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(query) ||
        patient.therapistName.toLowerCase().includes(query),
    );
  }, [patientSearch, patientsWithAssessments]);

  const { data: assessmentsData, isLoading: loadingAssessments } =
    usePatientAssessments(selectedPatientId);

  const assessmentOptions = useMemo(() => {
    const items = assessmentsData?.data ?? [];
    return items.map((assessment) => {
      const instrument =
        INSTRUMENT_LABELS[assessment.instrumentCode] ?? assessment.instrumentCode;
      const when = formatDateTime(assessment.finalizedAt ?? assessment.startedAt);
      const score = assessment.result?.rawLabel ?? '-';
      return {
        value: assessment.id,
        label: `${instrument} · ${score} · ${when}`,
      };
    });
  }, [assessmentsData?.data]);

  const selectedPatient = patientsWithAssessments.find(
    (patient) => patient.id === selectedPatientId,
  );

  function selectPatient(patientId: string) {
    setSelectedPatientId(patientId);
    setSelectedAssessmentId('');
    setDownloadError(null);
    setDownloadSuccess(null);
  }

  async function handleDownload() {
    if (!selectedAssessmentId) return;
    setDownloadError(null);
    setDownloadSuccess(null);
    setDownloading(true);
    try {
      const blob = await downloadAssessmentReport(selectedAssessmentId);
      const shortId = selectedAssessmentId.slice(0, 8);
      triggerBlobDownload(blob, `relatorio-${shortId}.pdf`);
      setDownloadSuccess('PDF gerado e baixado. O download ficou registrado na auditoria.');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
    } catch (err) {
      setDownloadError(err instanceof ApiError ? err.message : 'Erro ao gerar PDF.');
    } finally {
      setDownloading(false);
    }
  }

  const auditErrorMessage =
    auditErr instanceof ApiError
      ? auditErr.message
      : 'Não foi possível carregar os downloads recentes.';

  return (
    <AppShell
      title="Relatórios PDF"
      description="Gere PDF de avaliações finalizadas e acompanhe downloads recentes."
    >
      <div className="space-y-6">
        <section className="stf-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-stf-lg bg-[color-mix(in_srgb,var(--stf-primary)_12%,var(--stf-surface))] text-[var(--stf-primary)]">
              <IconDownload className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-[var(--stf-text)]">
                Gerar relatório
              </h2>
              <p className="mt-1 text-sm text-[var(--stf-text-muted)]">
                Selecione um paciente com avaliações finalizadas e baixe o PDF institucional.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <SearchInput
              id="reports-patient-search"
              value={patientSearch}
              onChange={setPatientSearch}
              placeholder="Filtrar paciente ou fisioterapeuta"
              label="Filtrar paciente"
            />

            {loadingPatients ? <Spinner label="Carregando pacientes…" /> : null}

            {!loadingPatients && filteredPatients.length === 0 ? (
              <EmptyState
                title="Nenhum paciente com avaliação finalizada"
                description="Cadastre e finalize avaliações no app mobile para gerar PDF aqui."
              />
            ) : null}

            {!loadingPatients && filteredPatients.length > 0 ? (
              <div className="max-h-56 overflow-y-auto rounded-stf border border-[var(--stf-border)]">
                <ul className="divide-y divide-[var(--stf-border)]">
                  {filteredPatients.map((patient) => {
                    const selected = patient.id === selectedPatientId;
                    return (
                      <li key={patient.id}>
                        <button
                          type="button"
                          onClick={() => selectPatient(patient.id)}
                          className={[
                            'flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors',
                            selected
                              ? 'bg-[color-mix(in_srgb,var(--stf-primary)_10%,var(--stf-surface))]'
                              : 'hover:bg-[var(--stf-page-bg)]',
                          ].join(' ')}
                          aria-pressed={selected}
                        >
                          <span className="text-sm font-semibold text-[var(--stf-text)]">
                            {patient.fullName}
                          </span>
                          <span className="text-xs text-[var(--stf-text-muted)]">
                            {patient.therapistName} · {patient.assessmentCount} avaliação(ões)
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {selectedPatientId ? (
              <div className="space-y-3 border-t border-[var(--stf-border)] pt-4">
                <p className="text-sm text-[var(--stf-text)]">
                  Paciente:{' '}
                  <Link
                    to={`/patients/${selectedPatientId}`}
                    className="font-medium text-[var(--stf-primary)] no-underline hover:underline"
                  >
                    {selectedPatient?.fullName}
                  </Link>
                </p>

                {loadingAssessments ? <Spinner label="Carregando avaliações…" /> : null}

                {!loadingAssessments && assessmentOptions.length === 0 ? (
                  <p className="text-sm text-[var(--stf-text-muted)]">
                    Este paciente não possui avaliações finalizadas disponíveis.
                  </p>
                ) : null}

                {!loadingAssessments && assessmentOptions.length > 0 ? (
                  <>
                    <SelectField
                      label="Avaliação finalizada"
                      options={[
                        { value: '', label: 'Selecione a avaliação' },
                        ...assessmentOptions,
                      ]}
                      value={selectedAssessmentId}
                      onChange={(event) => {
                        setSelectedAssessmentId(event.target.value);
                        setDownloadError(null);
                        setDownloadSuccess(null);
                      }}
                    />

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button
                        className="w-full sm:w-auto"
                        disabled={!selectedAssessmentId}
                        loading={downloading}
                        onClick={() => void handleDownload()}
                      >
                        <IconDownload />
                        Baixar PDF
                      </Button>
                      {selectedAssessmentId ? (
                        <Link
                          to={`/patients/${selectedPatientId}/assessment/${selectedAssessmentId}`}
                          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[var(--stf-primary)] no-underline hover:underline"
                        >
                          <IconEye className="size-4" />
                          Ver detalhe
                        </Link>
                      ) : null}
                    </div>
                  </>
                ) : null}

                {downloadError ? (
                  <p role="alert" className="text-sm text-[var(--stf-error)]">
                    {downloadError}
                  </p>
                ) : null}
                {downloadSuccess ? (
                  <p role="status" className="text-sm text-[var(--stf-secondary)]">
                    {downloadSuccess}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        <section className="stf-card overflow-hidden">
          <div className="border-b border-[var(--stf-border)] px-4 py-4 sm:px-5">
            <h2 className="text-base font-semibold text-[var(--stf-text)]">
              Downloads recentes
            </h2>
            <p className="mt-1 text-sm text-[var(--stf-text-muted)]">
              Quem baixou PDF pelo painel admin ou pelo app (trilha de auditoria).
            </p>
          </div>

          {loadingAudit ? <Spinner label="Carregando auditoria…" /> : null}
          {auditError ? (
            <ErrorState message={auditErrorMessage} onRetry={() => void refetchAudit()} />
          ) : null}

          {!loadingAudit && !auditError && (auditData?.data.length ?? 0) === 0 ? (
            <EmptyState title="Nenhum download registrado ainda" />
          ) : null}

          {!loadingAudit && !auditError && auditData && auditData.data.length > 0 ? (
            <ul className="divide-y divide-[var(--stf-border)]">
              {auditData.data.map((log) => {
                const meta = log.metadata ?? {};
                const patientName =
                  typeof meta.patientName === 'string' ? meta.patientName : null;
                const instrumentCode =
                  typeof meta.instrumentCode === 'string' ? meta.instrumentCode : null;
                const instrumentLabel = instrumentCode
                  ? (INSTRUMENT_LABELS[instrumentCode] ?? instrumentCode)
                  : null;
                const assessmentDate =
                  typeof meta.finalizedAt === 'string'
                    ? formatDateTime(meta.finalizedAt)
                    : null;

                const titleParts = [
                  patientName,
                  instrumentLabel,
                  assessmentDate,
                ].filter(Boolean);

                return (
                  <li
                    key={log.id}
                    className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--stf-text)]">
                        {titleParts.length > 0
                          ? titleParts.join(' · ')
                          : `Avaliação ${log.targetId.slice(0, 8)}…`}
                      </p>
                      <p className="text-xs text-[var(--stf-text-muted)]">
                        Baixado por {log.adminName}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-[var(--stf-text-muted)]">
                      {formatDateTime(log.createdAt)}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <div className="border-t border-[var(--stf-border)] px-4 py-3 sm:px-5">
            <Link
              to="/audit-logs"
              className="text-sm font-medium text-[var(--stf-primary)] no-underline hover:underline"
            >
              Ver trilha de auditoria completa
            </Link>
          </div>
        </section>

        <section className="stf-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-stf-lg bg-[var(--stf-page-bg)] text-[var(--stf-text-muted)]">
              <IconFile className="size-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[var(--stf-text)]">
                Também pelo detalhe da avaliação
              </h2>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-[var(--stf-text-muted)]">
                <li>
                  Abra{' '}
                  <Link to="/patients" className="font-medium text-[var(--stf-primary)]">
                    Pacientes
                  </Link>
                </li>
                <li>Entre no perfil e abra uma avaliação finalizada</li>
                <li>Use o botão &quot;Baixar PDF&quot; no canto superior</li>
              </ol>
              <p className="mt-3 text-xs text-[var(--stf-text-muted)]">
                Só avaliações finalizadas geram PDF. O arquivo não fica salvo no navegador
                após o download.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
