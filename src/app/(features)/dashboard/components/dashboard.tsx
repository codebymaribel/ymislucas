"use client";

import { Theme } from "@/src/lib/theme";
import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
type Page = "resume" | "accounts" | "budget" | "pending";

interface DashboardProps {
  initialTheme: Theme;
}

export default function Dashboard({ initialTheme }: DashboardProps) {
  const [activePage, setActivePage] = useState<Page>("resume");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        initialTheme={initialTheme}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header activePage={activePage} />
      </div>
    </div>
  );
}
