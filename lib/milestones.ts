// Metas por fecha (hitos). Se muestran en la app como "marcas" de progreso.
export type Milestone = {
  date: string; // YYYY-MM-DD objetivo
  label: string;
  targetKg: number;
  targetWaist: number; // cm
};

export const MILESTONES: Milestone[] = [
  { date: "2026-10-04", label: "Panza más plana", targetKg: 82.5, targetWaist: 95 },
  { date: "2026-11-01", label: "Te ves bien con playera", targetKg: 80, targetWaist: 94 },
  { date: "2026-12-20", label: "Confianza en la piscina", targetKg: 76, targetWaist: 89 },
];

// Fecha corta en español, ej. "4 oct".
export function shortDate(iso: string): string {
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${meses[m - 1]}`;
}
