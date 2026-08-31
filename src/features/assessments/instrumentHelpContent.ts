import { CHART_IMPROVEMENT_HINT } from '@/features/assessments/chartConfig';
import type { ClassificationTone } from '@/features/assessments/classificationTone';
import { INSTRUMENT_LABELS } from '@/types/api';

export type InstrumentHelpClassification = {
  range: string;
  description: string;
  tone: ClassificationTone;
};

export type InstrumentHelpSection = {
  code: keyof typeof INSTRUMENT_LABELS;
  name: string;
  scoreSummary: string;
  classifications: InstrumentHelpClassification[];
  chartHint: string;
  notes?: string;
};

export const INSTRUMENT_HELP_SECTIONS: InstrumentHelpSection[] = [
  {
    code: 'TUG',
    name: INSTRUMENT_LABELS.TUG,
    scoreSummary:
      'Média aritmética dos tempos (em segundos) dos três ensaios do Timed Up and Go. Quanto menor o tempo, melhor tende a ser a mobilidade funcional.',
    classifications: [
      {
        range: 'Abaixo de 10 s',
        description: 'Desempenho funcional muito bom para idosos ativos.',
        tone: 'good',
      },
      {
        range: '10 s a 13,4 s',
        description:
          'Desempenho funcional esperado, com atenção clínica ao contexto.',
        tone: 'warning',
      },
      {
        range: '13,5 s ou mais',
        description: 'Maior risco de quedas em idosos da comunidade.',
        tone: 'risk',
      },
    ],
    chartHint: CHART_IMPROVEMENT_HINT.TUG,
    notes:
      'Dispositivos auxiliares informados na avaliação ficam registrados no laudo, mas não alteram automaticamente os cortes de classificação.',
  },
  {
    code: 'KATZ',
    name: INSTRUMENT_LABELS.KATZ,
    scoreSummary:
      'Contagem de atividades básicas de vida diária (ABVD) classificadas como dependentes. O estrato vai de 0 (independente em todas) a 6 (dependente em todas).',
    classifications: [
      { range: 'Estrato 0', description: 'Independente em todas as ABVD.', tone: 'good' },
      { range: 'Estrato 1', description: 'Dependente em uma atividade.', tone: 'warning' },
      { range: 'Estrato 2', description: 'Dependente em duas atividades.', tone: 'risk' },
      { range: 'Estrato 3', description: 'Dependente em três atividades.', tone: 'risk' },
      { range: 'Estrato 4', description: 'Dependente em quatro atividades.', tone: 'risk' },
      { range: 'Estrato 5', description: 'Dependente em cinco atividades.', tone: 'risk' },
      { range: 'Estrato 6', description: 'Dependente em todas as atividades.', tone: 'risk' },
    ],
    chartHint: CHART_IMPROVEMENT_HINT.KATZ,
  },
  {
    code: 'BERG',
    name: INSTRUMENT_LABELS.BERG,
    scoreSummary:
      'Soma das pontuações dos 14 itens da Escala de Berg (0 a 4 por item). Pontuação máxima: 56 pontos.',
    classifications: [
      { range: '0–20', description: 'Risco gravíssimo de quedas.', tone: 'risk' },
      { range: '21–40', description: 'Risco moderado a alto de quedas.', tone: 'warning' },
      { range: '41–56', description: 'Baixo risco de quedas.', tone: 'good' },
    ],
    chartHint: CHART_IMPROVEMENT_HINT.BERG,
  },
  {
    code: 'TINETTI',
    name: INSTRUMENT_LABELS.TINETTI,
    scoreSummary:
      'Soma dos escores de equilíbrio e marcha. Pontuação máxima: 28 pontos.',
    classifications: [
      { range: 'Abaixo de 19', description: 'Alto risco de quedas.', tone: 'risk' },
      { range: '19–24', description: 'Risco moderado de quedas.', tone: 'warning' },
      { range: '25–28', description: 'Baixo risco de quedas.', tone: 'good' },
    ],
    chartHint: CHART_IMPROVEMENT_HINT.TINETTI,
  },
  {
    code: 'MEEM',
    name: INSTRUMENT_LABELS.MEEM,
    scoreSummary:
      'Soma dos itens do Mini Exame do Estado Mental. Pontuação máxima: 30 pontos. A classificação usa o corte Brucki conforme a escolaridade registrada na sessão.',
    classifications: [
      {
        range: 'Igual ou acima do corte Brucki',
        description: 'Pontuação dentro do esperado para a escolaridade da sessão.',
        tone: 'good',
      },
      {
        range: 'Abaixo do corte Brucki',
        description: 'Pontuação abaixo do corte Brucki para a escolaridade registrada.',
        tone: 'risk',
      },
    ],
    chartHint: CHART_IMPROVEMENT_HINT.MEEM,
    notes:
      'Cortes Brucki por escolaridade: analfabeto 20; 1–4 anos 25; 5–8 anos 26,5; 9–11 anos 28; 12 anos ou mais 29. A interpretação clínica completa consta no laudo em PDF.',
  },
];

export const GENERAL_TEST_HELP = {
  finalized:
    'Somente avaliações finalizadas entram em contagens, histórico, gráficos e geração de PDF. Rascunhos existem apenas no aplicativo do fisioterapeuta.',
  scoreVsClassification:
    'A pontuação bruta (ex.: “24/28”, “Estrato 2”) é o valor numérico do teste. A classificação traduz esse valor em faixas clínicas — verde indica desempenho favorável, amarelo atenção clínica e vermelho risco ou abaixo do corte.',
  chart:
    'O gráfico de evolução exige pelo menos duas avaliações finalizadas do mesmo instrumento. A cor do indicador complementa, mas nunca substitui, o texto descritivo.',
  pdf:
    'Os relatórios em PDF são gerados pelo sistema. Cada download fica registrado na trilha de auditoria, sem guardar o arquivo clínico no navegador.',
};
