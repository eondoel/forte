"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Inicio" },
  { href: "/entreno", label: "Entreno" },
  { href: "/comida", label: "Comida" },
  { href: "/progreso", label: "Progreso" },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <nav
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
      className="sticky top-0 z-50 border-b flex justify-around pt-[calc(env(safe-area-inset-top)+10px)] pb-3"
    >
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className="flex-1 text-center text-sm font-semibold py-1"
            style={{ color: active ? "var(--accent-2)" : "var(--muted)" }}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
