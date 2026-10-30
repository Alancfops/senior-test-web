import { apiGet } from '@/lib/api/client';
import type { AdminAuditAction, AuditLogsResponse } from '@/types/api';

export type AuditLogsQueryParams = {
  action?: AdminAuditAction;
  /** Várias ações de uma vez; tem precedência sobre `action`. */
  actions?: AdminAuditAction[];
  page?: number;
  limit?: number;
};

export async function fetchAuditLogs(
  params: AuditLogsQueryParams = {},
): Promise<AuditLogsResponse> {
  const { action, actions, page = 1, limit = 25 } = params;
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (actions?.length) {
    query.set('actions', actions.join(','));
  } else if (action) {
    query.set('action', action);
  }

  return apiGet<AuditLogsResponse>(`/admin/audit-logs?${query.toString()}`);
}
