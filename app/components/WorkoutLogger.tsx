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
  const [openHow, setOpenHow] = useState<number | null>(null);
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
          sets.push({ exerciseId, reps, weightKg: parseFloat(v?.weight ?? "") || 0 });
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
        <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
          Tu última sesión fue rutina {lastLabel}. Hoy toca <b style={{ color: "var(--accent-2)" }}>{suggested}</b>.
        </p>
      )}

      <p className="text-[11px] mb-3 rounded-lg px-2 py-1.5" style={{ background: "var(--card-2)", color: "var(--muted)" }}>
        Anota el peso en <b>kg</b>. Tus mancuernas están en lb: 10 lb ≈ 4.5 kg · 15 lb ≈ 7 kg · 25 lb ≈ 11 kg.
      </p>

      <div className="space-y-4">
        {plan.map((ex, exIdx) => (
          <div key={exIdx} className="rounded-xl p-3" style={{ background: "var(--card-2)" }}>
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium text-sm">{ex.name}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--bg)", color: "var(--muted)" }}>
                {ex.equipment}
              </span>
            </div>
            <div className="rounded-lg px-2.5 py-2 mb-2" style={{ background: "var(--bg)" }}>
              <div className="text-[10px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: "var(--accent-2)" }}>
                Sugerencia
              </div>
              <div className="text-xs" style={{ color: "var(--text)" }}>
                {ex.sets} series × {ex.reps} reps
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                Peso de inicio: <span style={{ color: "var(--text)" }}>{ex.startWeight}</span>
              </div>
            </div>
            <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
              {ex.tip}
            </div>
            <button
              type="button"
              onClick={() => setOpenHow(openHow === exIdx ? null : exIdx)}
              className="text-xs mb-2"
              style={{ color: "var(--accent-2)" }}
            >
              {openHow === exIdx ? "− Ocultar guía" : "¿Cómo se hace?"}
            </button>
            {openHow === exIdx && (
              <p className="text-xs mb-3 leading-relaxed rounded-lg p-2" style={{ background: "var(--bg)", color: "var(--muted)" }}>
                {ex.howto}
              </p>
            )}
            <div className="space-y-2">
              {Array.from({ length: ex.sets }).map((_, s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="text-xs w-12" style={{ color: "var(--muted)" }}>
                    Serie {s + 1}
                  </span>
                  <input
                    inputMode="numeric"
                    placeholder={ex.reps}
                    value={vals[`${exIdx}-${s}`]?.reps ?? ""}
                    onChange={(e) => set(`${exIdx}-${s}`, "reps", e.target.value)}
                    className="w-20 rounded-lg px-2 py-1.5 text-sm outline-none text-center"
                    style={{ background: "var(--bg)", color: "var(--text)" }}
                  />
                  <input
                    inputMode="decimal"
                    placeholder={ex.kgHint ? `${ex.kgHint} kg` : "kg"}
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
        {done ? "¡Sesión guardada!" : pending ? "Guardando..." : `Guardar entreno ${day}`}
      </button>
    </section>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
