"use client"

import { Card } from "@/components/ui/card"
import { Network, Activity } from "lucide-react"

export default function NetworkPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-6 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Network className="w-8 h-8 text-primary" />
            Network Analysis
          </h1>
          <p className="text-muted-foreground mt-1">AI-driven nodal link analysis for criminal syndicates.</p>
        </div>
      </div>

      <Card className="glass-panel border-border/50 flex flex-col flex-1 relative overflow-hidden min-h-[500px]">
        {/* Abstract Network Animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-primary animate-pulse" />
                <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-secondary animate-pulse [animation-delay:0.5s]" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" className="text-warning animate-pulse [animation-delay:1s]" />
                <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary" />
                <circle cx="80" cy="80" r="3" fill="currentColor" className="text-primary" />
                <circle cx="80" cy="20" r="1.5" fill="currentColor" className="text-secondary" />
                <circle cx="20" cy="80" r="2" fill="currentColor" className="text-secondary" />
                <circle cx="50" cy="50" r="4" fill="currentColor" className="text-destructive" />
            </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl mx-4 text-center">
                <Activity className="w-12 h-12 text-primary mb-4 animate-spin-slow" />
                <h2 className="text-xl font-bold text-white mb-2">Analyzing Node Connections...</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                    Cross-referencing telecom data and FIR records to construct criminal syndicate graphs.
                </p>
            </div>
        </div>
      </Card>
    </div>
  )
}
