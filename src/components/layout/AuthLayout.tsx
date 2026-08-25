import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <section
        className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden p-12 lg:flex"
        style={{ background: 'var(--stf-auth-panel-gradient)' }}
        aria-hidden
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -left-20 top-8 size-56 rounded-full bg-[color-mix(in_srgb,var(--stf-primary)_22%,transparent)]" />
          <div className="absolute left-[18%] top-[22%] size-24 rounded-full bg-[color-mix(in_srgb,var(--stf-primary-dark)_18%,transparent)]" />
          <div className="absolute right-[-3rem] top-[14%] size-40 rounded-full bg-[color-mix(in_srgb,var(--stf-secondary)_20%,transparent)]" />
          <div className="absolute bottom-[28%] left-8 size-32 rounded-full bg-[color-mix(in_srgb,var(--stf-secondary)_24%,transparent)]" />
          <div className="absolute bottom-20 right-6 size-44 rounded-full bg-[color-mix(in_srgb,var(--stf-primary)_20%,transparent)]" />
          <div className="absolute bottom-[-2rem] left-[35%] size-28 rounded-full bg-[color-mix(in_srgb,var(--stf-primary-dark)_16%,transparent)]" />
          <div className="absolute right-[22%] top-[58%] size-20 rounded-full bg-[color-mix(in_srgb,var(--stf-secondary)_18%,transparent)]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/logo-seniortest-physio.png"
            alt=""
            width={200}
            height={200}
            className="rounded-full shadow-stf-md ring-4 ring-[color-mix(in_srgb,var(--stf-primary)_12%,var(--stf-surface))]"
          />
          <p className="mt-8 text-center text-3xl font-bold tracking-tight text-[var(--stf-primary-dark)]">
            STF Gerenciador
          </p>
          <p className="mt-3 max-w-md text-center text-base font-medium leading-relaxed text-[var(--stf-text)]">
            Conta administrativa exclusiva do painel web — separada do app mobile STF.
          </p>
        </div>
        <p className="absolute bottom-8 z-10 text-sm font-medium text-[var(--stf-text)]">
          Um único administrador por instância.
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center bg-[var(--stf-surface)] px-6 py-10">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </div>
  );
}
