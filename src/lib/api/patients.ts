import { isMockMode } from '@/lib/api/config';
import { apiDelete, apiGet, apiPost } from '@/lib/api/client';
import { getAccessToken } from '@/lib/auth/session';
import { fetchTherapist, fetchTherapists } from '@/lib/api/therapists';
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
  PatientListItem,
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

/**
 * A API admin não expõe GET /admin/patients (lista global).
 * Agrega pacientes a partir do detalhe de cada fisioterapeuta clínico.
 */
export async function fetchPatients(): Promise<PatientsListResponse> {
  if (isMockMode()) {
    return mockListPatients();
  }

  const therapists = await fetchTherapists({ page: 1, limit: 100 });
  const details = await Promise.all(
    therapists.data.map((therapist) => fetchTherapist(therapist.id)),
  );

  const data: PatientListItem[] = details
    .flatMap((therapist) =>
      therapist.patients.map((patient) => ({
        id: patient.id,
        fullName: patient.fullName,
        age: patient.age,
        gender: patient.gender,
        therapistId: therapist.id,
        therapistName: therapist.fullName,
        assessmentCount: patient.assessmentCount,
        lastAssessmentAt: patient.lastAssessmentAt,
      })),
    )
    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'pt-BR'));

  return {
    data,
    meta: {
      page: 1,
      limit: data.length || 25,
      total: data.length,
      totalPages: 1,
    },
  };
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
