import { useMemo, useState } from 'react';
import {
  buildYAxisTicks,
  formatDurationMs,
  type EvolutionChartPoint,
} from '@/features/assessments/chartConfig';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type EvolutionLineChartProps = {
  points: EvolutionChartPoint[];
  maxValue: number;
  title: string;
  explanation?: string;
};

/** Paridade com app mobile (`EvolutionChart`: 320×180). */
const MOBILE_CHART = {
  width: 320,
  height: 180,
  padding: { top: 16, right: 12, bottom: 32, left: 36 },
  strokeWidth: 2,
  hitRadius: 18,
  pointRadius: 5,
  activePointRadius: 7,
  ringRadius: 9,
  labelSize: 10,
} as const;

const DESKTOP_CHART = {
  width: 640,
  height: 260,
  padding: { top: 18, right: 18, bottom: 34, left: 40 },
  strokeWidth: 1.5,
  hitRadius: 14,
  pointRadius: 3,
  activePointRadius: 3.5,
  ringRadius: 7,
  labelSize: 9,
} as const;

const LINE_COLOR = 'var(--stf-text)';

export function EvolutionLineChart({
  points,
  maxValue,
  title,
  explanation,
}: EvolutionLineChartProps) {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const chart = isDesktop ? DESKTOP_CHART : MOBILE_CHART;
  const [activePointId, setActivePointId] = useState<string | null>(null);

  const { width: chartWidth, height: chartHeight, padding } = chart;
  const chartW = chartWidth - padding.left - padding.right;
  const chartH = chartHeight - padding.top - padding.bottom;
  const yTicks = buildYAxisTicks(maxValue);

  const coords = useMemo(
    () =>
      points.map((point, index) => {
        const x = padding.left + (index / Math.max(points.length - 1, 1)) * chartW;
        const y = padding.top + chartH - (point.value / maxValue) * chartH;
        return { x, y, ...point };
      }),
    [chartH, chartW, maxValue, padding.left, padding.top, points],
  );

  const polyline = coords.map((point) => `${point.x},${point.y}`).join(' ');
  const activePoint = coords.find((point) => point.id === activePointId) ?? null;

  function togglePoint(pointId: string) {
    setActivePointId((current) => (current === pointId ? null : pointId));
  }

  if (points.length < 2) return null;

  return (
    <figure className="stf-card mx-auto w-full max-w-[1040px] p-3 sm:p-5">
      <figcaption className="mb-1 text-sm font-semibold text-[var(--stf-text)]">
        {title}
      </figcaption>
      {explanation ? (
        <p className="mb-3 text-sm leading-relaxed text-[var(--stf-text-muted)] sm:mb-4">
          {explanation}
        </p>
      ) : null}

      <div className="w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label={`${title}. Clique nas bolinhas para ver o resumo da avaliação.`}
          className="mx-auto block h-auto w-full max-w-full"
          style={{ aspectRatio: `${chartWidth} / ${chartHeight}` }}
        >
          {yTicks.map((tick) => {
            const y = padding.top + chartH - (tick / maxValue) * chartH;
            return (
              <g key={`grid-${tick}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="var(--stf-border)"
                  strokeWidth={1}
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-[var(--stf-text-muted)]"
                  style={{ fontSize: chart.labelSize }}
                >
                  {tick}
                </text>
              </g>
            );
          })}

          <polyline
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth={chart.strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={polyline}
          />

          {coords.map((point) => {
            const isActive = point.id === activePointId;
            return (
              <g key={point.id}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={chart.hitRadius}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => togglePoint(point.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Avaliação ${point.label}: ${point.scoreSummary}. ${point.classificationLabel}`}
                  aria-pressed={isActive}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      togglePoint(point.id);
                    }
                  }}
                />
                {isActive ? (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={chart.ringRadius}
                    fill="none"
                    stroke={LINE_COLOR}
                    strokeWidth={1.25}
                    className="pointer-events-none"
                  />
                ) : null}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? chart.activePointRadius : chart.pointRadius}
                  fill={LINE_COLOR}
                  className="pointer-events-none"
                />
                <text
                  x={point.x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  style={{ fontSize: chart.labelSize }}
                  className={[
                    isActive
                      ? 'fill-[var(--stf-text)] font-semibold'
                      : 'fill-[var(--stf-text-muted)]',
                  ].join(' ')}
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {activePoint ? (
        <div
          className="mt-3 rounded-stf border border-[var(--stf-border)] bg-[var(--stf-page-bg)] px-3 py-3 sm:mt-4 sm:px-4"
          role="status"
        >
          <p className="text-sm font-semibold text-[var(--stf-text)]">
            Avaliação {activePoint.label}
          </p>
          <dl className="mt-2 grid gap-2 text-sm text-[var(--stf-text)] sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--stf-text-muted)]">
                Pontuação
              </dt>
              <dd className="font-medium">{activePoint.scoreSummary}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs uppercase tracking-wide text-[var(--stf-text-muted)]">
                Classificação
              </dt>
              <dd className="break-words font-medium">{activePoint.classificationLabel}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--stf-text-muted)]">
                Tempo de aplicação
              </dt>
              <dd className="font-medium">
                {activePoint.durationMs ? formatDurationMs(activePoint.durationMs) : '-'}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="mt-3 text-sm text-[var(--stf-text-muted)]">
          Clique em uma bolinha para ver o resumo daquela avaliação.
        </p>
      )}
    </figure>
  );
}
