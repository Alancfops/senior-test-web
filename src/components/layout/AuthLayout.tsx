import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <section
        className="relative hidden w-full flex-col items-center justify-center overflow-hidden p-8 lg:flex lg:w-[46%] xl:w-1/2 xl:p-12"
        style={{ background: 'var(--stf-auth-panel-gradient)' }}
        aria-hidden
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -left-20 top-8 size-40 rounded-full bg-[color-mix(in_srgb,var(--stf-primary)_22%,transparent)] xl:size-56" />
          <div className="absolute left-[18%] top-[22%] size-20 rounded-full bg-[color-mix(in_srgb,var(--stf-primary-dark)_18%,transparent)] xl:size-24" />
          <div className="absolute right-[-3rem] top-[14%] size-32 rounded-full bg-[color-mix(in_srgb,var(--stf-secondary)_20%,transparent)] xl:size-40" />
          <div className="absolute bottom-[28%] left-8 size-28 rounded-full bg-[color-mix(in_srgb,var(--stf-secondary)_24%,transparent)] xl:size-32" />
          <div className="absolute bottom-20 right-6 size-36 rounded-full bg-[color-mix(in_srgb,var(--stf-primary)_20%,transparent)] xl:size-44" />
          <div className="absolute bottom-[-2rem] left-[35%] size-24 rounded-full bg-[color-mix(in_srgb,var(--stf-primary-dark)_16%,transparent)] xl:size-28" />
          <div className="absolute right-[22%] top-[58%] size-16 rounded-full bg-[color-mix(in_srgb,var(--stf-secondary)_18%,transparent)] xl:size-20" />
        </div>

        <div className="relative z-10 flex max-w-lg flex-col items-center px-4">
          <img
            src="/logo-seniortest-mark.png"
            alt=""
            width={147}
            height={174}
            className="h-44 w-auto drop-shadow-md xl:h-[200px]"
          />
          <p className="mt-6 text-center text-2xl font-bold tracking-tight text-[var(--stf-primary-dark)] xl:mt-8 xl:text-3xl">
            STF Gerenciador Web
          </p>
          <p className="mt-3 max-w-md text-center text-sm font-medium leading-relaxed text-[var(--stf-text)] xl:text-base">
            Conta administrativa exclusiva do painel web para supervisão do app mobile.
          </p>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center overflow-y-auto bg-[var(--stf-page-bg)] px-4 py-8 sm:px-6 md:px-8 md:py-10 lg:bg-[var(--stf-surface)] lg:px-10 xl:px-12">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </div>
  );
}
