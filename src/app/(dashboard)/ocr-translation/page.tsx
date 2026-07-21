"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Languages, Upload, Copy, Check, Sparkles, Image as ImageIcon, Send, RefreshCw, AlertCircle, FileSearch } from "lucide-react"

export default function OcrTranslationPage() {
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isOcrLoading, setIsOcrLoading] = useState(false)
  const [isTranslateLoading, setIsTranslateLoading] = useState(false)
  const [isFirLoading, setIsFirLoading] = useState(false)
  
  const [ocrText, setOcrText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [draftedFir, setDraftedFir] = useState("")
  
  const [targetLang, setTargetLang] = useState("kan_Kmr") // Default: Kannada
  const [ocrWarning, setOcrWarning] = useState<string | null>(null)
  const [translateWarning, setTranslateWarning] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(key)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.")
      return
    }
    
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
      setBase64Image(reader.result as string)
      // Reset outputs
      setOcrText("")
      setTranslatedText("")
      setDraftedFir("")
      setOcrWarning(null)
      setTranslateWarning(null)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const loadSampleTemplate = async () => {
    setImage("/images/sample_complaint.png")
    setBase64Image("data:image/png;base64,SAMPLE_TEMPLATE_BASE64_DATA")
    setOcrText("")
    setTranslatedText("")
    setDraftedFir("")
    setOcrWarning(null)
    setTranslateWarning(null)
  }

  const runOcr = async () => {
    if (!base64Image) return
    setIsOcrLoading(true)
    setOcrWarning(null)
    
    try {
      const res = await fetch("http://localhost:8000/api/intelligence/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: base64Image })
      })

      if (!res.ok) throw new Error("Failed to reach OCR API")
      const data = await res.json()
      setOcrText(data.text)
      if (data.warning) {
        setOcrWarning(data.warning)
      }
    } catch (e) {
      console.error(e)
      setOcrText("Error: OCR processing failed. Make sure the backend server is running on port 8000.")
    } finally {
      setIsOcrLoading(false)
    }
  }

  const runTranslation = async () => {
    if (!ocrText) return
    setIsTranslateLoading(true)
    setTranslateWarning(null)
    
    try {
      const res = await fetch("http://localhost:8000/api/intelligence/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: ocrText, target_lang: targetLang })
      })

      if (!res.ok) throw new Error("Failed to reach translation API")
      const data = await res.json()
      setTranslatedText(data.translated_text)
      if (data.warning) {
        setTranslateWarning(data.warning)
      }
    } catch (e) {
      console.error(e)
      setTranslatedText("Error: Translation processing failed. Make sure the backend server is running on port 8000.")
    } finally {
      setIsTranslateLoading(false)
    }
  }

  const draftFir = async () => {
    const textToDraft = ocrText || "No context provided"
    setIsFirLoading(true)
    
    try {
      const res = await fetch("http://localhost:8000/api/intelligence/draft-fir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transcript: textToDraft })
      })

      if (!res.ok) throw new Error("Failed to reach FIR drafting API")
      const data = await res.json()
      setDraftedFir(data.draft)
    } catch (e) {
      console.error(e)
      setDraftedFir("Error drafting FIR: Check backend connection.")
    } finally {
      setIsFirLoading(false)
    }
  }

  const sendToAssistant = (text: string) => {
    if (!text) return
    if (typeof window !== "undefined") {
      localStorage.setItem("kaaval_draft_context", text)
      router.push("/assistant")
    }
  }

  return (
    <div className="flex flex-col gap-6 p-2 min-h-0 w-full">
      {/* Header */}
      <div className="mb-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3 animate-in fade-in slide-in-from-left duration-500">
            <Languages className="w-8 h-8 text-indigo-500" />
            Document OCR & Translation
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Scan physical incident logs using TrOCR and translate language contexts using NLLB-200.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Hand: Document Upload & OCR */}
        <Card className="lg:col-span-5 glass-panel border-white/10 flex flex-col justify-between overflow-hidden shadow-xl min-h-[500px]">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-400" />
              Document Input
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Upload a scanned complaint/log or use a sample template to start.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col gap-5 justify-between">
            {/* Uploader Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden min-h-[220px]
                ${isDragging 
                  ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                  : image 
                    ? "border-white/10 bg-black/20" 
                    : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/20 hover:bg-zinc-950/50"}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {image ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group">
                  <img
                    src={image}
                    alt="Document preview"
                    className="max-h-full max-w-full object-contain p-2 rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-200">
                    <Upload className="w-8 h-8 text-indigo-400" />
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Replace Image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">Drag & Drop Image Here</p>
                    <p className="text-xs text-zinc-500 mt-1">Supports PNG, JPG, JPEG up to 10MB</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 text-xs border-zinc-800 text-zinc-300">
                    Browse Files
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Templates Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
                Demo Testing Templates
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={loadSampleTemplate}
                className="w-full flex items-center justify-center gap-2 border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-200 text-xs font-medium"
              >
                <FileSearch className="w-4 h-4 text-indigo-400" />
                Load Sample Incident Report (English)
              </Button>
            </div>

            {/* Run OCR Button */}
            <Button
              onClick={runOcr}
              disabled={!image || isOcrLoading}
              className="w-full shadow-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white py-5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-indigo-500/30"
            >
              {isOcrLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Extracting Text using TrOCR...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run OCR Text Extraction
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right Hand: OCR Output & Translation Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Extracted Text */}
          <Card className="glass-panel border-white/10 flex flex-col shadow-xl">
            <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Extracted Text Context
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Verify and edit the OCR results below before translating or drafting.
                </CardDescription>
              </div>
              {ocrText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(ocrText, "ocr")}
                  className="text-zinc-400 hover:text-white"
                >
                  {copiedText === "ocr" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col gap-4">
              <textarea
                value={ocrText}
                onChange={(e) => setOcrText(e.target.value)}
                placeholder="OCR output will appear here. You can edit this text directly..."
                className="w-full flex-1 min-h-[100px] bg-zinc-950/40 border border-white/5 rounded-xl p-4 text-zinc-300 focus:outline-none focus:border-indigo-500/50 font-mono text-sm leading-relaxed"
              />
              
              {ocrWarning && (
                <div className="text-[11px] text-yellow-500/90 flex items-center gap-1.5 mt-1 bg-yellow-500/5 px-2.5 py-1.5 rounded-lg border border-yellow-500/10">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{ocrWarning}</span>
                </div>
              )}

              {/* Translation Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Target Translation</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="kan_Kmr">Kannada (ಕನ್ನಡ - NLLB)</option>
                    <option value="eng_Latn">English (English - NLLB)</option>
                  </select>
                </div>

                <Button
                  onClick={runTranslation}
                  disabled={!ocrText || isTranslateLoading}
                  className="sm:self-end bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-medium text-xs flex items-center justify-center gap-2 py-5 rounded-lg border border-emerald-500/30"
                >
                  {isTranslateLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Translating (NLLB-200)...
                    </>
                  ) : (
                    <>
                      <Languages className="w-3.5 h-3.5" />
                      Translate Text Context
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Translation Output */}
          <Card className="glass-panel border-white/10 flex flex-col shadow-xl">
            <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Languages className="w-5 h-5 text-indigo-400" />
                  Translated Context Output
                </CardTitle>
              </div>
              {translatedText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(translatedText, "trans")}
                  className="text-zinc-400 hover:text-white"
                >
                  {copiedText === "trans" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col gap-4">
              <textarea
                readOnly
                value={translatedText}
                placeholder="Translated text will appear here..."
                className="w-full flex-1 min-h-[80px] bg-zinc-950/20 border border-white/5 rounded-xl p-4 text-zinc-300 font-mono text-sm leading-relaxed"
              />
              
              {translateWarning && (
                <div className="text-[11px] text-yellow-500/90 flex items-center gap-1.5 mt-1 bg-yellow-500/5 px-2.5 py-1.5 rounded-lg border border-yellow-500/10">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{translateWarning}</span>
                </div>
              )}

              {/* Integrations Toolbar */}
              <div className="flex flex-wrap gap-2.5 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendToAssistant(ocrText)}
                  disabled={!ocrText}
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold border-white/10 text-zinc-300 hover:text-white"
                >
                  <Send className="w-3.5 h-3.5 text-indigo-400" />
                  Import OCR to Assistant
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendToAssistant(translatedText)}
                  disabled={!translatedText}
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold border-white/10 text-zinc-300 hover:text-white"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  Import Translation to Assistant
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={draftFir}
                  disabled={!ocrText || isFirLoading}
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold border-white/10 text-zinc-300 hover:text-white"
                >
                  {isFirLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  Draft Structured FIR
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drafted FIR Display (optional output) */}
          {draftedFir && (
            <Card className="glass-panel border-white/10 flex flex-col overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between py-4">
                <CardTitle className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Drafted Legal FIR Document
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(draftedFir, "fir")}
                  className="text-zinc-400 hover:text-white"
                >
                  {copiedText === "fir" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardHeader>
              <CardContent className="p-4 bg-zinc-950/60">
                <pre className="whitespace-pre-wrap text-xs text-zinc-300 font-mono leading-relaxed max-h-[300px] overflow-y-auto">
                  {draftedFir}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
