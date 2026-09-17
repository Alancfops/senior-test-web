import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createManagerAccount, deleteTherapist, fetchTherapist } from '@/lib/api/therapists';

export function useTherapist(id: string) {
  return useQuery({
    queryKey: ['admin', 'therapists', id],
    queryFn: () => fetchTherapist(id),
    enabled: Boolean(id),
  });
}

export function useDeleteTherapist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTherapist(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}

export function useCreateManagerAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createManagerAccount,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'therapists'] });
    },
  });
}
