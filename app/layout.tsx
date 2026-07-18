import type { Metadata, Viewport } from "next";
import "./globals.css";
import TopNav from "./components/TopNav";

export const metadata: Metadata = {
  title: "Forte",
  description: "Tu app de ejercicio y comida para bajar de peso, sano y poco a poco.",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  );
}
