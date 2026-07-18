# Forte 💪

App personal de ejercicio y comida para bajar de peso **sano y poco a poco**, usando tu equipo en casa (Marcy Home Gym + mancuernas Weider) y caminatas.

- **Stack:** Next.js (App Router) · Neon (Postgres) · Drizzle ORM · Tailwind v4
- **Diseño:** mobile-first (pensado para abrirse desde el celular)

## Pantallas

- **Inicio** — peso actual vs meta, contador de refresco/agua, calorías, proteína, caminata y racha.
- **Entreno** — rutina A/B con tu equipo, registro de series/reps/peso, y botones de caminata.
- **Comida** — presets de un toque (tu comida disponible), calorías y proteína del día, refresco vs agua.
- **Progreso** — gráfica de peso y cintura, registro de presión y glucosa.

## Puesta en marcha (una vez)

1. **Crea la base de datos en Neon**
   - Entra a [neon.com](https://neon.com), crea un proyecto gratis.
   - Copia el *Connection string* (pooled).

2. **Configura el entorno**
   ```bash
   cp .env.example .env.local
   # pega tu DATABASE_URL dentro de .env.local
   ```

3. **Crea las tablas y siembra datos iniciales**
   ```bash
   npm run db:push    # crea las tablas en Neon
   npm run db:seed    # perfil + catálogo de ejercicios + peso de arranque
   ```

4. **Corre la app**
   ```bash
   npm run dev
   ```
   - En tu compu: http://localhost:3000
   - **En tu celular (misma WiFi):** http://TU_IP_LOCAL:3000
     (obtén tu IP con `ipconfig getifaddr en0` en Mac)

## Desplegar en Vercel (para abrirla desde cualquier lado)

1. Sube el código a GitHub.
2. En [vercel.com](https://vercel.com) importa el repo.
3. Agrega la variable de entorno `DATABASE_URL` (la misma de Neon).
4. Deploy. Vercel te da una URL que puedes guardar en la pantalla de inicio del celular.

## Notas de salud

Guía general de estilo de vida, no reemplaza a un médico. Con IMC ~30 y antecedentes
familiares (hipertensión y diabetes), conviene un chequeo de presión y glucosa antes de
empezar y registrar esos números en la pestaña **Progreso**.
