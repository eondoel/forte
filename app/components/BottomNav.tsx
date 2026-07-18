"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/entreno", label: "Entreno", icon: "💪" },
  { href: "/comida", label: "Comida", icon: "🍽️" },
  { href: "/progreso", label: "Progreso", icon: "📈" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[560px] border-t flex justify-around py-2 pb-[calc(env(safe-area-inset-bottom)+8px)] z-50"
    >
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs"
            style={{ color: active ? "var(--accent-2)" : "var(--muted)" }}
          >
            <span className="text-xl leading-none">{t.icon}</span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
