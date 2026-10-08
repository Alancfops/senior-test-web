import { formatShortDisplayName } from '@/lib/format';
import type { AuditLogItem } from '@/types/api';

export type AuditTargetView = {
  label: string;
  /** Nome completo do alvo, quando registrado no audit. */
  name: string | null;
  /** Rota interna quando o alvo ainda é navegável. */
  to: string | null;
  title: string;
};

function metaString(meta: Record<string, unknown>, key: string): string | null {
  const value = meta[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/** Alvo amigável para a trilha — sem UUID cru nem JSON de metadados. */
export function resolveAuditTarget(log: AuditLogItem): AuditTargetView {
  const meta = log.metadata ?? {};

  if (log.targetType === 'Patient') {
    const name = metaString(meta, 'patientName');
    const label = name ? formatShortDisplayName(name) : 'Paciente';
    // Após exclusão o registro some — só o nome (sem link quebrado).
    const to =
      log.action === 'DELETE_PATIENT' ? null : `/patients/${log.targetId}`;
    return {
      label,
      name,
      to,
      title: name ?? 'Ver perfil do paciente',
    };
  }

  if (log.targetType === 'Assessment') {
    const name = metaString(meta, 'patientName');
    const patientId = metaString(meta, 'patientId');
    const label = name ? formatShortDisplayName(name) : 'Avaliação';
    return {
      label,
      name,
      to: patientId ? `/patients/${patientId}` : null,
      title: name ?? 'Ver perfil do paciente',
    };
  }

  if (log.targetType === 'Therapist') {
    const name =
      metaString(meta, 'therapistName') ??
      metaString(meta, 'fullName');
    const label = name ? formatShortDisplayName(name) : 'Fisioterapeuta';
    return {
      label,
      name,
      to: null,
      title: name ?? 'Fisioterapeuta',
    };
  }

  return {
    label: 'Registro',
    name: null,
    to: null,
    title: 'Registro',
  };
}
