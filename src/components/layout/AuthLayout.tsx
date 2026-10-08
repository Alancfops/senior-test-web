import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <section
        className="relative hidden w-full flex-col items-center justify-center overflow-hidden p-8 lg:flex lg:w-[46%] xl:w-1/2 xl:p-12"
        style={{ background: 'var(--stf-header-gradient)' }}
        aria-hidden
      >
        <img
          src="/logo-seniorteste-vertical-branco.svg"
          alt=""
          width={170}
          height={152}
          className="h-64 w-auto drop-shadow-md xl:h-72"
        />
      </section>

      <section className="flex flex-1 items-center justify-center overflow-y-auto bg-[var(--stf-page-bg)] px-4 py-8 sm:px-6 md:px-8 md:py-10 lg:px-10 xl:px-12">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </div>
  );
}
