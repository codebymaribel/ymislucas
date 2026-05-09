import { Footer } from "./components/sections/footer";
import { Header } from "./components/sections/header";
import { Hero } from "./components/sections/hero";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}
