import { describe, expect, it } from 'vitest';
import {
  adminAccessRequestSchema,
  passwordSchema,
  resetTokenSchema,
} from './passwordSchema';

describe('passwordSchema', () => {
  it('aceita senha que atende às regras STF', () => {
    expect(passwordSchema.safeParse('Admin1234').success).toBe(true);
  });

  it('rejeita senha curta', () => {
    const result = passwordSchema.safeParse('Ab12');
    expect(result.success).toBe(false);
  });

  it('rejeita senha sem letras maiúsculas suficientes', () => {
    const result = passwordSchema.safeParse('admin1234');
    expect(result.success).toBe(false);
  });

  it('rejeita senha com menos de 4 dígitos', () => {
    const result = passwordSchema.safeParse('Admin12ab');
    expect(result.success).toBe(false);
  });
});

describe('adminAccessRequestSchema', () => {
  it('aceita nome e e-mail válidos', () => {
    const result = adminAccessRequestSchema.safeParse({
      email: 'Novo@Clinica.Exemplo',
      fullName: 'Maria Silva',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('novo@clinica.exemplo');
    }
  });

  it('rejeita nome com números', () => {
    const result = adminAccessRequestSchema.safeParse({
      email: 'novo@clinica.exemplo',
      fullName: 'Maria 123',
    });
    expect(result.success).toBe(false);
  });
});

describe('resetTokenSchema', () => {
  it('aceita código de 6 dígitos', () => {
    expect(resetTokenSchema.safeParse('123456').success).toBe(true);
  });

  it('rejeita código inválido', () => {
    expect(resetTokenSchema.safeParse('12ab56').success).toBe(false);
  });
});
