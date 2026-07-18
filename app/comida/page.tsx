import { eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { meal, drinkLog } from "@/db/schema";
import { MEAL_PRESETS, DAILY_GOALS } from "@/lib/plan";
import { today } from "@/lib/date";
import DbSetup from "../components/DbSetup";
import DrinkCounter from "../components/DrinkCounter";
import MealLogger from "../components/MealLogger";

export const dynamic = "force-dynamic";

export default async function ComidaPage() {
  if (!isDbConfigured) return <DbSetup />;

  const d = today();
  const meals = await db.select().from(meal).where(eq(meal.date, d));
  const [drinks] = await db.select().from(drinkLog).where(eq(drinkLog.date, d));

  const kcal = meals.reduce((a, m) => a + (m.calories ?? 0), 0);
  const protein = meals.reduce((a, m) => a + (m.proteinG ?? 0), 0);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Comida de hoy</h1>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={card}>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Calorías</div>
          <div className="text-2xl font-bold" style={{ color: kcal > DAILY_GOALS.calories ? "var(--accent-2)" : "var(--good)" }}>
            {kcal}
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>meta {DAILY_GOALS.calories}</div>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Proteína</div>
          <div className="text-2xl font-bold" style={{ color: protein >= DAILY_GOALS.proteinG ? "var(--good)" : "var(--text)" }}>
            {protein} g
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>meta {DAILY_GOALS.proteinG} g</div>
        </div>
      </section>

      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-3">Bebidas</h2>
        <DrinkCounter
          water={drinks?.waterCups ?? 0}
          soda={drinks?.sodaCups ?? 0}
          waterGoal={DAILY_GOALS.waterCups}
        />
      </section>

      <MealLogger presets={MEAL_PRESETS} meals={meals} />
    </main>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
