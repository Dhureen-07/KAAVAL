"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, BarChart } from "lucide-react"

export default function PredictivePage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-6 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Predictive Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Forecasting models for upcoming crime trends.</p>
        </div>
      </div>

      <Card className="glass-panel border-border/50 flex flex-col flex-1 relative overflow-hidden min-h-[500px]">
        {/* Abstract Chart Animation */}
        <div className="absolute inset-0 flex items-end justify-between p-12 opacity-10 pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <div key={i} className="w-4 bg-primary rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%`, transition: 'height 2s ease-in-out' }}></div>
            ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl mx-4 text-center">
                <BarChart className="w-12 h-12 text-primary mb-4 animate-pulse" />
                <h2 className="text-xl font-bold text-white mb-2">Generating Forecast Models...</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                    Processing 2024 SCRB data through AI models to predict localized anomaly surges for the next 14 days.
                </p>
            </div>
        </div>
      </Card>
    </div>
  )
}
