import { asc, gte, sql as dsql } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { weightLog, profile, meal, walk, workoutSession, activeEnergy } from "@/db/schema";
import { maintenanceKcal, exerciseKcal, kgFromKcal } from "@/lib/energy";
import { MILESTONES, shortDate } from "@/lib/milestones";
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
  const currentWaist = waistPoints[waistPoints.length - 1]?.waistCm ?? null;

  // Metas: la próxima es la primera que aún no logras (por peso).
  const nextIdx = MILESTONES.findIndex((m) => current > m.targetKg);

  // Avance por calorías: déficit acumulado en los días con comidas registradas (últimos 30).
  const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const mealDays = await db
    .select({ date: meal.date, kcal: dsql<number>`coalesce(sum(${meal.calories}),0)` })
    .from(meal)
    .where(gte(meal.date, since))
    .groupBy(meal.date);
  const walkDays = await db
    .select({ date: walk.date, min: dsql<number>`coalesce(sum(${walk.minutes}),0)` })
    .from(walk)
    .where(gte(walk.date, since))
    .groupBy(walk.date);
  const sessDays = await db
    .select({ date: workoutSession.date, n: dsql<number>`count(*)` })
    .from(workoutSession)
    .where(gte(workoutSession.date, since))
    .groupBy(workoutSession.date);
  const energyDays = await db
    .select({ date: activeEnergy.date, kcal: activeEnergy.kcal })
    .from(activeEnergy)
    .where(gte(activeEnergy.date, since));

  const walkMap = new Map(walkDays.map((r) => [r.date, Number(r.min)]));
  const sessMap = new Map(sessDays.map((r) => [r.date, Number(r.n)]));
  const energyMap = new Map(energyDays.map((r) => [r.date, Number(r.kcal)]));
  const base = maintenanceKcal(current, prof?.heightCm ?? 175, prof?.birthYear ?? 1986);

  let totalDeficit = 0;
  let loggedDays = 0;
  for (const day of mealDays) {
    const consumed = Number(day.kcal);
    if (consumed <= 0) continue;
    loggedDays++;
    // Calorías activas reales del Watch si existen; si no, estimación.
    const active = energyMap.get(day.date) ?? 0;
    const ex = active > 0 ? active : exerciseKcal(walkMap.get(day.date) ?? 0, sessMap.get(day.date) ?? 0);
    totalDeficit += base + ex - consumed;
  }
  const estKg = kgFromKcal(totalDeficit);

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

      {/* Metas por fecha */}
      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-1">Mis metas</h2>
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          Estás en {current.toFixed(1)} kg{currentWaist ? ` · cintura ${currentWaist} cm` : ""}.
        </p>
        <div className="space-y-2">
          {MILESTONES.map((m, i) => {
            const done = current <= m.targetKg;
            const isNext = i === nextIdx;
            const kgLeft = Math.max(0, current - m.targetKg);
            return (
              <div
                key={m.date}
                className="rounded-xl px-3 py-2.5 flex items-center justify-between"
                style={{
                  background: "var(--card-2)",
                  border: isNext ? "1px solid var(--accent)" : "1px solid transparent",
                }}
              >
                <div>
                  <div className="text-sm">
                    {m.label}
                    {isNext && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--accent)", color: "white" }}>
                        próxima
                      </span>
                    )}
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                    {shortDate(m.date)} · meta {m.targetKg} kg · cintura ~{m.targetWaist} cm
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  {done ? (
                    <span className="text-sm font-semibold" style={{ color: "var(--good)" }}>Lograda</span>
                  ) : (
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      faltan <b style={{ color: "var(--text)" }}>{kgLeft.toFixed(1)} kg</b>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-3">Avance por calorías</h2>
        {loggedDays === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Registra tus comidas unos días (en Comida) y aquí verás cuánto déficit
            llevas acumulado y cuánta grasa representa. Es tu avance por lo que comes
            y te mueves, no solo por la báscula.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-xl p-3" style={{ background: "var(--card-2)" }}>
                <div className="text-xs" style={{ color: "var(--muted)" }}>Déficit acumulado</div>
                <div className="text-xl font-bold" style={{ color: totalDeficit >= 0 ? "var(--good)" : "var(--warn)" }}>
                  {totalDeficit >= 0 ? "−" : "+"}
                  {Math.abs(Math.round(totalDeficit))}
                </div>
                <div className="text-[11px]" style={{ color: "var(--muted)" }}>kcal · {loggedDays} días</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: "var(--card-2)" }}>
                <div className="text-xs" style={{ color: "var(--muted)" }}>Grasa estimada</div>
                <div className="text-xl font-bold" style={{ color: estKg >= 0 ? "var(--good)" : "var(--warn)" }}>
                  {estKg >= 0 ? "−" : "+"}
                  {Math.abs(estKg).toFixed(2)} kg
                </div>
                <div className="text-[11px]" style={{ color: "var(--muted)" }}>por comida y ejercicio</div>
              </div>
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {lost > 0
                ? `Tu báscula ha bajado ${lost.toFixed(1)} kg. Si va parecido a la grasa estimada, vas perfecto.`
                : "Sigue registrando: la báscula tarda unos días en reflejar el déficit."}
            </p>
          </>
        )}
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
        <ul className="space-y-1.5 list-disc ml-4" style={{ color: "var(--muted)" }}>
          <li>El peso baja en escalones, no en línea recta: es normal.</li>
          <li>Si el peso no se mueve pero la cintura baja, vas bien igual.</li>
          <li>Meta sana: 0.5–0.75 kg por semana.</li>
        </ul>
      </section>
    </main>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
