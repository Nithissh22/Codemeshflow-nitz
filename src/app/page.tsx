import NavBar from "@/components/sections/NavBar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import TrustedBrands from "@/components/sections/TrustedBrands";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import TextRevealWrapper from "@/components/ui/TextRevealWrapper";
import CyberpunkCity from "@/components/ui/CyberpunkCity";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-cmf-bg">
      <CyberpunkCity />
      <TextRevealWrapper />
      <NavBar />
      <Hero />
      <Marquee />
      <Services />
      <Work />
      <About />
      <Process />
      <TrustedBrands />
      <Contact />
      <Footer />
    </main>
  );
}
