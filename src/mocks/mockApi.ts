import { getMockDelay } from '@/lib/api/config';
import { ApiError } from '@/lib/api/errors';
import {
  appendAccessRequest,
  appendAuditLog,
  getMockState,
  getPatientAssessments,
  MOCK_IDS,
  removePatient,
  removeTherapist,
  resolveAccessRequest,
  transferPatient,
} from '@/mocks/mockStore';
import type {
  AccessRequestsListResponse,
  AdminAccessRequestStatus,
  AdminAuditAction,
  AssessmentDetail,
  AssessmentsListResponse,
  AuditLogsResponse,
  LoginResponse,
  MessageResponse,
  PatientsListResponse,
  PatientProfile,
  TherapistsListResponse,
  TherapistDetail,
  TimeseriesResponse,
  TransferPatientRequest,
  TransferPatientResponse,
} from '@/types/api';
import type { LoginFormValues } from '@/features/auth/loginSchema';
import type {
  AdminAccessRequestFormValues,
  ChangePasswordRequest,
  ResetPasswordFormValues,
  VerifyResetCodeFormValues,
} from '@/features/auth/passwordSchema';

async function delay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, getMockDelay()));
}

export async function mockLogin(_values: LoginFormValues): Promise<LoginResponse> {
  void _values;
  await delay();

  return {
    accessToken: 'mock-jwt-token-prototype',
    user: {
      fullName: 'Administrador',
      email: 'admin@clinica.exemplo',
      role: 'ADMIN',
      mustChangePassword: false,
      canManageAccessRequests: true,
    },
  };
}

export async function mockListTherapists(): Promise<TherapistsListResponse> {
  await delay();
  const { therapists } = getMockState();
  return {
    data: [...therapists],
    meta: {
      page: 1,
      limit: 25,
      total: therapists.length,
      totalPages: 1,
    },
  };
}

export async function mockGetTherapist(id: string): Promise<TherapistDetail> {
  await delay();
  const detail = getMockState().therapistDetails[id];
  if (!detail) {
    throw new ApiError('Fisioterapeuta não encontrado.', 404);
  }
  return structuredClone(detail);
}

export async function mockDeleteTherapist(id: string): Promise<void> {
  await delay();
  const state = getMockState();
  const therapist = state.therapists.find((t) => t.id === id);
  if (!therapist) {
    throw new ApiError('Fisioterapeuta não encontrado.', 404);
  }
  if (therapist.patientCount > 0) {
    throw new ApiError(
      `Este fisioterapeuta ainda possui ${therapist.patientCount} paciente(s). Transfira ou exclua os pacientes antes de remover a conta.`,
      409,
    );
  }
  if (therapist.role === 'ADMIN' && state.therapists.filter((t) => t.role === 'ADMIN').length <= 1) {
    throw new ApiError('Não é possível remover o único administrador do sistema.', 409);
  }
  removeTherapist(id);
  appendAuditLog({
    adminId: MOCK_IDS.therapistAdmin,
    adminName: 'Administrador',
    action: 'DELETE_THERAPIST',
    targetType: 'Therapist',
    targetId: id,
    metadata: {
      therapistName: therapist.fullName,
      fullName: therapist.fullName,
      email: therapist.email,
    },
  });
}

export async function mockGetPatient(id: string): Promise<PatientProfile> {
  await delay();
  const patient = getMockState().patients[id];
  if (!patient) {
    throw new ApiError('Paciente não encontrado.', 404);
  }
  return structuredClone(patient);
}

export async function mockListPatients(): Promise<PatientsListResponse> {
  await delay();
  const state = getMockState();
  const data = Object.values(state.patients).map((patient) => {
    const assessments = getPatientAssessments(patient.id);
    return {
      id: patient.id,
      fullName: patient.fullName,
      age: patient.age,
      gender: patient.gender,
      therapistId: patient.therapist.id,
      therapistName: patient.therapist.fullName,
      assessmentCount: assessments.length,
      lastAssessmentAt: assessments[0]?.finalizedAt ?? null,
    };
  });

  return {
    data,
    meta: {
      page: 1,
      limit: 25,
      total: data.length,
      totalPages: 1,
    },
  };
}

export async function mockListAssessments(patientId: string): Promise<AssessmentsListResponse> {
  await delay();
  if (!getMockState().patients[patientId]) {
    throw new ApiError('Paciente não encontrado.', 404);
  }
  return { data: getPatientAssessments(patientId) };
}

export async function mockGetAssessment(
  patientId: string,
  assessmentId: string,
): Promise<AssessmentDetail> {
  await delay();
  const assessment = getMockState().assessments[assessmentId];
  if (!assessment || assessment.patientId !== patientId) {
    throw new ApiError('Avaliação não encontrada.', 404);
  }
  return structuredClone(assessment);
}

export async function mockGetTimeseries(
  patientId: string,
  code: string,
): Promise<TimeseriesResponse> {
  await delay();
  const instrumentCode = code.toUpperCase();
  const points = getPatientAssessments(patientId)
    .filter((a) => a.instrumentCode === instrumentCode && a.status === 'FINALIZED' && a.result)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
    .map((a) => ({
      assessmentId: a.id,
      startedAt: a.startedAt,
      finalizedAt: a.finalizedAt!,
      rawValue: a.result!.rawValue,
      rawLabel: a.result!.rawLabel,
      classificationLabel: a.result!.classificationLabel,
      classificationCode: a.result!.classificationCode,
    }));

  return {
    instrumentCode,
    points,
    canShowChart: points.length >= 2,
  };
}

