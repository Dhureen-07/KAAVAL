"use client"

import { useState, useEffect } from "react"
import { Siren, MapPin, Radio, ShieldAlert, Phone, Clock, Navigation, CheckCircle2, AlertCircle, Volume2, User } from "lucide-react"

interface SOSAlert {
  id?: number
  caller_name: string
  caller_phone: string
  latitude: number
  longitude: number
  address: string
  incident_type: string
  priority: string
  status: string
  assigned_pcr: string
  created_at?: string
}

export default function SOSDispatchPage() {
  const [alerts, setAlerts] = useState<SOSAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [triggering, setTriggering] = useState(false)
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "DISPATCH_MAP">("ACTIVE")

  // Preset quick trigger incident options
  const incidentPresets = [
    { label: "Women Safety Emergency SOS", type: "WOMEN SAFETY EMERGENCY SOS", priority: "CRITICAL" },
    { label: "Suspect Pursuit in Progress", type: "SUSPECT PURSUIT IN PROGRESS", priority: "HIGH" },
    { label: "Armed Robbery / Assault", type: "ARMED ROBBERY / ASSAULT", priority: "CRITICAL" },
    { label: "Traffic / Hit-and-Run Incident", type: "HIT AND RUN ACCIDENT", priority: "HIGH" },
  ]

  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/sos/alert")
      if (res.ok) {
        const data = await res.json()
        setAlerts(data.alerts || [])
      }
    } catch (e) {
      console.warn("Using local SOS fallback memory", e)
      setAlerts([
        { id: 1, caller_name: "Officer Ramesh (Patrol)", caller_phone: "+91 9845012345", latitude: 12.9716, longitude: 77.5946, address: "MG Road Metro Station, Bengaluru", incident_type: "SUSPECT PURSUIT IN PROGRESS", priority: "HIGH", status: "DISPATCHED", assigned_pcr: "PCR-104 (MG Road Division)" },
        { id: 2, caller_name: "Priya Sharma (Public)", caller_phone: "+91 9900112233", latitude: 12.9352, longitude: 77.6245, address: "Koramangala 4th Block, Bengaluru", incident_type: "WOMEN SAFETY EMERGENCY SOS", priority: "CRITICAL", status: "EN_ROUTE", assigned_pcr: "PCR-208 (Koramangala Division)" },
      ])
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const triggerSOS = async (incidentType = "CRITICAL EMERGENCY SOS", priority = "CRITICAL") => {
    setTriggering(true)
    let lat = 12.9716
    let lng = 77.5946
    let addr = "Bengaluru City Central Command"

    if ("geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
        })
        lat = pos.coords.latitude
        lng = pos.coords.longitude
        addr = `GPS (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`
      } catch (err) {
        console.log("Geolocation fallback to Bengaluru center")
      }
    }

    try {
      const res = await fetch("http://localhost:8000/api/sos/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caller_name: "Field Officer (Instant Trigger)",
          caller_phone: "+91 9876543210",
          latitude: lat,
          longitude: lng,
          address: addr,
          incident_type: incidentType,
          priority: priority,
        }),
      })
      if (res.ok) {
        fetchAlerts()
      }
    } catch (e) {
      const fallbackAlert: SOSAlert = {
        id: Date.now(),
        caller_name: "Field Officer (Instant Trigger)",
        caller_phone: "+91 9876543210",
        latitude: lat,
        longitude: lng,
        address: addr,
        incident_type: incidentType,
        priority: priority,
        status: "DISPATCHED",
        assigned_pcr: "PCR-309 (Control Room Network)",
      }
      setAlerts([fallbackAlert, ...alerts])
    } finally {
      setTriggering(false)
    }
  }

  const handleUpdateStatus = async (alertId?: number, newStatus = "RESOLVED") => {
    if (!alertId) return
    try {
      await fetch("http://localhost:8000/api/sos/alert", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id: alertId, status: newStatus }),
      })
      fetchAlerts()
    } catch (e) {
      setAlerts(alerts.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a)))
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-2xl text-red-400 animate-pulse">
            <Siren className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              SOS Emergency Geolocation Dispatch Center
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-mono animate-pulse">
                POLICE CONTROL ROOM ACTIVE
              </span>
            </h1>
            <p className="text-sm text-zinc-400">
              Real-time panic signals, PCR unit dispatching, and emergency incident broadcast system.
            </p>
          </div>
        </div>
      </div>

      {/* INSTANT PANIC SOS TRIGGER HERO BUTTON */}
      <div className="glass-panel p-8 rounded-3xl border border-red-500/40 bg-gradient-to-br from-red-950/40 via-black to-red-950/20 space-y-6 text-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="max-w-md mx-auto space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
            // EMERGENCY RESPONSE PROTOCOL 112
          </span>
          <h2 className="text-xl font-black text-white">INSTANT SOS EMERGENCY SIGNAL</h2>
          <p className="text-xs text-zinc-400">
            Pressing the button below instantly captures GPS coordinates and dispatches the nearest PCR van.
          </p>
        </div>

        {/* Big Emergency Trigger Button */}
        <button
          onClick={() => triggerSOS()}
          disabled={triggering}
          className="relative group w-48 h-48 mx-auto rounded-full bg-gradient-to-tr from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 border-4 border-white/20 shadow-[0_0_60px_rgba(239,68,68,0.6)] hover:shadow-[0_0_90px_rgba(239,68,68,0.8)] transition-all duration-300 transform active:scale-95 flex flex-col items-center justify-center gap-2 text-white font-black tracking-wider"
        >
          <Siren className="w-14 h-14 group-hover:scale-110 transition-transform animate-bounce" />
          <span className="text-xl font-extrabold">TRIGGER SOS</span>
          <span className="text-[10px] font-mono opacity-80">SEND LAT/LNG</span>
        </button>

        {/* Incident Presets */}
        <div className="pt-2 space-y-2">
          <p className="text-xs text-zinc-400 font-medium">Or Select Quick Incident Category:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {incidentPresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => triggerSOS(p.type, p.priority)}
                className="px-3.5 py-1.5 bg-red-900/30 hover:bg-red-600/40 border border-red-500/30 rounded-xl text-xs text-red-200 font-semibold transition-all flex items-center gap-1.5"
              >
                <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Alerts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-400" />
            Live Emergency Alerts ({alerts.length})
          </h2>
          <span className="text-xs text-zinc-400 font-mono">Karnataka PCR Network #112</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert, idx) => (
            <div
              key={alert.id || idx}
              className="glass-panel p-6 rounded-3xl border border-red-500/30 space-y-4 hover:border-red-500/60 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase">{alert.priority} PRIORITY</span>
                  <h3 className="text-base font-extrabold text-white">{alert.incident_type}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold ${
                  alert.status === 'RESOLVED' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                }`}>
                  {alert.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-black/30 rounded-xl border border-white/5 space-y-1">
                  <span className="text-zinc-500 flex items-center gap-1 text-[10px]">
                    <User className="w-3 h-3 text-zinc-400" /> Caller / Patrol
                  </span>
                  <p className="font-bold text-white truncate">{alert.caller_name}</p>
                </div>
                <div className="p-2.5 bg-black/30 rounded-xl border border-white/5 space-y-1">
                  <span className="text-zinc-500 flex items-center gap-1 text-[10px]">
                    <Phone className="w-3 h-3 text-zinc-400" /> Contact Phone
                  </span>
                  <p className="font-bold text-indigo-300">{alert.caller_phone}</p>
                </div>
                <div className="p-2.5 bg-black/30 rounded-xl border border-white/5 space-y-1 col-span-2">
                  <span className="text-zinc-500 flex items-center gap-1 text-[10px]">
                    <MapPin className="w-3 h-3 text-red-400" /> Location Coordinates
                  </span>
                  <p className="font-bold text-amber-300">{alert.address}</p>
                </div>
              </div>

              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-red-200 font-mono font-bold">
                  <Navigation className="w-4 h-4 text-red-400" />
                  <span>Assigned: {alert.assigned_pcr}</span>
                </div>

                {alert.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[10px] transition-all"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
