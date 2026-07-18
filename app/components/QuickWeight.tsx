"use client";

import { useState, useTransition } from "react";
import { addWeight } from "../actions";

export default function QuickWeight() {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [pending, start] = useTransition();

  function save() {
    const w = parseFloat(weight);
    if (!w) return;
    const cm = parseFloat(waist);
    start(async () => {
      await addWeight(w, isNaN(cm) ? undefined : cm);
      setWeight("");
      setWaist("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-2xl font-semibold"
        style={{ background: "var(--accent)", color: "white" }}
      >
        ⚖️ Registrar peso de hoy
      </button>
    );
  }

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex gap-2">
        <input
          inputMode="decimal"
          placeholder="Peso (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="flex-1 rounded-xl px-3 py-2 outline-none"
          style={{ background: "var(--card-2)", color: "var(--text)" }}
        />
        <input
          inputMode="decimal"
          placeholder="Cintura (cm)"
          value={waist}
          onChange={(e) => setWaist(e.target.value)}
          className="flex-1 rounded-xl px-3 py-2 outline-none"
          style={{ background: "var(--card-2)", color: "var(--text)" }}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setOpen(false)} className="flex-1 py-2 rounded-xl" style={{ background: "var(--card-2)" }}>
          Cancelar
        </button>
        <button
          onClick={save}
          disabled={pending}
          className="flex-1 py-2 rounded-xl font-semibold disabled:opacity-50"
          style={{ background: "var(--accent)", color: "white" }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
