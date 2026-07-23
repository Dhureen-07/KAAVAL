"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import Link from "next/link"
import {
  AlertCircle, FileText, MapPin, Users, ShieldAlert, Activity,
  Siren, Car, GitCommit, Mic, Eye, TrendingUp,
  CheckCircle2, Sparkles, ArrowUpRight
} from "lucide-react"

/* ═══════ Scroll reveal ═══════ */
function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, vis }
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, vis } = useReveal()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${vis ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-[2px]"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

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
  glow:     "rgba(124,92,252,0.08)",
} as const

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h")
  const [activeCategory, setActiveCategory] = useState<"all" | "property" | "cyber" | "women" | "traffic">("all")
  const [currentTime, setCurrentTime] = useState("")

  const [incidents, setIncidents] = useState([
    { id: "INC-801", title: "Armed Robbery fleeing via MG Road ATM", location: "MG Road Division", priority: "CRITICAL", time: "2 mins ago", status: "PATROL_DISPATCHED", pcr: "PCR-104" },
    { id: "INC-802", title: "ANPR Plate Match KA-01-MJ-4921 Hit & Run", location: "Indiranagar 100ft Rd", priority: "HIGH", time: "8 mins ago", status: "SURVEILLANCE_FLAG", pcr: "PCR-208" },
    { id: "INC-803", title: "Women Safety SOS Emergency Alert", location: "Koramangala 4th Block", priority: "CRITICAL", time: "14 mins ago", status: "EN_ROUTE", pcr: "PCR-312" },
    { id: "INC-804", title: "Cyber Financial Fraud OTP Phishing", location: "Bengaluru Urban Cyber Cell", priority: "MEDIUM", time: "22 mins ago", status: "UNDER_INVESTIGATION", pcr: "CYBER-01" },
    { id: "INC-805", title: "Commercial Establishment Break-in", location: "Tumakuru Outer Division", priority: "HIGH", time: "35 mins ago", status: "EVIDENCE_COLLECTED", pcr: "PCR-119" },
  ])

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  const handleAck = (id: string) => setIncidents(p => p.map(i => i.id === id ? { ...i, status: "ACKNOWLEDGED_BY_COMMAND" } : i))

  const metrics = {
    "24h": { firs: 142, firsTrend: "+12% vs yesterday", open: "3,892", district: "Bengaluru Urban", repeat: 84 },
    "7d": { firs: 984, firsTrend: "+8% vs last week", open: "3,610", district: "Bengaluru Urban", repeat: 312 },
    "30d": { firs: 4120, firsTrend: "-3% vs last month", open: "3,150", district: "Mysuru Division", repeat: 1140 },
  }[timeRange]

  const districtData = [
    { district: "Bengaluru Urban", cases: 482, severity: 92, color: P.red },
    { district: "Mysuru City", cases: 210, severity: 64, color: P.amber },
    { district: "Mangaluru Coastal", cases: 145, severity: 48, color: P.violet },
    { district: "Hubballi-Dharwad", cases: 189, severity: 55, color: P.amber },
    { district: "Belagavi Division", cases: 98, severity: 32, color: P.green },
  ]

  const cards = [
    { title: "FIRs Filed", value: String(metrics.firs), sub: metrics.firsTrend, icon: FileText, color: P.coral, subIcon: TrendingUp },
    { title: "Active Cases", value: metrics.open, sub: "14 high-priority", icon: AlertCircle, color: P.amber, subIcon: Activity },
    { title: "High-Alert Zone", value: metrics.district, sub: "Critical deployment", icon: ShieldAlert, color: P.red, subIcon: MapPin },
    { title: "Repeat Suspects", value: String(metrics.repeat), sub: "Camera matched", icon: Users, color: P.violet, subIcon: Eye },
  ]

  const quickLinks = [
    { title: "AI Assistant", icon: Sparkles, color: P.coral, href: "/assistant" },
    { title: "Voice FIR", icon: Mic, color: P.violet, href: "/voice-fir" },
    { title: "ANPR Scanner", icon: Car, color: P.amber, href: "/anpr" },
    { title: "Timelines", icon: GitCommit, color: P.green, href: "/timeline" },
  ]

  return (
    <div className="max-w-[1320px] mx-auto space-y-6 pb-20">

      {/* ═══════════ HEADER ═══════════ */}
      <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6" style={{ borderBottom: `1px solid ${P.border}` }}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
                </span>
                Live Telemetry
              </div>
              <span className="text-[12px] font-mono text-[#5D5278]">{currentTime || "—"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Command Center
            </h1>
            <p className="text-[14px] mt-1.5 font-light text-[#8B7FA8]">
              Real-time crime analytics and emergency dispatch monitoring across Karnataka.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl glass-panel self-start lg:self-auto">
            {(["24h", "7d", "30d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-all duration-300"
                style={
                  timeRange === r
                    ? { background: `linear-gradient(135deg, ${P.coral}, ${P.coralSoft})`, color: "#fff", boxShadow: `0 4px 16px ${P.coral}40` }
                    : { color: P.text2 }
                }
              >
                {r === "24h" ? "24 Hours" : r === "7d" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ═══════════ METRICS ═══════════ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((m, i) => (
          <Reveal key={m.title} delay={i * 100}>
            <div
              className="glass-panel p-5 rounded-2xl hover:-translate-y-1 transition-all duration-400 group relative overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `${m.color}15` }}
              />

              <div className="relative flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8B7FA8]">{m.title}</span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${m.color}12` }}
                >
                  <m.icon className="w-4 h-4" style={{ color: m.color }} />
                </div>
              </div>
              <div className="relative text-[1.75rem] font-bold text-white tracking-tight mb-1">{m.value}</div>
              <p className="relative text-[11px] font-medium flex items-center gap-1" style={{ color: m.color }}>
                <m.subIcon className="w-3 h-3" /> {m.sub}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ═══════════ MAIN GRID ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT: District + Quick Links */}
        <div className="lg:col-span-7 space-y-5">
          <Reveal>
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4" style={{ borderBottom: `1px solid ${P.border}` }}>
                <div>
                  <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4" style={{ color: P.coral }} />
                    District Crime Severity
                  </h3>
                  <p className="text-[11px] mt-0.5 text-[#8B7FA8]">Live intensity by Karnataka Police Divisions</p>
                </div>
                <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
                  {(["all", "property", "cyber"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="px-3 py-1.5 rounded-md text-[11px] font-semibold capitalize transition-all duration-300"
                      style={
                        activeCategory === cat
                          ? { background: `linear-gradient(135deg, ${P.violet}, ${P.violetDim})`, color: "#fff", boxShadow: `0 2px 12px ${P.violet}30` }
                          : { color: P.text2 }
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {districtData.map((item, i) => (
                  <Reveal key={item.district} delay={i * 70}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                          {item.district}
                        </span>
                        <span className="font-mono font-medium text-[#8B7FA8]">{item.cases}</span>
                      </div>
                      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${item.severity}%`,
                            background: `linear-gradient(90deg, ${item.color}66, ${item.color})`,
                            boxShadow: `0 0 10px ${item.color}30`,
                          }}
                        />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((q, i) => (
              <Reveal key={q.title} delay={i * 70}>
                <Link href={q.href} className="group block">
                  <div className="glass-panel p-4 rounded-2xl text-center hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${q.color}08, transparent 70%)` }}
                    />
                    <div
                      className="relative w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: `${q.color}12` }}
                    >
                      <q.icon className="w-4 h-4" style={{ color: q.color }} />
                    </div>
                    <span className="relative text-[12px] font-semibold text-white block">{q.title}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* RIGHT: Live Feed */}
        <div className="lg:col-span-5">
          <Reveal delay={120}>
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: `1px solid ${P.border}` }}>
                <div>
                  <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                    <Siren className="w-4 h-4 animate-pulse" style={{ color: P.red }} />
                    Emergency Alerts
                  </h3>
                  <p className="text-[11px] mt-0.5 text-[#8B7FA8]">Last 60 minutes</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold animate-pulse bg-[#FF4757]/12 text-[#FF6B7A] border border-[#FF4757]/20">
                  LIVE
                </span>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-none">
                {incidents.map((inc, i) => (
                  <Reveal key={inc.id} delay={i * 70}>
                    <div
                      className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
                      style={{ background: P.surface, border: `1px solid ${P.border}` }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)" }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = P.border }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold" style={{ color: P.coral }}>{inc.id}</span>
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                          style={{
                            background: `${inc.priority === "CRITICAL" ? P.red : inc.priority === "HIGH" ? P.amber : P.blue}15`,
                            color: inc.priority === "CRITICAL" ? P.red : inc.priority === "HIGH" ? P.amber : P.blue,
                            border: `1px solid ${inc.priority === "CRITICAL" ? P.red : inc.priority === "HIGH" ? P.amber : P.blue}25`,
                          }}
                        >
                          {inc.priority}
                        </span>
                      </div>

                      <h4 className="text-[13px] font-semibold text-white mb-2 leading-snug">{inc.title}</h4>

                      <div className="flex items-center justify-between text-[11px] mb-3 text-[#8B7FA8]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" style={{ color: P.coral }} />
                          {inc.location}
                        </span>
                        <span className="text-[#5D5278]">{inc.time}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 text-[11px]" style={{ borderTop: `1px solid ${P.border}` }}>
                        <span className="font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: P.green }}>
                          <CheckCircle2 className="w-3 h-3" />
                          {inc.status.replace(/_/g, " ")}
                          <span className="text-[#5D5278]"> · {inc.pcr}</span>
                        </span>

                        {inc.status !== "ACKNOWLEDGED_BY_COMMAND" ? (
                          <button
                            onClick={() => handleAck(inc.id)}
                            className="px-3 py-1 rounded-lg text-[10px] font-semibold transition-all hover:scale-105"
                            style={{ background: `${P.coral}12`, color: P.coral, border: `1px solid ${P.coral}25` }}
                          >
                            Acknowledge
                          </button>
                        ) : (
                          <span className="text-[10px] font-semibold text-[#5D5278]">✓ Logged</span>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
