// Siembra inicial: perfil + catálogo de ejercicios + peso de arranque.
// Ejecuta con:  npm run db:seed   (necesita DATABASE_URL en .env.local)
// El entorno se carga con `tsx --env-file=.env.local` (ver script db:seed),
// así DATABASE_URL ya existe cuando se evalúa ./index.
import { db, isDbConfigured } from "./index";
import { profile, exercise, weightLog } from "./schema";
import { EXERCISE_CATALOG } from "../lib/plan";

async function main() {
  if (!isDbConfigured) {
    console.error("❌ Falta DATABASE_URL. Copia .env.example a .env.local y pega tu cadena de Neon.");
    process.exit(1);
  }

  const existing = await db.select().from(profile);
  if (existing.length === 0) {
    await db.insert(profile).values({
      name: "Forte",
      heightCm: 175,
      startWeightKg: 93.5,
      goalWeightKg: 80,
      birthYear: 1986,
    });
    console.log("✅ Perfil creado.");
  }

  const existingEx = await db.select().from(exercise);
  if (existingEx.length === 0) {
    await db.insert(exercise).values(EXERCISE_CATALOG);
    console.log(`✅ ${EXERCISE_CATALOG.length} ejercicios sembrados.`);
  }

  const existingW = await db.select().from(weightLog);
  if (existingW.length === 0) {
    await db.insert(weightLog).values({
      date: new Date().toISOString().slice(0, 10),
      weightKg: 93.5,
      note: "Peso de arranque",
    });
    console.log("✅ Peso de arranque registrado.");
  }

  console.log("🎉 Listo.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
