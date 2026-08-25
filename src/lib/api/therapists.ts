import { isMockMode } from '@/lib/api/config';
import { apiDelete, apiGet } from '@/lib/api/client';
import { filterClinicalTherapists } from '@/lib/domain/therapists';
import { mockDeleteTherapist, mockGetTherapist, mockListTherapists } from '@/mocks/mockApi';
import type { TherapistDetail, TherapistsListResponse } from '@/types/api';

export type TherapistsQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function fetchTherapists(
  params: TherapistsQueryParams = {},
): Promise<TherapistsListResponse> {
  if (isMockMode()) {
    return filterClinicalTherapists(await mockListTherapists());
  }

  const { search, page = 1, limit = 25 } = params;
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (search?.trim()) {
    query.set('search', search.trim());
  }

  const response = await apiGet<TherapistsListResponse>(`/admin/therapists?${query.toString()}`);
  return filterClinicalTherapists(response);
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
