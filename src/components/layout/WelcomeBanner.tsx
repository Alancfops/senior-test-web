import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type WelcomeBannerProps = {
  userName: string;
  subtitle: string;
};

export function WelcomeBanner({ userName, subtitle }: WelcomeBannerProps) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <section
      className="relative overflow-hidden rounded-stf-lg p-6 text-[var(--stf-on-primary)] shadow-stf-md"
      style={{ background: 'var(--stf-header-gradient)' }}
    >
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
            Senior Teste Funcional
          </p>
          <h2 className="mt-1 text-2xl font-bold">Olá, {userName}!</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/90">{subtitle}</p>
        </div>
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white backdrop-blur-sm"
          aria-hidden
        >
          {initial}
        </div>
      </div>
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  accent?: 'primary' | 'secondary';
};

export function StatCard({ label, value, accent = 'primary' }: StatCardProps) {
  const accentColor =
    accent === 'secondary' ? 'var(--stf-secondary)' : 'var(--stf-primary)';

  return (
    <div className="stf-card p-5 transition-shadow hover:shadow-stf-md">
      <div className="mb-3 flex items-start justify-between">
        <div
          className="h-1 w-10 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden
        />
        <div
          className="flex size-8 items-center justify-center rounded-stf-sm bg-[color-mix(in_srgb,var(--stf-primary)_10%,var(--stf-surface))] text-[var(--stf-primary)]"
          aria-hidden
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M8 13h8M8 17h5" />
          </svg>
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--stf-text)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--stf-text-muted)]">{label}</p>
    </div>
  );
}

type QuickLinkCardProps = {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
};

export function QuickLinkCard({ to, title, description, icon }: QuickLinkCardProps) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-stf-lg border border-[var(--stf-border)] bg-[var(--stf-page-bg)] p-4 no-underline shadow-stf transition-all hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--stf-primary)_35%,var(--stf-border))] hover:shadow-stf-md"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-stf bg-[color-mix(in_srgb,var(--stf-primary)_12%,var(--stf-surface))] text-[var(--stf-primary)] transition-colors group-hover:bg-[var(--stf-primary)] group-hover:text-[var(--stf-on-primary)]">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-[var(--stf-text)]">{title}</p>
        <p className="mt-0.5 text-sm text-[var(--stf-text-muted)]">{description}</p>
      </div>
    </Link>
  );
}
