import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ChevronRight, Lock } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-xl z-10">
        <div className="flex items-center gap-2 font-bold text-2xl text-primary">
          <ShieldAlert className="h-8 w-8" />
          <span>KAAVAL</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Lock className="w-4 h-4 mr-2" />
              Secure Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full">
              Enter Command Center
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-6">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            KSP Intelligence Network Active
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            AI-Powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-success">
              Crime Intelligence
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
            Transform statewide crime data into actionable intelligence using conversational AI for the Karnataka Police.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_40px_8px_rgba(109,93,246,0.3)] transition-all hover:scale-105">
                Access Platform
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Trust Section */}
      <footer className="py-8 text-center text-sm text-muted-foreground z-10 border-t border-border/50 bg-background/50 backdrop-blur-md">
        <p>State Crime Records Bureau (SCRB) • Government of Karnataka</p>
        <p className="mt-2 text-xs flex items-center justify-center gap-2">
          <Lock className="w-3 h-3" /> Encrypted & Secured by KSP Cyber Division
        </p>
      </footer>
    </div>
  )
}
