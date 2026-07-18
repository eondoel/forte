"use client";

import { useState, useTransition } from "react";
import { addMeal, deleteMeal } from "../actions";
import type { Meal } from "@/db/schema";

type Preset = {
  type: "desayuno" | "comida" | "cena" | "snack";
  description: string;
  calories: number;
  proteinG: number;
};

const TYPE_LABEL: Record<string, string> = {
  desayuno: "🌅 Desayuno",
  comida: "🍽️ Comida",
  cena: "🌙 Cena",
  snack: "🍎 Snack",
};

export default function MealLogger({ presets, meals }: { presets: Preset[]; meals: Meal[] }) {
  const [pending, start] = useTransition();
  const [custom, setCustom] = useState(false);
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<Preset["type"]>("comida");
  const [cal, setCal] = useState("");
  const [prot, setProt] = useState("");

  return (
    <div className="space-y-4">
      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-3">Agrega rápido</h2>
        <div className="grid grid-cols-1 gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              disabled={pending}
              onClick={() => start(() => addMeal(p.type, p.description, p.calories, p.proteinG))}
              className="flex items-center justify-between text-left rounded-xl px-3 py-2.5 disabled:opacity-50"
              style={{ background: "var(--card-2)" }}
            >
              <span className="text-sm">
                <span style={{ color: "var(--muted)" }}>{TYPE_LABEL[p.type]}</span>{" "}
                {p.description}
              </span>
              <span className="text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>
                {p.calories} kcal · {p.proteinG}g
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setCustom((v) => !v)}
          className="mt-3 text-sm"
          style={{ color: "var(--accent-2)" }}
        >
          {custom ? "− Cerrar" : "+ Otra comida"}
        </button>

        {custom && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-2 flex-wrap">
              {(["desayuno", "comida", "cena", "snack"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: type === t ? "var(--accent)" : "var(--card-2)",
                    color: type === t ? "white" : "var(--muted)",
                  }}
                >
                  {TYPE_LABEL[t]}
                </button>
              ))}
            </div>
            <input
              placeholder="¿Qué comiste?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full rounded-xl px-3 py-2 outline-none"
              style={{ background: "var(--card-2)", color: "var(--text)" }}
            />
            <div className="flex gap-2">
              <input
                inputMode="numeric"
                placeholder="Calorías (aprox)"
                value={cal}
                onChange={(e) => setCal(e.target.value)}
                className="flex-1 rounded-xl px-3 py-2 outline-none"
                style={{ background: "var(--card-2)", color: "var(--text)" }}
              />
              <input
                inputMode="numeric"
                placeholder="Proteína g"
                value={prot}
                onChange={(e) => setProt(e.target.value)}
                className="flex-1 rounded-xl px-3 py-2 outline-none"
                style={{ background: "var(--card-2)", color: "var(--text)" }}
              />
            </div>
            <button
              disabled={pending || !desc}
              onClick={() =>
                start(async () => {
                  await addMeal(type, desc, parseInt(cal) || undefined, parseInt(prot) || undefined);
                  setDesc("");
                  setCal("");
                  setProt("");
                  setCustom(false);
                })
              }
              className="w-full py-2.5 rounded-xl font-semibold disabled:opacity-50"
              style={{ background: "var(--accent)", color: "white" }}
            >
              Guardar comida
            </button>
          </div>
        )}
      </section>

      <section className="rounded-2xl p-4" style={card}>
        <h2 className="font-semibold mb-3">Registrado hoy</h2>
        {meals.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Aún nada. Toca un botón de arriba para registrar.
          </p>
        ) : (
          <ul className="space-y-2">
            {meals.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-xl px-3 py-2"
                style={{ background: "var(--card-2)" }}
              >
                <div className="text-sm">
                  <div>{m.description}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    {TYPE_LABEL[m.type]} · {m.calories ?? "?"} kcal · {m.proteinG ?? "?"}g
                  </div>
                </div>
                <button
                  disabled={pending}
                  onClick={() => start(() => deleteMeal(m.id))}
                  className="text-lg disabled:opacity-40"
                  style={{ color: "var(--muted)" }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
