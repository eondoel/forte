"use client";

import { useState, useTransition } from "react";
import { addMeal } from "../actions";
import { FOODS, defaultQty, type Food } from "@/lib/foods";

const TYPES = [
  { key: "desayuno", label: "Desayuno" },
  { key: "comida", label: "Comida" },
  { key: "cena", label: "Cena" },
  { key: "snack", label: "Snack" },
] as const;

export default function FoodCalculator() {
  const [pending, start] = useTransition();
  const [type, setType] = useState<(typeof TYPES)[number]["key"]>("comida");
  const [foodIdx, setFoodIdx] = useState(0);
  const [qty, setQty] = useState(String(defaultQty(FOODS[0].unit)));

  const food: Food = FOODS[foodIdx];
  const q = parseFloat(qty) || 0;
  const kcal = Math.round(q * food.kcal);
  const protein = Math.round(q * food.protein);

  function onFood(i: number) {
    setFoodIdx(i);
    setQty(String(defaultQty(FOODS[i].unit)));
  }

  function add() {
    if (q <= 0) return;
    const desc = `${food.name} (${qty} ${food.unit})`;
    start(async () => {
      await addMeal(type, desc, kcal, protein);
    });
  }

  return (
    <section className="rounded-2xl p-4" style={card}>
      <h2 className="font-semibold mb-1">Calcular por alimento</h2>
      <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
        Elige el alimento y la cantidad; calculo las calorías y la proteína.
      </p>

      <div className="flex gap-2 flex-wrap mb-3">
        {TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            className="px-3 py-1.5 rounded-full text-xs"
            style={{
              background: type === t.key ? "var(--accent)" : "var(--card-2)",
              color: type === t.key ? "white" : "var(--muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <label className="block text-xs mb-1" style={{ color: "var(--muted)" }}>
        Alimento
      </label>
      <select
        value={foodIdx}
        onChange={(e) => onFood(Number(e.target.value))}
        className="w-full rounded-xl px-3 py-2.5 mb-3 outline-none text-sm"
        style={{ background: "var(--card-2)", color: "var(--text)" }}
      >
        {FOODS.map((f, i) => (
          <option key={i} value={i}>
            {f.name}
          </option>
        ))}
      </select>

      <label className="block text-xs mb-1" style={{ color: "var(--muted)" }}>
        Cantidad ({food.unit})
      </label>
      <div className="flex items-center rounded-xl px-3 mb-3" style={{ background: "var(--card-2)" }}>
        <input
          inputMode="decimal"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="w-full bg-transparent py-2.5 outline-none text-sm"
          style={{ color: "var(--text)" }}
        />
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          {food.unit}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-xl px-3 py-3 mb-3" style={{ background: "var(--bg)" }}>
        <div className="text-center flex-1">
          <div className="text-xl font-bold" style={{ color: "var(--text)" }}>{kcal}</div>
          <div className="text-[11px]" style={{ color: "var(--muted)" }}>calorías</div>
        </div>
        <div className="w-px h-8" style={{ background: "var(--border)" }} />
        <div className="text-center flex-1">
          <div className="text-xl font-bold" style={{ color: "var(--good)" }}>{protein} g</div>
          <div className="text-[11px]" style={{ color: "var(--muted)" }}>proteína</div>
        </div>
      </div>

      <button
        onClick={add}
        disabled={pending || q <= 0}
        className="w-full py-2.5 rounded-xl font-semibold disabled:opacity-50"
        style={{ background: "var(--accent)", color: "white" }}
      >
        Agregar
      </button>
    </section>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
