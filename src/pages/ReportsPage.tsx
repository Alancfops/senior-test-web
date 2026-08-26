import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { IconFile } from '@/components/icons/NavIcons';

export function ReportsPage() {
  return (
    <AppShell
      title="Relatórios PDF"
      description="Geração de relatórios clínicos sem restrição de ownership (GW009)."
    >
      <div className="stf-card p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-stf-lg bg-[color-mix(in_srgb,var(--stf-primary)_12%,var(--stf-surface))] text-[var(--stf-primary)]">
            <IconFile className="size-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[var(--stf-text)]">Como baixar relatórios</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--stf-text-muted)]">
              No protótipo, o PDF é gerado a partir do detalhe de uma avaliação{' '}
              <strong>finalizada</strong>. Acesse um paciente, abra uma avaliação na lista de
              histórico e use o botão <strong>Baixar PDF</strong>.
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--stf-text)]">
              <li>
                Vá em{' '}
                <Link to="/patients" className="font-medium text-[var(--stf-primary)]">
                  Pacientes
                </Link>
              </li>
              <li>Abra o perfil de um paciente com avaliações finalizadas</li>
              <li>Clique em &quot;Ver detalhe&quot; na avaliação desejada</li>
              <li>Use &quot;Baixar PDF&quot; no canto superior direito</li>
            </ol>
            <p className="mt-4 rounded-stf-sm bg-[var(--stf-page-bg)] px-3 py-2 text-xs text-[var(--stf-text-muted)]">
              Na integração com a API STF, o download usará{' '}
              <code className="text-[var(--stf-primary)]">POST /admin/reports/assessments/:id</code>{' '}
              e registrará auditoria automaticamente.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
