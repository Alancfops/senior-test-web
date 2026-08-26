import {
  getAssessmentItemLabel,
  truncateQuestion,
} from '@/features/assessments/assessmentItemLabels';

export type AssessmentAnswerRow = {
  /** Nome curto do item (ex.: "Tomar banho"). */
  title: string;
  /** Início da pergunta / instrução aplicada. */
  question: string;
  value: string;
};

const TUG_ROWS: Array<{ key: string; title: string; question: string }> = [
  {
    key: 'trial1Sec',
    title: 'Ensaio 1',
    question: 'Tempo do primeiro ensaio do Timed Up and Go',
  },
  {
    key: 'trial2Sec',
    title: 'Ensaio 2',
    question: 'Tempo do segundo ensaio do Timed Up and Go',
  },
  {
    key: 'trial3Sec',
    title: 'Ensaio 3',
    question: 'Tempo do terceiro ensaio do Timed Up and Go',
  },
];

const CATEGORICAL_VALUE_LABELS: Record<string, string> = {
  independente: 'Independente',
  assistencia: 'Assistência',
  dependente: 'Dependente',
};

function formatScalar(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '');
  }
  if (typeof value === 'string') {
    return CATEGORICAL_VALUE_LABELS[value] ?? value;
  }
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }
  if (value == null) {
    return '-';
  }
  return String(value);
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toRow(key: string, value: unknown, valueSuffix = ''): AssessmentAnswerRow {
  const known = getAssessmentItemLabel(key);
  const title = known?.title ?? humanizeKey(key);
  const question = known
    ? truncateQuestion(known.question || known.title)
    : truncateQuestion(title);

  return {
    title,
    question,
    value: `${formatScalar(value)}${valueSuffix}`,
  };
}

/** Monta linhas legíveis a partir do payload clínico da API (sem recalcular scoring). */
export function mapAssessmentPayloadToAnswers(
  instrumentCode: string,
  payload: Record<string, unknown> | undefined,
): AssessmentAnswerRow[] {
  if (!payload || Object.keys(payload).length === 0) {
    return [];
  }

  const code = instrumentCode.toUpperCase();

  if (code === 'TUG') {
    return TUG_ROWS.filter((row) => payload[row.key] != null).map((row) => ({
      title: row.title,
      question: truncateQuestion(row.question),
      value: `${formatScalar(payload[row.key])} s`,
    }));
  }

  return Object.entries(payload)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .map(([key, value]) => toRow(key, value));
}
