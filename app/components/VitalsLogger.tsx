"use client";

import { useState, useTransition } from "react";
import { addVitals } from "../actions";

export default function VitalsLogger() {
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [glu, setGlu] = useState("");
  const [pending, start] = useTransition();

  function save() {
    if (!sys && !dia && !glu) return;
    start(async () => {
      await addVitals(parseInt(sys) || undefined, parseInt(dia) || undefined, parseInt(glu) || undefined);
      setSys("");
      setDia("");
      setGlu("");
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input inputMode="numeric" placeholder="Sistólica" value={sys} onChange={(e) => setSys(e.target.value)} className="flex-1 rounded-xl px-3 py-2 outline-none text-sm" style={inp} />
        <input inputMode="numeric" placeholder="Diastólica" value={dia} onChange={(e) => setDia(e.target.value)} className="flex-1 rounded-xl px-3 py-2 outline-none text-sm" style={inp} />
        <input inputMode="numeric" placeholder="Glucosa" value={glu} onChange={(e) => setGlu(e.target.value)} className="flex-1 rounded-xl px-3 py-2 outline-none text-sm" style={inp} />
      </div>
      <button
        onClick={save}
        disabled={pending}
        className="w-full py-2.5 rounded-xl font-semibold disabled:opacity-50 text-sm"
        style={{ background: "var(--accent)", color: "white" }}
      >
        Registrar medición
      </button>
    </div>
  );
}

const inp: React.CSSProperties = { background: "var(--card-2)", color: "var(--text)" };
