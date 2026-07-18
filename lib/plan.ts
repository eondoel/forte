// Plan de arranque de Forte: rutina para principiante con TU equipo
// (Marcy Home Gym + mancuernas Weider) y presets de comida disponibles.

export type PlanExercise = {
  name: string;
  equipment: "Marcy" | "Mancuernas" | "Peso corporal";
  muscle: string;
  sets: number;
  reps: string;
  tip: string;
};

// Catálogo completo de ejercicios disponibles (se siembra en la BD).
export const EXERCISE_CATALOG: { name: string; equipment: string; muscle: string }[] = [
  { name: "Press de pecho sentado", equipment: "Marcy", muscle: "Pecho" },
  { name: "Aperturas / Pec Fly", equipment: "Marcy", muscle: "Pecho" },
  { name: "Jalón al pecho (Lat Pull-down)", equipment: "Marcy", muscle: "Espalda" },
  { name: "Remo en polea baja", equipment: "Marcy", muscle: "Espalda" },
  { name: "Curl de bíceps sentado", equipment: "Marcy", muscle: "Bíceps" },
  { name: "Extensión de tríceps en polea", equipment: "Marcy", muscle: "Tríceps" },
  { name: "Extensión de piernas", equipment: "Marcy", muscle: "Cuádriceps" },
  { name: "Curl femoral", equipment: "Marcy", muscle: "Femoral" },
  { name: "Crunch abdominal en polea alta", equipment: "Marcy", muscle: "Core" },
  { name: "Curl de bíceps con mancuernas", equipment: "Mancuernas", muscle: "Bíceps" },
  { name: "Press de hombro con mancuernas", equipment: "Mancuernas", muscle: "Hombros" },
  { name: "Elevación frontal / lateral", equipment: "Mancuernas", muscle: "Hombros" },
  { name: "Sentadilla a silla con mancuerna", equipment: "Mancuernas", muscle: "Piernas" },
  { name: "Peso muerto rumano con mancuernas", equipment: "Mancuernas", muscle: "Femoral" },
  { name: "Plancha", equipment: "Peso corporal", muscle: "Core" },
];

// Rutina A y B (cuerpo completo, alternadas 3x/semana).
export const ROUTINE: Record<"A" | "B", PlanExercise[]> = {
  A: [
    { name: "Press de pecho sentado", equipment: "Marcy", muscle: "Pecho", sets: 2, reps: "12-15", tip: "Peso ligero, baja controlado." },
    { name: "Jalón al pecho (Lat Pull-down)", equipment: "Marcy", muscle: "Espalda", sets: 2, reps: "12-15", tip: "Lleva la barra al pecho, no atrás." },
    { name: "Sentadilla a silla con mancuerna", equipment: "Mancuernas", muscle: "Piernas", sets: 2, reps: "12", tip: "Baja hasta rozar la silla y sube." },
    { name: "Press de hombro con mancuernas", equipment: "Mancuernas", muscle: "Hombros", sets: 2, reps: "12", tip: "Empieza con 8-10 lb." },
    { name: "Curl de bíceps sentado", equipment: "Marcy", muscle: "Bíceps", sets: 2, reps: "12-15", tip: "Sin balancear el cuerpo." },
    { name: "Crunch abdominal en polea alta", equipment: "Marcy", muscle: "Core", sets: 2, reps: "15", tip: "Redondea la espalda al bajar." },
  ],
  B: [
    { name: "Aperturas / Pec Fly", equipment: "Marcy", muscle: "Pecho", sets: 2, reps: "12-15", tip: "Aprieta el pecho al cerrar." },
    { name: "Remo en polea baja", equipment: "Marcy", muscle: "Espalda", sets: 2, reps: "12-15", tip: "Codos pegados, aprieta la espalda." },
    { name: "Curl femoral", equipment: "Marcy", muscle: "Femoral", sets: 2, reps: "12-15", tip: "Movimiento lento." },
    { name: "Extensión de piernas", equipment: "Marcy", muscle: "Cuádriceps", sets: 2, reps: "12-15", tip: "No trabes la rodilla arriba." },
    { name: "Extensión de tríceps en polea", equipment: "Marcy", muscle: "Tríceps", sets: 2, reps: "12-15", tip: "Codos fijos a los costados." },
    { name: "Plancha", equipment: "Peso corporal", muscle: "Core", sets: 2, reps: "20-30 seg", tip: "Cadera alineada, no la subas." },
  ],
};

// Presets de comida que SIEMPRE tienes a la mano (para registrar en 1 toque).
export const MEAL_PRESETS: {
  type: "desayuno" | "comida" | "cena" | "snack";
  description: string;
  calories: number;
  proteinG: number;
}[] = [
  { type: "desayuno", description: "Pechuga asada + verduras + frijoles", calories: 420, proteinG: 42 },
  { type: "comida", description: "Pechuga asada + verduras + frijoles + pan + queso", calories: 620, proteinG: 50 },
  { type: "cena", description: "Pechuga asada + verduras + queso", calories: 380, proteinG: 40 },
  { type: "snack", description: "Yogur griego natural", calories: 130, proteinG: 15 },
  { type: "snack", description: "Fruta (manzana / plátano)", calories: 95, proteinG: 1 },
  { type: "comida", description: "Comida rápida (día libre 1x/sem)", calories: 900, proteinG: 30 },
];

// Metas diarias sencillas para el tablero.
export const DAILY_GOALS = {
  calories: 1800,
  proteinG: 140,
  waterCups: 8, // vasos de ~250 ml
  maxSodaCups: 0, // meta: cero refresco normal
  walkMinutes: 30,
};
