import { NextRequest, NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { walk, activeEnergy } from "@/db/schema";
import { today } from "@/lib/date";

// Registra datos desde un Atajo de Apple (Apple Watch / Salud).
// Acepta los datos por query params (recomendado, evita el bloqueo de Health de iOS)
// o por body JSON. Auth por token en query (?token=) o header Authorization: Bearer.
//   .../api/walk?token=XXX&minutes=47&kcal=560&date=2026-07-18
// minutes y kcal son opcionales, pero debe venir al menos uno mayor a 0.

async function handle(req: NextRequest) {
  const token = process.env.WALK_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "WALK_API_TOKEN no configurado" }, { status: 500 });
  }

  const url = new URL(req.url);
  const header = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const queryToken = url.searchParams.get("token");
  if (header !== token && queryToken !== token) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  if (!isDbConfigured) {
    return NextResponse.json({ error: "base de datos no configurada" }, { status: 500 });
  }

  // Los valores pueden venir por query o por body JSON.
  let body: Record<string, unknown> = {};
  if (req.method === "POST") {
    body = await req.json().catch(() => ({}));
  }
  const pick = (key: string) => url.searchParams.get(key) ?? body[key];

  const minutes = Math.round(Number(pick("minutes"))) || 0;
  const kcal = Math.round(Number(pick("kcal"))) || 0;

  if (minutes <= 0 && kcal <= 0) {
    return NextResponse.json(
      { error: "manda al menos minutes o kcal mayor a 0" },
      { status: 400 }
    );
  }

  const rawDate = pick("date");
  const date = typeof rawDate === "string" && rawDate ? rawDate : today();

  if (minutes > 0) {
    await db.insert(walk).values({ date, minutes, note: "Apple Watch" });
  }
  if (kcal > 0) {
    await db
      .insert(activeEnergy)
      .values({ date, kcal })
      .onConflictDoUpdate({ target: activeEnergy.date, set: { kcal } });
  }

  return NextResponse.json({ ok: true, minutes, kcal, date });
}

export const GET = handle;
export const POST = handle;
