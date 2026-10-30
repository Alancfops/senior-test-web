import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
} from '@/components/icons/ActionIcons';
import { Button } from '@/components/ui/Button';
import { getSemesterBounds, toIsoDate } from '@/lib/format';

/** Datas no formato `YYYY-MM-DD` (fuso local). */
type DateRange = { from: string; to: string };

type DateRangePickerProps = {
  label: string;
  from: string;
  to: string;
  /** Última data selecionável (`YYYY-MM-DD`). */
  max?: string;
  /** Tamanho máximo do período, em dias (inclusivo). */
  maxDays?: number;
  /** Texto do limite exibido ao usuário (ex.: "um semestre"); padrão: "N dias". */
  maxLabel?: string;
  onChange: (range: DateRange) => void;
};

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
function formatMonth(date: Date): string {
  const text = monthFormatter.format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const longDayFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });

function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDisplayDate(value: string): string {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function countDays(from: string, to: string): number {
  const ms = parseIsoDate(to).getTime() - parseIsoDate(from).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

function addDays(value: string, days: number): string {
  const date = parseIsoDate(value);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function buildPresets(today: Date, maxDays?: number): { label: string; range: DateRange }[] {
  const todayIso = toIsoDate(today);
  const currentSemester = getSemesterBounds(today);
  const previousSemester = getSemesterBounds(parseIsoDate(addDays(currentSemester.from, -1)));

  const presets = [
    ...[7, 30, 90].map((days) => ({
      label: `Últimos ${days} dias`,
      range: { from: addDays(todayIso, -(days - 1)), to: todayIso },
    })),
    { label: 'Este semestre', range: { from: currentSemester.from, to: todayIso } },
    { label: 'Semestre passado', range: previousSemester },
  ];

  return presets.filter(({ range }) => !maxDays || countDays(range.from, range.to) <= maxDays);
}

type MonthGridProps = {
  year: number;
  month: number;
  from: string | null;
  to: string | null;
  hover: string | null;
  max?: string;
  /** Janela permitida enquanto a data final ainda não foi escolhida. */
  windowStart: string | null;
  windowEnd: string | null;
  todayIso: string;
  onSelect: (day: string) => void;
  onHover: (day: string | null) => void;
};

function MonthGrid({
  year,
  month,
  from,
  to,
  hover,
  max,
  windowStart,
  windowEnd,
  todayIso,
  onSelect,
  onHover,
}: MonthGridProps) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const hoverInWindow = hover && (!windowEnd || hover <= windowEnd) ? hover : null;
  const rangeEnd = to ?? (from && hoverInWindow && hoverInWindow > from ? hoverInWindow : null);

  const cells: (string | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => toIsoDate(new Date(year, month, index + 1))),
  ];

  return (
    <div className="w-full sm:w-[17rem]">
      <div className="grid grid-cols-7 text-center text-xs font-medium text-[var(--stf-text-muted)]">
        {WEEKDAYS.map((weekday, index) => (
          <span key={index} className="py-1.5" aria-hidden>
            {weekday}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1" role="grid" aria-label={monthFormatter.format(new Date(year, month, 1))}>
        {cells.map((day, index) => {
          if (!day) return <span key={`blank-${index}`} />;

          const disabled = Boolean(
            (max && day > max) ||
              (windowStart && day < windowStart) ||
              (windowEnd && day > windowEnd),
          );
          const isStart = day === from;
          const isEnd = day === rangeEnd;
          const inRange = Boolean(from && rangeEnd && day > from && day < rangeEnd);
          const hasBand = Boolean(from && rangeEnd && from !== rangeEnd && (isStart || isEnd || inRange));
          const isToday = day === todayIso;

          return (
            <div
              key={day}
              className={[
                'flex justify-center',
                hasBand ? 'bg-[color-mix(in_srgb,var(--stf-primary)_10%,var(--stf-surface))]' : '',
                hasBand && isStart ? 'rounded-l-full' : '',
                hasBand && isEnd ? 'rounded-r-full' : '',
              ].join(' ')}
            >
              <button
                type="button"
                disabled={disabled}
                aria-pressed={isStart || isEnd}
                aria-label={longDayFormatter.format(parseIsoDate(day))}
                onClick={() => onSelect(day)}
                onMouseEnter={() => onHover(day)}
                onMouseLeave={() => onHover(null)}
                className={[
                  'flex aspect-square w-full max-w-[2.25rem] items-center justify-center rounded-full text-sm tabular-nums transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--stf-primary)]',
                  isStart || isEnd
                    ? 'bg-[var(--stf-primary)] font-semibold text-[var(--stf-on-primary)]'
                    : inRange
                      ? 'text-[var(--stf-primary-dark)] hover:bg-[color-mix(in_srgb,var(--stf-primary)_18%,var(--stf-surface))]'
                      : 'text-[var(--stf-text)] hover:bg-[var(--stf-page-bg)]',
                  isToday && !(isStart || isEnd) ? 'font-semibold ring-1 ring-inset ring-[var(--stf-primary)]' : '',
                  disabled ? 'cursor-not-allowed text-[var(--stf-placeholder)] opacity-50 hover:bg-transparent' : '',
                ].join(' ')}
              >
                {Number(day.slice(8))}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({
  label,
  from,
  to,
  max,
  maxDays,
  maxLabel,
  onChange,
}: DateRangePickerProps) {
  const triggerId = useId();
  const dialogId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState<string | null>(from);
  const [draftTo, setDraftTo] = useState<string | null>(to);
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState(() => {
    const date = parseIsoDate(to);
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  const today = new Date();
  const todayIso = toIsoDate(today);
  const presets = buildPresets(today, maxDays);
  const picking = Boolean(draftFrom && !draftTo && maxDays);
  const windowStart = picking && draftFrom ? addDays(draftFrom, -(maxDays! - 1)) : null;
  const windowEnd = picking && draftFrom ? addDays(draftFrom, maxDays! - 1) : null;

  // Exibe o mês final na coluna da direita (telas largas) para mostrar o período até "hoje".
  const leftMonth = new Date(view.year, view.month - 1, 1);
  const rightMonth = new Date(view.year, view.month, 1);
  const maxMonth = max ? parseIsoDate(max) : null;
  const canGoNext =
    !maxMonth ||
    rightMonth.getFullYear() < maxMonth.getFullYear() ||
    (rightMonth.getFullYear() === maxMonth.getFullYear() && rightMonth.getMonth() < maxMonth.getMonth());

  function openPicker() {
    setDraftFrom(from);
    setDraftTo(to);
    const date = parseIsoDate(to);
    setView({ year: date.getFullYear(), month: date.getMonth() });
    setOpen(true);
  }

  function closePicker() {
    setOpen(false);
    setHover(null);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function shiftMonth(delta: number) {
    setView(({ year, month }) => {
      const date = new Date(year, month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  function selectDay(day: string) {
    if (!draftFrom || draftTo) {
      setDraftFrom(day);
      setDraftTo(null);
      return;
    }
    if (day < draftFrom) {
      setDraftTo(draftFrom);
      setDraftFrom(day);
    } else {
      setDraftTo(day);
    }
  }

  function applyPreset(range: DateRange) {
    setDraftFrom(range.from);
    setDraftTo(range.to);
    const date = parseIsoDate(range.to);
    setView({ year: date.getFullYear(), month: date.getMonth() });
  }

  function apply() {
    if (!draftFrom) return;
    onChange({ from: draftFrom, to: draftTo ?? draftFrom });
    closePicker();
  }

  function onDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closePicker();
    }
  }

  const activePreset = presets.find(
    (preset) => preset.range.from === draftFrom && preset.range.to === draftTo,
  );
  const gridProps = {
    from: draftFrom,
    to: draftTo,
    hover,
    max,
    windowStart,
    windowEnd,
    todayIso,
    onSelect: selectDay,
    onHover: setHover,
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <label htmlFor={triggerId} className="text-sm font-medium text-[var(--stf-text)]">
        {label}
      </label>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={() => (open ? closePicker() : openPicker())}
        className={[
          'flex h-[var(--stf-row-height)] w-full items-center gap-3 rounded-stf-lg border bg-[var(--stf-surface)] px-3.5 text-left text-sm shadow-stf transition-colors sm:max-w-md',
          'focus:border-[var(--stf-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stf-primary)_20%,transparent)]',
          open
            ? 'border-[var(--stf-primary)] ring-2 ring-[color-mix(in_srgb,var(--stf-primary)_20%,transparent)]'
            : 'border-[var(--stf-border)] hover:border-[color-mix(in_srgb,var(--stf-primary)_35%,var(--stf-border))]',
        ].join(' ')}
      >
        <IconCalendar className="size-4 shrink-0 text-[var(--stf-primary)]" />
        <span className="min-w-0 flex-1 truncate font-medium tabular-nums text-[var(--stf-text)]">
          {formatDisplayDate(from)} <span className="text-[var(--stf-text-muted)]">até</span>{' '}
          {formatDisplayDate(to)}
        </span>
        <span className="hidden shrink-0 text-xs text-[var(--stf-text-muted)] sm:inline">
          {countDays(from, to)} dias
        </span>
        <IconChevronDown
          className={[
            'size-4 shrink-0 text-[var(--stf-text-muted)] transition-transform',
            open ? 'rotate-180 text-[var(--stf-primary)]' : '',
          ].join(' ')}
        />
      </button>

      {open ? (
        <div
          id={dialogId}
          role="dialog"
          aria-label={label}
          onKeyDown={onDialogKeyDown}
          className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-stf-lg border border-[var(--stf-border)] bg-[var(--stf-surface)] shadow-stf-md sm:w-auto"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="flex flex-wrap gap-1.5 border-b border-[var(--stf-border)] p-3 sm:w-44 sm:flex-col sm:flex-nowrap sm:border-b-0 sm:border-r">
              {presets.map((preset) => {
                const isActive = preset === activePreset;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.range)}
                    className={[
                      'whitespace-nowrap rounded-stf border border-[var(--stf-border)] px-3 py-1.5 text-left text-sm transition-colors sm:border-transparent sm:py-2',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--stf-primary)]',
                      isActive
                        ? 'bg-[color-mix(in_srgb,var(--stf-primary)_10%,var(--stf-surface))] font-medium text-[var(--stf-primary-dark)]'
                        : 'text-[var(--stf-text)] hover:bg-[var(--stf-page-bg)]',
                    ].join(' ')}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-label="Mês anterior"
                  onClick={() => shiftMonth(-1)}
                  className="flex size-8 items-center justify-center rounded-full text-[var(--stf-text-muted)] hover:bg-[var(--stf-page-bg)] hover:text-[var(--stf-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--stf-primary)]"
                >
                  <IconChevronLeft />
                </button>
                <div className="flex flex-1 justify-around text-sm font-semibold text-[var(--stf-text)]" aria-live="polite">
                  <span className="hidden xl:inline">{formatMonth(leftMonth)}</span>
                  <span>{formatMonth(rightMonth)}</span>
                </div>
                <button
                  type="button"
                  aria-label="Próximo mês"
                  disabled={!canGoNext}
                  onClick={() => shiftMonth(1)}
                  className="flex size-8 items-center justify-center rounded-full text-[var(--stf-text-muted)] hover:bg-[var(--stf-page-bg)] hover:text-[var(--stf-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--stf-primary)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <IconChevronRight />
                </button>
              </div>

              <div className="flex gap-6">
                <div className="hidden xl:block">
                  <MonthGrid year={leftMonth.getFullYear()} month={leftMonth.getMonth()} {...gridProps} />
                </div>
                <MonthGrid year={rightMonth.getFullYear()} month={rightMonth.getMonth()} {...gridProps} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[var(--stf-border)] bg-[var(--stf-page-bg)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--stf-text-muted)]" aria-live="polite">
              {draftFrom && draftTo ? (
                <>
                  <span className="font-medium tabular-nums text-[var(--stf-text)]">
                    {formatDisplayDate(draftFrom)} – {formatDisplayDate(draftTo)}
                  </span>{' '}
                  · {countDays(draftFrom, draftTo)} dias
                </>
              ) : draftFrom ? (
                maxDays
                  ? `Escolha a data final (até ${maxLabel ?? `${maxDays} dias`})`
                  : 'Escolha a data final'
              ) : (
                'Escolha a data inicial'
              )}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1 sm:flex-none" onClick={closePicker}>
                Cancelar
              </Button>
              <Button className="flex-1 sm:flex-none" disabled={!draftFrom || !draftTo} onClick={apply}>
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
