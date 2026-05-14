"use client";

import { setThemeAction } from "@/lib/actions/theme.action";
import { Theme } from "@/lib/theme";
import { useCallback, useEffect, useState } from "react";

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export function useTheme(initialTheme: Theme = "system"): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  // Resolves "system" to actual light/dark based on OS preference
  const resolvedTheme = useCallback((): "light" | "dark" => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme]);

  // Apply the class to <html> whenever theme changes
  useEffect(() => {
    const resolved = resolvedTheme();
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
  }, [resolvedTheme]);

  // Listen for OS preference changes when theme is "system"
  useEffect(() => {
    if (theme !== "system") return;

    if (!window) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = useCallback(async (newTheme: Theme) => {
    setThemeState(newTheme);
    await setThemeAction(newTheme);
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = resolvedTheme() === "dark" ? "light" : "dark";
    await setTheme(next);
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme: resolvedTheme(),
    setTheme,
    toggleTheme,
  };
}
