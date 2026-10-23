import type { TherapistListItem, TherapistRole } from '@/types/api';

/**
 * Espelha o escopo da API: professora exclui ajudante/fisio; ajudante só fisio.
 * A conta da professora só muda via `admin:set` no backend.
 */
const MANAGED_ROLES: Record<TherapistRole, TherapistRole[]> = {
  ADMIN: ['ASSISTANT', 'THERAPIST'],
  ASSISTANT: ['THERAPIST'],
  THERAPIST: [],
};

export function canDeleteTherapist(
  therapist: Pick<TherapistListItem, 'role'>,
  requesterRole: TherapistRole | undefined,
): boolean {
  return requesterRole ? MANAGED_ROLES[requesterRole].includes(therapist.role) : false;
}
