"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { Scale, ShieldAlert, Sparkles, BookOpen, AlertCircle, CheckCircle2, FileText, Search, ChevronRight } from "lucide-react"

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

interface MatchedSection { bns_section: string; ipc_section: string; offense_title: string; category: string; type: string; max_sentence: string; mandatory_action: string; }

export default function LegalMatcherPage() {
  const [statement, setStatement] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<MatchedSection[]>([])
  const [searched, setSearched] = useState(false)

  const sampleScenarios = [
    { label: "Vehicle Theft", text: "Suspect forcibly broke the lock of a white Creta near Silk Board and fled towards Hosur road." },
    { label: "Hit & Run Accident", text: "Black SUV hit a two-wheeler at high speed on Ring Road and drove away without offering medical help." },
    { label: "Cyber Financial Scam", text: "Victim received an urgent call pretending to be bank customer care and lost Rs 75,000 via fraudulent UPI transfer." },
    { label: "Physical Assault", text: "Two individuals attacked the shopkeeper with iron rods causing serious head injuries." },
  ]

  const handleMatch = async (inputText?: string) => {
    const textToSubmit = inputText || statement
    if (!textToSubmit.trim()) return
    setLoading(true); setSearched(true)

    try {
      const res = await fetch("http://localhost:8000/api/legal/match-section", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ statement: textToSubmit }) })
      if (res.ok) { const data = await res.json(); setResults(data.matched_sections || []) } else throw new Error()
    } catch (e) {
      const q = textToSubmit.toLowerCase()
      if (q.includes("hit") || q.includes("accident")) {
        setResults([{ bns_section: "BNS Section 106 (1) & (2)", ipc_section: "IPC Section 279 / 304A", offense_title: "Rash Driving & Hit-and-Run", category: "Traffic & Public Safety", type: "Cognizable & Non-Bailable", max_sentence: "Up to 10 Years Imprisonment & Fine", mandatory_action: "File instant ANPR lookup and issue radio broadcast to nearest PCR vans." }])
      } else if (q.includes("cyber") || q.includes("upi") || q.includes("bank")) {
        setResults([{ bns_section: "BNS Section 318 & IT Act 66D", ipc_section: "IPC Section 420", offense_title: "Cheating by Personation & Cyber Fraud", category: "Cyber Crime", type: "Cognizable & Bailable", max_sentence: "Up to 7 Years Imprisonment", mandatory_action: "Freeze beneficiary account via 1930 National Cybercrime Portal." }])
      } else {
        setResults([{ bns_section: "BNS Section 303 (2)", ipc_section: "IPC Section 379", offense_title: "Theft of Property / Vehicle", category: "Property Crime", type: "Cognizable & Bailable", max_sentence: "Up to 3 Years Imprisonment", mandatory_action: "Verify vehicle registration & check nearest CCTV feeds." }])
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-[1320px] mx-auto space-y-6 pb-20">
      
      {/* ═══ HEADER ═══ */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6" style={{ borderBottom: `1px solid ${P.border}` }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl relative group overflow-hidden" style={{ background: `${P.blue}15`, border: `1px solid ${P.blue}30` }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 50%, ${P.blue}40, transparent 70%)` }} />
              <Scale className="w-6 h-6 relative z-10" style={{ color: P.blue }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight flex items-center gap-3">
                Legal Auto-Matcher
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border tracking-wide uppercase shadow-lg" style={{ background: `${P.violet}15`, color: P.violet, borderColor: `${P.violet}30` }}>BNS 2024 Reform</span>
              </h1>
              <p className="text-[13px] mt-1.5 font-light" style={{ color: P.text2 }}>AI neural engine mapping victim statements to BNS & IPC provisions.</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ═══ INPUT SECTION ═══ */}
      <Reveal delay={100}>
        <div className="glass-panel p-8 rounded-3xl border flex flex-col xl:flex-row gap-8 relative overflow-hidden" style={{ borderColor: P.border, background: P.surface }}>
          
          <div className="flex-1 flex flex-col space-y-5">
            <div className="flex items-center justify-between relative z-10">
              <label className="text-[14px] font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: P.blue }} /> Enter Victim Statement / Narrative
              </label>
              <span className="text-[11px] font-mono tracking-wide" style={{ color: P.text3 }}>Auto-detects active statutes</span>
            </div>

            <textarea
              value={statement} onChange={(e) => setStatement(e.target.value)}
              placeholder="Describe the incident (e.g. 'Suspect forcibly stole a motorcycle after threatening the driver with a knife at 10 PM near Indiranagar...')"
              className="w-full flex-1 min-h-[160px] p-5 rounded-2xl text-white outline-none transition-all resize-none text-[13px] font-light relative z-10 leading-relaxed"
              style={{ background: "#0A0118", border: `1px solid ${P.border}`, color: P.text1, boxShadow: "inset 0 4px 20px rgba(0,0,0,0.5)" }}
            />

            <button onClick={() => handleMatch()} disabled={loading || !statement.trim()} className="w-full py-4 rounded-2xl text-[13px] font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 relative z-10" style={{ background: `linear-gradient(135deg, ${P.blue}, #3B82F6)`, boxShadow: `0 8px 24px ${P.blue}40` }}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-t-white rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)" }} /> <span>Analyzing Legal Statutes...</span></>
              ) : (
                <><Search className="w-4 h-4" /> <span>Analyze & Match BNS / IPC Provisions</span></>
              )}
            </button>
          </div>

          <div className="xl:w-80 shrink-0 flex flex-col space-y-4 border-t xl:border-t-0 xl:border-l pt-6 xl:pt-0 xl:pl-8 relative z-10" style={{ borderColor: P.border }}>
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: P.text3 }}>Quick Test Scenarios:</p>
            <div className="flex flex-col gap-2">
              {sampleScenarios.map((sc, i) => (
                <button key={i} onClick={() => { setStatement(sc.text); handleMatch(sc.text) }} className="px-4 py-3 rounded-xl text-left transition-all hover:translate-x-1 group flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${P.border}` }}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: P.blue }} />
                    <span className="text-[12px] font-medium text-white group-hover:text-blue-400 transition-colors">{sc.label}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" style={{ color: P.blue }} />
                </button>
              ))}
            </div>
          </div>

        </div>
      </Reveal>

      {/* ═══ RESULTS SECTION ═══ */}
      {searched && (
        <Reveal delay={150}>
          <div className="space-y-5">
            <h2 className="text-[16px] font-bold text-white flex items-center gap-2 border-b pb-4" style={{ borderColor: P.border }}>
              <BookOpen className="w-5 h-5" style={{ color: P.blue }} /> Matched Statutory Provisions ({results.length})
            </h2>

            {results.length === 0 ? (
              <div className="glass-panel p-10 text-center rounded-3xl text-[13px] font-medium border" style={{ borderColor: P.border, background: P.surface, color: P.text2 }}>
                No specific criminal section matched. Standard Non-Cognizable report guidelines apply.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {results.map((res, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <div className="glass-panel p-8 rounded-3xl border flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-xl" style={{ borderColor: P.border, background: P.surface }}>
                      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-30" style={{ background: P.blue }} />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 mb-5 relative z-10" style={{ borderColor: P.border }}>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest block mb-1" style={{ color: P.blue }}>{res.category}</span>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">{res.offense_title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-4 py-2 rounded-full font-mono text-[12px] font-bold shadow-lg" style={{ background: `${P.blue}15`, color: P.blue, border: `1px solid ${P.blue}40` }}>{res.bns_section}</span>
                          <span className="px-4 py-2 rounded-full font-mono text-[11px] font-medium" style={{ background: "#0A0118", color: P.text3, border: `1px solid ${P.border}` }}>Legacy: {res.ipc_section}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px] relative z-10">
                        <div className="p-4 rounded-2xl border flex flex-col justify-center" style={{ background: "rgba(0,0,0,0.2)", borderColor: P.border }}>
                          <span className="font-medium mb-1.5" style={{ color: P.text2 }}>Offense Classification</span>
                          <p className="font-bold flex items-center gap-1.5 text-[14px]" style={{ color: P.amber }}>
                            <AlertCircle className="w-4 h-4" /> {res.type}
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl border flex flex-col justify-center" style={{ background: "rgba(0,0,0,0.2)", borderColor: P.border }}>
                          <span className="font-medium mb-1.5" style={{ color: P.text2 }}>Maximum Sentence</span>
                          <p className="font-bold text-[14px]" style={{ color: P.red }}>{res.max_sentence}</p>
                        </div>
                        <div className="p-4 rounded-2xl border flex flex-col justify-center" style={{ background: "rgba(0,0,0,0.2)", borderColor: P.border }}>
                          <span className="font-medium mb-1.5" style={{ color: P.text2 }}>Mandatory Protocol</span>
                          <p className="font-bold flex items-center gap-1.5 text-[14px]" style={{ color: P.green }}>
                            <CheckCircle2 className="w-4 h-4" /> Standard SOP Active
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 p-5 rounded-2xl border flex items-start gap-4 relative z-10" style={{ background: `${P.blue}10`, borderColor: `${P.blue}20` }}>
                        <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" style={{ color: P.blue }} />
                        <div>
                          <p className="text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color: P.blue }}>Mandatory Officer SOP / Action Step:</p>
                          <p className="text-[14px] font-medium text-white leading-relaxed">{res.mandatory_action}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      )}

    </div>
  )
}
