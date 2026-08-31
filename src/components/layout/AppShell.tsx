import { useEffect, useId, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AppFooter } from '@/components/layout/AppFooter';
import { Sidebar } from '@/components/layout/Sidebar';
import { PrototypeBanner } from '@/components/layout/PrototypeBanner';
import { PageBackLink } from '@/components/ui/PageBackLink';
import { IconMenu } from '@/components/icons/NavIcons';

type AppShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  backLink?: { to: string; label?: string };
};

export function AppShell({
  title,
  description,
  children,
  actions,
  breadcrumbs,
  backLink,
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
          <div className="relative mb-3 flex h-11 items-center justify-center lg:hidden">
            <button
              id={menuButtonId}
              type="button"
              className="absolute left-0 inline-flex size-11 items-center justify-center rounded-stf-lg border border-[var(--stf-border)] bg-[var(--stf-surface)] text-[var(--stf-text)] shadow-stf hover:bg-[var(--stf-page-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--stf-primary)] focus-visible:ring-offset-1"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="app-sidebar"
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu className="size-5" />
            </button>
            <img
              src="/logo-seniortest-wordmark.png"
              alt="Sênior Teste Funcional"
              width={120}
              height={36}
              className="h-7 w-auto"
            />
          </div>

          {backLink ? (
            <PageBackLink to={backLink.to} label={backLink.label} />
          ) : null}

          {breadcrumbs ? (
            <div className="mb-2 text-xs font-medium text-[var(--stf-primary)]">{breadcrumbs}</div>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1
                className="hyphens-none break-words text-xl font-bold text-[var(--stf-text)] sm:text-2xl md:truncate"
                title={title}
              >
                {title}
              </h1>
              {description ? (
                <p
                  className="mt-1 max-w-3xl break-words text-sm text-[var(--stf-text-muted)] md:truncate"
                  title={description}
                >
                  {description}
                </p>
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
        <AppFooter />
      </div>
    </div>
  );
}
