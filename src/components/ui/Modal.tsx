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
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(15,23,42,0.45)] p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
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
          'flex max-h-[min(92dvh,720px)] w-full flex-col overflow-hidden rounded-t-stf-lg border border-[var(--stf-border)] bg-[var(--stf-surface)] shadow-stf-md outline-none sm:rounded-stf-lg',
          size === 'sm' ? 'sm:max-w-md' : 'sm:max-w-lg',
        ].join(' ')}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[var(--stf-border)] px-4 py-4 sm:px-5">
          <h2 id={titleId} className="pr-4 text-base font-semibold text-[var(--stf-text)] sm:text-lg">
            {title}
          </h2>
          {showClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-stf-sm text-[var(--stf-text-muted)] hover:bg-[var(--stf-page-bg)] hover:text-[var(--stf-text)]"
              aria-label="Fechar"
            >
              <IconClose />
            </button>
          ) : null}
        </div>
        <div
          className={[
            'overflow-y-auto px-4 py-5 text-sm text-[var(--stf-text-muted)] sm:px-5',
            centered ? 'text-center' : '',
          ].join(' ')}
        >
          {children}
        </div>
        {footer ? (
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[var(--stf-border)] px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
