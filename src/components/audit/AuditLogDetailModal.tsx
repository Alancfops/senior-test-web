import { useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useTherapists } from '@/features/therapists/useTherapists';
import {
  AUDIT_ENTITY_LABELS,
  buildAuditLogChanges,
  type AuditSnapshot,
} from '@/lib/audit/auditLogChanges';
import { resolveAuditTarget } from '@/lib/audit/formatAuditTarget';
import { formatDateTime } from '@/lib/format';
import type { AuditLogItem } from '@/types/api';
import { AUDIT_ACTION_LABELS } from '@/types/api';

type AuditLogDetailModalProps = {
  log: AuditLogItem;
  onClose: () => void;
};

export function AuditLogDetailModal({ log, onClose }: AuditLogDetailModalProps) {
  // Transferência grava só IDs dos fisioterapeutas — nomes resolvidos pela lista admin.
  const { data: therapists } = useTherapists({ limit: 100 });
  const resolveTherapistName = useCallback(
    (id: string) => therapists?.data.find((therapist) => therapist.id === id)?.fullName ?? null,
    [therapists],
  );

  const changes = buildAuditLogChanges(log, resolveTherapistName);
  const target = resolveAuditTarget(log);

  return (
    <Modal open title="Detalhes do registro" onClose={onClose}>
      <dl className="grid grid-cols-1 gap-4 rounded-stf border border-[var(--stf-border)] bg-[var(--stf-page-bg)] p-4 sm:grid-cols-2">
        <SummaryItem label="Data/hora" value={formatDateTime(log.createdAt)} />
        <SummaryItem label="Usuário" value={log.adminName} />
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--stf-text-muted)]">
            Ação
          </dt>
          <dd className="mt-1">
            <span className="inline-flex rounded-full border border-[var(--stf-primary)] px-2.5 py-0.5 text-xs font-medium text-[var(--stf-primary)]">
              {AUDIT_ACTION_LABELS[log.action]}
            </span>
          </dd>
        </div>
        <SummaryItem
          label="Registro afetado"
          value={[AUDIT_ENTITY_LABELS[log.targetType] ?? 'Registro', target.name]
            .filter(Boolean)
            .join(' · ')}
        />
      </dl>

      <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-[var(--stf-text-muted)]">
        Valores alterados
      </h3>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SnapshotPanel title="Antes" tone="before" snapshot={changes.before} />
        <SnapshotPanel title="Depois" tone="after" snapshot={changes.after} />
      </div>
    </Modal>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--stf-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-[var(--stf-text)]">{value}</dd>
    </div>
  );
}

const toneClasses = {
  before: {
    panel: 'border-[var(--stf-border)]',
    header: 'bg-[color-mix(in_srgb,var(--stf-primary)_8%,var(--stf-surface))] text-[var(--stf-primary)]',
    dot: 'bg-[var(--stf-primary)]',
  },
  after: {
    panel: 'border-[var(--stf-secondary)]',
    header: 'bg-[color-mix(in_srgb,var(--stf-secondary)_18%,var(--stf-surface))] text-[var(--stf-text)]',
    dot: 'bg-[var(--stf-secondary)]',
  },
} as const;

function SnapshotPanel({
  title,
  tone,
  snapshot,
}: {
  title: string;
  tone: keyof typeof toneClasses;
  snapshot: AuditSnapshot;
}) {
  const classes = toneClasses[tone];

  return (
    <section
      aria-label={title}
      className={['overflow-hidden rounded-stf border', classes.panel].join(' ')}
    >
      <header
        className={[
          'flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide',
          classes.header,
        ].join(' ')}
      >
        <span aria-hidden className={['size-2 rounded-full', classes.dot].join(' ')} />
        {title}
      </header>
      {snapshot.fields.length === 0 ? (
        <p className="px-3 py-6 text-center text-sm text-[var(--stf-text-muted)]">
          {snapshot.emptyLabel}
        </p>
      ) : (
        <dl className="space-y-2.5 px-3 py-3">
          {snapshot.fields.map((item) => (
            <div key={item.label}>
              <dt className="text-xs text-[var(--stf-text-muted)]">{item.label}</dt>
              <dd className="break-words font-medium text-[var(--stf-text)]">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
