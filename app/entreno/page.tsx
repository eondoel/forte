import { desc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { exercise, workoutSession } from "@/db/schema";
import { ROUTINE } from "@/lib/plan";
import DbSetup from "../components/DbSetup";
import WorkoutLogger from "../components/WorkoutLogger";
import WalkLogger from "../components/WalkLogger";

export const dynamic = "force-dynamic";

export default async function EntrenoPage() {
  if (!isDbConfigured) return <DbSetup />;

  const exercises = await db.select().from(exercise);
  const recent = await db
    .select()
    .from(workoutSession)
    .orderBy(desc(workoutSession.date))
    .limit(5);

  // Sugerir A o B alternando según la última sesión.
  const suggested = recent[0]?.dayLabel === "A" ? "B" : "A";

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Entreno</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Cuerpo completo · 2 series · 12-15 reps · peso ligero. Alterna A y B, 3 días por semana.
      </p>

      <WalkLogger />

      <WorkoutLogger
        routine={ROUTINE}
        exercises={exercises}
        suggested={suggested}
        lastLabel={recent[0]?.dayLabel ?? null}
      />

      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-3">Últimas sesiones</h2>
        {recent.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Aún no registras entrenos. ¡Empieza hoy con la rutina {suggested}!
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((s) => (
              <li
                key={s.id}
                className="flex justify-between text-sm rounded-xl px-3 py-2"
                style={{ background: "var(--card-2)" }}
              >
                <span>Rutina {s.dayLabel}</span>
                <span style={{ color: "var(--muted)" }}>{s.date}</span>
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
