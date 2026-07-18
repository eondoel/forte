"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Inicio" },
  { href: "/entreno", label: "Entreno" },
  { href: "/comida", label: "Comida" },
  { href: "/progreso", label: "Progreso" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[560px] border-t flex justify-around py-3 pb-[calc(env(safe-area-inset-bottom)+10px)] z-50"
    >
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className="flex-1 text-center text-sm font-medium"
            style={{ color: active ? "var(--accent-2)" : "var(--muted)" }}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
