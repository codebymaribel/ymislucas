import { Footer } from "@/landing/components/sections/footer";
import { Header } from "@/landing/components/sections/header";
import { Hero } from "@/landing/components/sections/hero";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}
