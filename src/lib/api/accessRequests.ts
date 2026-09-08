import { isMockMode } from '@/lib/api/config';
import { apiGet, apiPost } from '@/lib/api/client';
import {
  mockApproveAccessRequest,
  mockListAccessRequests,
  mockRejectAccessRequest,
} from '@/mocks/mockApi';
import type {
  AccessRequestItem,
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

  if (isMockMode()) {
    return mockListAccessRequests(status);
  }

  const query = new URLSearchParams();
  query.set('status', status);
  return apiGet<AccessRequestsListResponse>(`/admin/access-requests?${query.toString()}`);
}

export async function approveAccessRequest(id: string): Promise<unknown> {
  if (isMockMode()) {
    return mockApproveAccessRequest(id);
  }
  return apiPost(`/admin/access-requests/${id}/approve`);
}

export async function rejectAccessRequest(id: string): Promise<AccessRequestItem | unknown> {
  if (isMockMode()) {
    return mockRejectAccessRequest(id);
  }
  return apiPost(`/admin/access-requests/${id}/reject`);
}
