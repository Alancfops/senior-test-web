import type {
  AccessRequestItem,
  AssessmentDetail,
  AssessmentListItem,
  AuditLogItem,
  PatientProfile,
  TherapistDetail,
  TherapistListItem,
} from '@/types/api';

export const MOCK_IDS = {
  therapistMaria: '550e8400-e29b-41d4-a716-446655440001',
  therapistCarlos: '550e8400-e29b-41d4-a716-446655440002',
  therapistAdmin: '550e8400-e29b-41d4-a716-446655440003',
  therapistAssistant: '550e8400-e29b-41d4-a716-446655440004',
  patientJoao: '660e8400-e29b-41d4-a716-446655440001',
  patientAna: '660e8400-e29b-41d4-a716-446655440002',
  patientPedro: '660e8400-e29b-41d4-a716-446655440003',
  assessmentBerg1: '770e8400-e29b-41d4-a716-446655440001',
  assessmentBerg2: '770e8400-e29b-41d4-a716-446655440002',
  assessmentBerg3: '770e8400-e29b-41d4-a716-446655440003',
  assessmentKatz1: '770e8400-e29b-41d4-a716-446655440004',
  assessmentTug1: '770e8400-e29b-41d4-a716-446655440005',
  accessRequestPending: '880e8400-e29b-41d4-a716-446655440001',
} as const;

type MockState = {
  therapists: TherapistListItem[];
  therapistDetails: Record<string, TherapistDetail>;
  patients: Record<string, PatientProfile>;
  assessments: Record<string, AssessmentDetail>;
  auditLogs: AuditLogItem[];
  accessRequests: AccessRequestItem[];
};

