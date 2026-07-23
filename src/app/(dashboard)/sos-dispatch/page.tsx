"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { Siren, MapPin, Radio, ShieldAlert, Phone, Clock, Navigation, CheckCircle2, AlertCircle, Volume2, User } from "lucide-react"

/* ═══════ Colors ═══════ */
const P = {
  coral:    "#FF6B42",
  coralSoft:"#FF8F6B",
  violet:   "#7C5CFC",
  violetDim:"#5B3FD6",
  green:    "#34D399",
  red:      "#FF4757",
  amber:    "#FBBF24",
  blue:     "#60A5FA",
  text1:    "#F4F0FB",
  text2:    "#8B7FA8",
  text3:    "#5D5278",
  surface:  "rgba(255,255,255,0.03)",
  border:   "rgba(255,255,255,0.06)",
} as const

/* ═══════ Scroll reveal ═══════ */
function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, vis }
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${vis ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-[2px]"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

interface SOSAlert { id?: number; caller_name: string; caller_phone: string; latitude: number; longitude: number; address: string; incident_type: string; priority: string; status: string; assigned_pcr: string; created_at?: string; }

export default function SOSDispatchPage() {
  const [alerts, setAlerts] = useState<SOSAlert[]>([])
  const [triggering, setTriggering] = useState(false)

  const incidentPresets = [
    { label: "Women Safety Emergency SOS", type: "WOMEN SAFETY EMERGENCY SOS", priority: "CRITICAL" },
    { label: "Suspect Pursuit in Progress", type: "SUSPECT PURSUIT IN PROGRESS", priority: "HIGH" },
    { label: "Armed Robbery / Assault", type: "ARMED ROBBERY / ASSAULT", priority: "CRITICAL" },
    { label: "Traffic / Hit-and-Run Incident", type: "HIT AND RUN ACCIDENT", priority: "HIGH" },
  ]

  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/sos/alert")
      if (res.ok) { const data = await res.json(); setAlerts(data.alerts || []) }
    } catch (e) {
      setAlerts([
        { id: 1, caller_name: "Officer Ramesh (Patrol)", caller_phone: "+91 9845012345", latitude: 12.9716, longitude: 77.5946, address: "MG Road Metro Station, Bengaluru", incident_type: "SUSPECT PURSUIT IN PROGRESS", priority: "HIGH", status: "DISPATCHED", assigned_pcr: "PCR-104 (MG Road Division)" },
        { id: 2, caller_name: "Priya Sharma (Public)", caller_phone: "+91 9900112233", latitude: 12.9352, longitude: 77.6245, address: "Koramangala 4th Block, Bengaluru", incident_type: "WOMEN SAFETY EMERGENCY SOS", priority: "CRITICAL", status: "EN_ROUTE", assigned_pcr: "PCR-208 (Koramangala Division)" },
      ])
    }
  }

  useEffect(() => { fetchAlerts() }, [])

  const triggerSOS = async (incidentType = "CRITICAL EMERGENCY SOS", priority = "CRITICAL") => {
    setTriggering(true)
    let lat = 12.9716, lng = 77.5946, addr = "Bengaluru City Central Command"

    if ("geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => { navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 }) })
        lat = pos.coords.latitude; lng = pos.coords.longitude; addr = `GPS (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`
      } catch (err) {}
    }

    try {
      const res = await fetch("http://localhost:8000/api/sos/alert", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caller_name: "Field Officer (Instant Trigger)", caller_phone: "+91 9876543210", latitude: lat, longitude: lng, address: addr, incident_type: incidentType, priority: priority }) })
      if (res.ok) fetchAlerts()
    } catch (e) {
      setAlerts([{ id: Date.now(), caller_name: "Field Officer (Instant Trigger)", caller_phone: "+91 9876543210", latitude: lat, longitude: lng, address: addr, incident_type: incidentType, priority: priority, status: "DISPATCHED", assigned_pcr: "PCR-309 (Control Room Network)" }, ...alerts])
    } finally { setTriggering(false) }
  }

  const handleUpdateStatus = async (alertId?: number, newStatus = "RESOLVED") => {
    if (!alertId) return
    try {
      await fetch("http://localhost:8000/api/sos/alert", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ alert_id: alertId, status: newStatus }) })
      fetchAlerts()
    } catch (e) { setAlerts(alerts.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))) }
  }

  return (
    <div className="max-w-[1320px] mx-auto space-y-6 pb-20">
      
      {/* ═══ HEADER ═══ */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6" style={{ borderBottom: `1px solid ${P.border}` }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl relative group overflow-hidden" style={{ background: `${P.red}15`, border: `1px solid ${P.red}30` }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 50%, ${P.red}40, transparent 70%)` }} />
              <Siren className="w-6 h-6 relative z-10 animate-pulse" style={{ color: P.red }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight flex items-center gap-3">
                SOS Dispatch Center
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border tracking-wide uppercase shadow-lg animate-pulse" style={{ background: `${P.red}15`, color: P.red, borderColor: `${P.red}30` }}>PCR ACTIVE</span>
              </h1>
              <p className="text-[13px] mt-1.5 font-light" style={{ color: P.text2 }}>Real-time panic signals and emergency incident broadcast system.</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ═══ INSTANT TRIGGER HERO ═══ */}
      <Reveal delay={100}>
        <div className="glass-panel p-8 sm:p-12 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden border" style={{ borderColor: `${P.red}30`, background: "rgba(10,1,24,0.4)" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-30" style={{ background: P.red }} />
          
          <div className="max-w-md mx-auto space-y-2 relative z-10 mb-8">
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase mb-2 block" style={{ color: P.red }}>// Protocol 112 //</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">INSTANT SOS SIGNAL</h2>
            <p className="text-[13px] font-light" style={{ color: P.text2 }}>Pressing the button below instantly captures GPS coordinates and dispatches the nearest PCR van.</p>
          </div>

          <button
            onClick={() => triggerSOS()} disabled={triggering}
            className="relative group w-48 h-48 mx-auto rounded-full border-4 shadow-2xl transition-all duration-300 transform active:scale-95 flex flex-col items-center justify-center gap-2 text-white font-black tracking-wider z-10 hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${P.red}, #E11D48)`, borderColor: "rgba(255,255,255,0.2)", boxShadow: `0 0 80px ${P.red}60` }}
          >
            <Siren className="w-14 h-14 group-hover:scale-110 transition-transform animate-bounce" />
            <span className="text-xl font-extrabold">TRIGGER SOS</span>
            <span className="text-[10px] font-mono opacity-80 font-bold uppercase">Send Lat/Lng</span>
          </button>

          <div className="pt-10 space-y-4 relative z-10 w-full max-w-2xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: P.text3 }}>Or Select Quick Incident Category:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {incidentPresets.map((p, i) => (
                <button key={i} onClick={() => triggerSOS(p.type, p.priority)} className="px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all hover:-translate-y-px flex items-center gap-2 hover:scale-105" style={{ background: `${P.red}10`, color: P.text1, border: `1px solid ${P.red}25` }}>
                  <Radio className="w-3.5 h-3.5 animate-pulse" style={{ color: P.red }} /> {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ═══ ACTIVE ALERTS GRID ═══ */}
      <Reveal delay={150}>
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4" style={{ borderColor: P.border }}>
            <h2 className="text-[16px] font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4" style={{ color: P.red }} /> Live Emergency Alerts ({alerts.length})
            </h2>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase" style={{ color: P.text3 }}>Karnataka PCR Network #112</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {alerts.map((alert, i) => (
              <Reveal key={alert.id || i} delay={i * 80}>
                <div className="glass-panel p-6 rounded-3xl flex flex-col h-full border relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" style={{ borderColor: P.border, background: P.surface }}>
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none transition-opacity duration-500" style={{ background: alert.status === 'RESOLVED' ? P.green : P.red }} />
                  
                  <div className="flex items-center justify-between border-b pb-4 mb-4 relative z-10" style={{ borderColor: P.border }}>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest block mb-1" style={{ color: alert.priority === 'CRITICAL' ? P.red : P.amber }}>{alert.priority} PRIORITY</span>
                      <h3 className="text-[16px] font-extrabold text-white leading-tight">{alert.incident_type}</h3>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase shadow-lg ${alert.status === 'RESOLVED' ? '' : 'animate-pulse'}`} style={{ background: alert.status === 'RESOLVED' ? `${P.green}15` : `${P.red}15`, color: alert.status === 'RESOLVED' ? P.green : P.red, border: `1px solid ${alert.status === 'RESOLVED' ? P.green : P.red}30` }}>
                      {alert.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[12px] relative z-10 flex-1 content-start mb-5">
                    <div className="p-3.5 rounded-2xl border flex flex-col justify-center" style={{ background: "rgba(0,0,0,0.2)", borderColor: P.border }}>
                      <span className="flex items-center gap-1.5 mb-1 text-[9px] uppercase tracking-wider font-semibold" style={{ color: P.text2 }}><User className="w-3 h-3" style={{ color: P.violet }} /> Caller / Patrol</span>
                      <p className="font-bold text-white text-[13px] truncate">{alert.caller_name}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl border flex flex-col justify-center" style={{ background: "rgba(0,0,0,0.2)", borderColor: P.border }}>
                      <span className="flex items-center gap-1.5 mb-1 text-[9px] uppercase tracking-wider font-semibold" style={{ color: P.text2 }}><Phone className="w-3 h-3" style={{ color: P.blue }} /> Contact Phone</span>
                      <p className="font-bold text-[13px]" style={{ color: P.blue }}>{alert.caller_phone}</p>
                    </div>
                    <div className="col-span-2 p-3.5 rounded-2xl border flex flex-col justify-center" style={{ background: "rgba(0,0,0,0.2)", borderColor: P.border }}>
                      <span className="flex items-center gap-1.5 mb-1 text-[9px] uppercase tracking-wider font-semibold" style={{ color: P.text2 }}><MapPin className="w-3 h-3" style={{ color: P.coral }} /> Location Coordinates</span>
                      <p className="font-bold text-[13px]" style={{ color: P.amber }}>{alert.address}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl flex items-center justify-between text-[11px] relative z-10" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${P.border}` }}>
                    <div className="flex items-center gap-2 font-mono font-bold" style={{ color: P.coralSoft }}>
                      <Navigation className="w-4 h-4" style={{ color: P.coral }} />
                      <span>Assigned: {alert.assigned_pcr}</span>
                    </div>

                    {alert.status !== 'RESOLVED' ? (
                      <button onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')} className="px-4 py-2 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all hover:scale-105 shadow-lg" style={{ background: `linear-gradient(135deg, ${P.green}, #059669)` }}>
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5" style={{ color: P.green }}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

    </div>
  )
}
