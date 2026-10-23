import { useState } from 'react';
import { AuditLogDetailModal } from '@/components/audit/AuditLogDetailModal';
import { IconEye } from '@/components/icons/ActionIcons';
import { AppShell } from '@/components/layout/AppShell';
import {
  MobileCard,
  MobileCardField,
  MobileCardFields,
  MobileCardList,
} from '@/components/ui/MobileCardList';
import { ActionButton, TableActions } from '@/components/ui/TableActions';
import { SelectField } from '@/components/ui/SelectField';
import { TableColGroup } from '@/components/ui/TableColGroup';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Spinner } from '@/components/ui/Spinner';
import { useAuditLogs } from '@/features/audit/useAuditLogs';
import { resolveAuditTarget } from '@/lib/audit/formatAuditTarget';
import { formatDateTime, formatCount } from '@/lib/format';
import { ApiError } from '@/lib/api/errors';
import type { AdminAuditAction, AuditLogItem } from '@/types/api';
import { AUDIT_ACTION_LABELS } from '@/types/api';

const actionOptions: Array<{ value: string; label: string }> = [
  { value: '', label: 'Todas as ações' },
  ...Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => ({ value, label })),
];

export function AuditLogsPage() {
  const [action, setAction] = useState<AdminAuditAction | ''>('');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
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
          <>
            <MobileCardList
              label="Registros da trilha de auditoria administrativa"
              countLabel={formatCount(data.data.length, 'registro', 'registros')}
            >
              {data.data.map((log) => (
                <AuditLogCard key={log.id} log={log} onOpenDetails={setSelectedLog} />
              ))}
            </MobileCardList>
            <div className="hidden overflow-x-hidden md:block">
              <table className="stf-table">
                <caption className="sr-only">Registros da trilha de auditoria administrativa</caption>
                <TableColGroup variant="audit-logs" />
                <thead>
                  <tr>
                    <th scope="col" className="stf-table-col-leading">
                      Data
                    </th>
                    <th scope="col" className="stf-table-col-secondary">
                      Usuário
                    </th>
                    <th scope="col" className="stf-table-col-secondary">
                      Ação
                    </th>
                    <th scope="col" className="stf-table-col-secondary">
                      Registro afetado
                    </th>
                    <th scope="col" className="stf-table-col-actions">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((log) => (
                    <AuditLogRow key={log.id} log={log} onOpenDetails={setSelectedLog} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>

      {selectedLog ? (
        <AuditLogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      ) : null}
    </AppShell>
  );
}

function AuditLogRow({
  log,
  onOpenDetails,
}: {
  log: AuditLogItem;
  onOpenDetails: (log: AuditLogItem) => void;
}) {
  const target = resolveAuditTarget(log);

  return (
    <tr>
      <td className="stf-table-col-leading text-[var(--stf-text-muted)]">
        {formatDateTime(log.createdAt)}
      </td>
      <td className="stf-table-col-secondary">{log.adminName}</td>
      <td className="stf-table-col-secondary">{AUDIT_ACTION_LABELS[log.action]}</td>
      <td className="stf-table-col-secondary">
        <AuditTargetLink target={target} />
      </td>
      <td className="stf-table-col-actions">
        <TableActions>
          <ActionButton icon={<IconEye />} onClick={() => onOpenDetails(log)}>
            Ver detalhes
          </ActionButton>
        </TableActions>
      </td>
    </tr>
  );
}

function AuditLogCard({
  log,
  onOpenDetails,
}: {
  log: AuditLogItem;
  onOpenDetails: (log: AuditLogItem) => void;
}) {
  const target = resolveAuditTarget(log);

  return (
    <MobileCard
      title={AUDIT_ACTION_LABELS[log.action]}
      subtitle={formatDateTime(log.createdAt)}
      aside={
        <ActionButton icon={<IconEye />} onClick={() => onOpenDetails(log)}>
          Ver detalhes
        </ActionButton>
      }
    >
      <MobileCardFields>
        <MobileCardField label="Usuário" full>
          {log.adminName}
        </MobileCardField>
        <MobileCardField label="Registro afetado" full>
          <AuditTargetLink target={target} />
        </MobileCardField>
      </MobileCardFields>
    </MobileCard>
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
