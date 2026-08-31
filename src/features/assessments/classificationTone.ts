export type ClassificationTone = 'good' | 'warning' | 'risk';

export const CLASSIFICATION_TONE_COLOR: Record<ClassificationTone, string> = {
  good: 'var(--stf-secondary)',
  warning: 'var(--stf-warning)',
  risk: 'var(--stf-error)',
};

const CODE_TONE: Record<string, ClassificationTone> = {
  TUG_EXCELLENT: 'good',
  TUG_EXPECTED: 'warning',
  TUG_HIGH_RISK: 'risk',

  KATZ_STRATUM_0: 'good',
  KATZ_STRATUM_1: 'warning',
  KATZ_STRATUM_2: 'risk',
  KATZ_STRATUM_3: 'risk',
  KATZ_STRATUM_4: 'risk',
  KATZ_STRATUM_5: 'risk',
  KATZ_STRATUM_6: 'risk',

  BERG_LOW: 'good',
  BERG_MODERATE: 'warning',
  BERG_SEVERE: 'risk',

  TINETTI_LOW: 'good',
  TINETTI_MODERATE: 'warning',
  TINETTI_HIGH: 'risk',

  MEEM_ABOVE_CUTOFF: 'good',
  MEEM_BELOW_CUTOFF: 'risk',
};

type ResolveClassificationToneInput = {
  code?: string | null;
  label?: string | null;
  meta?: Record<string, unknown> | null;
};

function toneFromLegacyColor(color: string): ClassificationTone | null {
  const normalized = color.toLowerCase();
  if (normalized.includes('dc2626') || normalized.includes('ef4444')) return 'risk';
  if (normalized.includes('eab308') || normalized.includes('f59e0b')) return 'warning';
  if (normalized.includes('7cc5b4') || normalized.includes('22c55e')) return 'good';
  return null;
}

function toneFromLabel(label: string): ClassificationTone | null {
  const text = label.toLowerCase();

  if (
    text.includes('muito bom') ||
    text.includes('baixo risco') ||
    text.includes('independente em todas') ||
    text.includes('igual ou acima')
  ) {
    return 'good';
  }

  if (
    text.includes('abaixo do corte') ||
    text.includes('alto risco') ||
    text.includes('gravíssimo') ||
    text.includes('maior risco') ||
    text.includes('dependente em duas') ||
    text.includes('dependente em três') ||
    text.includes('dependente em quatro') ||
    text.includes('dependente em cinco') ||
    text.includes('dependente em todas')
  ) {
    return 'risk';
  }

  if (
    text.includes('esperado') ||
    text.includes('atenção clínica') ||
    text.includes('moderado') ||
    text.includes('dependente em uma')
  ) {
    return 'warning';
  }

  return null;
}

export function resolveClassificationTone({
  code,
  label,
  meta,
}: ResolveClassificationToneInput): ClassificationTone {
  if (code && CODE_TONE[code]) {
    return CODE_TONE[code];
  }

  if (typeof meta?.aboveCutoff === 'boolean') {
    return meta.aboveCutoff ? 'good' : 'risk';
  }

  if (typeof meta?.color === 'string') {
    const legacyTone = toneFromLegacyColor(meta.color);
    if (legacyTone) return legacyTone;
  }

  if (label) {
    const labelTone = toneFromLabel(label);
    if (labelTone) return labelTone;
  }

  return 'warning';
}

export function classificationToneColor(tone: ClassificationTone): string {
  return CLASSIFICATION_TONE_COLOR[tone];
}
