import { useEffect, useId, useRef, type ReactNode } from 'react';
import { IconClose } from '@/components/icons/AuthIcons';

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md';
  showClose?: boolean;
  centered?: boolean;
};

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = 'md',
  showClose = true,
  centered = false,
}: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.45)] p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[
          'w-full rounded-stf-lg border border-[var(--stf-border)] bg-[var(--stf-surface)] shadow-stf-md outline-none',
          size === 'sm' ? 'max-w-md' : 'max-w-lg',
        ].join(' ')}
      >
        <div className="flex items-start justify-between border-b border-[var(--stf-border)] px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-[var(--stf-text)]">
            {title}
          </h2>
          {showClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-stf-sm p-1 text-[var(--stf-text-muted)] hover:bg-[var(--stf-page-bg)] hover:text-[var(--stf-text)]"
              aria-label="Fechar"
            >
              <IconClose />
            </button>
          ) : null}
        </div>
        <div
          className={[
            'px-5 py-5 text-sm text-[var(--stf-text-muted)]',
            centered ? 'text-center' : '',
          ].join(' ')}
        >
          {children}
        </div>
        {footer ? (
          <div className="flex justify-end gap-3 border-t border-[var(--stf-border)] px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
