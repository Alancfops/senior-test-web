import { isMockMode } from '@/lib/api/config';
import { apiDelete, apiGet, apiPost } from '@/lib/api/client';
import { filterClinicalTherapists } from '@/lib/domain/therapists';
import {
  mockCreateManagerAccount,
  mockDeleteTherapist,
  mockGetTherapist,
  mockListTherapists,
} from '@/mocks/mockApi';
import type { TherapistDetail, TherapistRole, TherapistsListResponse } from '@/types/api';

export type TherapistsQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
  role?: TherapistRole;
};

export type CreateManagerAccountInput = {
  email: string;
  fullName: string;
};

export type CreateManagerAccountResponse = {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN';
  mustChangePassword: boolean;
  createdAt: string;
};

export async function fetchTherapists(
  params: TherapistsQueryParams = {},
): Promise<TherapistsListResponse> {
  if (isMockMode()) {
    const response = await mockListTherapists(params.role);
    return params.role ? response : filterClinicalTherapists(response);
  }

  const { search, page = 1, limit = 25, role } = params;
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (search?.trim()) {
    query.set('search', search.trim());
  }
  if (role) {
    query.set('role', role);
  }

  const response = await apiGet<TherapistsListResponse>(`/admin/therapists?${query.toString()}`);
  return role ? response : filterClinicalTherapists(response);
}

export async function createManagerAccount(
  input: CreateManagerAccountInput,
): Promise<CreateManagerAccountResponse> {
  if (isMockMode()) {
    return mockCreateManagerAccount(input);
  }
  return apiPost<CreateManagerAccountResponse>('/admin/therapists', input);
}

export async function fetchTherapist(id: string): Promise<TherapistDetail> {
  if (isMockMode()) {
    return mockGetTherapist(id);
  }
  return apiGet<TherapistDetail>(`/admin/therapists/${id}`);
}

export async function deleteTherapist(id: string): Promise<void> {
  if (isMockMode()) {
    return mockDeleteTherapist(id);
  }
  await apiDelete(`/admin/therapists/${id}`);
}
