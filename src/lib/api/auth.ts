import { isMockMode } from '@/lib/api/config';
import { apiPost } from '@/lib/api/client';
import { mockLogin, mockRequestPasswordReset } from '@/mocks/mockApi';
import type { LoginResponse } from '@/types/api';
import type { LoginFormValues } from '@/features/auth/loginSchema';
import { ApiError } from '@/lib/api/errors';

export async function loginRequest(values: LoginFormValues): Promise<LoginResponse> {
  if (isMockMode()) {
    return mockLogin(values);
  }

  const response = await apiPost<LoginResponse>('/auth/login', values, false);
  if (response.user.role !== 'ADMIN') {
    throw new ApiError('Acesso restrito a administradores.', 403);
  }
  return response;
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (isMockMode()) {
    return mockRequestPasswordReset(email);
  }
  await apiPost('/auth/forgot-password', { email }, false);
}
