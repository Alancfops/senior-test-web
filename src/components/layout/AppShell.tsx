import { useEffect, useId, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { PrototypeBanner } from '@/components/layout/PrototypeBanner';
import { IconMenu } from '@/components/icons/NavIcons';

type AppShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
};

export function AppShell({
  title,
  description,
  children,
  actions,
  breadcrumbs,
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuButtonId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-dvh bg-[var(--stf-page-bg)]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <PrototypeBanner />

        <header className="border-b border-[var(--stf-border)] bg-[var(--stf-surface)] px-4 py-4 shadow-stf sm:px-6 sm:py-5">
          <div className="mb-3 flex items-center gap-3 lg:hidden">
            <button
              id={menuButtonId}
              type="button"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-stf-lg border border-[var(--stf-border)] bg-[var(--stf-surface)] text-[var(--stf-text)] hover:bg-[var(--stf-page-bg)]"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="app-sidebar"
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu className="size-5" />
            </button>
            <img
              src="/logo-seniortest-wordmark.png"
              alt="SeniorTest Physio"
              width={120}
              height={36}
              className="h-7 w-auto"
            />
          </div>

          {breadcrumbs ? (
            <div className="mb-2 text-xs font-medium text-[var(--stf-primary)]">{breadcrumbs}</div>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-[var(--stf-text)] sm:text-2xl">{title}</h1>
              {description ? (
                <p className="mt-1 max-w-3xl text-sm text-[var(--stf-text-muted)]">{description}</p>
              ) : null}
            </div>
            {actions ? (
              <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
                {actions}
              </div>
            ) : null}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
