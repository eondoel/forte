"use server";

import { revalidatePath } from "next/cache";
import { eq, sql as dsql } from "drizzle-orm";
import { db } from "@/db";
import {
  weightLog,
  meal,
  drinkLog,
  walk,
  workoutSession,
  workoutSet,
  routineExercise,
  savedFood,
} from "@/db/schema";
import { today } from "@/lib/date";
import { FOODS, type FoodResult } from "@/lib/foods";

// Busca alimentos: primero el catálogo local, luego Open Food Facts (gratis, sin cuenta).
export async function searchFood(query: string): Promise<FoodResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const ql = q.toLowerCase();
  const local: FoodResult[] = FOODS.filter((f) => f.name.toLowerCase().includes(ql)).map(
    (f) => ({ name: f.name, unit: f.unit, kcal: f.kcal, protein: f.protein, source: "local" })
  );

  let off: FoodResult[] = [];
  try {
    const url =
      "https://es.openfoodfacts.org/cgi/search.pl?search_terms=" +
      encodeURIComponent(q) +
      "&search_simple=1&action=process&json=1&page_size=20&fields=product_name,brands,nutriments";
    const res = await fetch(url, {
      headers: { "User-Agent": "Forte/1.0 (app personal de peso)" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      const seen = new Set(local.map((l) => l.name.toLowerCase()));
      off = ((data?.products as unknown[]) ?? [])
        .map((p): FoodResult | null => {
          const prod = p as {
            product_name?: string;
            brands?: string;
            nutriments?: Record<string, number>;
          };
          const kcal100 = prod.nutriments?.["energy-kcal_100g"];
          const name = (prod.product_name ?? "").trim();
          if (!kcal100 || kcal100 <= 0 || !name) return null;
          const prot100 = prod.nutriments?.["proteins_100g"] ?? 0;
          const brand = (prod.brands ?? "").split(",")[0]?.trim();
          const label = brand ? `${name} (${brand})` : name;
          if (seen.has(label.toLowerCase())) return null;
          seen.add(label.toLowerCase());
          return { name: label, unit: "g", kcal: kcal100 / 100, protein: prot100 / 100, source: "off" };
        })
        .filter((x): x is FoodResult => x !== null)
        .slice(0, 12);
    }
  } catch {
    // Si Open Food Facts falla o tarda, devolvemos solo los locales.
  }

  return [...local, ...off].slice(0, 15);
}

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

// Guarda una comida para reusarla después (por 1 unidad).
export async function addSavedFood(
  name: string,
  unit: string,
  kcal: number,
  protein: number
) {
  if (!name.trim() || kcal <= 0) return;
  await db.insert(savedFood).values({
    name: name.trim(),
    unit: unit || "porción",
    kcal,
    protein: protein || 0,
  });
  revalidatePath("/comida");
}

export async function deleteSavedFood(id: number) {
  await db.delete(savedFood).where(eq(savedFood.id, id));
  revalidatePath("/comida");
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

export type SetInput = { exerciseId: number; reps: number; weightKg: number };

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
      weightKg: s.weightKg,
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

// Borra una sesión de entreno completa (sus series se borran en cascada).
export async function deleteWorkoutSession(id: number) {
  await db.delete(workoutSession).where(eq(workoutSession.id, id));
  revalidatePath("/entreno");
  revalidatePath("/");
}

// Edita una serie (reps y peso) de un entreno ya guardado.
export async function updateWorkoutSet(id: number, reps: number, weightKg: number) {
  if (reps <= 0) {
    await db.delete(workoutSet).where(eq(workoutSet.id, id));
  } else {
    await db.update(workoutSet).set({ reps, weightKg }).where(eq(workoutSet.id, id));
  }
  revalidatePath("/entreno");
}

// Guarda (reemplaza) la rutina personalizada "C".
export type RoutineItem = { exerciseId: number; sets: number; reps: string; kg: number };

export async function saveCustomRoutine(items: RoutineItem[]) {
  await db.delete(routineExercise).where(eq(routineExercise.label, "C"));
  const valid = items.filter((i) => i.exerciseId > 0);
  if (valid.length > 0) {
    await db.insert(routineExercise).values(
      valid.map((i, idx) => ({
        label: "C",
        exerciseId: i.exerciseId,
        position: idx,
        sets: i.sets > 0 ? i.sets : 2,
        reps: i.reps || "12-15",
        kg: i.kg > 0 ? i.kg : 0,
      }))
    );
  }
  revalidatePath("/entreno");
}
