import { apiGet, apiPost } from '@/lib/api/client';
import type {
  AccessRequestActionResponse,
  AccessRequestsListResponse,
  AdminAccessRequestStatus,
} from '@/types/api';

export type AccessRequestsQueryParams = {
  status?: AdminAccessRequestStatus;
};

export async function fetchAccessRequests(
  params: AccessRequestsQueryParams = {},
): Promise<AccessRequestsListResponse> {
  const status = params.status ?? 'PENDING';

  const query = new URLSearchParams();
  query.set('status', status);
  return apiGet<AccessRequestsListResponse>(`/admin/access-requests?${query.toString()}`);
}

export async function approveAccessRequest(id: string): Promise<AccessRequestActionResponse> {
  return apiPost<AccessRequestActionResponse>(`/admin/access-requests/${id}/approve`);
}

export async function rejectAccessRequest(id: string): Promise<AccessRequestActionResponse> {
  return apiPost<AccessRequestActionResponse>(`/admin/access-requests/${id}/reject`);
}
