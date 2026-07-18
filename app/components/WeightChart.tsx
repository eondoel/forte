// Gráfica de línea simple en SVG (sin librerías externas).
export default function WeightChart({
  points,
  goal,
  color = "var(--accent-2)",
}: {
  points: { date: string; value: number }[];
  goal?: number;
  color?: string;
}) {
  if (points.length === 0) {
    return <p className="text-sm" style={{ color: "var(--muted)" }}>Aún no hay registros. Registra tu peso en Inicio.</p>;
  }

  const W = 320;
  const H = 140;
  const pad = 24;

  const values = points.map((p) => p.value);
  const min = Math.min(...values, goal ?? Infinity) - 1;
  const max = Math.max(...values, goal ?? -Infinity) + 1;
  const range = Math.max(1, max - min);

  const x = (i: number) =>
    points.length === 1 ? W / 2 : pad + (i / (points.length - 1)) * (W - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / range) * (H - pad * 2);

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.value)}`).join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const delta = last.value - first.value;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
        {goal != null && (
          <line
            x1={pad}
            x2={W - pad}
            y1={y(goal)}
            y2={y(goal)}
            stroke="var(--good)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        )}
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.value)} r="3" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between text-xs mt-1" style={{ color: "var(--muted)" }}>
        <span>{first.value.toFixed(1)}</span>
        <span style={{ color: delta <= 0 ? "var(--good)" : "var(--accent-2)" }}>
          {delta <= 0 ? "▼" : "▲"} {Math.abs(delta).toFixed(1)} kg
        </span>
        <span>{last.value.toFixed(1)}</span>
      </div>
    </div>
  );
}
