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

// Estimaciones conservadoras de gasto por ejercicio.
export const WALK_KCAL_PER_MIN = 5; // caminata a buen paso
export const WORKOUT_KCAL = 130; // por sesión de fuerza (principiante)

export function exerciseKcal(walkMinutes: number, workoutSessions: number): number {
  return Math.round(walkMinutes * WALK_KCAL_PER_MIN + workoutSessions * WORKOUT_KCAL);
}

// 1 kg de grasa ≈ 7700 kcal.
export const KCAL_PER_KG_FAT = 7700;

export function kgFromKcal(kcal: number): number {
  return kcal / KCAL_PER_KG_FAT;
}
