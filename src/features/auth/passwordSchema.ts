import { z } from 'zod';

export type PasswordRule = {
  label: string;
  test: (password: string) => boolean;
  message: string;
};

/** RF001 / RF003 — mesma política do mobile STF + checklist visual. */
export const passwordRules: PasswordRule[] = [
  {
    label: 'Mínimo de 8 caracteres',
    test: (password) => password.length >= 8,
    message: 'A senha deve ter no mínimo 8 caracteres.',
  },
  {
    label: 'Pelo menos 4 números',
    test: (password) => (password.match(/\d/g) ?? []).length >= 4,
    message: 'A senha deve ter pelo menos 4 números.',
  },
  {
    label: 'Pelo menos 2 letras',
    test: (password) => (password.match(/[A-Za-zÀ-ÿ]/g) ?? []).length >= 2,
    message: 'A senha deve ter pelo menos 2 letras.',
  },
  {
    label: 'Uma letra maiúscula',
    test: (password) => /[A-ZÀ-Ý]/.test(password),
    message: 'A senha deve ter pelo menos 1 letra maiúscula.',
  },
  {
    label: 'Uma letra minúscula',
    test: (password) => /[a-zà-ÿ]/.test(password),
    message: 'A senha deve ter pelo menos 1 letra minúscula.',
  },
];

/** Regras alinhadas ao STF (`auth.schemas.ts` / mobile). */
export const passwordSchema = passwordRules.reduce(
  (schema, rule) => schema.refine(rule.test, { message: rule.message }),
  z.string(),
);

export const fullNameSchema = z
  .string()
  .trim()
  .min(1, 'Informe o nome completo.')
  .max(250, 'Nome muito longo (máx. 250 caracteres).')
  .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'Nome não pode conter números ou caracteres especiais.');

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Informe o e-mail.')
  .email('Digite um e-mail válido');

export const resetTokenSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'O código deve ter 6 dígitos numéricos.');

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha temporária recebida por e-mail.'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: 'A nova senha deve ser diferente da senha temporária.',
    path: ['newPassword'],
  });

export const adminAccessRequestSchema = z.object({
  email: emailSchema,
  fullName: fullNameSchema,
});

export const verifyResetCodeSchema = z.object({
  email: emailSchema,
  token: resetTokenSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  token: resetTokenSchema,
  password: passwordSchema,
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type ChangePasswordRequest = Pick<
  ChangePasswordFormValues,
  'currentPassword' | 'newPassword'
>;
export type AdminAccessRequestFormValues = z.infer<typeof adminAccessRequestSchema>;
export type VerifyResetCodeFormValues = z.infer<typeof verifyResetCodeSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
