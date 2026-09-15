import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Z3R0 MUSIC — Sound beyond the signal",
  description: "Discover the next frequency with Z3R0 MUSIC.",
  icons: { icon: "/app-icon.svg" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
