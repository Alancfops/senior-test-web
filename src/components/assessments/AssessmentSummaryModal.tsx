import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { ClassificationBadge } from '@/components/ui/ClassificationBadge';
import { Modal } from '@/components/ui/Modal';
import { formatDateTime } from '@/lib/format';
import type { AssessmentListItem } from '@/types/api';
import { INSTRUMENT_LABELS } from '@/types/api';

type AssessmentSummaryModalProps = {
  open: boolean;
  patientId: string;
  patientName: string;
  assessment: AssessmentListItem | null;
  onClose: () => void;
};

export function AssessmentSummaryModal({
  open,
  patientId,
  patientName,
  assessment,
  onClose,
}: AssessmentSummaryModalProps) {
  if (!assessment) return null;

  const instrumentLabel =
    INSTRUMENT_LABELS[assessment.instrumentCode] ?? assessment.instrumentCode;
  const detailPath = `/patients/${patientId}/assessment/${assessment.id}`;
  const backState = {
    backTo: '/reports',
    backLabel: 'Voltar para relatórios',
  };

  return (
    <Modal
      open={open}
      title="Resumo da avaliação"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Fechar
          </Button>
          <Link
            to={detailPath}
            state={backState}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-stf-lg bg-[var(--stf-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--stf-on-primary,#fff)] no-underline transition-colors hover:bg-[var(--stf-primary-dark)] sm:w-auto"
            onClick={onClose}
          >
            Ver detalhes
          </Link>
        </>
      }
    >
      <div className="space-y-5 text-left">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
            Instrumento
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--stf-text)]">{instrumentLabel}</p>
          <p className="mt-0.5 text-sm text-[var(--stf-text-muted)]">
            {assessment.status === 'FINALIZED' ? 'Finalizada' : 'Rascunho'}
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <SummaryItem label="Paciente">
            <Link
              to={`/patients/${patientId}`}
              state={backState}
              className="font-medium text-[var(--stf-primary)] no-underline hover:underline"
              onClick={onClose}
            >
              {patientName}
            </Link>
          </SummaryItem>
          <SummaryItem label="Fisioterapeuta">{assessment.therapistName}</SummaryItem>
          <SummaryItem label="Início">{formatDateTime(assessment.startedAt)}</SummaryItem>
          <SummaryItem label="Finalização">
            {formatDateTime(assessment.finalizedAt)}
          </SummaryItem>
        </dl>

        {assessment.result ? (
          <div className="rounded-stf-lg border border-[var(--stf-border)] bg-[var(--stf-page-bg)] px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
              Resultado
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--stf-text)]">
              {assessment.result.rawLabel}
            </p>
            <div className="mt-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
                Classificação
              </p>
              <ClassificationBadge
                label={assessment.result.classificationLabel}
                code={assessment.result.classificationCode}
                meta={assessment.result.classificationMeta}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--stf-text-muted)]">
            Avaliação sem resultado finalizado.
          </p>
        )}

        <p className="text-xs text-[var(--stf-text-muted)]">
          Em &quot;Ver detalhes&quot; você abre a página completa (respostas do teste e PDF).
        </p>
      </div>
    </Modal>
  );
}

function SummaryItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--stf-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[var(--stf-text)]">{children}</dd>
    </div>
  );
}
