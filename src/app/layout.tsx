import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import BackToTop from "@/components/ui/BackToTop";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Preloader from "@/components/ui/Preloader";
import LenisProvider from "@/components/providers/LenisProvider";
import AnimatedFavicon from "@/components/ui/AnimatedFavicon";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CodeMeshFlow | Designing Your Digital Identity",
  description: "A premium digital agency crafting digital presences that endure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans bg-[#080808] text-[#EDE8DA]" suppressHydrationWarning>
          <LenisProvider>
            <AnimatedFavicon />
            <Preloader />
            <CustomCursor />
          <ScrollToTop />
          {children}
          <BackToTop />
        </LenisProvider>
      </body>
    </html>
  );
}
