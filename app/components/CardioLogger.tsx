"use client";

import { useState, useTransition } from "react";
import { addCardio } from "../actions";
import { cardioKcal } from "@/lib/energy";

export default function CardioLogger({
  weightKg,
  todayWalkKm,
  todayJogKm,
}: {
  weightKg: number;
  todayWalkKm: number;
  todayJogKm: number;
}) {
  const [walkKm, setWalkKm] = useState("");
  const [jogKm, setJogKm] = useState("");
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  const w = parseFloat(walkKm) || 0;
  const j = parseFloat(jogKm) || 0;
  const kcal = Math.round(cardioKcal(w, j, weightKg));
  const todayTotal = todayWalkKm + todayJogKm;

  function save() {
    if (w <= 0 && j <= 0) return;
    start(async () => {
      await addCardio(w, j);
      setWalkKm("");
      setJogKm("");
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    });
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-semibold">Cardio de hoy</h2>
        {todayTotal > 0 && (
          <span className="text-xs" style={{ color: "var(--good)" }}>
            Llevas {todayTotal.toFixed(1)} km
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <Field label="Caminata" value={walkKm} onChange={setWalkKm} placeholder="ej. 1.5" />
        <Field label="Trote" value={jogKm} onChange={setJogKm} placeholder="ej. 3.5" />
      </div>

      <button
        onClick={save}
        disabled={pending || (w <= 0 && j <= 0)}
        className="w-full py-2.5 rounded-xl font-semibold disabled:opacity-50"
        style={{ background: done ? "var(--good)" : "var(--accent)", color: "white" }}
      >
        {done
          ? "Guardado"
          : w + j > 0
            ? `Guardar ${(w + j).toFixed(1)} km · ~${kcal} kcal`
            : "Guardar cardio"}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-xs mb-1" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <span className="flex items-center rounded-xl px-3 min-w-0" style={{ background: "var(--card-2)" }}>
        <input
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent py-2.5 outline-none"
          style={{ color: "var(--text)" }}
        />
        <span className="text-sm pl-1" style={{ color: "var(--muted)" }}>
          km
        </span>
      </span>
    </label>
  );
}
