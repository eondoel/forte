import { desc, eq, sql as dsql } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { profile, weightLog, drinkLog, meal, walk, workoutSession } from "@/db/schema";
import { DAILY_GOALS } from "@/lib/plan";
import { maintenanceKcal, exerciseKcal, kgFromKcal } from "@/lib/energy";
import { workoutCount } from "./actions";
import { today } from "@/lib/date";
import DbSetup from "./components/DbSetup";
import DrinkCounter from "./components/DrinkCounter";
import QuickWeight from "./components/QuickWeight";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  if (!isDbConfigured) return <DbSetup />;

  const d = today();
  const [prof] = await db.select().from(profile).limit(1);
  const weights = await db
    .select()
    .from(weightLog)
    .orderBy(desc(weightLog.date))
    .limit(1);
  const [drinks] = await db.select().from(drinkLog).where(eq(drinkLog.date, d));
  const todayMeals = await db.select().from(meal).where(eq(meal.date, d));
  const todayWalks = await db.select().from(walk).where(eq(walk.date, d));
  const sessions = await workoutCount();
  const todaySessRows = await db
    .select({ n: dsql<number>`count(*)` })
    .from(workoutSession)
    .where(eq(workoutSession.date, d));
  const sessionsToday = Number(todaySessRows[0]?.n ?? 0);

  const start = prof?.startWeightKg ?? 93.5;
  const goal = prof?.goalWeightKg ?? 80;
  const current = weights[0]?.weightKg ?? start;
  const lost = Math.max(0, start - current);
  const totalToLose = Math.max(0.1, start - goal);
  const pct = Math.min(100, Math.round((lost / totalToLose) * 100));

  const kcal = todayMeals.reduce((a, m) => a + (m.calories ?? 0), 0);
  const protein = todayMeals.reduce((a, m) => a + (m.proteinG ?? 0), 0);
  const walkMin = todayWalks.reduce((a, w) => a + w.minutes, 0);
  const water = drinks?.waterCups ?? 0;
  const soda = drinks?.sodaCups ?? 0;

  // Balance de calorías de hoy: gasto (base + ejercicio) menos lo comido.
  const base = maintenanceKcal(current, prof?.heightCm ?? 175, prof?.birthYear ?? 1986);
  const exKcal = exerciseKcal(walkMin, sessionsToday);
  const gasto = base + exKcal;
  const deficit = gasto - kcal;
  const monthlyKg = kgFromKcal(deficit) * 30;
  const hasMeals = kcal > 0;

  return (
    <main className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hola</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Un paso más cerca de tu meta.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{current.toFixed(1)}</div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            kg actuales
          </div>
        </div>
      </header>

      {/* Progreso de peso */}
      <section className="rounded-2xl p-4" style={card}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: "var(--muted)" }}>Inicio {start.toFixed(1)} kg</span>
          <span style={{ color: "var(--accent-2)" }}>Meta {goal.toFixed(1)} kg</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--card-2)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,var(--accent),var(--accent-2))" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span>
            <b style={{ color: "var(--good)" }}>-{lost.toFixed(1)} kg</b> bajados
          </span>
          <span style={{ color: "var(--muted)" }}>{pct}% de la meta</span>
        </div>
      </section>

      {/* Balance de calorías de hoy */}
      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-3">Balance de hoy</h2>
        {!hasMeals ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Registra tus comidas para ver tu balance de calorías del día.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-xl p-3" style={{ background: "var(--card-2)" }}>
                <div className="text-xs" style={{ color: "var(--muted)" }}>Gastas</div>
                <div className="text-xl font-bold">{gasto}</div>
                <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                  base {base} + ejercicio {exKcal}
                </div>
              </div>
              <div className="rounded-xl p-3" style={{ background: "var(--card-2)" }}>
                <div className="text-xs" style={{ color: "var(--muted)" }}>Comes</div>
                <div className="text-xl font-bold">{kcal}</div>
                <div className="text-[11px]" style={{ color: "var(--muted)" }}>calorías de hoy</div>
              </div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg)" }}>
              {deficit > 0 ? (
                <>
                  <div className="text-2xl font-bold" style={{ color: "var(--good)" }}>
                    −{deficit} kcal
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    déficit de hoy · a este ritmo, ~{monthlyKg.toFixed(1)} kg al mes
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold" style={{ color: "var(--warn)" }}>
                    +{Math.abs(deficit)} kcal
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    superávit hoy · camina un poco o aligera la cena para cerrar en déficit
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </section>

      {/* Bebidas: tu palanca #1 */}
      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-3">Bebidas de hoy</h2>
        <DrinkCounter water={water} soda={soda} waterGoal={DAILY_GOALS.waterCups} />
      </section>

      {/* Métricas del día */}
      <section className="grid grid-cols-2 gap-3">
        <Stat label="Calorías" value={`${kcal}`} sub={`meta ${DAILY_GOALS.calories}`} ok={kcal <= DAILY_GOALS.calories && kcal > 0} />
        <Stat label="Proteína" value={`${protein} g`} sub={`meta ${DAILY_GOALS.proteinG} g`} ok={protein >= DAILY_GOALS.proteinG} />
        <Stat label="Caminata" value={`${walkMin} min`} sub={`meta ${DAILY_GOALS.walkMinutes} min`} ok={walkMin >= DAILY_GOALS.walkMinutes} />
        <Stat label="Entrenos" value={`${sessions}`} sub="sesiones totales" ok={sessions > 0} />
      </section>

      <QuickWeight />
    </main>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};

function Stat({ label, value, sub, ok }: { label: string; value: string; sub: string; ok?: boolean }) {
  return (
    <div className="rounded-2xl p-4" style={card}>
      <div className="text-xs" style={{ color: "var(--muted)" }}>{label}</div>
      <div className="text-2xl font-bold" style={{ color: ok ? "var(--good)" : "var(--text)" }}>{value}</div>
      <div className="text-xs" style={{ color: "var(--muted)" }}>{sub}</div>
    </div>
  );
}
