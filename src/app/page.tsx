"use client"

import { useEffect, useState, useRef, type ReactNode } from "react"
import Link from "next/link"
import {
  Shield, ArrowRight, ChevronDown, Cpu, GitCommit, Car, Scale,
  ShieldAlert, Activity, Users, FileText, Siren, Eye, Sparkles,
  BarChart3, Globe, Lock, MapPin
} from "lucide-react"

/* ═══════ Hooks ═══════ */
function useCounter(end: number, dur = 2200) {
  const [v, setV] = useState(0)
  const s = useRef(false)
  useEffect(() => {
    if (s.current) return; s.current = true
    let c = 0; const step = end / (dur / 16)
    const id = setInterval(() => { c += step; if (c >= end) { setV(end); clearInterval(id) } else setV(Math.floor(c)) }, 16)
    return () => clearInterval(id)
  }, [end, dur])
  return v
}

function useReveal(t = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect() } }, { threshold: t })
    o.observe(el); return () => o.disconnect()
  }, [t])
  return { ref, v }
}

function R({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, v } = useReveal()
  return (
    <div ref={ref} className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${v ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-[3px]"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ═══════ Colors ═══════ */
const P = {
  coral: "#FF6B42", coralSoft: "#FF8F6B",
  violet: "#7C5CFC", violetDim: "#5B3FD6",
  green: "#34D399", red: "#FF4757", amber: "#FBBF24", blue: "#60A5FA",
  text1: "#F4F0FB", text2: "#8B7FA8", text3: "#5D5278",
} as const

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])

  const firs = useCounter(4120), districts = useCounter(31), officers = useCounter(1840), uptime = useCounter(99)
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#0A0118", color: P.text1, fontFamily: "var(--font-sans)" }}>

      {/* ═══ NAV ═══ */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
        style={{ background: scrolled ? "rgba(10,1,24,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#FF6B42] to-[#FF8F6B] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,107,66,0.4)] transition-all">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold tracking-[0.14em] text-sm uppercase">Kaaval</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#8B7FA8]">
            <button onClick={() => scrollTo("features")} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollTo("modules")} className="hover:text-white transition-colors">Modules</button>
            <Link href="/assistant" className="hover:text-white transition-colors">AI Assistant</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:flex text-[13px] font-medium text-[#8B7FA8] hover:text-white transition-colors">Login</Link>
            <Link href="/dashboard" className="h-10 px-5 rounded-xl text-[13px] font-semibold text-white flex items-center gap-1.5 transition-all hover:-translate-y-px bg-gradient-to-r from-[#FF6B42] to-[#FF8F6B] hover:shadow-[0_4px_24px_rgba(255,107,66,0.4)]">
              Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
        {/* Ambient */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] rounded-full blur-[200px]" style={{ background: "rgba(124,92,252,0.08)", animation: "ambient-drift 18s ease-in-out infinite" }} />
          <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px]" style={{ background: "rgba(255,107,66,0.06)", animation: "ambient-drift 22s ease-in-out infinite reverse" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[220px]" style={{ background: "rgba(124,92,252,0.04)" }} />
        </div>

        <div className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${mounted ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-12 blur-[6px]"}`}>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 text-[12px] font-semibold tracking-wide glass-panel" style={{ color: P.green }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: P.green }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: P.green }} />
            </span>
            Karnataka State Police · Neural Command v3.0
          </div>

          <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-extrabold tracking-[-0.04em] leading-[1.05] text-white mb-6">
            Protecting Karnataka
            <br />with{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B42] via-[#FF8F6B] to-[#7C5CFC]" style={{ backgroundSize: "200% auto", animation: "gradient-shift 4s ease infinite" }}>
                AI Intelligence
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-[#FF6B42] to-[#7C5CFC] opacity-50" />
            </span>
          </h1>

          <p className="text-[clamp(1rem,2vw,1.25rem)] font-light leading-relaxed max-w-2xl mx-auto mb-10 text-[#8B7FA8]">
            Real-time crime analytics, AI-driven case analysis, and emergency dispatch — unified in one ultra-secure command platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard" className="group h-14 px-8 rounded-2xl text-white text-[15px] font-bold flex items-center gap-2.5 transition-all hover:-translate-y-1 bg-gradient-to-r from-[#FF6B42] to-[#FF8F6B] hover:shadow-[0_8px_40px_rgba(255,107,66,0.35)]">
              Launch Command Center
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/assistant" className="h-14 px-8 rounded-2xl text-[15px] font-medium flex items-center gap-2.5 transition-all hover:bg-white/[0.06] glass-panel">
              <Sparkles className="w-4 h-4" style={{ color: P.violet }} />
              AI Crime Assistant
            </Link>
          </div>
        </div>

        <button onClick={() => scrollTo("stats")} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8B7FA8] hover:text-white transition-colors z-10">
          <span className="text-[11px] tracking-[0.2em] uppercase font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </section>

      {/* ═══ STATS ═══ */}
      <section id="stats" style={{ borderTop: `1px solid rgba(255,255,255,0.04)`, borderBottom: `1px solid rgba(255,255,255,0.04)`, background: "rgba(124,92,252,0.02)" }}>
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "FIRs This Month", value: firs.toLocaleString(), icon: FileText, color: P.coral },
            { label: "Districts Covered", value: String(districts), icon: Globe, color: P.violet },
            { label: "Active Officers", value: officers.toLocaleString(), icon: Users, color: P.coral },
            { label: "System Uptime", value: `${uptime}%`, icon: Activity, color: P.green },
          ].map((s, i) => (
            <R key={s.label} delay={i * 100}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}10` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">{s.value}</div>
                  <div className="text-[12px] font-medium text-[#8B7FA8]">{s.label}</div>
                </div>
              </div>
            </R>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-28 px-6 lg:px-10">
        <div className="max-w-[1320px] mx-auto">
          <R>
            <div className="max-w-2xl mb-20">
              <span className="text-[12px] font-bold tracking-[0.18em] uppercase mb-4 block" style={{ color: P.coral }}>Intelligence Platform</span>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-white tracking-tight leading-tight mb-5">
                Your Entire Command Center,<br />One Unified Interface.
              </h2>
              <p className="text-base font-light leading-relaxed text-[#8B7FA8]">
                From AI-driven crime pattern analysis to real-time patrol dispatch — every tool your officers need, designed for speed and zero friction.
              </p>
            </div>
          </R>

          {/* Dashboard Preview */}
          <R>
            <div className="rounded-2xl p-[1px] mb-20" style={{ background: "linear-gradient(135deg, rgba(255,107,66,0.2), rgba(124,92,252,0.15), rgba(255,255,255,0.03))" }}>
              <div className="rounded-[15px] p-6 lg:p-8" style={{ background: "#0E0520" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${P.coral}12` }}>
                      <BarChart3 className="w-5 h-5" style={{ color: P.coral }} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-white">Statewide Analytics</h3>
                      <p className="text-[11px] text-[#8B7FA8]">Live crime data · Auto-refreshing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {["24h", "7d", "30d"].map((r, i) => (
                      <span key={r} className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold" style={i === 0 ? { background: `linear-gradient(135deg, ${P.coral}, ${P.coralSoft})`, color: "#fff" } : { background: "rgba(255,255,255,0.04)", color: P.text2, border: `1px solid rgba(255,255,255,0.06)` }}>{r}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { t: "FIRs Filed Today", v: "142", c: "+12%", icon: FileText, col: P.coral },
                    { t: "Active Cases", v: "3,892", c: "14 critical", icon: Activity, col: P.amber },
                    { t: "High-Alert Zone", v: "BLR Urban", c: "Severity 92%", icon: ShieldAlert, col: P.red },
                    { t: "Repeat Suspects", v: "84", c: "CCTV matched", icon: Eye, col: P.violet },
                  ].map((m) => (
                    <div key={m.t} className="p-5 rounded-xl group hover:-translate-y-0.5 transition-all" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.04)` }}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8B7FA8]">{m.t}</span>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${m.col}12` }}>
                          <m.icon className="w-4 h-4" style={{ color: m.col }} />
                        </div>
                      </div>
                      <div className="text-[1.6rem] font-bold text-white mb-1 tracking-tight">{m.v}</div>
                      <div className="text-[11px] font-semibold" style={{ color: m.col }}>{m.c}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.04)` }}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[13px] font-semibold text-white">District Crime Distribution</span>
                    <div className="flex items-center gap-4 text-[10px] text-[#8B7FA8]">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: P.coral }} />Property</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: P.violet }} />Cyber</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: P.red }} />Violent</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-[6px] h-36">
                    {[72,48,88,56,94,40,78,62,50,86,44,68].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full rounded-md transition-all duration-500 hover:opacity-80" style={{ height: `${h}%`, background: h > 85 ? `linear-gradient(to top, ${P.red}bb, ${P.red})` : h > 65 ? `linear-gradient(to top, ${P.coral}66, ${P.coral}cc)` : `linear-gradient(to top, ${P.violet}44, ${P.violet}88)`, boxShadow: h > 85 ? `0 0 12px ${P.red}33` : "none" }} />
                        <span className="text-[8px] font-mono text-[#5D5278]">{["BLR","MYS","MNG","HBL","BLG","DVG","TUM","KLB","SHM","GBG","UDN","CHK"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </R>

          {/* ═══ MODULES ═══ */}
          <div id="modules">
            <R><div className="max-w-xl mb-14">
              <span className="text-[12px] font-bold tracking-[0.18em] uppercase mb-4 block" style={{ color: P.coral }}>Modules</span>
              <h2 className="text-[clamp(1.5rem,3.5vw,2.4rem)] font-bold text-white tracking-tight leading-tight">Purpose-Built Tools for Every Operation</h2>
            </div></R>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: "Command Hub", desc: "Live telemetrics, incident feeds, and statewide crime severity monitoring.", icon: ShieldAlert, color: P.coral, href: "/dashboard" },
                { title: "AI Crime Assistant", desc: "RAG-powered neural engine for legal lookups and crime pattern analysis.", icon: Sparkles, color: P.violet, href: "/assistant" },
                { title: "Case Timeline & Datasets", desc: "Visual chain-of-custody evidence builder with SQLite-backed data.", icon: GitCommit, color: P.blue, href: "/timeline" },
                { title: "ANPR Vehicle Network", desc: "Number plate recognition connected to stolen and wanted databases.", icon: Car, color: P.amber, href: "/anpr" },
                { title: "BNS Legal Matcher", desc: "IPC to Bharatiya Nyaya Sanhita smart legal section mapper.", icon: Scale, color: P.violet, href: "/legal-matcher" },
                { title: "SOS Emergency Dispatch", desc: "Instant citizen alerts with automatic PCR patrol van routing.", icon: Siren, color: P.red, href: "/sos-dispatch" },
              ].map((m, i) => (
                <R key={m.title} delay={i * 80}>
                  <Link href={m.href} className="group block h-full">
                    <div className="glass-panel h-full p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden">
                      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${m.color}10` }} />
                      <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: `${m.color}12` }}>
                        <m.icon className="w-5 h-5" style={{ color: m.color }} />
                      </div>
                      <h3 className="relative text-[16px] font-semibold text-white mb-2 group-hover:text-[#FF6B42] transition-colors duration-300">{m.title}</h3>
                      <p className="relative text-[13px] font-light leading-relaxed text-[#8B7FA8] mt-auto">{m.desc}</p>
                      <div className="relative mt-5 flex items-center gap-1.5 text-[12px] font-semibold opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300" style={{ color: P.coral }}>
                        Open Module <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </R>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="relative py-28 px-6 overflow-hidden" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]" style={{ background: "rgba(124,92,252,0.04)" }} />
        </div>
        <R>
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-7">
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-white tracking-tight leading-tight">
              Ready to Transform<br />Law Enforcement?
            </h2>
            <p className="text-base font-light text-[#8B7FA8]">Join 1,800+ officers using KAAVAL to protect Karnataka every day.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/dashboard" className="group h-14 px-8 rounded-2xl text-white text-[15px] font-bold flex items-center gap-2.5 transition-all hover:-translate-y-1 bg-gradient-to-r from-[#FF6B42] to-[#FF8F6B] hover:shadow-[0_8px_40px_rgba(255,107,66,0.35)]">
                Enter Command Center <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/login" className="h-14 px-8 rounded-2xl text-[15px] font-medium flex items-center gap-2.5 transition-all hover:bg-white/[0.06] glass-panel">
                <Lock className="w-4 h-4" style={{ color: P.green }} />
                Officer Login
              </Link>
            </div>
          </div>
        </R>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-6 lg:px-10" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
        <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#FF6B42] to-[#FF8F6B]">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[12px] font-bold tracking-[0.12em] text-[#8B7FA8] uppercase">Kaaval</span>
          </div>
          <p className="text-[11px] font-mono tracking-wide text-[#5D5278]">State Crime Records Bureau (SCRB) · Government of Karnataka · © 2026</p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: P.green }}>
            <Lock className="w-3 h-3" /> Encrypted & Verified
          </div>
        </div>
      </footer>
    </div>
  )
}
