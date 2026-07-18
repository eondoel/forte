"use client";

import { useMemo, useState, useTransition } from "react";
import { saveWorkout, type SetInput } from "../actions";
import type { PlanExercise } from "@/lib/plan";
import type { Exercise } from "@/db/schema";

export default function WorkoutLogger({
  routine,
  exercises,
  suggested,
  lastLabel,
}: {
  routine: Record<"A" | "B", PlanExercise[]>;
  exercises: Exercise[];
  suggested: "A" | "B";
  lastLabel: string | null;
}) {
  const [day, setDay] = useState<"A" | "B">(suggested);
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  // clave: `${exIdx}-${setIdx}` -> { reps, weight }
  const [vals, setVals] = useState<Record<string, { reps: string; weight: string }>>({});

  const byName = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of exercises) m.set(e.name, e.id);
    return m;
  }, [exercises]);

  const plan = routine[day];

  function set(key: string, field: "reps" | "weight", v: string) {
    setVals((prev) => ({
      ...prev,
      [key]: { reps: prev[key]?.reps ?? "", weight: prev[key]?.weight ?? "", [field]: v },
    }));
  }

  function save() {
    const sets: SetInput[] = [];
    plan.forEach((ex, exIdx) => {
      const exerciseId = byName.get(ex.name);
      if (!exerciseId) return;
      for (let s = 0; s < ex.sets; s++) {
        const v = vals[`${exIdx}-${s}`];
        const reps = parseInt(v?.reps ?? "");
        if (reps > 0) {
          sets.push({ exerciseId, reps, weightLb: parseFloat(v?.weight ?? "") || 0 });
        }
      }
    });
    if (sets.length === 0) return;
    start(async () => {
      await saveWorkout(day, sets);
      setVals({});
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    });
  }

  return (
    <section className="rounded-2xl p-4" style={card}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Rutina de hoy</h2>
        <div className="flex gap-2">
          {(["A", "B"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDay(d)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: day === d ? "var(--accent)" : "var(--card-2)",
                color: day === d ? "white" : "var(--muted)",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {lastLabel && (
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          Tu última sesión fue rutina {lastLabel}. Hoy toca <b style={{ color: "var(--accent-2)" }}>{suggested}</b>.
        </p>
      )}

      <div className="space-y-4">
        {plan.map((ex, exIdx) => (
          <div key={exIdx} className="rounded-xl p-3" style={{ background: "var(--card-2)" }}>
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium text-sm">{ex.name}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--bg)", color: "var(--muted)" }}>
                {ex.equipment}
              </span>
            </div>
            <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>
              {ex.sets} × {ex.reps} · {ex.tip}
            </div>
            <div className="space-y-2">
              {Array.from({ length: ex.sets }).map((_, s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="text-xs w-12" style={{ color: "var(--muted)" }}>
                    Serie {s + 1}
                  </span>
                  <input
                    inputMode="numeric"
                    placeholder="reps"
                    value={vals[`${exIdx}-${s}`]?.reps ?? ""}
                    onChange={(e) => set(`${exIdx}-${s}`, "reps", e.target.value)}
                    className="w-20 rounded-lg px-2 py-1.5 text-sm outline-none text-center"
                    style={{ background: "var(--bg)", color: "var(--text)" }}
                  />
                  <input
                    inputMode="decimal"
                    placeholder="lb"
                    value={vals[`${exIdx}-${s}`]?.weight ?? ""}
                    onChange={(e) => set(`${exIdx}-${s}`, "weight", e.target.value)}
                    className="w-20 rounded-lg px-2 py-1.5 text-sm outline-none text-center"
                    style={{ background: "var(--bg)", color: "var(--text)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={save}
        disabled={pending}
        className="mt-4 w-full py-3 rounded-2xl font-semibold disabled:opacity-50"
        style={{ background: done ? "var(--good)" : "var(--accent)", color: "white" }}
      >
        {done ? "✅ ¡Sesión guardada!" : pending ? "Guardando..." : `Guardar entreno ${day}`}
      </button>
    </section>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
