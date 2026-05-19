import { Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-12 mt-10 border-t border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-slate-500 text-sm font-medium">
            Hecho con{" "}
            <Heart
              size={14}
              className="inline text-emerald-500 fill-emerald-500"
            />{" "}
            y mucho café en Buenos Aires.
          </p>
          <p className="text-slate-600 text-xs uppercase tracking-widest">
            © 2026 ymislucas. Todos los derechos reservados.
          </p>
        </div>

        <a
          href="https://github.com/codebymaribel/ymislucas"
          target="_blank"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <span className="text-sm font-mono">view_source</span>
          <Github
            size={20}
            className="group-hover:rotate-12 transition-transform"
          />
        </a>
      </div>
    </footer>
  );
}
