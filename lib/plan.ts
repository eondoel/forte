// Plan de arranque de Forte: rutina para principiante con TU equipo
// (Marcy Home Gym + mancuernas Weider) y presets de comida disponibles.
// Nota: tus mancuernas están marcadas en libras. Equivalencias útiles:
//   10 lb ≈ 4.5 kg · 15 lb ≈ 7 kg · 25 lb ≈ 11 kg

export type PlanExercise = {
  name: string;
  equipment: "Marcy" | "Mancuernas" | "Peso corporal";
  muscle: string;
  sets: number;
  reps: string;
  startWeight: string; // sugerencia de peso de inicio (para mostrar)
  kgHint: string; // número sugerido para el campo de kg ("" si es peso corporal)
  tip: string;
  howto: string;
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
  { name: "Crunch abdominal sentado", equipment: "Marcy", muscle: "Core" },
  { name: "Pullover sentado con polea", equipment: "Marcy", muscle: "Espalda" },
  { name: "Elevación de talones con mancuernas", equipment: "Mancuernas", muscle: "Pantorrilla" },
];

// Rutina A y B (cuerpo completo, alternadas 3x/semana).
export const ROUTINE: Record<"A" | "B", PlanExercise[]> = {
  A: [
    {
      name: "Press de pecho sentado",
      equipment: "Marcy",
      muscle: "Pecho",
      sets: 2,
      reps: "12-15",
      startWeight: "~15 kg (2.ª–3.ª placa)",
      kgHint: "15",
      tip: "Peso ligero, baja controlado.",
      howto:
        "Siéntate con la espalda pegada al respaldo y las manijas a la altura del pecho. Empuja hacia adelante hasta casi estirar los brazos (sin trabar los codos) y regresa lento contando 2-3 segundos. Respira: exhala al empujar.",
    },
    {
      name: "Jalón al pecho (Lat Pull-down)",
      equipment: "Marcy",
      muscle: "Espalda",
      sets: 2,
      reps: "12-15",
      startWeight: "~20 kg (3.ª–4.ª placa)",
      kgHint: "20",
      tip: "Lleva la barra al pecho, no atrás.",
      howto:
        "Sujeta la barra ancha, siéntate y fija las piernas bajo el rodillo. Jala la barra hacia la parte alta del pecho llevando los codos hacia abajo y atrás, apretando la espalda. Sube controlando, sin soltar de golpe.",
    },
    {
      name: "Sentadilla a silla con mancuerna",
      equipment: "Mancuernas",
      muscle: "Piernas",
      sets: 2,
      reps: "12",
      startWeight: "7 kg (mancuerna de 15 lb)",
      kgHint: "7",
      tip: "Baja hasta rozar la silla y sube.",
      howto:
        "De pie, pies al ancho de hombros, una mancuerna sostenida al pecho con ambas manos. Baja como si fueras a sentarte en una silla detrás de ti hasta rozarla, manteniendo el pecho arriba y la espalda recta. Sube empujando con los talones.",
    },
    {
      name: "Press de hombro con mancuernas",
      equipment: "Mancuernas",
      muscle: "Hombros",
      sets: 2,
      reps: "12",
      startWeight: "4.5 kg por mano (10 lb)",
      kgHint: "4.5",
      tip: "Empieza ligero (≈4-5 kg).",
      howto:
        "Sentado o de pie, mancuernas a la altura de las orejas con las palmas al frente. Empuja hacia arriba hasta estirar los brazos y baja lento. No arquees la espalda baja; aprieta el abdomen.",
    },
    {
      name: "Curl de bíceps sentado",
      equipment: "Marcy",
      muscle: "Bíceps",
      sets: 2,
      reps: "12-15",
      startWeight: "~10 kg (1.ª–2.ª placa)",
      kgHint: "10",
      tip: "Sin balancear el cuerpo.",
      howto:
        "Con los codos fijos, sube la barra/manija contrayendo el bíceps sin mover los codos ni impulsarte con la espalda. Baja lento hasta estirar casi por completo el brazo.",
    },
    {
      name: "Crunch abdominal en polea alta",
      equipment: "Marcy",
      muscle: "Core",
      sets: 2,
      reps: "15",
      startWeight: "~10 kg (1.ª–2.ª placa)",
      kgHint: "10",
      tip: "Usa el abdomen, no los brazos.",
      howto:
        "De rodillas frente a la polea alta, sujeta la cuerda junto a la cabeza. Redondea la espalda llevando los codos hacia los muslos usando el abdomen (no jales con los brazos). Regresa lento sin dejar que el peso te estire de golpe.",
    },
  ],
  B: [
    {
      name: "Aperturas / Pec Fly",
      equipment: "Marcy",
      muscle: "Pecho",
      sets: 2,
      reps: "12-15",
      startWeight: "~10 kg (1.ª–2.ª placa)",
      kgHint: "10",
      tip: "Aprieta el pecho al cerrar.",
      howto:
        "Sentado con la espalda apoyada, brazos abiertos sobre los cojines o manijas. Junta los brazos al frente en arco, como si abrazaras un árbol, apretando el pecho. Abre lento y controlado sin dejar que los brazos vayan demasiado atrás.",
    },
    {
      name: "Remo en polea baja",
      equipment: "Marcy",
      muscle: "Espalda",
      sets: 2,
      reps: "12-15",
      startWeight: "~20 kg (3.ª placa)",
      kgHint: "20",
      tip: "Codos pegados, aprieta la espalda.",
      howto:
        "Sentado, tira del agarre hacia tu abdomen llevando los codos hacia atrás y pegados al cuerpo, apretando la espalda. Estira los brazos lento al regresar, sin encorvar la espalda ni balancearte.",
    },
    {
      name: "Curl femoral",
      equipment: "Marcy",
      muscle: "Femoral",
      sets: 2,
      reps: "12-15",
      startWeight: "~10 kg (1.ª–2.ª placa)",
      kgHint: "10",
      tip: "Movimiento lento.",
      howto:
        "Engancha los tobillos bajo el rodillo (boca abajo o sentado según tu torre). Flexiona las rodillas llevando el rodillo hacia los glúteos, aprieta la parte trasera del muslo y baja lento.",
    },
    {
      name: "Extensión de piernas",
      equipment: "Marcy",
      muscle: "Cuádriceps",
      sets: 2,
      reps: "12-15",
      startWeight: "~15 kg (2.ª–3.ª placa)",
      kgHint: "15",
      tip: "No trabes la rodilla arriba.",
      howto:
        "Sentado, tobillos bajo el rodillo. Estira las piernas hacia el frente hasta casi rectas (sin trabar las rodillas de golpe), aprieta el muslo arriba 1 segundo y baja lento controlando el peso.",
    },
    {
      name: "Extensión de tríceps en polea",
      equipment: "Marcy",
      muscle: "Tríceps",
      sets: 2,
      reps: "12-15",
      startWeight: "~10 kg (1.ª–2.ª placa)",
      kgHint: "10",
      tip: "Codos fijos a los costados.",
      howto:
        "De pie frente a la polea alta, codos pegados a los costados. Empuja el agarre hacia abajo hasta estirar los brazos, aprieta el tríceps abajo y sube lento sin despegar los codos del cuerpo.",
    },
    {
      name: "Plancha",
      equipment: "Peso corporal",
      muscle: "Core",
      sets: 2,
      reps: "20-30 seg",
      startWeight: "Peso corporal",
      kgHint: "",
      tip: "Cadera alineada, no la subas.",
      howto:
        "Apóyate en los antebrazos y las puntas de los pies, con el cuerpo recto de la cabeza a los talones. Aprieta el abdomen y los glúteos, sin subir ni hundir la cadera. Aguanta el tiempo indicado respirando normal.",
    },
  ],
};

