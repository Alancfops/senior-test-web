import { getAccessToken } from '@/lib/auth/session';
import { ApiError, toApiError } from '@/lib/api/errors';

function getBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_STF_API_URL;
  if (!baseUrl) {
    throw new ApiError('API não configurada. Defina VITE_STF_API_URL.', 0);
  }
  return baseUrl.replace(/\/$/, '');
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  auth?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, auth = true, headers, ...init } = options;
  const token = auth ? getAccessToken() : null;

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' });
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  auth = true,
): Promise<T> {
  return apiRequest<T>(path, { method: 'POST', body, auth });
}

export async function apiDelete<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'DELETE' });
}
