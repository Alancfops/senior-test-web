import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type SelectHTMLAttributes,
} from 'react';
import { IconCheck, IconChevronDown } from '@/components/icons/ActionIcons';

type SelectOption = { value: string; label: string };

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  label: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      label,
      error,
      hint,
      options,
      placeholder = 'Selecione…',
      id,
      name,
      value,
      defaultValue,
      disabled,
      className = '',
      onChange,
      onBlur,
      required,
      ...rest
    },
    ref,
  ) {
    const listboxId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);
    const [open, setOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [internalValue, setInternalValue] = useState(() =>
      value !== undefined
        ? String(value)
        : defaultValue !== undefined
          ? String(defaultValue)
          : (options[0]?.value ?? ''),
    );

    useImperativeHandle(ref, () => hiddenSelectRef.current as HTMLSelectElement);

    const selectId = id ?? name ?? listboxId;

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(String(value));
      }
    }, [value]);

    useEffect(() => {
      if (open) return;
      if (value !== undefined) return;
      const hiddenValue = hiddenSelectRef.current?.value;
      if (hiddenValue !== undefined && hiddenValue !== internalValue) {
        setInternalValue(hiddenValue);
      }
    }, [open, value, internalValue]);

    const resolvedValue = value !== undefined ? String(value) : internalValue;

    const selectedOption =
      options.find((option) => option.value === resolvedValue) ?? null;

    const emitChange = useCallback(
      (nextValue: string) => {
        if (!hiddenSelectRef.current) return;

        hiddenSelectRef.current.value = nextValue;

        const event = new Event('change', { bubbles: true });
        hiddenSelectRef.current.dispatchEvent(event);

        onChange?.({
          target: hiddenSelectRef.current,
          currentTarget: hiddenSelectRef.current,
        } as ChangeEvent<HTMLSelectElement>);
      },
      [onChange],
    );

    const selectOption = useCallback(
      (nextValue: string) => {
        setInternalValue(nextValue);
        emitChange(nextValue);
        setOpen(false);
        hiddenSelectRef.current?.focus();
      },
      [emitChange],
    );

    useEffect(() => {
      if (!open) return;

      const selectedIndex = options.findIndex((option) => option.value === resolvedValue);
      setHighlightIndex(selectedIndex >= 0 ? selectedIndex : 0);

      const onPointerDown = (event: MouseEvent) => {
        if (!containerRef.current?.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', onPointerDown);
      return () => document.removeEventListener('mousedown', onPointerDown);
    }, [open, options, resolvedValue]);

    const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!open) {
            setOpen(true);
            return;
          }
          setHighlightIndex((index) => Math.min(index + 1, options.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (!open) {
            setOpen(true);
            return;
          }
          setHighlightIndex((index) => Math.max(index - 1, 0));
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (open) {
            const option = options[highlightIndex];
            if (option) selectOption(option.value);
          } else {
            setOpen(true);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setOpen(false);
          break;
        default:
          break;
      }
    };

    return (
      <div className={['flex flex-col gap-1.5', className].filter(Boolean).join(' ')}>
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--stf-text)]">
          {label}
        </label>

        <div ref={containerRef} className="relative">
          <button
            id={selectId}
            type="button"
            role="combobox"
            aria-controls={listboxId}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-invalid={Boolean(error)}
            aria-describedby={
              [error ? `${selectId}-error` : undefined, hint ? `${selectId}-hint` : undefined]
                .filter(Boolean)
                .join(' ') || undefined
            }
            disabled={disabled || options.length === 0}
            onClick={() => setOpen((current) => !current)}
            onKeyDown={onTriggerKeyDown}
            onBlur={(event) => {
              if (!containerRef.current?.contains(event.relatedTarget as Node)) {
                setOpen(false);
                onBlur?.({
                  target: hiddenSelectRef.current as HTMLSelectElement,
                  currentTarget: hiddenSelectRef.current as HTMLSelectElement,
                } as FocusEvent<HTMLSelectElement>);
              }
            }}
            className={[
              'flex h-[var(--stf-row-height)] w-full items-center justify-between gap-3 rounded-stf-lg border bg-[var(--stf-surface)] px-3.5 text-left text-sm shadow-stf transition-colors',
              'focus:border-[var(--stf-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stf-primary)_20%,transparent)]',
              open ? 'border-[var(--stf-primary)] ring-2 ring-[color-mix(in_srgb,var(--stf-primary)_20%,transparent)]' : '',
              error ? 'border-[var(--stf-error)]' : 'border-[var(--stf-border)]',
              disabled || options.length === 0 ? 'cursor-not-allowed opacity-60' : 'hover:border-[color-mix(in_srgb,var(--stf-primary)_35%,var(--stf-border))]',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span
              className={[
                'truncate',
                selectedOption ? 'font-medium text-[var(--stf-text)]' : 'text-[var(--stf-placeholder)]',
              ].join(' ')}
            >
              {selectedOption?.label ?? placeholder}
            </span>
            <IconChevronDown
              className={[
                'size-4 shrink-0 text-[var(--stf-text-muted)] transition-transform',
                open ? 'rotate-180 text-[var(--stf-primary)]' : '',
              ].join(' ')}
            />
          </button>

          {open && options.length > 0 ? (
            <ul
              id={listboxId}
              role="listbox"
              aria-label={label}
              className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-stf-lg border border-[var(--stf-border)] bg-[var(--stf-surface)] p-1.5 shadow-stf-md"
            >
              {options.map((option, index) => {
                const isSelected = option.value === resolvedValue;
                const isHighlighted = index === highlightIndex;

                return (
                  <li key={option.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setHighlightIndex(index)}
                      onClick={() => selectOption(option.value)}
                      className={[
                        'flex w-full items-center justify-between gap-3 rounded-stf px-3 py-2.5 text-left text-sm transition-colors',
                        isSelected
                          ? 'bg-[color-mix(in_srgb,var(--stf-primary)_10%,var(--stf-surface))] font-medium text-[var(--stf-primary-dark)]'
                          : isHighlighted
                            ? 'bg-[var(--stf-page-bg)] text-[var(--stf-text)]'
                            : 'text-[var(--stf-text)] hover:bg-[var(--stf-page-bg)]',
                      ].join(' ')}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected ? (
                        <IconCheck className="size-4 shrink-0 text-[var(--stf-primary)]" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <select
            ref={hiddenSelectRef}
            name={name}
            value={resolvedValue}
            required={required}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden
            className="sr-only"
            onChange={onChange}
            {...rest}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hint ? (
          <p id={`${selectId}-hint`} className="text-xs text-[var(--stf-text-muted)]">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={`${selectId}-error`} role="alert" className="text-xs text-[var(--stf-error)]">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
