import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SelectField } from '@/components/ui/SelectField';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Spinner } from '@/components/ui/Spinner';
import { useAuditLogs } from '@/features/audit/useAuditLogs';
import { formatDateTime } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';
import type { AdminAuditAction } from '@/types/api';
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
      actions={
        <div className="min-w-[260px]">
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
          <div className="overflow-x-auto">
            <table className="stf-table">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Admin</th>
                  <th scope="col">Ação</th>
                  <th scope="col">Alvo</th>
                  <th scope="col">Metadados</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((log) => (
                  <tr key={log.id}>
                    <td className="text-[var(--stf-text-muted)]">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td>{log.adminName}</td>
                    <td>{AUDIT_ACTION_LABELS[log.action]}</td>
                    <td>
                      {log.targetType} · {log.targetId.slice(0, 8)}…
                    </td>
                    <td className="text-xs text-[var(--stf-text-muted)]">
                      {Object.keys(log.metadata).length > 0
                        ? JSON.stringify(log.metadata)
                        : '—'}
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
