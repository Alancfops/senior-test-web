import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deletePatient,
  fetchAssessment,
  fetchPatient,
  fetchPatients,
  fetchPatientAssessments,
  fetchTimeseries,
  transferPatientRequest,
} from '@/lib/api/patients';

export function usePatientsList() {
  return useQuery({
    queryKey: ['admin', 'patients'],
    queryFn: () => fetchPatients(),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['admin', 'patients', id],
    queryFn: () => fetchPatient(id),
    enabled: Boolean(id),
  });
}

export function usePatientAssessments(patientId: string) {
  return useQuery({
    queryKey: ['admin', 'patients', patientId, 'assessments'],
    queryFn: () => fetchPatientAssessments(patientId),
    enabled: Boolean(patientId),
  });
}

export function useAssessment(patientId: string, assessmentId: string) {
  return useQuery({
    queryKey: ['admin', 'patients', patientId, 'assessments', assessmentId],
    queryFn: () => fetchAssessment(patientId, assessmentId),
    enabled: Boolean(patientId && assessmentId),
  });
}

export function useTimeseries(patientId: string, instrumentCode: string | null) {
  return useQuery({
    queryKey: ['admin', 'patients', patientId, 'timeseries', instrumentCode],
    queryFn: () => fetchTimeseries(patientId, instrumentCode!),
    enabled: Boolean(patientId && instrumentCode),
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) => deletePatient(patientId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}

export function useTransferPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      targetTherapistId,
    }: {
      patientId: string;
      targetTherapistId: string;
    }) => transferPatientRequest(patientId, { targetTherapistId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}
