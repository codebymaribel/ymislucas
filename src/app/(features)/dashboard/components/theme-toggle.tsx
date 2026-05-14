"use client";

import { useTheme } from "@/hooks/use-theme";
import { Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  initialTheme: Theme;
}

export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme(initialTheme);

  const options: { value: Theme; icon: React.ElementType; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-sidebar-accent/50">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={label}
          className={cn(
            "flex-1 flex items-center justify-center p-1.5 rounded-md transition-all duration-150",
            theme === value
              ? "bg-background text-foreground shadow-sm"
              : "text-sidebar-foreground/50 hover:text-sidebar-foreground",
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
