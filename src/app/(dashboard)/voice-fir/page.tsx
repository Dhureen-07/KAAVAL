"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, Loader2, FileText, CheckCircle2, Copy, AlertTriangle, ShieldAlert } from "lucide-react"
import ReactMarkdown from 'react-markdown'

export default function VoiceToFIRPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isDrafting, setIsDrafting] = useState(false)
  const [draftedFIR, setDraftedFIR] = useState("")
  const [error, setError] = useState("")
  
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Web Speech API for true browser microphone recording
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = ""
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " "
          }
          setTranscript(currentTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setError(`Microphone error: ${event.error}. Please ensure microphone permissions are granted.`)
          setIsRecording(false)
        }
        
        recognitionRef.current.onend = () => {
          if (isRecording) {
            setIsRecording(false)
          }
        }
      } else {
        setError("Speech Recognition API is not supported in this browser. Please use Google Chrome or Microsoft Edge.")
      }
    }
  }, [isRecording])

  const handleToggleRecord = () => {
    if (!recognitionRef.current) {
      setError("Speech Recognition is not available. Please use Chrome/Edge.")
      return;
    }
    
    setError("")

    if (isRecording) {
      // Stop recording
      recognitionRef.current.stop()
      setIsRecording(false)
      generateFIR(transcript)
    } else {
      // Start recording
      setTranscript("")
      setDraftedFIR("")
      try {
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (err) {
        console.error("Could not start recording", err)
      }
    }
  }

  const generateFIR = async (finalTranscript: string) => {
    if (!finalTranscript.trim()) return;
    setIsDrafting(true);

    try {
      const res = await fetch("http://localhost:8000/api/intelligence/draft-fir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: finalTranscript })
      });

      if (!res.ok) throw new Error("Backend connection failed");
      
      const data = await res.json();
      setDraftedFIR(data.draft);
    } catch (error) {
      setDraftedFIR("**Error drafting FIR.** Please ensure the backend is running.");
    } finally {
      setIsDrafting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Mic className="w-8 h-8 text-primary" />
          Automated Voice-to-FIR
        </h1>
        <p className="text-muted-foreground mt-1">Speak directly into your microphone. KAAVAL AI will extract entities and draft a formal legal document.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/20 border border-destructive/50 text-destructive rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0 w-full h-full">
        {/* Recording Panel */}
        <Card className="glass-panel border-border/50 flex flex-col relative overflow-hidden h-[50vh] xl:h-auto min-h-[450px]">
          <CardHeader className="border-b border-border/50 bg-card/50">
            <CardTitle className="flex items-center justify-between">
              <span>Live Dictation Microphone</span>
              {isRecording && <span className="text-xs text-destructive flex items-center gap-2 animate-pulse"><div className="w-2 h-2 rounded-full bg-destructive"></div> LISTENING</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-8 relative">
            {/* Audio Waves Simulation */}
            {isRecording && (
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-48 h-48 border-4 border-primary rounded-full animate-ping"></div>
                <div className="w-64 h-64 border-2 border-primary rounded-full animate-ping [animation-delay:0.3s] absolute"></div>
              </div>
            )}
            
            <button 
              onClick={handleToggleRecord}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl z-10
                ${isRecording 
                  ? 'bg-destructive hover:bg-destructive/90 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-110' 
                  : 'bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-105'}`}
            >
              {isRecording ? <Square className="w-12 h-12 text-white" /> : <Mic className="w-14 h-14 text-white" />}
            </button>
            <p className="mt-8 text-muted-foreground font-medium text-center">
              {isRecording ? "Tap to Stop & Generate FIR" : "Tap to Start Speaking"}
              {!isRecording && <span className="block text-xs mt-1 opacity-60">(Browser will ask for microphone permission)</span>}
            </p>

            <div className="w-full mt-8 p-4 bg-zinc-950/80 rounded-xl border border-border/50 min-h-[150px] shadow-inner text-zinc-300 text-sm leading-relaxed relative overflow-y-auto">
              {transcript || <span className="text-muted-foreground/50 italic">Speak into your microphone to generate text...</span>}
              {isRecording && <span className="w-1.5 h-4 bg-primary inline-block ml-1 animate-pulse"></span>}
            </div>
          </CardContent>
        </Card>

        {/* Drafting Panel */}
        <Card className="glass-panel border-border/50 flex flex-col relative overflow-hidden h-[50vh] xl:h-auto min-h-[450px]">
          <CardHeader className="border-b border-border/50 bg-card/50">
            <CardTitle className="flex items-center gap-2 text-primary">
              <FileText className="w-5 h-5" />
              Generated Legal Draft
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col bg-zinc-950/40 relative">
            {isDrafting ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-bold">Synthesizing Legal Document...</h3>
                <p className="text-muted-foreground text-sm mt-2">Extracting entities and formatting via Intelligence Engine</p>
              </div>
            ) : draftedFIR ? (
              <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                <div className="bg-white text-black p-10 rounded shadow-xl min-h-full font-serif prose prose-sm max-w-none prose-headings:font-bold prose-headings:mb-2 prose-p:mb-4">
                  {/* Watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                    <ShieldAlert className="w-96 h-96" />
                  </div>
                  <ReactMarkdown>{draftedFIR}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                <FileText className="w-24 h-24 mb-4" />
                <p>Waiting for dictation...</p>
              </div>
            )}
            
            {draftedFIR && (
              <div className="p-4 border-t border-border/50 bg-card/80 backdrop-blur-xl flex justify-end gap-3 z-10">
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                  <Copy className="w-4 h-4" /> Copy Text
                </button>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <CheckCircle2 className="w-4 h-4" /> Approve & Submit to SCRB
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
