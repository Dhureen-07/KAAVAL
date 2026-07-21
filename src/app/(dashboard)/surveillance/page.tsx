"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, AlertTriangle, ShieldAlert, CheckCircle2, Crosshair } from "lucide-react"

interface Alert {
  id: number;
  time: string;
  camera: string;
  message: string;
  confidence: number;
  type: "warning" | "critical" | "info";
}

export default function SurveillancePage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, time: new Date().toLocaleTimeString(), camera: "CAM-42 (MG Road)", message: "Crowd gathering anomaly detected", confidence: 82, type: "info" }
  ])

  // Simulate incoming CCTV anomalies
  useEffect(() => {
    const possibleAlerts = [
      { camera: "CAM-12 (Indiranagar)", message: "Unattended baggage detected at station", confidence: 94, type: "critical" },
      { camera: "CAM-89 (Koramangala)", message: "Vehicle matching stolen FIR KA-01-XX", confidence: 98, type: "warning" },
      { camera: "CAM-05 (Majestic)", message: "Unauthorized perimeter breach", confidence: 88, type: "critical" },
      { camera: "CAM-33 (Jayanagar)", message: "Sudden crowd dispersal (panic anomaly)", confidence: 76, type: "warning" }
    ]

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const randomAlert = possibleAlerts[Math.floor(Math.random() * possibleAlerts.length)]
        setAlerts(prev => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            ...randomAlert
          } as Alert,
          ...prev
        ].slice(0, 8)) // Keep only last 8 alerts
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Video className="w-8 h-8 text-primary" />
            Live Surveillance Grid
          </h1>
          <p className="text-muted-foreground mt-1">Real-time CCTV anomaly detection powered by computer vision.</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-destructive/10 text-destructive border border-destructive/30 text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse"></span>
          AI Monitoring Active
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0 w-full h-full">
        {/* Camera Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 h-[50vh] xl:h-auto min-h-[400px]">
          {[1, 2, 3, 4].map((camIndex) => (
            <Card key={camIndex} className="glass-panel border-border/50 overflow-hidden relative group cursor-pointer">
              {/* Simulated Camera Feed */}
              <div className="absolute inset-0 bg-black/80">
                {/* Scan line animation */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent w-full h-[10%] animate-[scan_3s_ease-in-out_infinite]"></div>
                
                {/* Random bounding boxes to simulate AI vision */}
                {camIndex === 2 && (
                  <div className="absolute top-1/3 left-1/4 w-24 h-32 border-2 border-warning bg-warning/10 z-10 flex flex-col justify-between">
                    <div className="text-[8px] bg-warning text-warning-foreground px-1 w-max font-bold">PERSON 82%</div>
                    <div className="w-2 h-2 border-t-2 border-l-2 border-warning absolute -top-1 -left-1"></div>
                    <div className="w-2 h-2 border-b-2 border-r-2 border-warning absolute -bottom-1 -right-1"></div>
                  </div>
                )}
                {camIndex === 4 && (
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-20 border-2 border-destructive bg-destructive/10 z-10 animate-pulse">
                    <div className="text-[8px] bg-destructive text-destructive-foreground px-1 w-max font-bold uppercase flex items-center gap-1"><Crosshair className="w-2 h-2" /> Stolen Vehicle 98%</div>
                  </div>
                )}
                
                {/* Static grid overlay */}
                <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <div className="bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 border border-zinc-700 backdrop-blur">
                    CAM-0{camIndex}
                  </div>
                  <div className="bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-destructive border border-destructive/50 flex items-center gap-1 backdrop-blur">
                    <span className="w-1.5 h-1.5 bg-destructive rounded-full"></span> REC
                  </div>
                </div>
                
                <div className="absolute bottom-3 right-3 text-[10px] text-zinc-500 font-mono">
                  {new Date().toISOString().split('T')[0]} {new Date().toLocaleTimeString()}
                </div>
                
                {/* Hover focus effect */}
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-colors z-20 pointer-events-none"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Live Alerts Panel */}
        <Card className="w-full xl:w-96 glass-panel border-border/50 flex flex-col h-[50vh] xl:h-auto min-h-[400px]">
          <CardHeader className="border-b border-border/50 bg-card/50">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Live Threat Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <ShieldAlert className="w-12 h-12 mb-2" />
                <p className="text-sm">No anomalies detected</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border flex flex-col gap-2 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300
                    ${alert.type === 'critical' ? 'bg-destructive/10 border-destructive/40 text-destructive-foreground' : 
                      alert.type === 'warning' ? 'bg-warning/10 border-warning/40 text-warning-foreground' : 
                      'bg-primary/10 border-primary/30 text-primary-foreground'}`}
                >
                  {/* Confidence bar background */}
                  <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20" style={{ width: `${alert.confidence}%` }}></div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono opacity-70">{alert.time}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 px-1.5 rounded">{alert.camera}</span>
                  </div>
                  <p className="text-sm font-semibold leading-tight">{alert.message}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] font-bold flex items-center gap-1 opacity-90">
                      MATCH: {alert.confidence}%
                    </span>
                    <button className="text-[10px] bg-background/50 hover:bg-background px-2 py-1 rounded transition-colors border border-border">
                      Investigate
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
