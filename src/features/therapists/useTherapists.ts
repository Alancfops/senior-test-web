import { useQuery } from '@tanstack/react-query';
import { fetchTherapists, type TherapistsQueryParams } from '@/lib/api/therapists';

export function useTherapists(params: TherapistsQueryParams = {}) {
  const { search, page = 1, limit = 25 } = params;

  return useQuery({
    queryKey: ['admin', 'therapists', { search, page, limit }],
    queryFn: () => fetchTherapists({ search, page, limit }),
  });
}
