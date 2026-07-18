"use server";

import { revalidatePath } from "next/cache";
import { eq, sql as dsql } from "drizzle-orm";
import { db } from "@/db";
import {
  weightLog,
  meal,
  drinkLog,
  walk,
  vitals,
  workoutSession,
  workoutSet,
} from "@/db/schema";
import { today } from "@/lib/date";

export async function addWeight(weightKg: number, waistCm?: number) {
  if (!weightKg) return;
  await db.insert(weightLog).values({
    date: today(),
    weightKg,
    waistCm: waistCm ?? null,
  });
  revalidatePath("/");
  revalidatePath("/progreso");
}

export async function addMeal(
  type: string,
  description: string,
  calories?: number,
  proteinG?: number
) {
  if (!description) return;
  await db.insert(meal).values({
    date: today(),
    type,
    description,
    calories: calories ?? null,
    proteinG: proteinG ?? null,
  });
  revalidatePath("/comida");
  revalidatePath("/");
}

export async function deleteMeal(id: number) {
  await db.delete(meal).where(eq(meal.id, id));
  revalidatePath("/comida");
  revalidatePath("/");
}

// Suma (o resta) un vaso de agua o refresco para hoy. Upsert por fecha.
export async function adjustDrink(kind: "water" | "soda", delta: number) {
  const d = today();
  const existing = await db.select().from(drinkLog).where(eq(drinkLog.date, d));
  if (existing.length === 0) {
    await db.insert(drinkLog).values({
      date: d,
      waterCups: kind === "water" ? Math.max(0, delta) : 0,
      sodaCups: kind === "soda" ? Math.max(0, delta) : 0,
    });
  } else {
    const row = existing[0];
    const next = {
      waterCups: kind === "water" ? Math.max(0, row.waterCups + delta) : row.waterCups,
      sodaCups: kind === "soda" ? Math.max(0, row.sodaCups + delta) : row.sodaCups,
    };
    await db.update(drinkLog).set(next).where(eq(drinkLog.date, d));
  }
  revalidatePath("/comida");
  revalidatePath("/");
}

export async function addWalk(minutes: number) {
  if (!minutes) return;
  await db.insert(walk).values({ date: today(), minutes });
  revalidatePath("/");
  revalidatePath("/progreso");
}

export async function addVitals(
  systolic?: number,
  diastolic?: number,
  glucose?: number
) {
  await db.insert(vitals).values({
    date: today(),
    systolic: systolic ?? null,
    diastolic: diastolic ?? null,
    glucose: glucose ?? null,
  });
  revalidatePath("/progreso");
}

export type SetInput = { exerciseId: number; reps: number; weightLb: number };

export async function saveWorkout(dayLabel: string, sets: SetInput[]) {
  const valid = sets.filter((s) => s.reps > 0);
  if (valid.length === 0) return;
  const [session] = await db
    .insert(workoutSession)
    .values({ date: today(), dayLabel })
    .returning({ id: workoutSession.id });

  await db.insert(workoutSet).values(
    valid.map((s, i) => ({
      sessionId: session.id,
      exerciseId: s.exerciseId,
      setNumber: i + 1,
      reps: s.reps,
      weightLb: s.weightLb,
    }))
  );
  revalidatePath("/entreno");
  revalidatePath("/");
}

// Cuenta de sesiones de entrenamiento (para la racha en el tablero).
export async function workoutCount(): Promise<number> {
  const r = await db
    .select({ n: dsql<number>`count(*)` })
    .from(workoutSession);
  return Number(r[0]?.n ?? 0);
}
