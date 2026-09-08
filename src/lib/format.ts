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

/** Primeiros N tokens do nome + reticências (paridade com truncagem visual mobile). */
export function formatShortDisplayName(fullName: string, maxWords = 2): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fullName;
  if (parts.length <= maxWords) return parts.join(' ');
  return `${parts.slice(0, maxWords).join(' ')}…`;
}

/** Nome de arquivo de PDF — mesma regra do app mobile STF. */
export function buildAssessmentReportFilename(patientFullName: string): string {
  const cleaned = patientFullName
    .trim()
    .replace(/[/\\:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 100);

  const name = cleaned || 'Paciente';
  return `Relatório - ${name}.pdf`;
}
