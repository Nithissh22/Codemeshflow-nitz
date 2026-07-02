import { notFound } from "next/navigation";
import { servicesData } from "@/data/services";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Existing Demos
import WebArchitectureDemo from "@/components/ui/WebArchitectureDemo";
import BrandIdentityDemo from "@/components/ui/BrandIdentityDemo";
import MotionInteractionDemo from "@/components/ui/MotionInteractionDemo";
import DigitalStrategyDemo from "@/components/ui/DigitalStrategyDemo";
import ThreeExperiencesDemo from "@/components/ui/ThreeExperiencesDemo";

// New Demos
import MobileAppDemo from "@/components/ui/MobileAppDemo";
import SoftwareDevDemo from "@/components/ui/SoftwareDevDemo";
import DigitalMarketingDemo from "@/components/ui/DigitalMarketingDemo";
import WhatsAppDemo from "@/components/ui/WhatsAppDemo";
import SocialMediaDemo from "@/components/ui/SocialMediaDemo";
import StudentServicesDemo from "@/components/ui/StudentServicesDemo";
import AiAutomationDemo from "@/components/ui/AiAutomationDemo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({ params }: PageProps) {
  const resolvedParams = await params;
  const service = servicesData.find((s) => s.slug === resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const currentIndex = servicesData.findIndex((s) => s.slug === resolvedParams.slug);
  const nextService = servicesData[(currentIndex + 1) % servicesData.length];

  return (
    <main className="bg-cmf-bg min-h-screen text-cmf-text pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        
        {/* Back Link */}
        <Link href="/#services" className="inline-flex items-center gap-2 text-cmf-gold hover:text-cmf-gold-light transition-colors mb-16 label-mono">
          <ArrowLeft size={16} />
          BACK TO SERVICES
        </Link>

        {/* Hero Section */}
        <div className="relative mb-32 py-12">
          {/* Abstract Background Elements */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <div className="absolute top-0 left-0 md:left-1/4 w-[600px] h-[300px] bg-cmf-gold/5 blur-[120px] pointer-events-none rounded-[100%]"></div>
          
          <div className="relative z-10 max-w-4xl">
            <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-6 animate-fade-in-up">
              {service.num} / EXPERTISE
            </span>
            <h1 className="heading-display text-5xl md:text-[80px] mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {service.title}
            </h1>
            <p className="font-sans font-light text-xl md:text-2xl text-cmf-text-muted leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {service.fullDesc}
            </p>
            
            {/* Skills Grid */}
            <div className="mt-12 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {service.skills.map((skill, idx) => (
                <div key={idx} className="border border-cmf-gold/20 bg-cmf-gold/5 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.05)] hover:bg-cmf-gold/10 hover:border-cmf-gold/40 transition-all cursor-default">
                  <span className="label-mono text-[10px] text-cmf-gold uppercase tracking-widest">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Demos */}
        <div className="mb-40">
          {resolvedParams.slug === 'web-solutions' && <WebArchitectureDemo />}
          {resolvedParams.slug === 'mobile-development' && <MobileAppDemo />}
          {resolvedParams.slug === 'software-development' && <SoftwareDevDemo />}
          {resolvedParams.slug === 'graphic-design' && <BrandIdentityDemo />}
          {resolvedParams.slug === 'creative-media' && <MotionInteractionDemo />}
          {resolvedParams.slug === 'digital-marketing' && <DigitalMarketingDemo />}
          {resolvedParams.slug === 'whatsapp-solutions' && <WhatsAppDemo />}
          {resolvedParams.slug === 'social-media-management' && <SocialMediaDemo />}
          {resolvedParams.slug === 'student-services' && <StudentServicesDemo />}
          {resolvedParams.slug === 'business-growth' && <DigitalStrategyDemo />}
          {resolvedParams.slug === '3d-experiences' && <ThreeExperiencesDemo />}
          {resolvedParams.slug === 'ai-automation' && <AiAutomationDemo />}
        </div>

        {/* Next Service Footer */}
        <div className="border-t border-cmf-border pt-20 flex flex-col items-center text-center">
          <span className="label-mono text-[10px] text-cmf-text-muted tracking-[0.3em] block mb-4">
            NEXT EXPERTISE
          </span>
          <Link href={`/services/${nextService.slug}`} className="group inline-block">
            <h2 className="heading-display text-4xl md:text-6xl text-cmf-text group-hover:text-cmf-gold transition-colors duration-500">
              {nextService.title}
            </h2>
          </Link>
        </div>

      </div>
    </main>
  );
}
