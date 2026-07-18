// Fecha local de hoy en formato YYYY-MM-DD.
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
