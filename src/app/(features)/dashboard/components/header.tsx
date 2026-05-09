"use client";

import { Button } from "@/src/components/ui/button";
import { Bell, Settings } from "lucide-react";

const pageTitles: Record<string, { title: string; description: string }> = {
  resume: {
    title: "Hola, Marib",
    description: "Veamos por donde andan tus lucas hoy",
  },
  accounts: {
    title: "Cuentas",
    description: "Registra que has gastado hoy",
  },
  budget: {
    title: "Presupuesto",
    description: "A ver cómo va tu platica",
  },
  pending: {
    title: "Pendientes",
    description: "Próximos pagos a realizar",
  },
};

interface HeaderProps {
  activePage: string;
}

export function Header({ activePage }: HeaderProps) {
  const { title, description } = pageTitles[activePage] ?? pageTitles.resume;

  return (
    <header className="flex items-center justify-between px-6 py-4 shrink-0">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
          <span className="sr-only">Notificaciones</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
