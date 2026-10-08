import { AppShell } from '@/components/layout/AppShell';
import { SYSTEM_INFO } from '@/features/system-info/systemInfo';

function CreditSection({ title, names }: { title: string; names: readonly string[] }) {
  return (
    <section className="stf-card p-4 sm:p-5">
      <h2 className="text-base font-semibold text-[var(--stf-text)]">{title}</h2>
      <ul className="mt-3 space-y-1 text-sm text-[var(--stf-text-muted)]">
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
}

export function SystemInfoPage() {
  return (
    <AppShell
      title="Informações do sistema"
      description="Equipe envolvida no Sênior Teste Funcional"
      backLink={{ to: '/dashboard', label: 'Voltar ao início' }}
    >
      <div className="space-y-4">
        <section className="stf-card p-4 sm:p-5">
          <h2 className="text-base font-semibold text-[var(--stf-text)]">Desenvolvido por</h2>
          <img
            src={SYSTEM_INFO.developedByLogo}
            alt="CESMAC CITEC"
            className="mt-3 h-16 w-auto"
          />
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <CreditSection
            title="Professores e pesquisadores envolvidos"
            names={SYSTEM_INFO.professorsAndResearchers}
          />
          <CreditSection title="Desenvolvedores responsáveis" names={SYSTEM_INFO.developers} />
          <CreditSection title="Designers" names={SYSTEM_INFO.designers} />
        </div>
      </div>
    </AppShell>
  );
}
