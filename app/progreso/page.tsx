import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { weightLog, profile } from "@/db/schema";
import DbSetup from "../components/DbSetup";
import WeightChart from "../components/WeightChart";

export const dynamic = "force-dynamic";

export default async function ProgresoPage() {
  if (!isDbConfigured) return <DbSetup />;

  const [prof] = await db.select().from(profile).limit(1);
  const weights = await db.select().from(weightLog).orderBy(asc(weightLog.date));
  const waistPoints = weights.filter((w) => w.waistCm != null);

  const start = prof?.startWeightKg ?? 93.5;
  const current = weights[weights.length - 1]?.weightKg ?? start;
  const lost = start - current;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Progreso</h1>

      <section className="rounded-2xl p-4" style={card}>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-semibold">Peso (kg)</h2>
          {lost > 0 && (
            <span className="text-sm" style={{ color: "var(--good)" }}>
              −{lost.toFixed(1)} kg desde el inicio
            </span>
          )}
        </div>
        <WeightChart
          points={weights.map((w) => ({ date: w.date, value: w.weightKg }))}
          goal={prof?.goalWeightKg ?? 80}
          color="var(--accent-2)"
        />
      </section>

      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-3">Cintura (cm)</h2>
        {waistPoints.length > 1 ? (
          <WeightChart
            points={waistPoints.map((w) => ({ date: w.date, value: w.waistCm as number }))}
            color="var(--warn)"
          />
        ) : (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Mide tu cintura una vez por semana (a la altura del ombligo, relajado). Es el
            mejor indicador de que la barriga baja, incluso cuando la báscula se estanca.
            Regístrala junto con tu peso en Inicio.
          </p>
        )}
      </section>

      <section className="rounded-2xl p-4 text-sm leading-relaxed" style={card}>
        <h2 className="font-semibold mb-2">Cómo leer tu progreso</h2>
        <ul className="space-y-1.5" style={{ color: "var(--muted)" }}>
          <li>📉 El peso baja en escalones, no en línea recta: es normal.</li>
          <li>📏 Si el peso no se mueve pero la cintura baja, vas bien igual.</li>
          <li>🎯 Meta sana: 0.5–0.75 kg por semana.</li>
        </ul>
      </section>
    </main>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