function buildInitialState(): MockState {
  const therapists: TherapistListItem[] = [
    {
      id: MOCK_IDS.therapistMaria,
      fullName: 'Maria Silva',
      email: 'maria@clinica.exemplo',
      role: 'THERAPIST',
      createdAt: '2026-03-15T10:00:00.000Z',
      patientCount: 2,
      assessmentCount: 8,
      lastActivityAt: '2026-08-10T14:30:00.000Z',
    },
    {
      id: MOCK_IDS.therapistCarlos,
      fullName: 'Carlos Oliveira',
      email: 'carlos@clinica.exemplo',
      role: 'THERAPIST',
      createdAt: '2026-04-02T09:00:00.000Z',
      patientCount: 1,
      assessmentCount: 2,
      lastActivityAt: '2026-08-05T11:00:00.000Z',
    },
    {
      id: MOCK_IDS.therapistAdmin,
      fullName: 'Administradora',
      email: 'admin@clinica.exemplo',
      role: 'SUPER_ADMIN',
      createdAt: '2026-01-01T08:00:00.000Z',
      patientCount: 0,
      assessmentCount: 0,
      lastActivityAt: null,
    },
    {
      id: MOCK_IDS.therapistAssistant,
      fullName: 'Beatriz Ajudante',
      email: 'ajudante@clinica.exemplo',
      role: 'ASSISTANT',
      createdAt: '2026-02-10T08:00:00.000Z',
      patientCount: 0,
      assessmentCount: 0,
      lastActivityAt: null,
    },
  ];

  const patients: Record<string, PatientProfile> = {
    [MOCK_IDS.patientJoao]: {
      id: MOCK_IDS.patientJoao,
      fullName: 'João Santos',
      age: 72,
      gender: 'masculino',
      contact: '(11) 98765-4321',
      schoolingBand: '5_8_anos',
      avatarUrl: null,
      createdAt: '2026-04-01T08:00:00.000Z',
      therapist: {
        id: MOCK_IDS.therapistMaria,
        fullName: 'Maria Silva',
        email: 'maria@clinica.exemplo',
      },
    },
    [MOCK_IDS.patientAna]: {
      id: MOCK_IDS.patientAna,
      fullName: 'Ana Costa',
      age: 68,
      gender: 'feminino',
      contact: '(11) 91234-5678',
      schoolingBand: '9_anos_ou_mais',
      avatarUrl: null,
      createdAt: '2026-05-12T10:30:00.000Z',
      therapist: {
        id: MOCK_IDS.therapistMaria,
        fullName: 'Maria Silva',
        email: 'maria@clinica.exemplo',
      },
    },
    [MOCK_IDS.patientPedro]: {
      id: MOCK_IDS.patientPedro,
      fullName: 'Pedro Lima',
      age: 75,
      gender: 'masculino',
      contact: '(11) 99876-5432',
      schoolingBand: '1_4_anos',
      avatarUrl: null,
      createdAt: '2026-06-20T14:00:00.000Z',
      therapist: {
        id: MOCK_IDS.therapistCarlos,
        fullName: 'Carlos Oliveira',
        email: 'carlos@clinica.exemplo',
      },
    },
  };

  const assessments: Record<string, AssessmentDetail> = {
    [MOCK_IDS.assessmentBerg1]: {
      id: MOCK_IDS.assessmentBerg1,
      patientId: MOCK_IDS.patientJoao,
      instrumentCode: 'BERG',
      status: 'FINALIZED',
      startedAt: '2026-06-01T10:00:00.000Z',
      finalizedAt: '2026-06-01T10:15:00.000Z',
      therapistId: MOCK_IDS.therapistMaria,
      therapistName: 'Maria Silva',
      result: {
        rawValue: 44,
        rawLabel: '44 pontos',
        classificationLabel: 'Risco moderado de queda',
        classificationCode: 'MODERATE_FALL_RISK',
        classificationMeta: { color: '#EAB308' },
        computedAt: '2026-06-01T10:15:00.000Z',
      },
      payload: {},
      schoolingBandUsed: null,
      notesObservation: null,
    },
    [MOCK_IDS.assessmentBerg2]: {
      id: MOCK_IDS.assessmentBerg2,
      patientId: MOCK_IDS.patientJoao,
      instrumentCode: 'BERG',
      status: 'FINALIZED',
      startedAt: '2026-07-10T10:00:00.000Z',
      finalizedAt: '2026-07-10T10:12:00.000Z',
      therapistId: MOCK_IDS.therapistMaria,
      therapistName: 'Maria Silva',
      result: {
        rawValue: 46,
        rawLabel: '46 pontos',
        classificationLabel: 'Risco moderado de queda',
        classificationCode: 'MODERATE_FALL_RISK',
        classificationMeta: { color: '#EAB308' },
        computedAt: '2026-07-10T10:12:00.000Z',
      },
      payload: {},
      schoolingBandUsed: null,
      notesObservation: null,
    },
    [MOCK_IDS.assessmentBerg3]: {
      id: MOCK_IDS.assessmentBerg3,
      patientId: MOCK_IDS.patientJoao,
      instrumentCode: 'BERG',
      status: 'FINALIZED',
      startedAt: '2026-08-01T09:00:00.000Z',
      finalizedAt: '2026-08-01T09:18:00.000Z',
      therapistId: MOCK_IDS.therapistMaria,
      therapistName: 'Maria Silva',
      result: {
        rawValue: 48,
        rawLabel: '48 pontos',
        classificationLabel: 'Baixo risco de queda',
        classificationCode: 'LOW_FALL_RISK',
        classificationMeta: { color: '#7CC5B4' },
        computedAt: '2026-08-01T09:18:00.000Z',
      },
      payload: {},
      schoolingBandUsed: null,
      notesObservation: 'Evolução positiva na marcha.',
    },
    [MOCK_IDS.assessmentKatz1]: {
      id: MOCK_IDS.assessmentKatz1,
      patientId: MOCK_IDS.patientAna,
      instrumentCode: 'KATZ',
      status: 'FINALIZED',
      startedAt: '2026-07-22T14:00:00.000Z',
      finalizedAt: '2026-07-22T14:20:00.000Z',
      therapistId: MOCK_IDS.therapistMaria,
      therapistName: 'Maria Silva',
      result: {
        rawValue: 5,
        rawLabel: '5 pontos',
        classificationLabel: 'Dependência leve',
        classificationCode: 'MILD_DEPENDENCE',
        classificationMeta: { color: '#3666E0' },
        computedAt: '2026-07-22T14:20:00.000Z',
      },
      payload: {},
      schoolingBandUsed: null,
      notesObservation: null,
    },
    [MOCK_IDS.assessmentTug1]: {
      id: MOCK_IDS.assessmentTug1,
      patientId: MOCK_IDS.patientPedro,
      instrumentCode: 'TUG',
      status: 'FINALIZED',
      startedAt: '2026-08-05T11:00:00.000Z',
      finalizedAt: '2026-08-05T11:05:00.000Z',
      therapistId: MOCK_IDS.therapistCarlos,
      therapistName: 'Carlos Oliveira',
      result: {
        rawValue: 14.2,
        rawLabel: '14,2 s',
        classificationLabel: 'Risco moderado',
        classificationCode: 'MODERATE_RISK',
        classificationMeta: { color: '#EAB308' },
        computedAt: '2026-08-05T11:05:00.000Z',
      },
      payload: {},
      schoolingBandUsed: null,
      notesObservation: null,
    },
  };

  const therapistDetails: Record<string, TherapistDetail> = {
    [MOCK_IDS.therapistMaria]: {
      id: MOCK_IDS.therapistMaria,
      fullName: 'Maria Silva',
      email: 'maria@clinica.exemplo',
      role: 'THERAPIST',
      createdAt: '2026-03-15T10:00:00.000Z',
      patients: [
        {
          id: MOCK_IDS.patientJoao,
          fullName: 'João Santos',
          age: 72,
          gender: 'masculino',
          assessmentCount: 3,
          lastAssessmentAt: '2026-08-01T09:18:00.000Z',
        },
        {
          id: MOCK_IDS.patientAna,
          fullName: 'Ana Costa',
          age: 68,
          gender: 'feminino',
          assessmentCount: 1,
          lastAssessmentAt: '2026-07-22T14:20:00.000Z',
        },
      ],
      meta: { patientCount: 2, assessmentCount: 4 },
    },
    [MOCK_IDS.therapistCarlos]: {
      id: MOCK_IDS.therapistCarlos,
      fullName: 'Carlos Oliveira',
      email: 'carlos@clinica.exemplo',
      role: 'THERAPIST',
      createdAt: '2026-04-02T09:00:00.000Z',
      patients: [
        {
          id: MOCK_IDS.patientPedro,
          fullName: 'Pedro Lima',
          age: 75,
          gender: 'masculino',
          assessmentCount: 1,
          lastAssessmentAt: '2026-08-05T11:05:00.000Z',
        },
      ],
      meta: { patientCount: 1, assessmentCount: 1 },
    },
    [MOCK_IDS.therapistAdmin]: {
      id: MOCK_IDS.therapistAdmin,
      fullName: 'Administradora',
      email: 'admin@clinica.exemplo',
      role: 'SUPER_ADMIN',
      createdAt: '2026-01-01T08:00:00.000Z',
      patients: [],
      meta: { patientCount: 0, assessmentCount: 0 },
    },
    [MOCK_IDS.therapistAssistant]: {
      id: MOCK_IDS.therapistAssistant,
      fullName: 'Beatriz Ajudante',
      email: 'ajudante@clinica.exemplo',
      role: 'ASSISTANT',
      createdAt: '2026-02-10T08:00:00.000Z',
      patients: [],
      meta: { patientCount: 0, assessmentCount: 0 },
    },
  };

  const auditLogs: AuditLogItem[] = [
    {
      id: '990e8400-e29b-41d4-a716-446655440001',
      adminId: MOCK_IDS.therapistAdmin,
      adminName: 'Administrador',
      action: 'TRANSFER_PATIENT',
      targetType: 'Patient',
      targetId: MOCK_IDS.patientAna,
      metadata: {
        patientName: 'Ana Costa',
        fromTherapistId: MOCK_IDS.therapistCarlos,
        toTherapistId: MOCK_IDS.therapistMaria,
      },
      createdAt: '2026-08-15T16:00:00.000Z',
    },
    {
      id: '990e8400-e29b-41d4-a716-446655440002',
      adminId: MOCK_IDS.therapistAdmin,
      adminName: 'Administrador',
      action: 'DOWNLOAD_REPORT',
      targetType: 'Assessment',
      targetId: MOCK_IDS.assessmentBerg3,
      metadata: {
        patientId: MOCK_IDS.patientJoao,
        patientName: 'João Santos',
        instrumentCode: 'BERG',
        finalizedAt: '2026-08-01T09:18:00.000Z',
      },
      createdAt: '2026-08-16T10:30:00.000Z',
    },
  ];

  const accessRequests: AccessRequestItem[] = [
    {
      id: MOCK_IDS.accessRequestPending,
      email: 'solicitante@clinica.exemplo',
      fullName: 'Ana Solicitante',
      status: 'PENDING',
      createdAt: '2026-08-28T14:00:00.000Z',
      resolvedAt: null,
      resolvedBy: null,
    },
  ];

  return { therapists, therapistDetails, patients, assessments, auditLogs, accessRequests };
}

