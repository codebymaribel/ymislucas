"use client";

import { cn } from "@/lib/utils";
import { useScroll } from "@/src/hooks/use-scroll";

export function Header() {
  const scrolled = useScroll(20);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",

        scrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-slate-900 py-3"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-white tracking-tighter italic">
          ymislucas<span className="text-emerald-500">.</span>
        </div>
      </div>
    </nav>
  );
}
