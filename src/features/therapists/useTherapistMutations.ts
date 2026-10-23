import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTherapist, fetchTherapist, revokeAssistant } from '@/lib/api/therapists';

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

export function useRevokeAssistant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revokeAssistant(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}
