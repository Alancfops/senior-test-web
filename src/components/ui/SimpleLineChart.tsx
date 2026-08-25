import type { TimeseriesPoint } from '@/types/api';

type SimpleLineChartProps = {
  points: TimeseriesPoint[];
  title: string;
};

export function SimpleLineChart({ points, title }: SimpleLineChartProps) {
  if (points.length < 2) return null;

  const width = 560;
  const height = 220;
  const padding = { top: 24, right: 24, bottom: 36, left: 44 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const values = points.map((p) => p.rawValue);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = points.map((point, index) => {
    const x = padding.left + (index / (points.length - 1)) * innerWidth;
    const y =
      padding.top + innerHeight - ((point.rawValue - min) / range) * innerHeight;
    return { x, y, point };
  });

  const polyline = coords.map(({ x, y }) => `${x},${y}`).join(' ');

  return (
    <figure className="stf-card p-4">
      <figcaption className="mb-3 text-sm font-semibold text-[var(--stf-text)]">
        {title}
      </figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Gráfico de evolução: ${title}`}
        className="h-auto w-full max-w-full"
      >
        <line
          x1={padding.left}
          y1={padding.top + innerHeight}
          x2={width - padding.right}
          y2={padding.top + innerHeight}
          stroke="var(--stf-border)"
        />
        <polyline
          fill="none"
          stroke="var(--stf-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={polyline}
        />
        {coords.map(({ x, y, point }) => (
          <g key={point.assessmentId}>
            <circle cx={x} cy={y} r="5" fill="var(--stf-primary)" />
            <title>{`${point.rawLabel} — ${point.classificationLabel}`}</title>
          </g>
        ))}
      </svg>
    </figure>
  );
}
