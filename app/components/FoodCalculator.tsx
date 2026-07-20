"use client";

import { useState, useTransition } from "react";
import { addMeal, searchFood } from "../actions";
import { FOODS, defaultQty, type FoodResult } from "@/lib/foods";

const TYPES = [
  { key: "desayuno", label: "Desayuno" },
  { key: "comida", label: "Comida" },
  { key: "cena", label: "Cena" },
  { key: "snack", label: "Snack" },
] as const;

const QUICK: FoodResult[] = FOODS.slice(0, 6).map((f) => ({
  name: f.name,
  unit: f.unit,
  kcal: f.kcal,
  protein: f.protein,
  source: "local",
}));

export default function FoodCalculator() {
  const [type, setType] = useState<(typeof TYPES)[number]["key"]>("comida");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<FoodResult | null>(null);
  const [qty, setQty] = useState("150");
  const [searching, startSearch] = useTransition();
  const [saving, startSave] = useTransition();
  const [saved, setSaved] = useState(false);

  function runSearch() {
    if (query.trim().length < 2) return;
    startSearch(async () => {
      const r = await searchFood(query);
      setResults(r);
      setSearched(true);
    });
  }

  function choose(f: FoodResult) {
    setSelected(f);
    setQty(String(defaultQty(f.unit)));
  }

  const q = parseFloat(qty) || 0;
  const kcal = selected ? Math.round(q * selected.kcal) : 0;
  const protein = selected ? Math.round(q * selected.protein) : 0;

  function add() {
    if (!selected || q <= 0) return;
    const desc = `${selected.name} (${qty} ${selected.unit})`;
    startSave(async () => {
      await addMeal(type, desc, kcal, protein);
      setSaved(true);
      setSelected(null);
      setQuery("");
      setResults([]);
      setSearched(false);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  // Etiqueta de energía por resultado (por 100 g o por unidad).
  function energyLabel(f: FoodResult) {
    if (f.unit === "g" || f.unit === "ml") {
      return `${Math.round(f.kcal * 100)} kcal/100${f.unit}`;
    }
    return `${Math.round(f.kcal)} kcal/${f.unit}`;
  }

  return (
    <section className="rounded-2xl p-4" style={card}>
      <h2 className="font-semibold mb-1">Calcular por alimento</h2>
      <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
        Busca cualquier comida y calculo sus calorías y proteína por la cantidad.
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

      {!selected ? (
        <>
          <div className="flex gap-2 mb-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="Ej. manzana, pizza, yogur..."
              className="flex-1 rounded-xl px-3 py-2.5 outline-none text-sm"
              style={{ background: "var(--card-2)", color: "var(--text)" }}
            />
            <button
              onClick={runSearch}
              disabled={searching || query.trim().length < 2}
              className="px-4 rounded-xl font-semibold text-sm disabled:opacity-50"
              style={{ background: "var(--accent)", color: "white" }}
            >
              {searching ? "..." : "Buscar"}
            </button>
          </div>

          <div className="space-y-2">
            {(searched ? results : QUICK).map((f, i) => (
              <button
                key={i}
                onClick={() => choose(f)}
                className="w-full flex items-center justify-between text-left rounded-xl px-3 py-2.5"
                style={{ background: "var(--card-2)" }}
              >
                <span className="text-sm pr-2">{f.name}</span>
                <span className="text-[11px] whitespace-nowrap" style={{ color: "var(--muted)" }}>
                  {energyLabel(f)}
                </span>
              </button>
            ))}
            {searched && results.length === 0 && (
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                No encontré esa comida. Prueba con otro nombre más simple.
              </p>
            )}
            {!searched && (
              <p className="text-[11px] mt-1" style={{ color: "var(--faint, var(--muted))" }}>
                Tus alimentos frecuentes. Escribe arriba para buscar cualquier otro.
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium pr-2">{selected.name}</span>
            <button
              onClick={() => setSelected(null)}
              className="text-xs whitespace-nowrap"
              style={{ color: "var(--accent-2)" }}
            >
              Cambiar
            </button>
          </div>

          <label className="block text-xs mb-1" style={{ color: "var(--muted)" }}>
            Cantidad ({selected.unit})
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
              {selected.unit}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl px-3 py-3 mb-3" style={{ background: "var(--bg)" }}>
            <div className="text-center flex-1">
              <div className="text-xl font-bold">{kcal}</div>
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
            disabled={saving || q <= 0}
            className="w-full py-2.5 rounded-xl font-semibold disabled:opacity-50"
            style={{ background: "var(--accent)", color: "white" }}
          >
            {saving ? "Agregando..." : "Agregar"}
          </button>
        </>
      )}

      {saved && (
        <p className="mt-2 text-xs text-center" style={{ color: "var(--good)" }}>
          Agregado a tu comida de hoy.
        </p>
      )}
    </section>
  );
}

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};
