import { ConfirmModal } from '@/components/ui/ConfirmModal';

type DeletePatientModalProps = {
  open: boolean;
  patientName: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function DeletePatientModal({
  open,
  patientName,
  loading,
  onConfirm,
  onClose,
}: DeletePatientModalProps) {
  return (
    <ConfirmModal
      open={open}
      title="Excluir paciente"
      destructive
      confirmLabel="Excluir permanentemente"
      loading={loading}
      onConfirm={onConfirm}
      onClose={onClose}
      description={
        <>
          <p>
            Você está prestes a excluir <strong>{patientName}</strong> e todo o histórico
            clínico associado.
          </p>
          <p className="mt-2 text-[var(--stf-error)]">
            Esta ação é irreversível e será registrada na trilha de auditoria.
          </p>
        </>
      }
    />
  );
}
