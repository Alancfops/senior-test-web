export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '-';
  const date = new Date(value);
  const datePart = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(date);
  const timePart = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(date);
  return `${datePart} ${timePart}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value));
}

export function formatGender(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
