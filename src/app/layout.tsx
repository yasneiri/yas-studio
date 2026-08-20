import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Yas Studio — AI Video & Image Generation", description: "Open-source AI studio. 100+ models. MIT licensed." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className="dark"><body className="min-h-screen">{children}</body></html>);
}
