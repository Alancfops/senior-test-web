import { describe, expect, it } from 'vitest';
import type { AuditLogItem } from '@/types/api';
import { buildAuditLogChanges } from './auditLogChanges';

const FROM_ID = '11111111-1111-4111-8111-111111111111';
const TO_ID = '22222222-2222-4222-8222-222222222222';

function makeLog(overrides: Partial<AuditLogItem>): AuditLogItem {
  return {
    id: 'log-1',
    adminId: 'admin-1',
    adminName: 'Professora',
    action: 'DELETE_PATIENT',
    targetType: 'Patient',
    targetId: '33333333-3333-4333-8333-333333333333',
    metadata: {},
    createdAt: '2026-09-30T12:23:00.000Z',
    ...overrides,
  };
}

const names: Record<string, string> = { [FROM_ID]: 'Ana Souza', [TO_ID]: 'Bruno Lima' };
const resolve = (id: string) => names[id] ?? null;

function allValues(log: AuditLogItem): string[] {
  const { before, after } = buildAuditLogChanges(log, resolve);
  return [...before.fields, ...after.fields].map((field) => field.value);
}

describe('buildAuditLogChanges', () => {
  it('shows previous and new responsible therapist names on transfer', () => {
    const changes = buildAuditLogChanges(
      makeLog({
        action: 'TRANSFER_PATIENT',
        metadata: { patientName: 'Maria', fromTherapistId: FROM_ID, toTherapistId: TO_ID },
      }),
      resolve,
    );

    expect(changes.before.fields).toContainEqual({
      label: 'Fisioterapeuta responsável',
      value: 'Ana Souza',
    });
    expect(changes.after.fields).toContainEqual({
      label: 'Fisioterapeuta responsável',
      value: 'Bruno Lima',
    });
  });

  it('never exposes internal IDs, even when a therapist cannot be resolved', () => {
    const log = makeLog({
      action: 'TRANSFER_PATIENT',
      metadata: { patientName: 'Maria', fromTherapistId: 'unknown-id', toTherapistId: TO_ID },
    });

    const values = allValues(log).join(' ');
    expect(values).not.toContain('unknown-id');
    expect(values).not.toContain(TO_ID);
    expect(values).not.toContain(log.targetId);
  });

  it('marks deleted patient as removed after the action', () => {
    const changes = buildAuditLogChanges(
      makeLog({ action: 'DELETE_PATIENT', metadata: { patientName: 'Maria' } }),
      resolve,
    );

    expect(changes.before.fields[0]).toEqual({ label: 'Paciente', value: 'Maria' });
    expect(changes.after.fields).toHaveLength(0);
    expect(changes.after.emptyLabel).toMatch(/excluídos/);
  });

  it('shows created account data only after the action', () => {
    const changes = buildAuditLogChanges(
      makeLog({
        action: 'CREATE_THERAPIST',
        targetType: 'Therapist',
        metadata: { fullName: 'Carla', email: 'carla@example.com', role: 'ASSISTANT' },
      }),
      resolve,
    );

    expect(changes.before.fields).toHaveLength(0);
    expect(changes.after.fields).toContainEqual({ label: 'Perfil', value: 'Ajudante' });
  });

  it('shows role change when an app account is promoted to assistant', () => {
    const changes = buildAuditLogChanges(
      makeLog({
        action: 'PROMOTE_ASSISTANT',
        targetType: 'Therapist',
        metadata: {
          fullName: 'Carla',
          email: 'carla@example.com',
          fromRole: 'THERAPIST',
          toRole: 'ASSISTANT',
        },
      }),
      resolve,
    );

    expect(changes.before.fields).toContainEqual({ label: 'Perfil', value: 'Fisioterapeuta' });
    expect(changes.after.fields).toContainEqual({ label: 'Perfil', value: 'Ajudante' });
  });

  it('shows role change when assistant access is revoked', () => {
    const changes = buildAuditLogChanges(
      makeLog({
        action: 'REVOKE_ASSISTANT',
        targetType: 'Therapist',
        metadata: {
          fullName: 'Carla',
          email: 'carla@example.com',
          fromRole: 'ASSISTANT',
          toRole: 'THERAPIST',
        },
      }),
      resolve,
    );

    expect(changes.before.fields).toContainEqual({ label: 'Perfil', value: 'Ajudante' });
    expect(changes.after.fields).toContainEqual({ label: 'Perfil', value: 'Fisioterapeuta' });
  });

  it('shows request status change when access request is rejected', () => {
    const changes = buildAuditLogChanges(
      makeLog({
        action: 'REJECT_ACCESS_REQUEST',
        targetType: 'AccessRequest',
        metadata: { fullName: 'Diego', email: 'diego@example.com' },
      }),
      resolve,
    );

    expect(changes.before.fields).toContainEqual({ label: 'Situação', value: 'Pendente' });
    expect(changes.after.fields).toContainEqual({ label: 'Situação', value: 'Rejeitada' });
    expect(changes.after.fields).toContainEqual({ label: 'E-mail', value: 'diego@example.com' });
  });
});
