import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/layout/PageTransition";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAAVAL — Intelligence Command Platform",
  description: "AI-Powered Crime Intelligence & Emergency Dispatch for Karnataka State Police",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${jetbrains.variable} font-sans min-h-screen bg-[#0A0118] text-white antialiased`}>
        <TooltipProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </TooltipProvider>
      </body>
    </html>
  );
}
