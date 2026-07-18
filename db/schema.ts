import {
  pgTable,
  serial,
  text,
  integer,
  real,
  date,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// Perfil del usuario (una sola fila). Guarda datos base y metas.
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Forte"),
  heightCm: real("height_cm").notNull().default(175),
  startWeightKg: real("start_weight_kg").notNull().default(93.5),
  goalWeightKg: real("goal_weight_kg").notNull().default(80),
  birthYear: integer("birth_year").notNull().default(1986),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Registro de peso y cintura (idealmente semanal).
export const weightLog = pgTable("weight_log", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  weightKg: real("weight_kg").notNull(),
  waistCm: real("waist_cm"),
  note: text("note"),
});

// Presión y glucosa (para vigilar el riesgo familiar).
export const vitals = pgTable("vitals", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  systolic: integer("systolic"),
  diastolic: integer("diastolic"),
  glucose: integer("glucose"),
  note: text("note"),
});

// Catálogo de ejercicios disponibles con tu equipo.
export const exercise = pgTable("exercise", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  equipment: text("equipment").notNull(), // "Marcy" | "Mancuernas" | "Peso corporal"
  muscle: text("muscle").notNull(),
});

// Sesión de entrenamiento (un día que fuiste a la torre/mancuernas).
export const workoutSession = pgTable("workout_session", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  dayLabel: text("day_label").notNull().default("A"), // rutina A / B
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Cada serie realizada dentro de una sesión.
export const workoutSet = pgTable("workout_set", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .notNull()
    .references(() => workoutSession.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercise.id),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps").notNull(),
  weightLb: real("weight_lb").notNull().default(0),
});

// Comidas registradas.
export const meal = pgTable("meal", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  type: text("type").notNull(), // desayuno | comida | cena | snack
  description: text("description").notNull(),
  calories: integer("calories"),
  proteinG: integer("protein_g"),
});

// Conteo diario de bebidas: agua vs refresco (tu palanca #1).
export const drinkLog = pgTable("drink_log", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  waterCups: integer("water_cups").notNull().default(0),
  sodaCups: integer("soda_cups").notNull().default(0),
});

// Caminatas / trotes.
export const walk = pgTable("walk", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  minutes: integer("minutes").notNull(),
  note: text("note"),
});

export type Exercise = typeof exercise.$inferSelect;
export type WeightLog = typeof weightLog.$inferSelect;
export type Meal = typeof meal.$inferSelect;