export async function mockDeletePatient(patientId: string): Promise<void> {
  await delay();
  const patient = getMockState().patients[patientId];
  if (!patient) {
    throw new ApiError('Paciente não encontrado.', 404);
  }
  const patientName = patient.fullName;
  removePatient(patientId);
  appendAuditLog({
    adminId: MOCK_IDS.therapistAdmin,
    adminName: 'Administrador',
    action: 'DELETE_PATIENT',
    targetType: 'Patient',
    targetId: patientId,
    metadata: { patientName },
  });
}

export async function mockTransferPatient(
  patientId: string,
  body: TransferPatientRequest,
): Promise<TransferPatientResponse> {
  await delay();
  const patient = getMockState().patients[patientId];
  if (!patient) {
    throw new ApiError('Paciente não encontrado.', 404);
  }
  if (patient.therapist.id === body.targetTherapistId) {
    throw new ApiError('O paciente já pertence a este fisioterapeuta.', 400);
  }
  const target = getMockState().therapistDetails[body.targetTherapistId];
  if (!target) {
    throw new ApiError('Fisioterapeuta de destino não encontrado.', 404);
  }

  const fromTherapistId = patient.therapist.id;
  const assessmentsUpdated = transferPatient(patientId, body.targetTherapistId);

  appendAuditLog({
    adminId: MOCK_IDS.therapistAdmin,
    adminName: 'Administrador',
    action: 'TRANSFER_PATIENT',
    targetType: 'Patient',
    targetId: patientId,
    metadata: {
      patientName: patient.fullName,
      fromTherapistId,
      toTherapistId: body.targetTherapistId,
    },
  });

  return {
    patientId,
    fromTherapistId,
    toTherapistId: body.targetTherapistId,
    assessmentsUpdated,
  };
}

export async function mockDownloadReport(assessmentId: string): Promise<Blob> {
  await delay();
  const assessment = getMockState().assessments[assessmentId];
  if (!assessment) {
    throw new ApiError('Avaliação não encontrada.', 404);
  }
  if (assessment.status !== 'FINALIZED') {
    throw new ApiError('Somente avaliações finalizadas podem gerar PDF.', 400);
  }

  appendAuditLog({
    adminId: MOCK_IDS.therapistAdmin,
    adminName: 'Administrador',
    action: 'DOWNLOAD_REPORT',
    targetType: 'Assessment',
    targetId: assessmentId,
    metadata: {},
  });

  const content = `Relatório STF (protótipo)\nAvaliação: ${assessment.instrumentCode}\nPaciente: ${assessment.patientId}\n`;
  return new Blob([content], { type: 'application/pdf' });
}

export async function mockListAuditLogs(action?: AdminAuditAction): Promise<AuditLogsResponse> {
  await delay();
  let data = [...getMockState().auditLogs];
  if (action) {
    data = data.filter((item) => item.action === action);
  }
  return {
    data,
    meta: {
      page: 1,
      limit: 25,
      total: data.length,
      totalPages: 1,
    },
  };
}

export async function mockRequestPasswordReset(_email: string): Promise<void> {
  void _email;
  await delay();
}

export async function mockRequestAdminAccess(
  values: AdminAccessRequestFormValues,
): Promise<MessageResponse> {
  await delay();
  appendAccessRequest(values.email, values.fullName);
  return {
    message:
      'Se os dados estiverem corretos, sua solicitação será analisada. Você receberá um e-mail quando houver uma resposta.',
  };
}

export async function mockChangePassword(
  _values: ChangePasswordRequest,
): Promise<MessageResponse> {
  void _values;
  await delay();
  return { message: 'Senha alterada com sucesso.' };
}

export async function mockVerifyResetCode(
  values: VerifyResetCodeFormValues,
): Promise<MessageResponse> {
  await delay();
  if (values.token !== '123456') {
    throw new ApiError('Código inválido ou expirado.', 400);
  }
  return { message: 'Código validado.' };
}

export async function mockResetPassword(
  values: ResetPasswordFormValues,
): Promise<MessageResponse> {
  await delay();
  if (values.token !== '123456') {
    throw new ApiError('Código inválido ou expirado.', 400);
  }
  return { message: 'Senha redefinida com sucesso.' };
}

export async function mockListAccessRequests(
  status: AdminAccessRequestStatus = 'PENDING',
): Promise<AccessRequestsListResponse> {
  await delay();
  const data = getMockState().accessRequests.filter((item) => item.status === status);
  return { data: structuredClone(data) };
}

export async function mockApproveAccessRequest(id: string): Promise<{ id: string }> {
  await delay();
  try {
    const request = resolveAccessRequest(id, 'APPROVED');
    return { id: request.id };
  } catch (error) {
    if (error instanceof Error && error.message === 'not_found') {
      throw new ApiError('Solicitação não encontrada.', 404);
    }
    throw new ApiError('Esta solicitação já foi resolvida.', 409);
  }
}

export async function mockRejectAccessRequest(id: string) {
  await delay();
  try {
    return resolveAccessRequest(id, 'REJECTED');
  } catch (error) {
    if (error instanceof Error && error.message === 'not_found') {
      throw new ApiError('Solicitação não encontrada.', 404);
    }
    throw new ApiError('Esta solicitação já foi resolvida.', 409);
  }
}
