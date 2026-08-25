import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { IconDownload } from '@/components/icons/ActionIcons';
import { ClassificationBadge } from '@/components/ui/ClassificationBadge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { Spinner } from '@/components/ui/Spinner';
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
          <Button onClick={() => void handleDownload()} loading={downloading}>
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

      <div className="stf-card overflow-hidden">
        {isLoading ? <Spinner label="Carregando avaliação…" /> : null}
        {isError ? <ErrorState message={errorMessage} onRetry={() => void refetch()} /> : null}

        {data ? (
          <div className="space-y-0">
            <div className="grid gap-4 border-b border-[var(--stf-border)] px-5 py-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoItem label="Status" value={data.status === 'FINALIZED' ? 'Finalizada' : 'Rascunho'} />
              <InfoItem label="Início" value={formatDateTime(data.startedAt)} />
              <InfoItem label="Finalização" value={formatDateTime(data.finalizedAt)} />
              <InfoItem label="Fisioterapeuta" value={data.therapistName} />
            </div>

            {data.result ? (
              <div className="space-y-4 px-5 py-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
                    Resultado
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[var(--stf-text)]">
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
                Avaliação ainda não finalizada — PDF indisponível.
              </div>
            )}
          </div>
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