let state = buildInitialState();

function syncTherapistAggregates() {
  for (const therapist of state.therapists) {
    const detail = state.therapistDetails[therapist.id];
    if (!detail) continue;

    const patientIds = detail.patients.map((p) => p.id);
    const assessmentCount = Object.values(state.assessments).filter((a) =>
      patientIds.includes(a.patientId),
    ).length;

    detail.meta.patientCount = detail.patients.length;
    detail.meta.assessmentCount = assessmentCount;
    therapist.patientCount = detail.patients.length;
    therapist.assessmentCount = assessmentCount;

    const lastDates = detail.patients
      .map((p) => p.lastAssessmentAt)
      .filter(Boolean) as string[];
    therapist.lastActivityAt =
      lastDates.length > 0
        ? lastDates.sort((a, b) => b.localeCompare(a))[0]
        : null;
  }
}

export function getMockState(): MockState {
  return state;
}

export function resetMockState(): void {
  state = buildInitialState();
}

export function getPatientAssessments(patientId: string): AssessmentListItem[] {
  return Object.values(state.assessments)
    .filter((a) => a.patientId === patientId)
    .sort((a, b) => (b.finalizedAt ?? b.startedAt).localeCompare(a.finalizedAt ?? a.startedAt))
    .map(
      ({
        id,
        patientId: pid,
        instrumentCode,
        status,
        startedAt,
        finalizedAt,
        therapistId,
        therapistName,
        result,
      }): AssessmentListItem => ({
        id,
        patientId: pid,
        instrumentCode,
        status,
        startedAt,
        finalizedAt,
        therapistId,
        therapistName,
        result,
      }),
    );
}

