// Fecha de "hoy" en formato YYYY-MM-DD, según la zona horaria de México.
// Usamos una zona fija para que el día no cambie a media tarde (evita el desfase de UTC).
export function today(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
  }).format(new Date());
}
