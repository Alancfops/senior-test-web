import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { PrototypeBanner } from '@/components/layout/PrototypeBanner';

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
  return (
    <div className="flex min-h-screen bg-[var(--stf-page-bg)]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <PrototypeBanner />

        <header className="border-b border-[var(--stf-border)] bg-[var(--stf-surface)] px-6 py-5 shadow-stf">
          {breadcrumbs ? (
            <div className="mb-2 text-xs font-medium text-[var(--stf-primary)]">{breadcrumbs}</div>
          ) : null}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-[var(--stf-text)]">{title}</h1>
              {description ? (
                <p className="mt-1 max-w-3xl text-sm text-[var(--stf-text-muted)]">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="flex shrink-0 items-end gap-2">{actions}</div> : null}
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
