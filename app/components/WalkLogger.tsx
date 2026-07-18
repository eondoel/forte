"use client";

import { useTransition } from "react";
import { addWalk } from "../actions";

export default function WalkLogger() {
  const [pending, start] = useTransition();
  return (
    <section className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <h2 className="font-semibold mb-1">🚶 Caminata de hoy</h2>
      <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
        Tu mejor quema-grasa. Toca los minutos que caminaste.
      </p>
      <div className="flex gap-2">
        {[15, 20, 30, 45].map((min) => (
          <button
            key={min}
            disabled={pending}
            onClick={() => start(() => addWalk(min))}
            className="flex-1 py-2.5 rounded-xl font-semibold disabled:opacity-50"
            style={{ background: "var(--card-2)" }}
          >
            +{min}
          </button>
        ))}
      </div>
    </section>
  );
}
