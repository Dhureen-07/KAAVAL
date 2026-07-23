"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { ShieldAlert, User, Send, Mic, Database, Activity, MapPin, Sparkles } from "lucide-react"
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

interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  confidence?: number;
  sources?: string[];
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content: "Hello Officer. I am **KAAVAL AI**, connected to the live State Crime Records Bureau (SCRB) datasets.\n\nAsk me to cross-reference evidence, summarize case files, or predict anomaly hotspots. For example:\n* *'Show burglary patterns in Mysuru during the last 30 days.'*\n* *'Match Suspect A against active ANPR records in Mangaluru.'*"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("kaaval_draft_context")
      if (draft) { setInput(draft); localStorage.removeItem("kaaval_draft_context") }
    }
  }, [])

  const startListening = () => {
    if (isListening) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech Recognition not supported in your browser."); return; }

    try {
      const r = new SpeechRecognition();
      r.lang = 'en-IN';
      r.continuous = false; r.interimResults = true;
      r.onstart = () => setIsListening(true);
      r.onresult = (e: any) => setInput(Array.from(e.results).map((res: any) => res[0].transcript).join(''));
      r.onerror = (e: any) => { console.error("Speech error", e.error); setIsListening(false); };
      r.onend = () => setIsListening(false);
      r.start();
    } catch (e: any) {
      alert("Microphone error: " + e.message); setIsListening(false);
    }
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  useEffect(() => { scrollToBottom() }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(p => [...p, userMsg]); setInput(""); setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/intelligence/query", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg.content, officer_id: "KA-1234" })
      });
      if (!res.ok) throw new Error("Backend connection failed");
      const data = await res.json();
      setMessages(p => [...p, { id: Date.now().toString(), role: "assistant", content: data.response, confidence: data.confidence_score, sources: data.sources }]);
    } catch (error) {
      setMessages(p => [...p, { id: Date.now().toString(), role: "assistant", content: "⚠️ Warning: The KAAVAL Intelligence Backend (Python FastAPI) is currently offline. Neural processing suspended." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-[1320px] mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px] pb-6">
      
      {/* ═══ MAIN CHAT INTERFACE ═══ */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full">
        
        <Reveal>
          <div className="flex items-end justify-between gap-4 pb-5 mb-5" style={{ borderBottom: `1px solid ${P.border}` }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl relative group overflow-hidden" style={{ background: `${P.violet}15`, border: `1px solid ${P.violet}30` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 50%, ${P.violet}40, transparent 70%)` }} />
                <Sparkles className="w-6 h-6 relative z-10" style={{ color: P.violet }} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">Neural Interface</h1>
                <p className="text-[13px] mt-1 font-light" style={{ color: P.text2 }}>RAG-powered investigative assistant linked to KAAVAL Datasets</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase" style={{ background: `${P.green}10`, color: P.green, border: `1px solid ${P.green}20`, boxShadow: `0 0 16px ${P.green}20` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: P.green }} />
              Secure Link Active
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="flex-1 min-h-0">
          <div className="glass-panel flex flex-col overflow-hidden h-full rounded-3xl relative border" style={{ borderColor: `${P.border}`, background: P.surface }}>
            
            {/* Scrollable messages area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 scrollbar-thin">
              {messages.map((msg, i) => (
                <Reveal key={msg.id} delay={i * 50} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-3 sm:gap-4 max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    {msg.role !== 'user' ? (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-1" style={{ background: `${P.violet}15`, borderColor: `${P.violet}40`, color: P.violet, boxShadow: `0 0 12px ${P.violet}20` }}>
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-1" style={{ background: "rgba(255,255,255,0.05)", borderColor: P.border, color: P.text2 }}>
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    
                    <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {/* Message Bubble */}
                      <div className={`px-5 py-4 text-[13.5px] leading-relaxed shadow-lg
                        prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 max-w-none font-light
                        ${msg.role === 'user' 
                          ? 'text-white rounded-[20px] rounded-tr-[4px]' 
                          : 'text-[#E2DCEF] rounded-[20px] rounded-tl-[4px] border'}`}
                        style={msg.role === 'user' 
                          ? { background: `linear-gradient(135deg, ${P.coral}, ${P.coralSoft})`, boxShadow: `0 8px 24px ${P.coral}30` }
                          : { background: "#110920", borderColor: "rgba(255,255,255,0.08)" }
                        }
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      
                      {/* Metadata / Confidence */}
                      {msg.role === 'assistant' && (msg.confidence || msg.sources) && (
                        <div className="flex flex-wrap items-center gap-3 px-2">
                          {msg.confidence && (
                            <span className="text-[10px] font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ background: `${P.green}15`, color: P.green, border: `1px solid ${P.green}30` }}>
                              <Activity className="w-3 h-3" />
                              Match: {(msg.confidence * 100).toFixed(0)}%
                            </span>
                          )}
                          {msg.sources && (
                            <span className="text-[10px] flex items-center gap-1.5 uppercase tracking-wider font-semibold" style={{ color: P.text3 }}>
                              <Database className="w-3 h-3" />
                              {msg.sources.join(" · ")}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </Reveal>
              ))}
              
              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border" style={{ background: `${P.violet}15`, borderColor: `${P.violet}40`, color: P.violet }}>
                      <ShieldAlert className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="px-5 py-4 rounded-[20px] rounded-tl-[4px] flex items-center gap-3 border shadow-lg" style={{ background: "#110920", borderColor: "rgba(255,255,255,0.08)" }}>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ background: P.violet }}></span>
                        <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ background: P.violet }}></span>
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: P.violet }}></span>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest ml-2" style={{ color: P.text3 }}>Processing Query...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
            
            {/* Input Area */}
            <div className="p-4 sm:p-5 shrink-0" style={{ borderTop: `1px solid ${P.border}`, background: "rgba(0,0,0,0.2)" }}>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask KAAVAL AI about suspects, patterns, or timelines..." 
                  className="w-full rounded-2xl pl-5 pr-28 py-4 focus:outline-none transition-all text-[13px] font-medium"
                  style={{ background: "#0A0118", border: `1px solid ${P.border}`, color: P.text1, boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)" }}
                />
                <div className="absolute right-2 flex items-center gap-1.5">
                  <button 
                    onClick={startListening}
                    className="p-2.5 rounded-xl transition-colors flex items-center gap-2 group"
                    style={{ color: isListening ? P.red : P.text2, background: isListening ? `${P.red}15` : "transparent" }}
                  >
                    <Mic className={`w-5 h-5 transition-transform ${isListening ? "animate-pulse scale-110" : "group-hover:text-white"}`} />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2.5 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${P.violet}, ${P.violetDim})`, boxShadow: `0 4px 16px ${P.violet}40` }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ═══ SIDEBAR TELEMETRY ═══ */}
      <div className="hidden lg:flex flex-col w-[320px] shrink-0 gap-5 min-h-0">
        <Reveal delay={150} className="flex-1 flex flex-col min-h-0">
          <div className="glass-panel flex-1 rounded-3xl p-5 flex flex-col border" style={{ borderColor: P.border, background: P.surface }}>
            <h3 className="text-[11px] font-bold tracking-wider uppercase flex items-center gap-2 mb-4 pb-3" style={{ color: P.text2, borderBottom: `1px solid ${P.border}` }}>
              <Database className="w-4 h-4" style={{ color: P.violet }} /> Connected RAG Nodes
            </h3>
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {[
                { name: "Bengaluru City Intel DB", status: "Syncing", color: P.amber },
                { name: "Mysuru District DB", status: "Online", color: P.green },
                { name: "Telecom Records Archive", status: "Online", color: P.green },
                { name: "RTO Vehicle ANPR", status: "Online", color: P.green },
                { name: "Facial Recognition API", status: "Idle", color: P.text3 },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <span className="text-[12px] font-medium text-white transition-colors group-hover:text-[#FF6B42]">{node.name}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border" style={{ color: node.color, background: `${node.color}15`, borderColor: `${node.color}30` }}>
                    {node.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        
        <Reveal delay={200} className="flex-1 flex flex-col min-h-0">
          <div className="glass-panel flex-1 rounded-3xl p-5 flex flex-col border relative overflow-hidden group" style={{ borderColor: P.border, background: P.surface }}>
            <h3 className="text-[11px] font-bold tracking-wider uppercase flex items-center gap-2 mb-4 relative z-10" style={{ color: P.text2 }}>
              <MapPin className="w-4 h-4" style={{ color: P.coral }} /> Live Network Ping
            </h3>
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#0A0118] border" style={{ borderColor: P.border }}>
              {/* Radar rings */}
              <div className="absolute inset-0 flex items-center justify-center opacity-60">
                <div className="w-32 h-32 rounded-full border animate-ping absolute" style={{ borderColor: `${P.coral}30`, animationDuration: "3s" }}></div>
                <div className="w-16 h-16 rounded-full border animate-ping absolute" style={{ borderColor: `${P.coral}40`, animationDuration: "3s", animationDelay: "1s" }}></div>
                <div className="w-2 h-2 rounded-full" style={{ background: P.coral, boxShadow: `0 0 16px ${P.coral}` }}></div>
              </div>
              <div className="absolute bottom-3 left-3 text-[10px] font-mono font-semibold" style={{ color: P.text2 }}>
                NODE: BLR-HQ-01<br/>
                LAT: 12.9716 N<br/>
                LON: 77.5946 E
              </div>
            </div>
          </div>
        </Reveal>
      </div>

    </div>
  )
}
