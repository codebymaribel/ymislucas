"use client";

import { useState } from "react";
import { Header } from "./header";
import { HomePage } from "./pages/resume/dashboard-home";
import { Sidebar } from "./sidebar";
type Page = "resume" | "accounts" | "budget" | "pending";

export default function Dashboard() {
  const [activePage, setActivePage] = useState<Page>("resume");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Header activePage={activePage} />
          {activePage === "resume" && <HomePage />}
        </main>
      </div>
    </div>
  );
}
