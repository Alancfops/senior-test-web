import type { ReactNode } from 'react';

import { IconCode, IconGraduationCap, IconPalette } from '@/components/icons/CreditIcons';
import { AppShell } from '@/components/layout/AppShell';
import { SYSTEM_INFO } from '@/features/system-info/systemInfo';

type CreditMember = { name: string; role?: { label: string; icon: ReactNode } };

/** "Érika Prado" → "ÉP". */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

function CreditSection({
  title,
  icon,
  members,
}: {
  title: string;
  icon: ReactNode;
  members: CreditMember[];
}) {
  return (
    <section className="stf-card overflow-hidden">
      <header className="flex items-center gap-3 border-b border-[var(--stf-border)] bg-[var(--stf-page-bg)] px-5 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-stf-sm bg-[color-mix(in_srgb,var(--stf-border)_55%,var(--stf-surface))] text-[var(--stf-text)]">
          {icon}
        </span>
        <h2 className="text-sm font-semibold text-[var(--stf-text)]">{title}</h2>
      </header>
      <ul className="divide-y divide-[color-mix(in_srgb,var(--stf-border)_60%,transparent)]">
        {members.map(({ name, role }) => (
          <li key={name} className="flex items-center gap-3 px-5 py-3">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-[var(--stf-on-primary)]"
              style={{ background: 'var(--stf-header-gradient)' }}
              aria-hidden
            >
              {initialsOf(name)}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-[var(--stf-text)]">{name}</span>
            {role ? (
              <span className="flex shrink-0 items-center gap-1.5 text-xs uppercase tracking-wide text-[var(--stf-text-muted)]">
                {role.icon}
                {role.label}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SystemInfoPage() {
  const { developedBy } = SYSTEM_INFO;
  const team: CreditMember[] = [
    ...SYSTEM_INFO.developers.map((name) => ({
      name,
      role: { label: 'Desenvolvimento', icon: <IconCode className="size-3.5" /> },
    })),
    ...SYSTEM_INFO.designers.map((name) => ({
      name,
      role: { label: 'Design', icon: <IconPalette className="size-3.5" /> },
    })),
  ];

  return (
    <AppShell
      title="Informações do sistema"
      description="Equipe envolvida no Sênior Teste Funcional"
      backLink={{ to: '/dashboard', label: 'Voltar ao início' }}
    >
      <div className="space-y-5">
        <section className="stf-card overflow-hidden">
          <div
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--stf-on-primary)]"
            style={{ background: 'var(--stf-header-gradient)' }}
          >
            Desenvolvido por
          </div>
          <div className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <span className="flex size-24 shrink-0 items-center justify-center rounded-stf-lg border border-[var(--stf-border)] bg-[var(--stf-surface)] p-3 shadow-stf">
              <img src={developedBy.logo} alt="" className="max-h-full w-auto" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[var(--stf-text)]">{developedBy.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--stf-text-muted)]">
                {developedBy.description}
              </p>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-5 md:grid-cols-2">
          <CreditSection
            title="Professores e pesquisadores envolvidos"
            icon={<IconGraduationCap />}
            members={SYSTEM_INFO.professorsAndResearchers.map((name) => ({ name }))}
          />
          <CreditSection title="Desenvolvimento e design" icon={<IconCode />} members={team} />
        </div>
      </div>
    </AppShell>
  );
}
