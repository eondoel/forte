// Cálculo de gasto energético y balance de calorías.

export function ageFrom(birthYear: number, year = new Date().getFullYear()): number {
  return year - birthYear;
}

// Metabolismo basal (Mifflin-St Jeor, hombre).
export function bmrMale(weightKg: number, heightCm: number, age: number): number {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
}

// Gasto de mantenimiento SIN ejercicio (base sedentaria). El ejercicio se suma aparte.
export function maintenanceKcal(weightKg: number, heightCm: number, birthYear: number): number {
  return Math.round(bmrMale(weightKg, heightCm, ageFrom(birthYear)) * 1.2);
}

// Estimaciones de gasto por ejercicio.
export const WALK_KCAL_PER_MIN = 5; // registros viejos en minutos (y Apple Watch)
export const WALK_KCAL_PER_KG_KM = 0.55; // caminar ~0.5-0.6 kcal por kg por km
export const JOG_KCAL_PER_KG_KM = 1.0; // trotar ~1 kcal por kg por km
export const WORKOUT_KCAL = 130; // por sesión de fuerza

// Calorías de cardio medido en km (depende del peso: más peso, más gasto por km).
export function cardioKcal(kmWalk: number, kmJog: number, weightKg: number): number {
  return kmWalk * WALK_KCAL_PER_KG_KM * weightKg + kmJog * JOG_KCAL_PER_KG_KM * weightKg;
}

export function exerciseKcal(
  walkMinutes: number,
  workoutSessions: number,
  kmWalk = 0,
  kmJog = 0,
  weightKg = 85
): number {
  return Math.round(
    walkMinutes * WALK_KCAL_PER_MIN +
      cardioKcal(kmWalk, kmJog, weightKg) +
      workoutSessions * WORKOUT_KCAL
  );
}

// 1 kg de grasa ≈ 7700 kcal.
export const KCAL_PER_KG_FAT = 7700;

export function kgFromKcal(kcal: number): number {
  return kcal / KCAL_PER_KG_FAT;
}
