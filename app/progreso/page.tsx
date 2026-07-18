import { asc, desc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { weightLog, vitals, profile } from "@/db/schema";
import DbSetup from "../components/DbSetup";
import WeightChart from "../components/WeightChart";
import VitalsLogger from "../components/VitalsLogger";

export const dynamic = "force-dynamic";

export default async function ProgresoPage() {
  if (!isDbConfigured) return <DbSetup />;

  const [prof] = await db.select().from(profile).limit(1);
  const weights = await db.select().from(weightLog).orderBy(asc(weightLog.date));
  const recentVitals = await db
    .select()
    .from(vitals)
    .orderBy(desc(vitals.date))
    .limit(8);

  const waistPoints = weights.filter((w) => w.waistCm != null);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Progreso</h1>

      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-3">Peso (kg)</h2>
        <WeightChart
          points={weights.map((w) => ({ date: w.date, value: w.weightKg }))}
          goal={prof?.goalWeightKg ?? 80}
          color="var(--accent-2)"
        />
      </section>

      {waistPoints.length > 1 && (
        <section className="rounded-2xl p-4" style={card}>
          <h2 className="font-semibold mb-3">Cintura (cm)</h2>
          <WeightChart
            points={waistPoints.map((w) => ({ date: w.date, value: w.waistCm as number }))}
            color="var(--warn)"
          />
        </section>
      )}

      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-1">Presión y glucosa</h2>
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          Por tus antecedentes familiares, vale la pena vigilarlas. Registra cuando te las midas.
        </p>
        <VitalsLogger />
        {recentVitals.length > 0 && (
          <ul className="mt-3 space-y-2">
            {recentVitals.map((v) => (
              <li key={v.id} className="flex justify-between text-sm rounded-xl px-3 py-2" style={{ background: "var(--card-2)" }}>
                <span>
                  {v.systolic && v.diastolic ? `${v.systolic}/${v.diastolic} mmHg` : ""}
                  {v.glucose ? ` · ${v.glucose} mg/dL` : ""}
                </span>
                <span style={{ color: "var(--muted)" }}>{v.date}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
