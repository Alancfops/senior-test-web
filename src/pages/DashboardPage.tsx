import { AppShell } from '@/components/layout/AppShell';
import {
  QuickLinkCard,
  StatCard,
  WelcomeBanner,
} from '@/components/layout/WelcomeBanner';
import {
  IconClipboard,
  IconFile,
  IconPatient,
  IconUsers,
} from '@/components/icons/NavIcons';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/features/auth/AuthContext';
import { usePatientsList } from '@/features/patients/usePatients';
import { useTherapists } from '@/features/therapists/useTherapists';
import { useAuditLogs } from '@/features/audit/useAuditLogs';
import { AUDIT_ACTION_LABELS } from '@/types/api';

export function DashboardPage() {
  const { user } = useAuth();
  const { data: therapists, isLoading: loadingTherapists } = useTherapists();
  const { data: patients, isLoading: loadingPatients } = usePatientsList();
  const { data: auditLogs, isLoading: loadingAudit } = useAuditLogs({ limit: 5 });

  const loading = loadingTherapists || loadingPatients || loadingAudit;

  const therapistCount = therapists?.meta.total ?? 0;
  const patientCount = patients?.meta.total ?? 0;
  const assessmentCount =
    therapists?.data.reduce((sum, item) => sum + item.assessmentCount, 0) ?? 0;

  return (
    <AppShell title="Início" description="Visão geral do gerenciador clínico.">
      <div className="space-y-6">
        <WelcomeBanner
          userName={user?.fullName ?? 'Administrador'}
          subtitle="Supervisione a equipe de fisioterapeutas no app mobile, sem operar avaliações por aqui."
        />

        {loading ? <Spinner label="Carregando resumo…" /> : null}

        {!loading ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard label="Fisioterapeutas" value={therapistCount} />
              <StatCard label="Pacientes" value={patientCount} accent="secondary" />
              <StatCard label="Avaliações (equipe)" value={assessmentCount} />
            </div>

            <section>
              <h2 className="mb-3 text-base font-bold text-[var(--stf-text)]">
                Acesso rápido
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                <QuickLinkCard
                  to="/therapists"
                  title="Fisioterapeutas"
                  description="Lista da equipe, pacientes vinculados e ações administrativas."
                  icon={<IconUsers className="size-5" />}
                />
                <QuickLinkCard
                  to="/patients"
                  title="Pacientes"
                  description="Todos os pacientes do sistema, independente do fisio responsável."
                  icon={<IconPatient className="size-5" />}
                />
                <QuickLinkCard
                  to="/audit-logs"
                  title="Auditoria"
                  description="Trilha de exclusões, transferências e downloads de relatório."
                  icon={<IconClipboard className="size-5" />}
                />
                <QuickLinkCard
                  to="/reports"
                  title="Relatórios PDF"
                  description="Como gerar e baixar relatórios clínicos no painel admin."
                  icon={<IconFile className="size-5" />}
                />
              </div>
            </section>

            {auditLogs && auditLogs.data.length > 0 ? (
              <section className="stf-card p-5">
                <h2 className="text-base font-bold text-[var(--stf-text)]">
                  Atividade recente
                </h2>
                <ul className="mt-3 space-y-2">
                  {auditLogs.data.slice(0, 3).map((log) => (
                    <li
                      key={log.id}
                      className="flex flex-col gap-1 rounded-stf-sm bg-[var(--stf-page-bg)] px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-[var(--stf-text)]">{log.adminName}</span>
                      <span className="text-[var(--stf-text-muted)]">
                        {AUDIT_ACTION_LABELS[log.action]}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
