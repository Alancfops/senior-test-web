import { formatDateTime } from '@/lib/format';
import type { AuditLogItem, TherapistRole } from '@/types/api';
import { INSTRUMENT_LABELS, ROLE_LABELS } from '@/types/api';

export type AuditField = { label: string; value: string };

export type AuditSnapshot = {
  fields: AuditField[];
  /** Texto exibido quando não há campos (ex.: registro excluído). */
  emptyLabel: string;
};

export type AuditLogChanges = {
  before: AuditSnapshot;
  after: AuditSnapshot;
};

export const AUDIT_ENTITY_LABELS: Record<AuditLogItem['targetType'], string> = {
  Patient: 'Paciente',
  Therapist: 'Conta de usuário',
  Assessment: 'Avaliação',
};

/** Resolve nome de fisioterapeuta a partir do ID gravado no audit (nunca exibido). */
export type TherapistNameResolver = (therapistId: string) => string | null;

const NO_DATA = 'Sem dados';
const UNKNOWN_THERAPIST = 'Conta não encontrada (possivelmente excluída)';

function metaString(meta: Record<string, unknown>, key: string): string | null {
  const value = meta[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function field(label: string, value: string | null): AuditField[] {
  return value ? [{ label, value }] : [];
}

function snapshot(fields: AuditField[], emptyLabel = NO_DATA): AuditSnapshot {
  return { fields, emptyLabel };
}

function therapistName(
  meta: Record<string, unknown>,
  nameKey: string,
  idKey: string,
  resolveTherapistName: TherapistNameResolver,
): string {
  const stored = metaString(meta, nameKey);
  if (stored) return stored;
  const id = metaString(meta, idKey);
  return (id && resolveTherapistName(id)) || UNKNOWN_THERAPIST;
}

/**
 * Estado antes/depois de cada ação administrativa, montado só com dados legíveis —
 * sem UUIDs nem JSON cru de metadados (LGPD: mínimo necessário).
 */
export function buildAuditLogChanges(
  log: AuditLogItem,
  resolveTherapistName: TherapistNameResolver,
): AuditLogChanges {
  const meta = log.metadata ?? {};
  const patientName = metaString(meta, 'patientName');

  switch (log.action) {
    case 'DELETE_PATIENT':
      return {
        before: snapshot([...field('Paciente', patientName), { label: 'Situação', value: 'Cadastrado' }]),
        after: snapshot([], 'Paciente e histórico clínico excluídos'),
      };

    case 'TRANSFER_PATIENT':
      return {
        before: snapshot([
          ...field('Paciente', patientName),
          {
            label: 'Fisioterapeuta responsável',
            value: therapistName(meta, 'fromTherapistName', 'fromTherapistId', resolveTherapistName),
          },
        ]),
        after: snapshot([
          ...field('Paciente', patientName),
          {
            label: 'Fisioterapeuta responsável',
            value: therapistName(meta, 'toTherapistName', 'toTherapistId', resolveTherapistName),
          },
        ]),
      };

    case 'DELETE_THERAPIST':
      return {
        before: snapshot([
          ...field('Nome', metaString(meta, 'therapistName') ?? metaString(meta, 'fullName')),
          ...field('E-mail', metaString(meta, 'email')),
        ]),
        after: snapshot([], 'Conta excluída'),
      };

    case 'CREATE_THERAPIST': {
      const role = metaString(meta, 'role') as TherapistRole | null;
      return {
        before: snapshot([], 'Conta inexistente'),
        after: snapshot([
          ...field('Nome', metaString(meta, 'fullName')),
          ...field('E-mail', metaString(meta, 'email')),
          ...field('Perfil', role ? (ROLE_LABELS[role] ?? role) : null),
        ]),
      };
    }

    case 'DOWNLOAD_REPORT': {
      const instrumentCode = metaString(meta, 'instrumentCode');
      const finalizedAt = metaString(meta, 'finalizedAt');
      return {
        before: snapshot([], 'Sem alteração de dados'),
        after: snapshot([
          { label: 'Relatório', value: 'PDF gerado para download' },
          ...field('Paciente', patientName),
          ...field(
            'Instrumento',
            instrumentCode ? (INSTRUMENT_LABELS[instrumentCode] ?? instrumentCode) : null,
          ),
          ...field('Avaliação finalizada em', finalizedAt ? formatDateTime(finalizedAt) : null),
        ]),
      };
    }

    default:
      return { before: snapshot([]), after: snapshot([]) };
  }
}
