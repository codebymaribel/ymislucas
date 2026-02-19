"use client";

import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { ArrowRight, Check, Loader } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { joinWaitlist } from "../../actions";

export const WaitlistForm = () => {
  const [state, formAction, isPending] = useActionState(joinWaitlist, null);
  const [prevFormState, setPrevFormState] = useState(state);
  const [displayState, setDisplayState] = useState(state);

  if (state !== prevFormState) {
    setPrevFormState(state);
    setDisplayState(state);
  }

  useEffect(() => {
    if (displayState?.error) {
      const timer = setTimeout(() => {
        setDisplayState(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [displayState]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <form
        action={formAction}
        className="flex flex-row justify-between w-full gap-3"
      >
        <div className="flex flex-col items-start w-full h2">
          <Input
            type="email"
            placeholder="tu@email.com"
            name="email"
            required
            className="w-full bg-slate-300 border border-slate-800 rounded-xl px-4 py-4 grow focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <p className="text-red-500 mt-2">{displayState?.error}</p>
        </div>
        <button
          className={clsx(
            {
              "bg-green-500": displayState?.success,
            },
            "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 h-14",
          )}
          type="submit"
          disabled={isPending}
        >
          {!isPending && displayState?.success ? (
            <div className="flex flex-row items-center gap-2">
              <Check size={20} color="white" />
              ¡Listo!
            </div>
          ) : (
            <div className="flex flex-row items-center gap-2">
              Anotame <ArrowRight size={20} />
            </div>
          )}
          {isPending && <Loader size={20} color="white" />}
        </button>
      </form>
    </div>
  );
};
