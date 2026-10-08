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
});
