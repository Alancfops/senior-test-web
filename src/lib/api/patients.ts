import { isMockMode } from '@/lib/api/config';
import { apiDelete, apiGet, apiPost } from '@/lib/api/client';
import { getAccessToken } from '@/lib/auth/session';
import {
  mockDeletePatient,
  mockDownloadReport,
  mockGetAssessment,
  mockGetPatient,
  mockGetTimeseries,
  mockListAssessments,
  mockListPatients,
  mockTransferPatient,
} from '@/mocks/mockApi';
import type {
  AssessmentDetail,
  AssessmentsListResponse,
  PatientProfile,
  PatientsListResponse,
  TimeseriesResponse,
  TransferPatientRequest,
  TransferPatientResponse,
} from '@/types/api';
import { ApiError, toApiError } from '@/lib/api/errors';

export async function fetchPatient(id: string): Promise<PatientProfile> {
  if (isMockMode()) {
    return mockGetPatient(id);
  }
  return apiGet<PatientProfile>(`/admin/patients/${id}`);
}

export async function fetchPatients(): Promise<PatientsListResponse> {
  if (isMockMode()) {
    return mockListPatients();
  }
  throw new ApiError('Listagem global de pacientes ainda não disponível na API.', 501);
}

export async function fetchPatientAssessments(patientId: string): Promise<AssessmentsListResponse> {
  if (isMockMode()) {
    return mockListAssessments(patientId);
  }
  return apiGet<AssessmentsListResponse>(`/admin/patients/${patientId}/assessments`);
}

export async function fetchAssessment(
  patientId: string,
  assessmentId: string,
): Promise<AssessmentDetail> {
  if (isMockMode()) {
    return mockGetAssessment(patientId, assessmentId);
  }
  return apiGet<AssessmentDetail>(
    `/admin/patients/${patientId}/assessments/${assessmentId}`,
  );
}

export async function fetchTimeseries(
  patientId: string,
  instrumentCode: string,
): Promise<TimeseriesResponse> {
  if (isMockMode()) {
    return mockGetTimeseries(patientId, instrumentCode);
  }
  return apiGet<TimeseriesResponse>(
    `/admin/patients/${patientId}/instruments/${instrumentCode}/timeseries`,
  );
}

export async function deletePatient(patientId: string): Promise<void> {
  if (isMockMode()) {
    return mockDeletePatient(patientId);
  }
  await apiDelete(`/admin/patients/${patientId}`);
}

export async function transferPatientRequest(
  patientId: string,
  body: TransferPatientRequest,
): Promise<TransferPatientResponse> {
  if (isMockMode()) {
    return mockTransferPatient(patientId, body);
  }
  return apiPost<TransferPatientResponse>(`/admin/patients/${patientId}/transfer`, body);
}

export async function downloadAssessmentReport(assessmentId: string): Promise<Blob> {
  if (isMockMode()) {
    return mockDownloadReport(assessmentId);
  }

  const baseUrl = import.meta.env.VITE_STF_API_URL?.replace(/\/$/, '');
  const token = getAccessToken();
  if (!baseUrl) {
    throw new ApiError('API não configurada.', 0);
  }

  const response = await fetch(`${baseUrl}/admin/reports/assessments/${assessmentId}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  return response.blob();
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
