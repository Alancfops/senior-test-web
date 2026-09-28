import type { AuthUser, TherapistRole } from '@/types/api';

const ACCESS_TOKEN_KEY = 'stf_access_token';
const USER_KEY = 'stf_user';

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setSession(accessToken: string, user: AuthUser): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

const WEB_ROLES: TherapistRole[] = ['ASSISTANT', 'ADMIN'];

export function isAdminSession(): boolean {
  const token = getAccessToken();
  const user = getStoredUser();
  return Boolean(token && user && WEB_ROLES.includes(user.role));
}
