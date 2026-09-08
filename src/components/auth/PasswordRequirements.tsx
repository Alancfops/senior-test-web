import { passwordRules } from '@/features/auth/passwordSchema';

type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <ul className="space-y-1.5" aria-label="Requisitos da senha">
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        return (
          <li key={rule.label} className="flex items-center gap-2 text-xs sm:text-sm">
            <span
              className={[
                'inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border text-[11px] font-bold',
                met
                  ? 'border-[var(--stf-primary)] bg-[var(--stf-primary)] text-[var(--stf-on-primary,#fff)]'
                  : 'border-[var(--stf-border)] bg-[var(--stf-surface)] text-transparent',
              ].join(' ')}
              aria-hidden
            >
              ✓
            </span>
            <span
              className={
                met ? 'font-medium text-[var(--stf-primary)]' : 'text-[var(--stf-text-muted)]'
              }
            >
              {rule.label}
            </span>
            <span className="sr-only">{met ? 'atendido' : 'pendente'}</span>
          </li>
        );
      })}
    </ul>
  );
}
