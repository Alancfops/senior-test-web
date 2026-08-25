import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SelectField } from '@/components/ui/SelectField';

type TransferPatientModalProps = {
  open: boolean;
  patientName: string;
  fromTherapistName: string;
  therapistOptions: Array<{ value: string; label: string }>;
  loading?: boolean;
  onConfirm: (targetTherapistId: string) => void;
  onClose: () => void;
};

type TransferForm = {
  targetTherapistId: string;
};

export function TransferPatientModal({
  open,
  patientName,
  fromTherapistName,
  therapistOptions,
  loading,
  onConfirm,
  onClose,
}: TransferPatientModalProps) {
  const { register, handleSubmit, reset, watch } = useForm<TransferForm>({
    defaultValues: { targetTherapistId: therapistOptions[0]?.value ?? '' },
  });

  useEffect(() => {
    if (open) {
      reset({ targetTherapistId: therapistOptions[0]?.value ?? '' });
    }
  }, [open, therapistOptions, reset]);

  const targetId = watch('targetTherapistId');
  const targetLabel =
    therapistOptions.find((option) => option.value === targetId)?.label ?? '—';

  return (
    <Modal
      open={open}
      title="Transferir paciente"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit((values) => onConfirm(values.targetTherapistId))}
            loading={loading}
            disabled={!valuesReady(therapistOptions, targetId)}
          >
            Confirmar transferência
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit((values) => onConfirm(values.targetTherapistId))}>
        <p className="text-sm text-[var(--stf-text)]">
          Transferir <strong>{patientName}</strong> de <strong>{fromTherapistName}</strong> para
          outro fisioterapeuta. Todo o histórico clínico será mantido.
        </p>

        <SelectField
          label="Fisioterapeuta de destino"
          options={therapistOptions}
          placeholder="Selecione o fisioterapeuta"
          value={targetId}
          {...register('targetTherapistId', { required: true })}
        />

        <div className="mt-1 rounded-stf-lg border border-[color-mix(in_srgb,var(--stf-primary)_18%,var(--stf-border))] bg-[color-mix(in_srgb,var(--stf-primary)_5%,var(--stf-surface))] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--stf-primary-dark)]">
            Resumo da transferência
          </p>
          <p className="mt-1 text-sm text-[var(--stf-text)]">
            <strong>{fromTherapistName}</strong>
            <span className="mx-2 text-[var(--stf-text-muted)]">→</span>
            <strong>{targetLabel}</strong>
          </p>
        </div>
      </form>
    </Modal>
  );
}

function valuesReady(
  options: Array<{ value: string; label: string }>,
  targetId: string,
): boolean {
  return options.length > 0 && Boolean(targetId);
}
