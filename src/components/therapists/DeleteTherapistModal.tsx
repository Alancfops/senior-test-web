import { ConfirmModal } from '@/components/ui/ConfirmModal';

type DeleteTherapistModalProps = {
  open: boolean;
  therapistName: string;
  patientCount: number;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function DeleteTherapistModal({
  open,
  therapistName,
  patientCount,
  loading,
  onConfirm,
  onClose,
}: DeleteTherapistModalProps) {
  const blocked = patientCount > 0;

  return (
    <ConfirmModal
      open={open}
      title="Excluir fisioterapeuta"
      destructive={!blocked}
      confirmLabel={blocked ? 'Entendi' : 'Excluir conta'}
      loading={loading}
      onConfirm={blocked ? onClose : onConfirm}
      onClose={onClose}
      description={
        blocked ? (
          <>
            <p>
              <strong>{therapistName}</strong> ainda possui {patientCount} paciente(s)
              vinculado(s).
            </p>
            <p className="mt-2">
              Transfira ou exclua os pacientes antes de remover esta conta.
            </p>
          </>
        ) : (
          <>
            <p>
              Você está prestes a excluir a conta de <strong>{therapistName}</strong>.
            </p>
            <p className="mt-2 text-[var(--stf-error)]">
              Esta ação é irreversível e será registrada na trilha de auditoria.
            </p>
          </>
        )
      }
    />
  );
}
