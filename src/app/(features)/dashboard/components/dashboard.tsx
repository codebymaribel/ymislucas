"use client";

import { useState } from "react";
import { Header } from "./header";
import { ResumePage } from "./pages/resume/resume-page";
import { Sidebar } from "./sidebar";
type Page = "resume" | "accounts" | "budget" | "pending";

export default function Dashboard() {
  const [activePage, setActivePage] = useState<Page>("resume");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header activePage={activePage} />
        <main className="flex-1 overflow-y-auto">
          {activePage === "resume" && <ResumePage />}
        </main>
      </div>
    </div>
  );
}
