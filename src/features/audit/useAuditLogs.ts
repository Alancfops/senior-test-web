import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs, type AuditLogsQueryParams } from '@/lib/api/audit';

export function useAuditLogs(params: AuditLogsQueryParams = {}) {
  const { action, actions, page = 1, limit = 25 } = params;

  return useQuery({
    queryKey: ['admin', 'audit-logs', { action, actions, page, limit }],
    queryFn: () => fetchAuditLogs({ action, actions, page, limit }),
  });
}
