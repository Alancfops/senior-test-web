import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveAccessRequest,
  fetchAccessRequests,
  rejectAccessRequest,
  type AccessRequestsQueryParams,
} from '@/lib/api/accessRequests';

const ACCESS_REQUESTS_KEY = ['admin', 'access-requests'] as const;

export function useAccessRequests(
  params: AccessRequestsQueryParams & { enabled?: boolean } = {},
) {
  const status = params.status ?? 'PENDING';
  const enabled = params.enabled ?? true;

  return useQuery({
    queryKey: [...ACCESS_REQUESTS_KEY, { status }],
    queryFn: () => fetchAccessRequests({ status }),
    enabled,
  });
}

export function useApproveAccessRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveAccessRequest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCESS_REQUESTS_KEY });
    },
  });
}

export function useRejectAccessRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejectAccessRequest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCESS_REQUESTS_KEY });
    },
  });
}
