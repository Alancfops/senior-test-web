import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SelectField } from '@/components/ui/SelectField';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Spinner } from '@/components/ui/Spinner';
import { useAuditLogs } from '@/features/audit/useAuditLogs';
import { resolveAuditTarget } from '@/lib/audit/formatAuditTarget';
import { formatDateTime } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';
import type { AdminAuditAction, AuditLogItem } from '@/types/api';
import { AUDIT_ACTION_LABELS } from '@/types/api';

const actionOptions: Array<{ value: string; label: string }> = [
  { value: '', label: 'Todas as ações' },
  ...Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => ({ value, label })),
];

export function AuditLogsPage() {
  const [action, setAction] = useState<AdminAuditAction | ''>('');
  const { data, isLoading, isError, error, refetch } = useAuditLogs({
    action: action || undefined,
  });

  const errorMessage =
    error instanceof ApiError ? error.message : 'Não foi possível carregar a auditoria.';

  return (
    <AppShell
      title="Trilha de auditoria"
      description="Registro de ações administrativas sensíveis."
      backLink={{ to: '/dashboard', label: 'Voltar ao início' }}
      actions={
        <div className="w-full min-w-0 sm:min-w-[260px]">
          <SelectField
            label="Filtrar ação"
            options={actionOptions}
            value={action}
            onChange={(event) => setAction(event.target.value as AdminAuditAction | '')}
          />
        </div>
      }
    >
      <div className="stf-card overflow-hidden">
        {isLoading ? <Spinner label="Carregando registros…" /> : null}
        {isError ? <ErrorState message={errorMessage} onRetry={() => void refetch()} /> : null}

        {!isLoading && !isError && data?.data.length === 0 ? (
          <EmptyState title="Nenhum registro encontrado" />
        ) : null}

        {!isLoading && !isError && data && data.data.length > 0 ? (
          <div className="overflow-x-hidden">
            <table className="stf-table">
              <caption className="sr-only">Registros da trilha de auditoria administrativa</caption>
              <thead>
                <tr>
                  <th scope="col" className="stf-table-col-leading">
                    Data
                  </th>
                  <th scope="col" className="stf-table-col-secondary">
                    Admin
                  </th>
                  <th scope="col" className="stf-table-col-secondary">
                    Ação
                  </th>
                  <th scope="col" className="stf-table-col-secondary stf-table-col-text">
                    Alvo
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((log) => (
                  <AuditLogRow key={log.id} log={log} />
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function AuditLogRow({ log }: { log: AuditLogItem }) {
  const target = resolveAuditTarget(log);

  return (
    <tr>
      <td className="stf-table-col-leading text-[var(--stf-text-muted)]">
        {formatDateTime(log.createdAt)}
        <span className="mt-1.5 block hyphens-none break-words text-xs leading-relaxed text-[var(--stf-text-muted)] md:hidden">
          {log.adminName} · {AUDIT_ACTION_LABELS[log.action]}
          {' · '}
          <AuditTargetLink target={target} />
        </span>
      </td>
      <td className="stf-table-col-secondary">{log.adminName}</td>
      <td className="stf-table-col-secondary">{AUDIT_ACTION_LABELS[log.action]}</td>
      <td className="stf-table-col-secondary stf-table-col-text">
        <AuditTargetLink target={target} />
      </td>
    </tr>
  );
}

function AuditTargetLink({
  target,
}: {
  target: ReturnType<typeof resolveAuditTarget>;
}) {
  return (
    <span className="font-medium text-[var(--stf-text)]" title={target.title}>
      {target.label}
    </span>
  );
}
