export default function DbSetup() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-1">Forte</h1>
      <p style={{ color: "var(--muted)" }} className="mb-5 text-sm">
        Falta conectar la base de datos para empezar a guardar tus registros.
      </p>
      <div
        className="rounded-2xl p-4 text-sm leading-relaxed"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <p className="font-semibold mb-2">Pasos (una sola vez):</p>
        <ol className="list-decimal ml-5 space-y-2" style={{ color: "var(--muted)" }}>
          <li>Crea un proyecto gratis en <span className="text-white">neon.com</span>.</li>
          <li>Copia el <span className="text-white">Connection string</span> (pooled).</li>
          <li>
            Crea el archivo <code className="text-white">.env.local</code> con:
            <pre
              className="mt-2 p-2 rounded-lg overflow-x-auto text-xs"
              style={{ background: "var(--bg)" }}
            >
              DATABASE_URL=&quot;postgresql://...&quot;
            </pre>
          </li>
          <li>
            En la terminal: <code className="text-white">npm run db:push</code> y luego{" "}
            <code className="text-white">npm run db:seed</code>.
          </li>
          <li>Recarga esta página.</li>
        </ol>
      </div>
    </div>
  );
}
