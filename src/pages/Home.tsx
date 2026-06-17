import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ThemePreview } from "@/components/landing/ThemePreview";
import { Plans } from "@/components/landing/Plans";
import { Testimonials } from "@/components/landing/Testimonials";

export default function Home() {
  return (
    <div className="grain-overlay min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ThemePreview />
        <Plans />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
