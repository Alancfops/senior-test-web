import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '@/lib/api/auth';
import type { LoginFormValues } from './loginSchema';

export function useLogin() {
  return useMutation({
    mutationFn: (values: LoginFormValues) => loginRequest(values),
  });
}
