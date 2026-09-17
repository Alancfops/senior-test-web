import { useQuery } from '@tanstack/react-query';
import { fetchTherapists, type TherapistsQueryParams } from '@/lib/api/therapists';

export function useTherapists(params: TherapistsQueryParams = {}) {
  const { search, page = 1, limit = 25, role } = params;

  return useQuery({
    queryKey: ['admin', 'therapists', { search, page, limit, role }],
    queryFn: () => fetchTherapists({ search, page, limit, role }),
  });
}
