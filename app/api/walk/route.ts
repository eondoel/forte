import { NextRequest, NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { walk } from "@/db/schema";
import { today } from "@/lib/date";

// Endpoint para registrar caminatas desde un Atajo de Apple (Apple Watch / Salud).
// El Atajo debe hacer un POST con:
//   Header:  Authorization: Bearer <WALK_API_TOKEN>
//   Body JSON: { "minutes": 60, "date": "2026-07-17" }   (date es opcional)
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
  const minutes = Math.round(Number(body?.minutes));
  if (!minutes || minutes <= 0) {
    return NextResponse.json({ error: "minutes debe ser un número mayor a 0" }, { status: 400 });
  }

  const date = typeof body?.date === "string" && body.date ? body.date : today();
  await db.insert(walk).values({ date, minutes, note: "Apple Watch" });

  return NextResponse.json({ ok: true, minutes, date });
}
