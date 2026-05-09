"use client";

import { Header } from "@/dashboard/components/header";
import { Sidebar } from "@/dashboard/components/sidebar";
import { useState } from "react";

type Page = "resume" | "accounts" | "budget" | "pending";

export default function Dashboard() {
  const [activePage, setActivePage] = useState<Page>("resume");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header activePage={activePage} />
      </div>
    </div>
  );
}
