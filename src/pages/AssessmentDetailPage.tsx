import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { IconDownload } from '@/components/icons/ActionIcons';
import { ClassificationBadge } from '@/components/ui/ClassificationBadge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { Spinner } from '@/components/ui/Spinner';
import { mapAssessmentPayloadToAnswers } from '@/features/assessments/mapAssessmentAnswers';
import { useAssessment, usePatient } from '@/features/patients/usePatients';
import {
  downloadAssessmentReport,
  triggerBlobDownload,
} from '@/lib/api/patients';
import { formatDateTime } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';
import { INSTRUMENT_LABELS } from '@/types/api';

export function AssessmentDetailPage() {
  const { id: patientId = '', assessmentId = '' } = useParams();
  const { data: patient } = usePatient(patientId);
  const { data, isLoading, isError, error, refetch } = useAssessment(
    patientId,
    assessmentId,
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const errorMessage =
    error instanceof ApiError ? error.message : 'Não foi possível carregar a avaliação.';

  const answers = data
    ? mapAssessmentPayloadToAnswers(data.instrumentCode, data.payload)
    : [];

  const handleDownload = async () => {
    setDownloadError(null);
    setDownloading(true);
    try {
      const blob = await downloadAssessmentReport(assessmentId);
      triggerBlobDownload(blob, `relatorio-${assessmentId.slice(0, 8)}.pdf`);
    } catch (err) {
      setDownloadError(err instanceof ApiError ? err.message : 'Erro ao gerar PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AppShell
      title={data ? `${INSTRUMENT_LABELS[data.instrumentCode] ?? data.instrumentCode}` : 'Avaliação'}
      description={patient?.fullName}
      breadcrumbs={
        patient ? (
          <span>
            <Link to="/therapists" className="text-[var(--stf-primary)] no-underline hover:underline">
              Fisioterapeutas
            </Link>
            {' / '}
            <Link
              to={`/patients/${patientId}`}
              className="text-[var(--stf-primary)] no-underline hover:underline"
            >
              {patient.fullName}
            </Link>
          </span>
        ) : null
      }
      actions={
        data?.status === 'FINALIZED' ? (
          <Button
            className="w-full sm:w-auto"
            onClick={() => void handleDownload()}
            loading={downloading}
          >
            <IconDownload />
            Baixar PDF
          </Button>
        ) : null
      }
    >
      {downloadError ? (
        <p role="alert" className="mb-4 text-sm text-[var(--stf-error)]">
          {downloadError}
        </p>
      ) : null}

      <div className="space-y-6">
        <div className="stf-card overflow-hidden">
          {isLoading ? <Spinner label="Carregando avaliação…" /> : null}
          {isError ? <ErrorState message={errorMessage} onRetry={() => void refetch()} /> : null}

          {data ? (
            <div className="space-y-0">
              <div className="grid gap-4 border-b border-[var(--stf-border)] px-4 py-4 sm:px-5 md:grid-cols-2 xl:grid-cols-4">
                <InfoItem
                  label="Status"
                  value={data.status === 'FINALIZED' ? 'Finalizada' : 'Rascunho'}
                />
                <InfoItem label="Início" value={formatDateTime(data.startedAt)} />
                <InfoItem label="Finalização" value={formatDateTime(data.finalizedAt)} />
                <InfoItem label="Fisioterapeuta" value={data.therapistName} />
              </div>

              {data.result ? (
                <div className="space-y-4 px-4 py-4 sm:px-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
                      Resultado
                    </p>
                    <p className="mt-1 text-xl font-bold text-[var(--stf-text)] sm:text-2xl">
                      {data.result.rawLabel}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
                      Classificação
                    </p>
                    <ClassificationBadge
                      label={data.result.classificationLabel}
                      meta={data.result.classificationMeta}
                    />
                  </div>

                  {data.notesObservation ? (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
                        Observações
                      </p>
                      <p className="mt-1 text-sm text-[var(--stf-text)]">{data.notesObservation}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="px-5 py-8 text-sm text-[var(--stf-text-muted)]">
                  Avaliação ainda não finalizada. PDF indisponível.
                </div>
              )}
            </div>
          ) : null}
        </div>

        {data && answers.length > 0 ? (
          <section className="stf-card overflow-hidden">
            <div className="border-b border-[var(--stf-border)] px-4 py-4 sm:px-5">
              <h2 className="text-base font-semibold text-[var(--stf-text)]">
                Respostas do teste
              </h2>
              <p className="mt-1 text-sm text-[var(--stf-text-muted)]">
                Itens aplicados no instrumento, com início da pergunta/instrução quando disponível.
              </p>
            </div>
            <div className="overflow-x-hidden">
              <table className="stf-table">
                <caption className="sr-only">Respostas registradas na avaliação</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-[30%]">
                      Item
                    </th>
                    <th scope="col">Pergunta / instrução</th>
                    <th scope="col" className="w-[22%]">
                      Resposta
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((row) => (
                    <tr key={`${row.title}-${row.question}`}>
                      <td className="font-medium text-[var(--stf-text)]">{row.title}</td>
                      <td className="text-[var(--stf-text-muted)]" title={row.question}>
                        {row.question}
                      </td>
                      <td className="font-medium text-[var(--stf-text)]">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {data && !isLoading && answers.length === 0 && data.status === 'FINALIZED' ? (
          <section className="stf-card px-4 py-5 text-sm text-[var(--stf-text-muted)] sm:px-5">
            Não há respostas detalhadas disponíveis no payload desta avaliação.
          </section>
        ) : null}
      </div>
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
