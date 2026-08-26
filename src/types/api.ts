export type TherapistRole = 'ADMIN' | 'THERAPIST';

export type AuthUser = {
  fullName: string;
  email: string;
  role: TherapistRole;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type TherapistListItem = {
  id: string;
  fullName: string;
  email: string;
  role: TherapistRole;
  createdAt: string;
  patientCount: number;
  assessmentCount: number;
  lastActivityAt: string | null;
};

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TherapistsListResponse = {
  data: TherapistListItem[];
  meta: PaginatedMeta;
};

export type TherapistPatientSummary = {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  assessmentCount: number;
  lastAssessmentAt: string | null;
};

export type TherapistDetail = {
  id: string;
  fullName: string;
  email: string;
  role: TherapistRole;
  createdAt: string;
  patients: TherapistPatientSummary[];
  meta: {
    patientCount: number;
    assessmentCount: number;
  };
};

export type PatientTherapistRef = {
  id: string;
  fullName: string;
  email: string;
};

export type PatientProfile = {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  contact: string;
  schoolingBand: string;
  avatarUrl: string | null;
  createdAt: string;
  therapist: PatientTherapistRef;
};

export type AssessmentResult = {
  rawValue: number;
  rawLabel: string;
  classificationLabel: string;
  classificationCode: string;
  classificationMeta: Record<string, unknown>;
  computedAt: string;
};

export type AssessmentListItem = {
  id: string;
  patientId: string;
  instrumentCode: string;
  status: 'DRAFT' | 'FINALIZED';
  startedAt: string;
  finalizedAt: string | null;
  therapistId: string;
  therapistName: string;
  result: AssessmentResult | null;
};

export type AssessmentsListResponse = {
  data: AssessmentListItem[];
};

export type AssessmentDetail = AssessmentListItem & {
  payload?: Record<string, unknown>;
  schoolingBandUsed: string | null;
  notesObservation: string | null;
};

export type TimeseriesPoint = {
  assessmentId: string;
  startedAt: string;
  finalizedAt: string;
  rawValue: number;
  rawLabel: string;
  classificationLabel: string;
  classificationCode: string;
};

export type TimeseriesResponse = {
  instrumentCode: string;
  points: TimeseriesPoint[];
  canShowChart: boolean;
};

export type TransferPatientRequest = {
  targetTherapistId: string;
};

export type TransferPatientResponse = {
  patientId: string;
  fromTherapistId: string;
  toTherapistId: string;
  assessmentsUpdated: number;
};

export type AdminAuditAction =
  | 'DELETE_PATIENT'
  | 'TRANSFER_PATIENT'
  | 'DELETE_THERAPIST'
  | 'DOWNLOAD_REPORT';

export type AuditLogItem = {
  id: string;
  adminId: string;
  adminName: string;
  action: AdminAuditAction;
  targetType: 'Patient' | 'Therapist' | 'Assessment';
  targetId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type AuditLogsResponse = {
  data: AuditLogItem[];
  meta: PaginatedMeta;
};

export type PatientListItem = {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  therapistId: string;
  therapistName: string;
  assessmentCount: number;
  lastAssessmentAt: string | null;
};

export type PatientsListResponse = {
  data: PatientListItem[];
  meta: PaginatedMeta;
};

export type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
};

export const INSTRUMENT_LABELS: Record<string, string> = {
  TUG: 'TUG',
  KATZ: 'Katz',
  BERG: 'Berg',
  TINETTI: 'Tinetti',
  MEEM: 'MEEM',
};

export const SCHOOLING_LABELS: Record<string, string> = {
  '0_anos': 'Analfabeto',
  '1_4_anos': '1–4 anos',
  '5_8_anos': '5–8 anos',
  '9_anos_ou_mais': '9 anos ou mais',
};

export const AUDIT_ACTION_LABELS: Record<AdminAuditAction, string> = {
  DELETE_PATIENT: 'Exclusão de paciente',
  TRANSFER_PATIENT: 'Transferência de paciente',
  DELETE_THERAPIST: 'Exclusão de fisioterapeuta',
  DOWNLOAD_REPORT: 'Download de relatório',
};
