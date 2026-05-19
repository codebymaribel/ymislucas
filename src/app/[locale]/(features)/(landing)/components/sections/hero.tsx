"use client";

import { GridPattern } from "@/src/components/grid-pattern";
import { motion } from "framer-motion";
import { WaitlistForm } from "./hero-form";
import HeroVisual from "./hero-visual";

export function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 ">
      <GridPattern />

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-300">
            Dejá de preguntarte <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              donde están tus lucas.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
            El dashboard financiero diseñado para la realidad argentina y
            venezolana. Controlá tu moneda local, internacional y crypto en un
            solo lugar, sin importar en qué billetera o cuenta de un tercero
            estén. Con funciones premium sin costo alguno.
          </p>

          <WaitlistForm />
          <p className="text-xs text-slate-500 mt-4 px-2">
            🔒 Tus datos están protegidos. No hacemos spam, solo avisamos cuando
            estemos listos.
          </p>
        </motion.div>
        <div>
          <HeroVisual />
        </div>
      </div>
    </div>
  );
}
