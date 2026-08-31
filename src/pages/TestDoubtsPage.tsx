import { AppShell } from '@/components/layout/AppShell';
import { ClassificationIndicator } from '@/components/ui/ClassificationBadge';
import { PageBackLink } from '@/components/ui/PageBackLink';
import {
  GENERAL_TEST_HELP,
  INSTRUMENT_HELP_SECTIONS,
} from '@/features/assessments/instrumentHelpContent';

export function TestDoubtsPage() {
  return (
    <AppShell
      title="Dúvidas sobre os testes"
      description="Referência rápida sobre pontuações, classificações e leitura dos resultados no painel admin."
      backLink={{ to: '/dashboard', label: 'Voltar ao início' }}
    >
      <div className="space-y-6">
        <section className="stf-card p-4 sm:p-5">
          <h2 className="text-base font-semibold text-[var(--stf-text)]">Como ler os resultados</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--stf-text-muted)]">
            <li>{GENERAL_TEST_HELP.finalized}</li>
            <li>{GENERAL_TEST_HELP.scoreVsClassification}</li>
            <li>{GENERAL_TEST_HELP.chart}</li>
            <li>{GENERAL_TEST_HELP.pdf}</li>
          </ul>
        </section>

        {INSTRUMENT_HELP_SECTIONS.map((section) => (
          <section key={section.code} className="stf-card p-4 sm:p-5">
            <h2 className="text-base font-semibold text-[var(--stf-text)]">{section.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--stf-text-muted)]">
              {section.scoreSummary}
            </p>

            <h3 className="mt-4 text-sm font-semibold text-[var(--stf-text)]">
              Faixas de classificação
            </h3>
            <dl className="mt-2 space-y-2">
              {section.classifications.map((item) => (
                <div
                  key={`${section.code}-${item.range}`}
                  className="flex gap-2.5 rounded-stf border border-[var(--stf-border)] bg-[var(--stf-page-bg)] px-3 py-2.5"
                >
                  <ClassificationIndicator tone={item.tone} className="mt-1.5" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--stf-text)]">
                      {item.range}
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--stf-text)]">{item.description}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <h3 className="mt-4 text-sm font-semibold text-[var(--stf-text)]">
              Gráfico de evolução
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--stf-text-muted)]">
              {section.chartHint}
            </p>

            {section.notes ? (
              <p className="mt-3 text-xs leading-relaxed text-[var(--stf-text-muted)]">
                {section.notes}
              </p>
            ) : null}
          </section>
        ))}

        <PageBackLink />
      </div>
    </AppShell>
  );
}
