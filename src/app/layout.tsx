import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/layout/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${jetbrains.variable} font-sans min-h-screen bg-[var(--color-background)] text-t1 antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </TooltipProvider>
          <Toaster theme="system" richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
