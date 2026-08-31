import type { TimeseriesPoint } from '@/types/api';

export type ChartInstrumentCode = 'TUG' | 'KATZ' | 'BERG' | 'TINETTI' | 'MEEM';

/** Escala Y por instrumento (paridade RF012 / app mobile). */
export const CHART_MAX_VALUE: Record<ChartInstrumentCode, number> = {
  TUG: 20,
  KATZ: 6,
  BERG: 90,
  TINETTI: 28,
  MEEM: 30,
};

export const CHART_IMPROVEMENT_HINT: Record<ChartInstrumentCode, string> = {
  TUG: 'O gráfico mostra a média dos tempos do TUG ao longo das avaliações. Para este instrumento, a queda da curva costuma indicar melhora funcional (o paciente leva menos segundos para concluir o percurso).',
  KATZ: 'O gráfico acompanha o estrato do Índice de Katz. A queda da curva costuma indicar melhora (menos atividades de vida diária classificadas como dependentes).',
  BERG: 'O gráfico acompanha a pontuação da Escala de Berg. A subida da curva costuma indicar melhora do equilíbrio e menor risco de queda.',
  TINETTI: 'O gráfico acompanha a pontuação de Tinetti (equilíbrio e marcha). A subida da curva costuma indicar melhora do desempenho motor.',
  MEEM: 'O gráfico acompanha a pontuação do MEEM. A subida da curva costuma indicar melhor desempenho cognitivo no rastreio.',
};

export const CHART_EMPTY_MESSAGE =
  'São necessárias pelo menos duas avaliações finalizadas do mesmo instrumento para exibir o gráfico.';

export function isChartInstrumentCode(code: string): code is ChartInstrumentCode {
  return code in CHART_MAX_VALUE;
}

export function getChartMaxValue(
  code: ChartInstrumentCode,
  points: readonly { value: number }[],
): number {
  const configured = CHART_MAX_VALUE[code];
  if (code === 'TUG' && points.length > 0) {
    const peak = Math.max(...points.map((point) => point.value));
    return Math.max(configured, Math.ceil(peak * 1.2));
  }
  return configured;
}

export function buildYAxisTicks(maxValue: number): number[] {
  const step = maxValue / 3;
  return [0, step, step * 2, maxValue].map((value) => Math.round(value));
}

export function formatChartDateLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
    .toUpperCase();
  return `${day}/${month}`;
}

export function formatDurationMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export type EvolutionChartPoint = {
  id: string;
  label: string;
  value: number;
  scoreSummary: string;
  classificationLabel: string;
  classificationCode: string;
  durationMs?: number;
};

export function mapTimeseriesToChartPoints(
  points: TimeseriesPoint[],
): EvolutionChartPoint[] {
  return points.map((point) => {
    const durationMs =
      new Date(point.finalizedAt).getTime() - new Date(point.startedAt).getTime();

    return {
      id: point.assessmentId,
      label: formatChartDateLabel(point.finalizedAt),
      value: point.rawValue,
      scoreSummary: point.rawLabel,
      classificationLabel: point.classificationLabel,
      classificationCode: point.classificationCode,
      durationMs: durationMs > 0 ? durationMs : undefined,
    };
  });
}
