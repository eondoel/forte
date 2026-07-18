import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

// Si no hay base de datos configurada, el resto de la app puede detectarlo
// y mostrar la pantalla de "conecta tu base de datos" en lugar de tronar.
export const isDbConfigured = Boolean(url);

const sql = url ? neon(url) : null;

export const db = sql
  ? drizzle(sql, { schema })
  : (null as unknown as ReturnType<typeof drizzle>);

export { schema };
