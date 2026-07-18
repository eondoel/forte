import { NextRequest, NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { walk, activeEnergy } from "@/db/schema";
import { today } from "@/lib/date";

// Endpoint para registrar datos desde un Atajo de Apple (Apple Watch / Salud).
// El Atajo hace un POST con:
//   Header:  Authorization: Bearer <WALK_API_TOKEN>
//   Body JSON: { "minutes": 60, "kcal": 450, "date": "2026-07-18" }
//   - minutes: minutos de ejercicio (opcional)
//   - kcal: calorías activas del día (opcional)
//   - date: opcional (por defecto hoy)
// Debe venir al menos uno de "minutes" o "kcal".
export async function POST(req: NextRequest) {
  const token = process.env.WALK_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "WALK_API_TOKEN no configurado" }, { status: 500 });
  }

  const header = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const queryToken = new URL(req.url).searchParams.get("token");
  if (header !== token && queryToken !== token) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  if (!isDbConfigured) {
    return NextResponse.json({ error: "base de datos no configurada" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const minutes = Math.round(Number(body?.minutes)) || 0;
  const kcal = Math.round(Number(body?.kcal)) || 0;

  if (minutes <= 0 && kcal <= 0) {
    return NextResponse.json(
      { error: "manda al menos minutes o kcal mayor a 0" },
      { status: 400 }
    );
  }

  const date = typeof body?.date === "string" && body.date ? body.date : today();

  if (minutes > 0) {
    await db.insert(walk).values({ date, minutes, note: "Apple Watch" });
  }

  // Calorías activas: una fila por día; si ya existe, se actualiza.
  if (kcal > 0) {
    await db
      .insert(activeEnergy)
      .values({ date, kcal })
      .onConflictDoUpdate({ target: activeEnergy.date, set: { kcal } });
  }

  return NextResponse.json({ ok: true, minutes, kcal, date });
}
