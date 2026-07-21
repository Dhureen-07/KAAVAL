"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, User, Send, Mic, Loader2, Database, Activity, MapPin } from "lucide-react"
import ReactMarkdown from 'react-markdown'

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
      content: "Hello Officer. I am **KAAVAL AI**. I am connected to the live State Crime Records Bureau (SCRB) data lake.\n\nYou can ask me to search records, find connections, or predict trends. For example:\n* *'Show burglary cases in Mysuru during the last 6 months.'*\n* *'Is there a connection between Suspect A and any vehicles in Mangaluru?'*"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("kaaval_draft_context")
      if (draft) {
        setInput(draft)
        localStorage.removeItem("kaaval_draft_context")
      }
    }
  }, [])

  const startListening = () => {
    if (isListening) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("❌ Speech Recognition is not supported in your browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'kn-IN'; // Kannada - India
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech error:", event.error);
        if (event.error === 'not-allowed') {
          alert("🎤 Microphone access was denied! Please click the lock icon in your URL bar and allow microphone permissions.");
        } else if (event.error === 'network') {
          alert("📶 Network error: The browser cannot reach its speech recognition servers.");
        } else if (event.error === 'language-not-supported') {
          alert("🌐 Kannada speech recognition is not supported by this browser.");
        } else if (event.error !== 'no-speech') {
          alert(`⚠️ Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };
      
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } catch (e: any) {
      alert("Failed to start microphone: " + e.message);
      setIsListening(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/intelligence/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: userMessage.content, officer_id: "KA-1234" })
      });

      if (!res.ok) throw new Error("Backend connection failed");
      
      const data = await res.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        confidence: data.confidence_score,
        sources: data.sources
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Error: Could not reach the KAAVAL Intelligence Backend. Please ensure the Python FastAPI server is running on port 8000."
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full w-full overflow-hidden p-2">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="mb-4 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-primary" />
              Central Intelligence
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Encrypted Neural Interface to SCRB Systems.</p>
          </div>
          <div className="hidden md:flex px-4 py-1.5 rounded-full bg-success/10 text-success border border-success/30 text-xs font-bold items-center gap-2 shadow-[0_0_15px_rgba(24,198,122,0.15)]">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            Connection Secure
          </div>
        </div>

        <Card className="flex-1 glass-panel border-border/50 flex flex-col overflow-hidden shadow-2xl relative">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
          
          <CardContent className="flex-1 flex flex-col p-0 relative z-10 overflow-hidden">
            {/* The scrollable area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex items-start gap-4 max-w-[85%]">
                    {msg.role !== 'user' && (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0 border border-primary/40 text-primary shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                    )}
                    
                    <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-5 py-4 rounded-2xl text-sm shadow-md leading-relaxed prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-border/50 max-w-none
                        ${msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none border border-primary' 
                          : 'bg-[#1e1e24] border border-border/70 rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-zinc-300'}`}
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      
                      {msg.role === 'assistant' && msg.confidence && (
                        <div className="flex items-center gap-4 px-2 opacity-80">
                          <span className="text-[10px] text-success font-semibold flex items-center gap-1.5 bg-success/10 px-2.5 py-1 rounded-full border border-success/20 tracking-wider uppercase">
                            <Activity className="w-3 h-3" />
                            Match: {(msg.confidence * 100).toFixed(0)}%
                          </span>
                          {msg.sources && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                              <Database className="w-3 h-3" />
                              {msg.sources.join(" | ")}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 text-zinc-300 shadow-md">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-4 max-w-[80%]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0 border border-primary/40 text-primary shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-[#1e1e24] border border-border/70 rounded-tl-none flex items-center gap-3 shadow-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest ml-2">Accessing Records...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
            
            <div className="p-5 border-t border-border/50 bg-card/80 backdrop-blur-xl shrink-0">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Enter query parameters for the intelligence engine..." 
                  className="w-full bg-zinc-950/80 border border-border rounded-full pl-6 pr-24 py-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm shadow-inner placeholder:text-zinc-600 font-medium"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button 
                    onClick={startListening}
                    className={`p-3 rounded-full transition-colors flex items-center gap-2 ${
                      isListening 
                        ? 'bg-destructive/20 text-destructive animate-pulse' 
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    {isListening && <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">ಮಾತನಾಡಿ</span>}
                    <Mic className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-3 bg-primary text-white hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Telemetry Panel */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 gap-4 min-h-0">
        <Card className="glass-panel border-border/50 flex-1 overflow-hidden flex flex-col min-h-0">
          <CardHeader className="pb-3 border-b border-border/50 bg-card/50">
            <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              Active Nodes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {[
                { name: "Bengaluru City Police", status: "Syncing", color: "text-warning", bg: "bg-warning/20" },
                { name: "Mysuru District DB", status: "Online", color: "text-success", bg: "bg-success/20" },
                { name: "Telecom Records v2", status: "Online", color: "text-success", bg: "bg-success/20" },
                { name: "RTO Vehicle DB", status: "Online", color: "text-success", bg: "bg-success/20" },
                { name: "Facial Recognition API", status: "Idle", color: "text-muted-foreground", bg: "bg-muted" },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-300">{node.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-current/20 ${node.color} ${node.bg}`}>
                    {node.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel border-border/50 flex-1 overflow-hidden flex flex-col min-h-0">
          <CardHeader className="pb-3 border-b border-border/50 bg-card/50">
            <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Live Surveillance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative bg-black/40">
            {/* Fake radar/map aesthetic */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-primary/20 animate-ping absolute"></div>
              <div className="w-16 h-16 rounded-full border border-primary/40 animate-ping absolute [animation-delay:0.5s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_#6366f1]"></div>
            </div>
            <div className="absolute bottom-3 left-3 text-[10px] text-primary/70 font-mono">
              LAT: 12.9716 N<br/>
              LON: 77.5946 E
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
