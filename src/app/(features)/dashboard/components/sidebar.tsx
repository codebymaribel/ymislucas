"use client";

import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Clock,
  Landmark,
  LayoutDashboard,
  PiggyBank,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

type Page = "resume" | "accounts" | "budget" | "pending" | "debts";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: {
  id: Page;
  label: string;
  icon: React.ElementType;
  badge?: number;
}[] = [
  { id: "resume", label: "Resumen", icon: LayoutDashboard },
  { id: "accounts", label: "Cuentas", icon: Landmark },
  { id: "budget", label: "Presupuesto", icon: PiggyBank },
  { id: "debts", label: "Deudas", icon: Clock, badge: 2 },
  { id: "pending", label: "Pendientes", icon: Clock, badge: 0 },
];

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar text-sidebar-foreground shrink-0 border-r border-default">
      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 text-[11px] font-semibold tracking-widest text-sidebar-foreground/40 uppercase mb-3">
          ymislucas
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-[#C2E812] text-black shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-r border-sidebar-border">
        <ThemeToggle />
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              John Doe
            </p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">
              john@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
