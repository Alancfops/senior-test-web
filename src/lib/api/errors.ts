import type { ApiErrorBody } from '@/types/api';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function toApiError(response: Response): Promise<ApiError> {
  const fallback = genericMessage(response.status);

  try {
    const body = (await response.json()) as ApiErrorBody;
    const message = normalizeMessage(body.message);
    return new ApiError(message ?? fallback, response.status);
  } catch {
    return new ApiError(fallback, response.status);
  }
}

function normalizeMessage(message: ApiErrorBody['message']): string | undefined {
  if (!message) return undefined;
  if (Array.isArray(message)) return message.join('. ');
  return message;
}

function genericMessage(status: number): string {
  switch (status) {
    case 401:
      return 'Sessão expirada. Faça login novamente.';
    case 403:
      return 'Acesso restrito a administradores.';
    case 404:
      return 'Recurso não encontrado.';
    case 409:
      return 'Não foi possível concluir a operação.';
    default:
      if (status >= 500) {
        return 'Erro no servidor. Tente novamente em instantes.';
      }
      return 'Não foi possível concluir a operação.';
  }
}
