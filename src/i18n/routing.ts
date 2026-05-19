import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"] as const,
  defaultLocale: "es",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number]; // 'en' | 'es'
