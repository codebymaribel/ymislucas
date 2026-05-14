import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getThemeAction } from "../lib/actions/theme.action";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "y mis lucas? - Controlá tus finanzas en serio",
  description: "La landing page de finanzas más honesta de latam.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeAction();

  // Resolve "system" server-side — defaults to light (OS unknown on server)
  const resolvedClass = theme === "dark" ? "dark" : "light";

  return (
    <html lang="en" className={resolvedClass}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
