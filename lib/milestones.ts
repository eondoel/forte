// Metas por fecha (hitos). Se muestran en la app como "marcas" de progreso.
// Recalculadas el 9 sep 2026 sobre el ritmo real (~0.85 kg/sem observado,
// proyectado conservador a ~0.7 kg/sem) desde 85.5 kg / cintura 101 cm.
export type Milestone = {
  date: string; // YYYY-MM-DD objetivo
  label: string;
  targetKg: number;
  targetWaist: number; // cm
};

export const MILESTONES: Milestone[] = [
  { date: "2026-09-15", label: "Panza más plana", targetKg: 85, targetWaist: 100 },
  { date: "2026-10-11", label: "Te ves bien con playera", targetKg: 82.5, targetWaist: 97 },
  { date: "2026-11-15", label: "Cintura fuera de riesgo", targetKg: 79, targetWaist: 93 },
  { date: "2026-12-27", label: "Primeros cuadritos", targetKg: 76, targetWaist: 89 },
];

// Fecha corta en español, ej. "4 oct".
export function shortDate(iso: string): string {
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${meses[m - 1]}`;
}
