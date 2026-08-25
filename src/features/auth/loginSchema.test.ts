import { describe, expect, it } from 'vitest';
import { loginSchema } from './loginSchema';

describe('loginSchema', () => {
  it('rejeita e-mail inválido', () => {
    const result = loginSchema.safeParse({
      email: 'invalido',
      password: 'Senha1234',
    });

    expect(result.success).toBe(false);
  });

  it('aceita credenciais válidas', () => {
    const result = loginSchema.safeParse({
      email: 'admin@clinica.exemplo',
      password: 'Admin1234',
    });

    expect(result.success).toBe(true);
  });
});
