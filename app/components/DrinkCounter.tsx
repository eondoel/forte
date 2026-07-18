"use client";

import { useTransition } from "react";
import { adjustDrink } from "../actions";

export default function DrinkCounter({
  water,
  soda,
  waterGoal,
}: {
  water: number;
  soda: number;
  waterGoal: number;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="grid grid-cols-2 gap-3">
      <Counter
        emoji="💧"
        label="Agua"
        value={water}
        goal={`meta ${waterGoal}`}
        color="var(--good)"
        pending={pending}
        onChange={(delta) => start(() => adjustDrink("water", delta))}
      />
      <Counter
        emoji="🥤"
        label="Refresco"
        value={soda}
        goal={soda === 0 ? "¡cero! 🎯" : "baja a 0"}
        color={soda === 0 ? "var(--good)" : "var(--accent-2)"}
        pending={pending}
        onChange={(delta) => start(() => adjustDrink("soda", delta))}
      />
    </div>
  );
}

function Counter({
  emoji,
  label,
  value,
  goal,
  color,
  pending,
  onChange,
}: {
  emoji: string;
  label: string;
  value: number;
  goal: string;
  color: string;
  pending: boolean;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: "var(--card-2)" }}>
      <div className="text-sm mb-1">
        {emoji} {label}
      </div>
      <div className="text-3xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>
        {goal}
      </div>
      <div className="flex gap-2 justify-center">
        <button
          disabled={pending}
          onClick={() => onChange(-1)}
          className="w-9 h-9 rounded-full text-lg font-bold disabled:opacity-40"
          style={{ background: "var(--bg)" }}
        >
          −
        </button>
        <button
          disabled={pending}
          onClick={() => onChange(1)}
          className="w-9 h-9 rounded-full text-lg font-bold disabled:opacity-40"
          style={{ background: "var(--accent)", color: "white" }}
        >
          +
        </button>
      </div>
    </div>
  );
}
