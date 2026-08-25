import { isMockMode } from '@/lib/api/config';
import { apiGet } from '@/lib/api/client';
import { mockListAuditLogs } from '@/mocks/mockApi';
import type { AdminAuditAction, AuditLogsResponse } from '@/types/api';

export type AuditLogsQueryParams = {
  action?: AdminAuditAction;
  page?: number;
  limit?: number;
};

export async function fetchAuditLogs(
  params: AuditLogsQueryParams = {},
): Promise<AuditLogsResponse> {
  if (isMockMode()) {
    return mockListAuditLogs(params.action);
  }

  const { action, page = 1, limit = 25 } = params;
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (action) {
    query.set('action', action);
  }

  return apiGet<AuditLogsResponse>(`/admin/audit-logs?${query.toString()}`);
}
