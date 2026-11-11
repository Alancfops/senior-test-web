export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '-';
  const date = new Date(value);
  const datePart = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(date);
  const timePart = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(date);
  return `${datePart} ${timePart}`;
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

const NAME_PARTICLES = new Set(['da', 'de', 'do', 'das', 'dos', 'e']);

/** Dois primeiros nomes para saudação, sem reticências ("Ana de Souza Lima" → "Ana de Souza"). */
export function formatGreetingName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 2) return parts.join(' ');
  const end = NAME_PARTICLES.has(parts[1].toLowerCase()) ? 3 : 2;
  return parts.slice(0, end).join(' ');
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

/** "1 paciente" / "3 pacientes". */
export function formatCount(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Data local no formato `YYYY-MM-DD` (sem conversão para UTC). */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Semestre letivo (jan–jun ou jul–dez) que contém a data, em `YYYY-MM-DD`. */
export function getSemesterBounds(date: Date): { from: string; to: string } {
  const year = date.getFullYear();
  return date.getMonth() < 6
    ? { from: `${year}-01-01`, to: `${year}-06-30` }
    : { from: `${year}-07-01`, to: `${year}-12-31` };
}

function daysBetweenInclusive(from: string, to: string): number {
  const [fy, fm, fd] = from.split('-').map(Number);
  const [ty, tm, td] = to.split('-').map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000) + 1;
}

/**
 * Rótulo legível do período do relatório geral (ex.: "Últimos 30 dias", "2 meses",
 * "Este semestre"), usado no nome do arquivo PDF.
 */
export function describeGeneralReportPeriod(from: string, to: string, today: Date): string {
  const todayIso = toIsoDate(today);
  const semester = getSemesterBounds(today);
  if (from === semester.from && (to === todayIso || to === semester.to)) return 'Este semestre';

  const [fromYear, fromMonth, fromDay] = from.split('-').map(Number);
  const [toYear, toMonth, toDay] = to.split('-').map(Number);
  const lastDayOfToMonth = new Date(toYear, toMonth, 0).getDate();
  const isWholeMonths = fromDay === 1 && toDay === lastDayOfToMonth;
  if (isWholeMonths) {
    const months = (toYear - fromYear) * 12 + (toMonth - fromMonth) + 1;
    if (months === 6) return 'Semestre';
    return months === 1 ? '1 mês' : `${months} meses`;
  }

  const days = daysBetweenInclusive(from, to);
  const label = days === 1 ? '1 dia' : `${days} dias`;
  return to === todayIso ? `Últimos ${label}` : label;
}

/** Nome do PDF do relatório geral: "Relatório Geral - Últimos 30 dias.pdf". */
export function buildGeneralReportFilename(from: string, to: string, today: Date): string {
  return `Relatório Geral - ${describeGeneralReportPeriod(from, to, today)}.pdf`;
}

/** Período do relatório geral gravado no audit (`from`/`to` em `YYYY-MM-DD`), como `dd/mm/aaaa a dd/mm/aaaa`. */
export function formatGeneralReportPeriod(meta: Record<string, unknown>): string | null {
  const { from, to } = meta;
  if (typeof from !== 'string' || typeof to !== 'string') return null;
  const toLabel = (value: string) => value.split('-').reverse().join('/');
  return `${toLabel(from)} a ${toLabel(to)}`;
}
