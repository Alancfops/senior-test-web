import { IconSearch } from '@/components/icons/AuthIcons';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = 'Pesquisar…',
  label = 'Pesquisar',
  id = 'search',
}: SearchInputProps) {
  return (
    <div className="relative w-full min-w-[220px] max-w-xs">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--stf-text-muted)]" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-[var(--stf-row-height)] w-full rounded-stf-lg border border-[var(--stf-border)] bg-[var(--stf-surface)] pl-9 pr-3 text-sm text-[var(--stf-text)] shadow-stf placeholder:text-[var(--stf-placeholder)] focus:border-[var(--stf-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stf-primary)_20%,transparent)]"
      />
    </div>
  );
}
