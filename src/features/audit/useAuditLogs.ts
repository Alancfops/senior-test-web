import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs, type AuditLogsQueryParams } from '@/lib/api/audit';

export function useAuditLogs(params: AuditLogsQueryParams = {}) {
  const { action, page = 1, limit = 25 } = params;

  return useQuery({
    queryKey: ['admin', 'audit-logs', { action, page, limit }],
    queryFn: () => fetchAuditLogs({ action, page, limit }),
  });
}
