import { apiDelete, apiGet, apiPost } from '@/lib/api/client';
import type {
  RevokeAssistantResponse,
  TherapistDetail,
  TherapistRole,
  TherapistsListResponse,
} from '@/types/api';

export type TherapistsQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
  role?: TherapistRole;
};

export async function fetchTherapists(
  params: TherapistsQueryParams = {},
): Promise<TherapistsListResponse> {
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

  return apiGet<TherapistsListResponse>(`/admin/therapists?${query.toString()}`);
}

export async function fetchTherapist(id: string): Promise<TherapistDetail> {
  return apiGet<TherapistDetail>(`/admin/therapists/${id}`);
}

export async function deleteTherapist(id: string): Promise<void> {
  await apiDelete(`/admin/therapists/${id}`);
}

/** Revoga o acesso de ajudante: a conta volta a fisioterapeuta e mantém os pacientes no app. */
export async function revokeAssistant(id: string): Promise<RevokeAssistantResponse> {
  return apiPost<RevokeAssistantResponse>(`/admin/assistants/${id}/revoke`);
}
