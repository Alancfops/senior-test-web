import type { TherapistListItem, TherapistsListResponse } from '@/types/api';

/** Fisioterapeutas clínicos (app mobile) — exclui conta ADMIN do painel web. */
export function isClinicalTherapist(therapist: Pick<TherapistListItem, 'role'>): boolean {
  return therapist.role === 'THERAPIST';
}

export function filterClinicalTherapists(
  response: TherapistsListResponse,
): TherapistsListResponse {
  const data = response.data.filter(isClinicalTherapist);
  return {
    data,
    meta: {
      ...response.meta,
      total: data.length,
      totalPages: Math.max(1, Math.ceil(data.length / response.meta.limit)),
    },
  };
}
