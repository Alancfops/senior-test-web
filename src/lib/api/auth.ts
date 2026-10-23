import { apiPost } from '@/lib/api/client';
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
  await apiPost('/auth/forgot-password', { email, panel: 'web' }, false);
}

export async function requestAdminAccess(
  values: AdminAccessRequestFormValues,
): Promise<MessageResponse> {
  return apiPost<MessageResponse>('/auth/admin-access-request', values, false);
}

export async function changePassword(
  values: ChangePasswordRequest,
): Promise<MessageResponse> {
  return apiPost<MessageResponse>('/auth/change-password', values, true);
}

export async function verifyResetCode(
  values: VerifyResetCodeFormValues,
): Promise<MessageResponse> {
  return apiPost<MessageResponse>(
    '/auth/verify-reset-code',
    { ...values, panel: 'web' },
    false,
  );
}

export async function resetPassword(values: ResetPasswordFormValues): Promise<MessageResponse> {
  return apiPost<MessageResponse>(
    '/auth/reset-password',
    { ...values, panel: 'web' },
    false,
  );
}