// Guía para los ejercicios del catálogo que NO están en la rutina A/B.
const EXTRA_HOWTO: Record<string, string> = {
  "Curl de bíceps con mancuernas":
    "De pie, una mancuerna en cada mano con los brazos estirados. Sube flexionando el codo hasta contraer el bíceps, sin mover los codos ni balancearte. Baja lento.",
  "Elevación frontal / lateral":
    "De pie, mancuernas a los costados. Súbelas al frente (o a los lados) hasta la altura de los hombros con los brazos casi rectos, y baja lento. Peso ligero.",
  "Peso muerto rumano con mancuernas":
    "De pie, mancuernas al frente de los muslos. Con la espalda recta, baja las mancuernas deslizándolas por las piernas empujando la cadera hacia atrás, siente el estirón atrás del muslo y sube apretando glúteos.",
  "Crunch abdominal sentado":
    "Sentado en la máquina, sujeta las manijas y flexiona el tronco hacia adelante contrayendo el abdomen (acerca el pecho a la cadera). Regresa lento sin dejar que el peso te jale de golpe. Exhala al encoger.",
  "Pullover sentado con polea":
    "Sentado frente a la polea alta, brazos casi rectos sujetando la barra arriba. Baja la barra en arco hacia tus muslos usando la espalda (dorsales), mantén los codos casi fijos, y sube lento controlando.",
  "Elevación de talones con mancuernas":
    "De pie con una mancuerna en cada mano, sube sobre las puntas de los pies lo más alto posible apretando la pantorrilla, aguanta 1 segundo arriba y baja lento. Puedes hacerlo en un escalón para más rango.",
};

// Devuelve la guía "cómo se hace" de un ejercicio por su nombre.
export function getHowto(name: string): string {
  for (const day of ["A", "B"] as const) {
    const found = ROUTINE[day].find((e) => e.name === name);
    if (found) return found.howto;
  }
  return EXTRA_HOWTO[name] ?? "";
}

// Construye un ejercicio de plan a partir de un ejercicio del catálogo (para la rutina C).
// Reutiliza los datos de la rutina A/B si el ejercicio ya existe ahí.
export function planFromCatalog(
  name: string,
  equipment: string,
  muscle: string,
  sets: number,
  reps: string
): PlanExercise {
  for (const day of ["A", "B"] as const) {
    const f = ROUTINE[day].find((e) => e.name === name);
    if (f) return { ...f, sets, reps };
  }
  return {
    name,
    equipment: equipment as PlanExercise["equipment"],
    muscle,
    sets,
    reps,
    startWeight: "según sensación",
    kgHint: "",
    tip: "",
    howto: getHowto(name),
  };
}

// Igual que planFromCatalog, pero usa el peso (kg) que tú definiste para la rutina C.
export function planFromCustom(
  name: string,
  equipment: string,
  muscle: string,
  sets: number,
  reps: string,
  kg: number
): PlanExercise {
  return {
    name,
    equipment: equipment as PlanExercise["equipment"],
    muscle,
    sets,
    reps,
    startWeight: kg > 0 ? `${kg} kg` : "según sensación / peso corporal",
    kgHint: kg > 0 ? String(kg) : "",
    tip: "",
    howto: getHowto(name),
  };
}

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
  { type: "snack", description: "Yogur griego con fresas y granola", calories: 200, proteinG: 15 },
  { type: "snack", description: "Manzana con crema de cacahuate", calories: 200, proteinG: 6 },
  { type: "snack", description: "Chocolate amargo 70% (2 cuadros)", calories: 110, proteinG: 2 },
  { type: "snack", description: "Palomitas naturales (1 taza)", calories: 90, proteinG: 2 },
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
