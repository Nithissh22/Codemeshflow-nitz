import { Metadata } from "next";
import NavBar from "@/components/sections/NavBar";
import Footer from "@/components/sections/Footer";
import InternshipHero from "@/components/internships/InternshipHero";
import Manifesto from "@/components/internships/Manifesto";
import OpenRoles from "@/components/internships/OpenRoles";
import Criteria from "@/components/internships/Criteria";
import ApplicationForm from "@/components/internships/ApplicationForm";
import Alumni from "@/components/internships/Alumni";
import FAQ from "@/components/internships/FAQ";

export const metadata: Metadata = {
  title: "Internships — CodeMeshFlow",
  description: "Join CodeMeshFlow as an intern. 12-week programme for designers, developers, and strategists. Real projects. Real mentorship. Real portfolio output.",
  openGraph: {
    title: "Work with us — CodeMeshFlow Internships",
    description: "We take 4 interns per cohort. Applications open.",
    images: ["/og-internships.jpg"],
  }
};

export default function InternshipsPage() {
  return (
    <main className="bg-cmf-bg min-h-screen text-cmf-text relative overflow-hidden">
      <NavBar />
      <InternshipHero />
      <Manifesto />
      <OpenRoles />
      <Criteria />
      <ApplicationForm />
      <Alumni />
      <FAQ />
      <Footer />
    </main>
  );
}
