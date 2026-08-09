import { desc, asc, eq, inArray } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { exercise, workoutSession, workoutSet, routineExercise } from "@/db/schema";
import { ROUTINE, planFromCustom, type PlanExercise } from "@/lib/plan";
import DbSetup from "../components/DbSetup";
import WorkoutLogger from "../components/WorkoutLogger";
import WalkLogger from "../components/WalkLogger";
import RoutineBuilder from "../components/RoutineBuilder";
import WorkoutHistory, { type HistSession } from "../components/WorkoutHistory";

export const dynamic = "force-dynamic";

export default async function EntrenoPage() {
  if (!isDbConfigured) return <DbSetup />;

  const exercises = await db.select().from(exercise);

  // Sesiones recientes con sus series (para el historial editable).
  const recent = await db
    .select()
    .from(workoutSession)
    .orderBy(desc(workoutSession.date), desc(workoutSession.id))
    .limit(8);

  const ids = recent.map((s) => s.id);
  const setRows = ids.length
    ? await db
        .select({
          id: workoutSet.id,
          sessionId: workoutSet.sessionId,
          name: exercise.name,
          muscle: exercise.muscle,
          reps: workoutSet.reps,
          weightKg: workoutSet.weightKg,
          setNumber: workoutSet.setNumber,
        })
        .from(workoutSet)
        .innerJoin(exercise, eq(workoutSet.exerciseId, exercise.id))
        .where(inArray(workoutSet.sessionId, ids))
        .orderBy(asc(workoutSet.setNumber))
    : [];

  const sessions: HistSession[] = recent.map((s) => ({
    id: s.id,
    date: s.date,
    dayLabel: s.dayLabel,
    sets: setRows
      .filter((r) => r.sessionId === s.id)
      .map((r) => ({ id: r.id, name: r.name, muscle: r.muscle, reps: r.reps, weightKg: r.weightKg })),
  }));

  // Rutina personalizada "C".
  const cRows = await db
    .select({
      exerciseId: routineExercise.exerciseId,
      sets: routineExercise.sets,
      reps: routineExercise.reps,
      kg: routineExercise.kg,
      name: exercise.name,
      equipment: exercise.equipment,
      muscle: exercise.muscle,
    })
    .from(routineExercise)
    .innerJoin(exercise, eq(routineExercise.exerciseId, exercise.id))
    .where(eq(routineExercise.label, "C"))
    .orderBy(asc(routineExercise.position));

  const cPlan: PlanExercise[] = cRows.map((r) =>
    planFromCustom(r.name, r.equipment, r.muscle, r.sets, r.reps, r.kg)
  );
  const initialC = cRows.map((r) => ({
    exerciseId: r.exerciseId,
    sets: r.sets,
    reps: r.reps,
    kg: r.kg,
  }));

  const routine: Record<string, PlanExercise[]> = { A: ROUTINE.A, B: ROUTINE.B };
  const labels = ["A", "B"];
  if (cPlan.length > 0) {
    routine.C = cPlan;
    labels.push("C");
  }

  const suggested = recent[0]?.dayLabel === "A" ? "B" : "A";

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Entreno</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Cuerpo completo · 2 series · 12-15 reps · peso ligero. Alterna A y B, 3 días por semana.
      </p>

      <WalkLogger />

      <WorkoutLogger
        routine={routine}
        labels={labels}
        exercises={exercises}
        suggested={suggested}
        lastLabel={recent[0]?.dayLabel ?? null}
      />

      <RoutineBuilder exercises={exercises} initial={initialC} />

      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-3">Historial de entrenos</h2>
        <WorkoutHistory sessions={sessions} />
      </section>
    </main>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
