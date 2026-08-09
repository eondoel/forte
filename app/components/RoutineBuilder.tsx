"use client";

import { useState, useTransition } from "react";
import { saveCustomRoutine } from "../actions";
import type { Exercise } from "@/db/schema";

type Item = { exerciseId: number; sets: number; reps: string; kg: number };

export default function RoutineBuilder({
  exercises,
  initial,
}: {
  exercises: Exercise[];
  initial: Item[];
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>(initial);
  const [exId, setExId] = useState(exercises[0]?.id ?? 0);
  const [sets, setSets] = useState("2");
  const [reps, setReps] = useState("12-15");
  const [kg, setKg] = useState("");
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  const info = (id: number) => exercises.find((e) => e.id === id);

  function add() {
    if (!exId) return;
    setItems((prev) => [
      ...prev,
      { exerciseId: exId, sets: parseInt(sets) || 2, reps: reps || "12-15", kg: parseFloat(kg) || 0 },
    ]);
  }
  function removeAt(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function saveRoutine() {
    start(async () => {
      await saveCustomRoutine(items);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <section className="rounded-2xl p-4" style={card}>
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between">
        <h2 className="font-semibold">Mi rutina (C)</h2>
        <span className="text-sm" style={{ color: "var(--accent-2)" }}>
          {open ? "Cerrar" : items.length > 0 ? "Editar" : "Crear"}
        </span>
      </button>

      {!open && items.length > 0 && (
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
          {items.length} ejercicios guardados. Selecciónala arriba con el botón C.
        </p>
      )}

      {open && (
        <div className="mt-3 space-y-3">
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Arma tu propia rutina con los ejercicios de tu equipo. Se guarda como "C"
            y la eliges arriba junto a A y B.
          </p>

          {/* Lista actual */}
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((it, i) => {
                const ex = info(it.exerciseId);
                return (
                  <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--card-2)" }}>
                    <div className="text-sm">
                      <div>{ex?.name ?? "?"}</div>
                      <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                        {it.sets} × {it.reps}
                        {it.kg > 0 ? ` · ${it.kg} kg` : ""} · {ex?.muscle}
                      </div>
                    </div>
                    <button onClick={() => removeAt(i)} className="text-xs" style={{ color: "var(--accent-2)" }}>
                      Quitar
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Agregar ejercicio */}
          <div className="rounded-xl p-3 space-y-2" style={{ background: "var(--card-2)" }}>
            <label className="block text-xs" style={{ color: "var(--muted)" }}>Ejercicio</label>
            <select
              value={exId}
              onChange={(e) => setExId(Number(e.target.value))}
              className="w-full rounded-lg px-3 py-2 outline-none text-sm"
              style={{ background: "var(--bg)", color: "var(--text)" }}
            >
              {exercises.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.muscle})
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs" style={{ color: "var(--muted)" }}>Series</label>
                <input
                  inputMode="numeric"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 outline-none text-sm"
                  style={{ background: "var(--bg)", color: "var(--text)" }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs" style={{ color: "var(--muted)" }}>Reps</label>
                <input
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 outline-none text-sm"
                  style={{ background: "var(--bg)", color: "var(--text)" }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs" style={{ color: "var(--muted)" }}>Peso kg</label>
                <input
                  inputMode="decimal"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  placeholder="opcional"
                  className="w-full rounded-lg px-3 py-2 outline-none text-sm"
                  style={{ background: "var(--bg)", color: "var(--text)" }}
                />
              </div>
            </div>
            <button onClick={add} className="w-full py-2 rounded-lg text-sm font-semibold" style={{ background: "var(--bg)", color: "var(--accent-2)" }}>
              + Agregar a la rutina
            </button>
          </div>

          <button
            onClick={saveRoutine}
            disabled={pending}
            className="w-full py-2.5 rounded-xl font-semibold disabled:opacity-50"
            style={{ background: saved ? "var(--good)" : "var(--accent)", color: "white" }}
          >
            {saved ? "Rutina C guardada" : pending ? "Guardando..." : "Guardar rutina C"}
          </button>
          {items.length === 0 && (
            <p className="text-[11px] text-center" style={{ color: "var(--muted)" }}>
              Guardar vacía borra tu rutina C.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
