import { isMockMode } from '@/lib/api/config';
import { apiPost } from '@/lib/api/client';
import {
  mockChangePassword,
  mockLogin,
  mockRequestAdminAccess,
  mockRequestPasswordReset,
  mockResetPassword,
  mockVerifyResetCode,
} from '@/mocks/mockApi';
import type { LoginResponse, MessageResponse } from '@/types/api';
import type { LoginFormValues } from '@/features/auth/loginSchema';
import type {
  AdminAccessRequestFormValues,
  ChangePasswordRequest,
  ResetPasswordFormValues,
  VerifyResetCodeFormValues,
} from '@/features/auth/passwordSchema';
import { ApiError } from '@/lib/api/errors';

export async function loginRequest(values: LoginFormValues): Promise<LoginResponse> {
  if (isMockMode()) {
    return mockLogin(values);
  }

  const response = await apiPost<LoginResponse>(
    '/auth/login',
    { ...values, panel: 'web' },
    false,
  );
  if (response.user.role === 'THERAPIST') {
    throw new ApiError('Acesso restrito a administradores.', 403);
  }
  return response;
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (isMockMode()) {
    return mockRequestPasswordReset(email);
  }
  await apiPost('/auth/forgot-password', { email, panel: 'web' }, false);
}

export async function requestAdminAccess(
  values: AdminAccessRequestFormValues,
): Promise<MessageResponse> {
  if (isMockMode()) {
    return mockRequestAdminAccess(values);
  }
  return apiPost<MessageResponse>('/auth/admin-access-request', values, false);
}

export async function changePassword(
  values: ChangePasswordRequest,
): Promise<MessageResponse> {
  if (isMockMode()) {
    return mockChangePassword(values);
  }
  return apiPost<MessageResponse>('/auth/change-password', values, true);
}

export async function verifyResetCode(
  values: VerifyResetCodeFormValues,
): Promise<MessageResponse> {
  if (isMockMode()) {
    return mockVerifyResetCode(values);
  }
  return apiPost<MessageResponse>(
    '/auth/verify-reset-code',
    { ...values, panel: 'web' },
    false,
  );
}

export async function resetPassword(values: ResetPasswordFormValues): Promise<MessageResponse> {
  if (isMockMode()) {
    return mockResetPassword(values);
  }
  return apiPost<MessageResponse>(
    '/auth/reset-password',
    { ...values, panel: 'web' },
    false,
  );
}
