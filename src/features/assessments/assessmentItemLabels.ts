/** Rótulos de itens dos instrumentos (paridade com o app mobile, somente exibição). */

export type AssessmentItemLabel = {
  title: string;
  question: string;
};

export const ASSESSMENT_ITEM_LABELS: Record<string, AssessmentItemLabel> = {
  'berg_1': { title: 'Sentado — em pé', question: 'Levante-se. Tente não usar as mãos para se apoiar.' },
  'berg_10': { title: 'Olhar para trás', question: 'Vire-se para olhar diretamente atrás de você por cima do ombro esquerdo, sem tirar os pés do chão. Faça o mesmo por cima do ombro direito. O examinador pode posicionar um objeto diretamente atrás do paciente para estimular o movimento.' },
  'berg_11': { title: 'Girar 360°', question: 'Gire-se completamente. Pause. Gire-se no sentido contrário.' },
  'berg_12': { title: 'Pés alternados no degrau', question: 'Toque cada pé alternadamente no degrau/banquinho (4 vezes cada pé).' },
  'berg_13': { title: 'Um pé à frente', question: '(Demonstre para o paciente.) Coloque um pé diretamente à frente do outro, na mesma linha; se achar que não irá conseguir, coloque o pé um pouco mais à frente do outro e levemente para o lado.' },
  'berg_14': { title: 'Em pé sobre uma perna', question: 'Fique em pé sobre uma perna o máximo que conseguir.' },
  'berg_2': { title: 'Em pé sem apoio', question: 'Fique em pé por 2 minutos sem se apoiar.' },
  'berg_3': { title: 'Sentado sem apoio nas costas', question: 'Com os pés apoiados no chão ou num banquinho, fique sentado sem apoiar as costas, com os braços cruzados, por 2 minutos.' },
  'berg_4': { title: 'Em pé para sentado', question: 'Sente-se.' },
  'berg_5': { title: 'Transferência', question: 'Arrume as cadeiras perpendicularmente ou uma de frente para a outra para uma transferência em pivô. Peça ao paciente para transferir-se de uma cadeira com apoio de braço para uma sem apoio de braço, e vice-versa. Pode-se usar duas cadeiras (uma com e outra sem apoio de braço) ou uma cama e uma cadeira.' },
  'berg_6': { title: 'Em pé — olhos fechados', question: 'Fique em pé e feche os olhos por 10 segundos.' },
  'berg_7': { title: 'Em pé — pés juntos', question: 'Junte os pés e fique em pé sem se apoiar.' },
  'berg_8': { title: 'Alcançar à frente', question: 'Levante o braço a 90°. Estique os dedos e tente alcançar à frente o mais longe possível. O examinador posiciona a régua no fim da ponta dos dedos com o braço a 90°; ao esticar, os dedos não devem tocar a régua. Registre a distância alcançada na inclinação máxima. Quando possível, peça para usar ambos os braços para evitar rotação do tronco.' },
  'berg_9': { title: 'Pegar objeto do chão', question: 'Pegue o sapato/chinelo que está na frente dos seus pés.' },
  'katz_1': { title: 'Tomar banho', question: 'Avalie se o paciente toma banho (leito, banheira ou chuveiro) sem ajuda, com assistência parcial ou dependente.' },
  'katz_2': { title: 'Vestir-se', question: 'Inclui pegar roupas, vestir-se e manusear fechos ou órteses/próteses quando utilizadas.' },
  'katz_3': { title: 'Uso do vaso sanitário', question: 'Ida ao banheiro, higiene íntima e arrumação das roupas após eliminações.' },
  'katz_4': { title: 'Transferências', question: 'Deitar/levantar da cama e sentar/levantar da cadeira, com ou sem dispositivo de apoio.' },
  'katz_5': { title: 'Continência', question: 'Controle de micção e evacuação.' },
  'katz_6': { title: 'Alimentação', question: 'Alimentar-se, incluindo cortar carne ou passar manteiga quando necessário.' },
  'meem_atencao': { title: 'Atenção e cálculo', question: 'Sete seriado (100−7=93−7=86−7=79−7=72−7=65), interrompendo após cinco respostas, ou soletrar MUNDO de trás para frente. 1 ponto por resposta correta (máx. 5).' },
  'meem_evocacao': { title: 'Evocação (lembrança)', question: 'Peça as 3 palavras do bloco de Registro. 1 ponto por palavra lembrada.' },
  'meem_l1': { title: 'Linguagem — nomeação', question: 'Aponte um lápis e um relógio. Peça para nomear. 1 ponto por objeto correto.' },
  'meem_l2': { title: 'Linguagem — repetição', question: 'Peça para repetir: “nem aqui, nem ali, nem lá”.' },
  'meem_l3': { title: 'Linguagem — comando em 3 etapas', question: 'Pegue o papel com a mão direita, dobre ao meio e coloque na mesa. 1 ponto por etapa.' },
  'meem_l4': { title: 'Linguagem — leitura e obediência', question: 'Peça para ler e obedecer: FECHE OS OLHOS.' },
  'meem_l5': { title: 'Linguagem — escrita', question: 'Peça para escrever uma frase de sua própria autoria, com sujeito e objeto e que faça sentido (ignore erros de ortografia).' },
  'meem_l6': { title: 'Linguagem — cópia do desenho', question: 'Copie o desenho (interseção em quadrilátero com lados e ângulos preservados).' },
  'meem_or_1': { title: 'Orientação — dia da semana', question: 'Qual é o dia da semana?' },
  'meem_or_10': { title: 'Orientação — estado', question: 'Qual é o estado?' },
  'meem_or_2': { title: 'Orientação — dia do mês', question: 'Qual é o dia do mês?' },
  'meem_or_3': { title: 'Orientação — mês', question: 'Qual é o mês?' },
  'meem_or_4': { title: 'Orientação — ano', question: 'Qual é o ano?' },
  'meem_or_5': { title: 'Orientação — hora', question: 'Qual é a hora aproximada?' },
  'meem_or_6': { title: 'Orientação — local', question: 'Onde estamos? (local)' },
  'meem_or_7': { title: 'Orientação — instituição', question: 'Instituição (casa, rua)?' },
  'meem_or_8': { title: 'Orientação — bairro', question: 'Qual é o bairro?' },
  'meem_or_9': { title: 'Orientação — cidade', question: 'Qual é a cidade?' },
  'meem_registro': { title: 'Registro (memória imediata)', question: 'Mencione as palavras vaso, carro e tijolo, levando 1 segundo para cada uma. Peça para repetir. 1 ponto por palavra correta.' },
  'tinetti_1': { title: 'Equilíbrio sentado', question: 'paciente sentado na cadeira de exame.' },
  'tinetti_10': { title: 'Iniciação da marcha', question: 'paciente caminha no ritmo usual e depois rápido, com dispositivos usuais.' },
  'tinetti_11': { title: 'Comprimento e altura do passo', question: 'avalie comprimento e altura do passo de cada perna em balanceio (até 4 pontos no total).' },
  'tinetti_12': { title: 'Simetria do passo', question: 'passos direito e esquerdo simétricos.' },
  'tinetti_13': { title: 'Continuidade do passo', question: 'passos contínuos, sem paradas.' },
  'tinetti_14': { title: 'Desvio da linha reta', question: 'caminhada em linha reta (~3 m de comprimento por 30 cm de largura).' },
  'tinetti_15': { title: 'Tronco', question: 'oscilação do tronco e uso dos braços na marcha.' },
  'tinetti_16': { title: 'Base de apoio', question: 'distância entre calcanhares durante a marcha.' },
  'tinetti_2': { title: 'Levantando', question: 'capacidade de levantar da cadeira.' },
  'tinetti_3': { title: 'Tentativas de levantar', question: 'número de tentativas para levantar.' },
  'tinetti_4': { title: 'Imediatamente após levantar', question: 'primeiros 5 segundos em pé após levantar.' },
  'tinetti_5': { title: 'Equilíbrio em pé', question: 'estabilidade em pé, base de sustentação.' },
  'tinetti_6': { title: 'Teste dos três tempos', question: 'examinador empurra levemente o esterno; paciente com pés juntos.' },
  'tinetti_7': { title: 'Olhos fechados', question: 'equilíbrio em pé, pés juntos, olhos fechados.' },
  'tinetti_8': { title: 'Girando 360°', question: 'giro completo de 360 graus.' },
  'tinetti_9': { title: 'Sentando', question: 'sentar-se na cadeira com segurança.' },
};

const QUESTION_PREVIEW_MAX = 72;

export function truncateQuestion(text: string, max = QUESTION_PREVIEW_MAX): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max - 1);
  const cut = slice.lastIndexOf(' ');
  return `${(cut > 40 ? slice.slice(0, cut) : slice).trimEnd()}…`;
}

export function getAssessmentItemLabel(key: string): AssessmentItemLabel | null {
  return ASSESSMENT_ITEM_LABELS[key] ?? null;
}

