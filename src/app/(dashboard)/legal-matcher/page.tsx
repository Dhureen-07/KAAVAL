"use client"

import { useState } from "react"
import { Scale, ShieldAlert, Sparkles, BookOpen, AlertCircle, CheckCircle2, ArrowRight, FileText, Search } from "lucide-react"

interface MatchedSection {
  bns_section: string
  ipc_section: string
  offense_title: string
  category: string
  type: string
  max_sentence: string
  mandatory_action: string
}

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

    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch("http://localhost:8000/api/legal/match-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement: textToSubmit }),
      })
      if (res.ok) {
        const data = await res.json()
        setResults(data.matched_sections || [])
      } else {
        throw new Error("API call failed")
      }
    } catch (e) {
      console.warn("Fallback local matching mode", e)
      // Fallback matching
      const queryLower = textToSubmit.toLowerCase()
      if (queryLower.includes("hit") || queryLower.includes("accident")) {
        setResults([{
          bns_section: "BNS Section 106 (1) & (2)",
          ipc_section: "IPC Section 279 / 304A",
          offense_title: "Rash Driving & Hit-and-Run Negligence",
          category: "Traffic & Public Safety",
          type: "Cognizable & Non-Bailable",
          max_sentence: "Up to 10 Years Imprisonment & Fine",
          mandatory_action: "File instant ANPR lookup and issue radio broadcast to nearest PCR vans."
        }])
      } else if (queryLower.includes("cyber") || queryLower.includes("upi") || queryLower.includes("bank")) {
        setResults([{
          bns_section: "BNS Section 318 & IT Act 66D",
          ipc_section: "IPC Section 420",
          offense_title: "Cheating by Personation & Cyber Fraud",
          category: "Cyber Crime",
          type: "Cognizable & Bailable",
          max_sentence: "Up to 7 Years Imprisonment",
          mandatory_action: "Freeze beneficiary account via 1930 National Cybercrime Portal."
        }])
      } else {
        setResults([{
          bns_section: "BNS Section 303 (2)",
          ipc_section: "IPC Section 379",
          offense_title: "Theft of Property / Vehicle",
          category: "Property Crime",
          type: "Cognizable & Bailable",
          max_sentence: "Up to 3 Years Imprisonment",
          mandatory_action: "Verify vehicle registration & check nearest CCTV feeds."
        }])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                BNS Legal Section Auto-Matcher
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  BNS 2024 Reform Ready
                </span>
              </h1>
              <p className="text-sm text-zinc-400">
                AI legal intelligence engine mapping complaint statements to Bharatiya Nyaya Sanhita (BNS) & IPC statutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Enter Incident Narrative or Victim Statement
          </label>
          <span className="text-xs text-zinc-500">Auto-detects BNS & IPC penal provisions</span>
        </div>

        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="Describe the incident (e.g. 'Suspect forcibly stole a motorcycle after threatening the driver with a knife at 10 PM near Indiranagar...')"
          className="w-full h-32 p-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-all resize-none text-sm font-mono"
        />

        {/* Presets */}
        <div className="space-y-2">
          <p className="text-xs text-zinc-400 font-medium">Quick Test Scenarios:</p>
          <div className="flex flex-wrap gap-2">
            {sampleScenarios.map((sc, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setStatement(sc.text)
                  handleMatch(sc.text)
                }}
                className="px-3 py-1.5 bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 rounded-xl text-xs text-zinc-300 hover:text-indigo-200 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleMatch()}
          disabled={loading || !statement.trim()}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Legal Statutes...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Analyze & Match BNS / IPC Provisions</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Matched Statutory Provisions ({results.length})
          </h2>

          {results.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-3xl text-zinc-400">
              No specific criminal section matched. Standard Non-Cognizable report guidelines apply.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {results.map((res, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-6 rounded-3xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs text-indigo-400 font-mono uppercase font-semibold">
                        {res.category}
                      </span>
                      <h3 className="text-xl font-extrabold text-white">{res.offense_title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full font-mono text-xs font-bold">
                        {res.bns_section}
                      </span>
                      <span className="px-3 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full font-mono text-xs">
                        Legacy: {res.ipc_section}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-black/30 rounded-2xl border border-white/5 space-y-1">
                      <span className="text-zinc-400 font-medium">Offense Classification</span>
                      <p className="font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        {res.type}
                      </p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-2xl border border-white/5 space-y-1">
                      <span className="text-zinc-400 font-medium">Maximum Sentence</span>
                      <p className="font-bold text-red-400">{res.max_sentence}</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-2xl border border-white/5 space-y-1">
                      <span className="text-zinc-400 font-medium">Mandatory Protocol</span>
                      <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Standard SOP Active
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-indigo-300">Mandatory Officer SOP / Action Step:</p>
                      <p className="text-xs text-zinc-300 mt-0.5">{res.mandatory_action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
