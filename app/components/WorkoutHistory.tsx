"use client";

import { useState, useTransition } from "react";
import { deleteWorkoutSession, updateWorkoutSet } from "../actions";

export type HistSet = {
  id: number;
  name: string;
  muscle: string;
  reps: number;
  weightKg: number;
};
export type HistSession = {
  id: number;
  date: string;
  dayLabel: string;
  sets: HistSet[];
};

export default function WorkoutHistory({ sessions }: { sessions: HistSession[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [pending, start] = useTransition();
  const [edits, setEdits] = useState<Record<number, { reps: string; weight: string }>>({});
  const [savedId, setSavedId] = useState<number | null>(null);

  function val(setId: number, field: "reps" | "weight", original: number) {
    return edits[setId]?.[field] ?? String(original);
  }
  function edit(setId: number, field: "reps" | "weight", v: string) {
    setEdits((prev) => ({ ...prev, [setId]: { ...prev[setId], [field]: v } as { reps: string; weight: string } }));
  }

  function saveSession(s: HistSession) {
    start(async () => {
      for (const st of s.sets) {
        const reps = parseInt(val(st.id, "reps", st.reps)) || 0;
        const weight = parseFloat(val(st.id, "weight", st.weightKg)) || 0;
        if (reps !== st.reps || weight !== st.weightKg) {
          await updateWorkoutSet(st.id, reps, weight);
        }
      }
      setSavedId(s.id);
      setTimeout(() => setSavedId(null), 2000);
    });
  }

  function remove(id: number) {
    if (!confirm("¿Borrar este entreno completo?")) return;
    start(() => deleteWorkoutSession(id));
  }

  if (sessions.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Aún no registras entrenos. ¡Empieza hoy!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((s) => (
        <div key={s.id} className="rounded-xl overflow-hidden" style={{ background: "var(--card-2)" }}>
          <div className="flex items-center justify-between px-3 py-2.5">
            <button
              onClick={() => setOpenId(openId === s.id ? null : s.id)}
              className="flex-1 text-left text-sm"
            >
              <span className="font-medium">Rutina {s.dayLabel}</span>{" "}
              <span style={{ color: "var(--muted)" }}>· {s.date} · {s.sets.length} series</span>
            </button>
            <button
              onClick={() => remove(s.id)}
              disabled={pending}
              className="text-xs px-2 py-1 rounded-lg disabled:opacity-40"
              style={{ color: "var(--accent-2)" }}
            >
              Borrar
            </button>
          </div>

          {openId === s.id && (
            <div className="px-3 pb-3 space-y-2">
              {s.sets.map((st, i) => (
                <div key={st.id} className="flex items-center gap-2">
                  <span className="text-xs flex-1 truncate" style={{ color: "var(--muted)" }}>
                    {i + 1}. {st.name}
                  </span>
                  <input
                    inputMode="numeric"
                    value={val(st.id, "reps", st.reps)}
                    onChange={(e) => edit(st.id, "reps", e.target.value)}
                    className="w-16 rounded-lg px-2 py-1.5 text-sm outline-none text-center"
                    style={{ background: "var(--bg)", color: "var(--text)" }}
                  />
                  <span className="text-[11px]" style={{ color: "var(--muted)" }}>reps</span>
                  <input
                    inputMode="decimal"
                    value={val(st.id, "weight", st.weightKg)}
                    onChange={(e) => edit(st.id, "weight", e.target.value)}
                    className="w-16 rounded-lg px-2 py-1.5 text-sm outline-none text-center"
                    style={{ background: "var(--bg)", color: "var(--text)" }}
                  />
                  <span className="text-[11px]" style={{ color: "var(--muted)" }}>kg</span>
                </div>
              ))}
              <button
                onClick={() => saveSession(s)}
                disabled={pending}
                className="w-full py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{ background: savedId === s.id ? "var(--good)" : "var(--accent)", color: "white" }}
              >
                {savedId === s.id ? "Cambios guardados" : "Guardar cambios"}
              </button>
              <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                Pon las reps en 0 para borrar esa serie.
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
