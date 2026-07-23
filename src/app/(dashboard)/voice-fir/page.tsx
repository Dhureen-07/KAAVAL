"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { Mic, Square, Loader2, FileText, CheckCircle2, Copy, AlertTriangle, ShieldAlert, Zap } from "lucide-react"
import ReactMarkdown from 'react-markdown'

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

export default function VoiceToFIRPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isDrafting, setIsDrafting] = useState(false)
  const [draftedFIR, setDraftedFIR] = useState("")
  const [error, setError] = useState("")
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = ""
          for (let i = 0; i < event.results.length; i++) currentTranscript += event.results[i][0].transcript + " "
          setTranscript(currentTranscript)
        }
        recognitionRef.current.onerror = (event: any) => {
          setError(`Microphone error: ${event.error}. Please allow permissions.`)
          setIsRecording(false)
        }
        recognitionRef.current.onend = () => { if (isRecording) setIsRecording(false) }
      } else setError("Speech Recognition API not supported. Use Chrome/Edge.")
    }
  }, [isRecording])

  const handleToggleRecord = () => {
    if (!recognitionRef.current) { setError("Speech Recognition unavailable."); return }
    setError("")
    if (isRecording) {
      recognitionRef.current.stop(); setIsRecording(false); generateFIR(transcript)
    } else {
      setTranscript(""); setDraftedFIR("");
      try { recognitionRef.current.start(); setIsRecording(true) } catch (err) {}
    }
  }

  const generateFIR = async (finalTranscript: string) => {
    if (!finalTranscript.trim()) return; setIsDrafting(true)
    try {
      const res = await fetch("http://localhost:8000/api/intelligence/draft-fir", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript: finalTranscript }) });
      if (!res.ok) throw new Error()
      const data = await res.json(); setDraftedFIR(data.draft)
    } catch (error) { setDraftedFIR("**Error drafting FIR.** Please ensure the backend is running.") } 
    finally { setIsDrafting(false) }
  }

  return (
    <div className="max-w-[1320px] mx-auto space-y-6 pb-20 h-[calc(100vh-120px)] min-h-[700px] flex flex-col">
      
      {/* ═══ HEADER ═══ */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-5 border-b shrink-0" style={{ borderColor: P.border }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl relative group overflow-hidden" style={{ background: `${P.coral}15`, border: `1px solid ${P.coral}30` }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 50%, ${P.coral}40, transparent 70%)` }} />
              <Mic className="w-6 h-6 relative z-10" style={{ color: P.coral }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight flex items-center gap-3">
                Voice-to-FIR
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border tracking-wide uppercase shadow-lg" style={{ background: `${P.violet}15`, color: P.violet, borderColor: `${P.violet}30` }}>AI Draft</span>
              </h1>
              <p className="text-[13px] mt-1.5 font-light" style={{ color: P.text2 }}>Speak to auto-generate a legal FIR via the Neural Intelligence engine.</p>
            </div>
          </div>
        </div>
      </Reveal>

      {error && (
        <Reveal delay={50} className="shrink-0">
          <div className="p-4 rounded-2xl text-[13px] font-bold flex items-center gap-3 border shadow-lg" style={{ background: `${P.red}15`, color: P.red, borderColor: `${P.red}30` }}>
            <AlertTriangle className="w-5 h-5 animate-pulse" /> {error}
          </div>
        </Reveal>
      )}

      {/* ═══ PANELS ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Left: Recording */}
        <Reveal delay={100} className="flex-1 flex flex-col h-full min-h-[450px]">
          <div className="glass-panel flex-1 rounded-3xl flex flex-col relative overflow-hidden border" style={{ borderColor: P.border, background: P.surface }}>
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b relative z-10" style={{ borderColor: P.border, background: "rgba(0,0,0,0.2)" }}>
              <span className="text-[13px] font-bold text-white flex items-center gap-2">
                <Mic className="w-4 h-4" style={{ color: P.coral }} /> Live Dictation
              </span>
              {isRecording && (
                <span className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-2" style={{ color: P.red }}>
                  <div className="w-2 h-2 rounded-full animate-ping" style={{ background: P.red }}></div> LISTENING
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
              {isRecording && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <div className="w-48 h-48 border-2 rounded-full animate-ping" style={{ borderColor: P.coral, animationDuration: "2s" }}></div>
                  <div className="w-72 h-72 border rounded-full animate-ping absolute" style={{ borderColor: P.coralSoft, animationDuration: "3s", animationDelay: "0.5s" }}></div>
                </div>
              )}
              
              <button onClick={handleToggleRecord} className="w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative z-10 hover:scale-105" style={{ background: isRecording ? `linear-gradient(135deg, ${P.red}, #E11D48)` : `linear-gradient(135deg, ${P.coral}, ${P.coralSoft})`, boxShadow: isRecording ? `0 0 50px ${P.red}60` : `0 0 40px ${P.coral}40` }}>
                {isRecording ? <Square className="w-10 h-10 text-white" /> : <Mic className="w-12 h-12 text-white" />}
              </button>
              
              <p className="mt-8 font-medium text-center text-[14px]" style={{ color: P.text1 }}>
                {isRecording ? "Tap to Stop & Generate FIR" : "Tap to Start Speaking"}
                {!isRecording && <span className="block text-[11px] mt-2 opacity-60 font-light">(Browser will ask for microphone permission)</span>}
              </p>

              <div className="w-full mt-8 p-5 rounded-2xl border text-[13px] leading-relaxed font-light relative overflow-y-auto" style={{ background: "#0A0118", borderColor: P.border, color: P.text1, boxShadow: "inset 0 4px 20px rgba(0,0,0,0.5)", height: "160px" }}>
                {transcript || <span className="italic" style={{ color: P.text3 }}>Speak into your microphone to generate text...</span>}
                {isRecording && <span className="w-1.5 h-4 inline-block ml-1 animate-pulse translate-y-1" style={{ background: P.coral }}></span>}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right: Drafting */}
        <Reveal delay={150} className="flex-1 flex flex-col h-full min-h-[450px]">
          <div className="glass-panel flex-1 rounded-3xl flex flex-col relative overflow-hidden border" style={{ borderColor: P.border, background: P.surface }}>
            {/* Header */}
            <div className="px-6 py-4 flex items-center gap-2 border-b relative z-10" style={{ borderColor: P.border, background: "rgba(0,0,0,0.2)" }}>
              <FileText className="w-4 h-4" style={{ color: P.violet }} />
              <span className="text-[13px] font-bold text-white">Generated Legal Draft</span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col bg-[#05010C] relative">
              {isDrafting ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{ background: "rgba(10,1,24,0.85)", backdropFilter: "blur(8px)" }}>
                  <div className="relative mb-6">
                    <Loader2 className="w-12 h-12 animate-spin" style={{ color: P.violet }} />
                    <Zap className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: P.coral }} />
                  </div>
                  <h3 className="text-[16px] font-bold text-white">Synthesizing Legal Document...</h3>
                  <p className="text-[12px] font-light mt-2" style={{ color: P.text2 }}>Extracting entities and formatting via Intelligence Engine</p>
                </div>
              ) : draftedFIR ? (
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                  <div className="bg-[#EAE5D9] text-[#1A1A1A] p-8 sm:p-10 rounded-xl shadow-2xl min-h-full font-serif prose prose-sm max-w-none prose-headings:font-bold prose-headings:mb-3 prose-p:mb-4 relative overflow-hidden" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}>
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                      <ShieldAlert className="w-[400px] h-[400px]" />
                    </div>
                    <ReactMarkdown>{draftedFIR}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                  <FileText className="w-20 h-20 mb-4" style={{ color: P.text3 }} />
                  <p className="text-[13px] font-medium" style={{ color: P.text2 }}>Waiting for dictation...</p>
                </div>
              )}
              
              {/* Footer Actions */}
              {draftedFIR && !isDrafting && (
                <div className="p-4 border-t flex justify-end gap-3 z-10" style={{ borderColor: P.border, background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}>
                  <button className="px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all hover:bg-white/10 flex items-center gap-2" style={{ color: P.text1, border: `1px solid ${P.border}` }}>
                    <Copy className="w-4 h-4" /> Copy Text
                  </button>
                  <button className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-105 flex items-center gap-2 shadow-lg" style={{ background: `linear-gradient(135deg, ${P.violet}, ${P.violetDim})`, boxShadow: `0 8px 24px ${P.violet}40` }}>
                    <CheckCircle2 className="w-4 h-4" /> Approve & Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
