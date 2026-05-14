"use server";

import { THEME_COOKIE_KEY, Theme } from "@/lib/theme";
import { cookies } from "next/headers";

export async function getThemeAction(): Promise<Theme> {
  const cookieStore = await cookies();
  const theme = cookieStore.get(THEME_COOKIE_KEY)?.value as Theme | undefined;
  return theme ?? "system";
}

export async function setThemeAction(theme: Theme): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_KEY, theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