export function removePatient(patientId: string): void {
  const patient = state.patients[patientId];
  if (!patient) return;

  delete state.patients[patientId];
  for (const [id, assessment] of Object.entries(state.assessments)) {
    if (assessment.patientId === patientId) {
      delete state.assessments[id];
    }
  }

  const detail = state.therapistDetails[patient.therapist.id];
  if (detail) {
    detail.patients = detail.patients.filter((p) => p.id !== patientId);
  }

  syncTherapistAggregates();
}

export function removeTherapist(therapistId: string): void {
  state.therapists = state.therapists.filter((t) => t.id !== therapistId);
  delete state.therapistDetails[therapistId];
}

export function transferPatient(patientId: string, targetTherapistId: string): number {
  const patient = state.patients[patientId];
  const targetDetail = state.therapistDetails[targetTherapistId];
  if (!patient || !targetDetail) return 0;

  const fromTherapistId = patient.therapist.id;
  const fromDetail = state.therapistDetails[fromTherapistId];
  const summary = fromDetail?.patients.find((p) => p.id === patientId);

  if (fromDetail && summary) {
    fromDetail.patients = fromDetail.patients.filter((p) => p.id !== patientId);
  }

  patient.therapist = {
    id: targetDetail.id,
    fullName: targetDetail.fullName,
    email: targetDetail.email,
  };

  targetDetail.patients.push(
    summary ?? {
      id: patient.id,
      fullName: patient.fullName,
      age: patient.age,
      gender: patient.gender,
      assessmentCount: getPatientAssessments(patientId).length,
      lastAssessmentAt: getPatientAssessments(patientId)[0]?.finalizedAt ?? null,
    },
  );

  let updated = 0;
  for (const assessment of Object.values(state.assessments)) {
    if (assessment.patientId === patientId) {
      assessment.therapistId = targetTherapistId;
      assessment.therapistName = targetDetail.fullName;
      updated += 1;
    }
  }

  syncTherapistAggregates();
  return updated;
}

export function appendAuditLog(entry: Omit<AuditLogItem, 'id' | 'createdAt'>): void {
  state.auditLogs.unshift({
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
}

export function resolveAccessRequest(
  id: string,
  status: 'APPROVED' | 'REJECTED',
): AccessRequestItem {
  const request = state.accessRequests.find((item) => item.id === id);
  if (!request) {
    throw new Error('not_found');
  }
  if (request.status !== 'PENDING') {
    throw new Error('already_resolved');
  }

  request.status = status;
  request.resolvedAt = new Date().toISOString();
  request.resolvedBy = {
    id: MOCK_IDS.therapistAdmin,
    fullName: 'Administrador',
    email: 'admin@clinica.exemplo',
  };

  if (status === 'APPROVED') {
    const newId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    addTherapist(
      {
        id: newId,
        fullName: request.fullName,
        email: request.email,
        role: 'ASSISTANT',
        createdAt,
        patientCount: 0,
        assessmentCount: 0,
        lastActivityAt: null,
      },
      {
        id: newId,
        fullName: request.fullName,
        email: request.email,
        role: 'ASSISTANT',
        createdAt,
        patients: [],
        meta: { patientCount: 0, assessmentCount: 0 },
      },
    );
  }

  return structuredClone(request);
}

export function addTherapist(therapist: TherapistListItem, detail: TherapistDetail): void {
  state.therapists.unshift(therapist);
  state.therapistDetails[therapist.id] = detail;
}

export function appendAccessRequest(email: string, fullName: string): void {
  const existing = state.accessRequests.find(
    (item) => item.email === email && item.status === 'PENDING',
  );
  if (existing) return;

  state.accessRequests.unshift({
    id: crypto.randomUUID(),
    email,
    fullName,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    resolvedBy: null,
  });
}
