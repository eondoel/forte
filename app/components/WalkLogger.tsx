"use client";

import { useState, useTransition } from "react";
import { addWalk } from "../actions";

export default function WalkLogger() {
  const [minutes, setMinutes] = useState("");
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  function save() {
    const m = parseInt(minutes);
    if (!m || m <= 0) return;
    start(async () => {
      await addWalk(m);
      setMinutes("");
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    });
  }

  return (
    <section className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <h2 className="font-semibold mb-1">🚶 Caminata de hoy</h2>
      <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
        Tu mejor quema-grasa. Escribe cuántos minutos caminaste.
      </p>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center rounded-xl px-3" style={{ background: "var(--card-2)" }}>
          <input
            inputMode="numeric"
            placeholder="Minutos (ej. 60)"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-full bg-transparent py-2.5 outline-none"
            style={{ color: "var(--text)" }}
          />
          <span className="text-sm" style={{ color: "var(--muted)" }}>min</span>
        </div>
        <button
          onClick={save}
          disabled={pending || !minutes}
          className="px-5 rounded-xl font-semibold disabled:opacity-50"
          style={{ background: done ? "var(--good)" : "var(--accent)", color: "white" }}
        >
          {done ? "✅" : "Guardar"}
        </button>
      </div>
    </section>
  );
}
