const REMEMBER_EMAIL_KEY = 'stf_remember_email';

/** Só e-mail (não JWT/senha) — LGPD: sessão admin continua em sessionStorage. */
export function getRememberedEmail(): string | null {
  try {
    return localStorage.getItem(REMEMBER_EMAIL_KEY);
  } catch {
    return null;
  }
}

export function setRememberedEmail(email: string): void {
  try {
    localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim().toLowerCase());
  } catch {
    // ignore quota / private mode
  }
}

export function clearRememberedEmail(): void {
  try {
    localStorage.removeItem(REMEMBER_EMAIL_KEY);
  } catch {
    // ignore
  }
}
