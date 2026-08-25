import type { ReactNode } from 'react';
import { IconShieldAlert } from '@/components/icons/AuthIcons';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  destructive = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      centered
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-[var(--stf-error)] text-[var(--stf-error)] hover:bg-[color-mix(in_srgb,var(--stf-error)_6%,var(--stf-surface))]"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            pill
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4">
        <IconShieldAlert
          className={[
            'size-14',
            destructive ? 'text-[var(--stf-error)]' : 'text-[var(--stf-primary)]',
          ].join(' ')}
        />
        <div className="text-sm text-[var(--stf-text)]">{description}</div>
      </div>
    </Modal>
  );
}
