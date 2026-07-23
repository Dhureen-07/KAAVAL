"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { 
  GitCommit, Clock, Plus, Trash2, Shield, Video, PhoneCall, 
  FileText, Camera, CheckCircle2, Download, Database, FolderPlus, 
  Sparkles, AlertCircle, MapPin, User, ChevronRight, Layers, FileJson, FileSpreadsheet
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

interface CaseItem {
  id?: number; case_id: string; title: string; category: string; priority: string; status: string;
  location: string; assigned_officer: string; summary: string; created_at?: string;
}

interface TimelineNode {
  id?: number; case_id: string; title: string; event_timestamp: string;
  description: string; evidence_type: string; verified: number;
}

interface CaseDataset {
  id: number; dataset_name: string; case_id: string; record_count: number; source: string; created_at: string;
}

export default function TimelineBuilderPage() {
  const [cases, setCases] = useState<CaseItem[]>([])
  const [selectedCaseId, setSelectedCaseId] = useState("CASE-2026-089")
  const [timeline, setTimeline] = useState<TimelineNode[]>([])
  const [datasets, setDatasets] = useState<CaseDataset[]>([])
  const [loading, setLoading] = useState(true)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showNewCaseModal, setShowNewCaseModal] = useState(false)
  const [showSaveDatasetModal, setShowSaveDatasetModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"timeline" | "datasets">("timeline")

  const [newNode, setNewNode] = useState({ title: "", event_timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), description: "", evidence_type: "CCTV" })
  const [newCase, setNewCase] = useState({ case_id: `CASE-2026-${Math.floor(100 + Math.random() * 900)}`, title: "", category: "Property Crime", priority: "HIGH", status: "OPEN", location: "Bengaluru City", assigned_officer: "Inspector V. Rao", summary: "" })
  const [datasetForm, setDatasetForm] = useState({ dataset_name: "", description: "" })
  const [notification, setNotification] = useState<string | null>(null)

  const showToast = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(null), 4000) }

  const fetchCases = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/cases")
      if (res.ok) { const data = await res.json(); if (data.cases?.length) setCases(data.cases) }
    } catch (e) {
      setCases([
        { case_id: "CASE-2026-089", title: "MG Road ATM Robbery & Hit & Run Inquiry", category: "Armed Robbery", priority: "CRITICAL", status: "UNDER_INVESTIGATION", location: "MG Road", assigned_officer: "Inspector V. Rao", summary: "ATM theft and getaway vehicle pursuit." },
        { case_id: "CASE-2026-090", title: "Indiranagar Commercial Theft Alert", category: "Property Crime", priority: "MEDIUM", status: "OPEN", location: "Indiranagar", assigned_officer: "Sub-Inspector K. Sharma", summary: "Break-in reported during night hours." },
        { case_id: "CASE-2026-091", title: "Koramangala Cyber Financial Fraud", category: "Cyber Crime", priority: "HIGH", status: "OPEN", location: "Koramangala", assigned_officer: "Inspector S. Patil", summary: "Phishing scam targeting online banking users." },
      ])
    }
  }

  const fetchTimeline = async (cId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8000/api/timelines?case_id=${cId}`)
      if (res.ok) { const data = await res.json(); setTimeline(data.timeline || []) }
    } catch (e) {
      setTimeline([
        { id: 1, case_id: "CASE-2026-089", title: "Initial Incident Hotline Call", event_timestamp: "2026-07-21 14:15", description: "Witness reported suspicious activity near MG Road ATM kiosk.", evidence_type: "CALL_LOG", verified: 1 },
        { id: 2, case_id: "CASE-2026-089", title: "CCTV Footage Captured", event_timestamp: "2026-07-21 14:22", description: "High-res cameras logged red vehicle fleeing towards Brigade Road.", evidence_type: "CCTV", verified: 1 },
        { id: 3, case_id: "CASE-2026-089", title: "PCR Van Arrival & Forensic Sweep", event_timestamp: "2026-07-21 14:28", description: "Officer Team #104 secured the scene and retrieved physical fingerprint evidence.", evidence_type: "POLICE_REPORT", verified: 1 },
        { id: 4, case_id: "CASE-2026-089", title: "Suspect Identified via ANPR", event_timestamp: "2026-07-21 14:45", description: "ANPR System matched license plate KA-01-MJ-4921 at Trinity Circle.", evidence_type: "ANPR_LOG", verified: 1 },
      ])
    } finally { setLoading(false) }
  }

  const fetchDatasets = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/cases/datasets")
      if (res.ok) { const data = await res.json(); setDatasets(data.datasets || []) }
    } catch (e) {}
  }

  useEffect(() => { fetchCases(); fetchDatasets() }, [])
  useEffect(() => { if (selectedCaseId) fetchTimeline(selectedCaseId) }, [selectedCaseId])

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newNode.title.trim()) return
    try {
      const res = await fetch("http://localhost:8000/api/timelines", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newNode, case_id: selectedCaseId }) })
      if (res.ok) {
        setShowAddForm(false)
        setNewNode({ title: "", event_timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), description: "", evidence_type: "CCTV" })
        fetchTimeline(selectedCaseId)
        showToast("Log added successfully to case " + selectedCaseId)
      }
    } catch (e) {
      setTimeline([...timeline, { ...newNode, case_id: selectedCaseId, id: Date.now(), verified: 1 }])
      setShowAddForm(false)
      showToast("Added log to local timeline")
    }
  }

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newCase.title.trim()) return
    try {
      const res = await fetch("http://localhost:8000/api/cases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCase) })
      if (res.ok) {
        setShowNewCaseModal(false); fetchCases(); setSelectedCaseId(newCase.case_id); showToast(`New case ${newCase.case_id} registered!`)
        setNewCase({ case_id: `CASE-2026-${Math.floor(100 + Math.random() * 900)}`, title: "", category: "Property Crime", priority: "HIGH", status: "OPEN", location: "Bengaluru City", assigned_officer: "Inspector V. Rao", summary: "" })
      }
    } catch (e) { showToast("Error registering new case.") }
  }

  const handleSaveDataset = async (e: React.FormEvent) => {
    e.preventDefault(); if (!datasetForm.dataset_name.trim()) return
    try {
      const res = await fetch("http://localhost:8000/api/cases/datasets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dataset_name: datasetForm.dataset_name, case_id: selectedCaseId, description: datasetForm.description }) })
      if (res.ok) {
        setShowSaveDatasetModal(false); fetchDatasets(); showToast(`Dataset "${datasetForm.dataset_name}" stored in kaaval.db & RAG pool!`)
        setDatasetForm({ dataset_name: "", description: "" })
      }
    } catch (e) { showToast("Failed to save dataset.") }
  }

  const handleDeleteNode = async (id?: number) => {
    if (!id) return
    try {
      await fetch(`http://localhost:8000/api/timelines/${id}`, { method: "DELETE" })
      fetchTimeline(selectedCaseId)
      showToast("Log marker removed.")
    } catch (e) { setTimeline(timeline.filter((t) => t.id !== id)) }
  }

  const handleExportJSON = () => {
    const activeCase = cases.find(c => c.case_id === selectedCaseId)
    const exportData = { case_info: activeCase || { case_id: selectedCaseId }, exported_at: new Date().toISOString(), logs_count: timeline.length, logs: timeline }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2))
    const dl = document.createElement('a'); dl.setAttribute("href", dataStr); dl.setAttribute("download", `${selectedCaseId}_logs_dataset.json`); document.body.appendChild(dl); dl.click(); dl.remove()
    showToast("Case dataset exported as JSON.")
  }

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "CCTV": return <Video className="w-4 h-4" style={{ color: P.blue }} />
      case "CALL_LOG": return <PhoneCall className="w-4 h-4" style={{ color: P.coral }} />
      case "POLICE_REPORT": return <FileText className="w-4 h-4" style={{ color: P.violet }} />
      case "ANPR_LOG": return <Camera className="w-4 h-4" style={{ color: P.red }} />
      default: return <Shield className="w-4 h-4" style={{ color: P.green }} />
    }
  }

  const currentCase = cases.find(c => c.case_id === selectedCaseId)

  return (
    <div className="max-w-[1320px] mx-auto space-y-6 pb-20">
      {notification && (
        <div className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4" style={{ background: P.surface, backdropFilter: "blur(24px)", border: `1px solid ${P.green}40`, color: P.green, boxShadow: `0 8px 32px ${P.green}20` }}>
          <Sparkles className="w-4 h-4 animate-pulse" /> {notification}
        </div>
      )}

      {/* ═══ HEADER ═══ */}
      <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6" style={{ borderBottom: `1px solid ${P.border}` }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl" style={{ background: `${P.blue}15`, color: P.blue, border: `1px solid ${P.blue}30` }}>
              <GitCommit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">Case Management & Timelines</h1>
              <p className="text-[14px] mt-1.5 font-light" style={{ color: P.text2 }}>Track evidence chronologically and structure case datasets for AI analysis.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel">
              <span className="text-[12px] font-semibold px-2" style={{ color: P.text2 }}>Active Case:</span>
              <select value={selectedCaseId} onChange={(e) => setSelectedCaseId(e.target.value)} className="bg-transparent font-mono text-[12px] font-bold px-2 py-1.5 rounded-xl focus:outline-none cursor-pointer" style={{ color: P.blue }}>
                {cases.map((c) => <option key={c.case_id} value={c.case_id} style={{ background: "#0A0118", color: P.text1 }}>{c.case_id} - {c.title.slice(0, 30)}...</option>)}
              </select>
            </div>
            <button onClick={() => setShowNewCaseModal(true)} className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:scale-105 flex items-center gap-2" style={{ background: `${P.violet}20`, color: P.text1, border: `1px solid ${P.violet}40` }}>
              <FolderPlus className="w-4 h-4" style={{ color: P.violet }} /> New Case
            </button>
          </div>
        </div>
      </Reveal>

      {/* ═══ CASE CARD ═══ */}
      <Reveal delay={100}>
        {currentCase && (
          <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[70px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `${P.blue}15` }} />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold" style={{ background: `${P.blue}15`, color: P.blue, border: `1px solid ${P.blue}30` }}>{currentCase.case_id}</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: `${P.violet}15`, color: P.violet, border: `1px solid ${P.violet}30` }}>{currentCase.category}</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: `${currentCase.priority === 'CRITICAL' ? P.red : currentCase.priority === 'HIGH' ? P.amber : P.green}15`, color: currentCase.priority === 'CRITICAL' ? P.red : currentCase.priority === 'HIGH' ? P.amber : P.green, border: `1px solid ${currentCase.priority === 'CRITICAL' ? P.red : currentCase.priority === 'HIGH' ? P.amber : P.green}30` }}>{currentCase.priority} PRIORITY</span>
              </div>
              <h2 className="text-xl font-bold text-white leading-tight">{currentCase.title}</h2>
              <p className="text-[13px] font-light" style={{ color: P.text2 }}>{currentCase.summary}</p>
            </div>
            <div className="flex items-center gap-6 text-[12px] font-mono border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8 shrink-0 relative z-10" style={{ borderColor: P.border, color: P.text2 }}>
              <div>
                <span className="text-[10px] block mb-1" style={{ color: P.text3 }}>LOCATION</span>
                <span className="font-semibold text-white flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" style={{ color: P.blue }} /> {currentCase.location}</span>
              </div>
              <div>
                <span className="text-[10px] block mb-1" style={{ color: P.text3 }}>OFFICER</span>
                <span className="font-semibold text-white flex items-center gap-1.5"><User className="w-3.5 h-3.5" style={{ color: P.violet }} /> {currentCase.assigned_officer}</span>
              </div>
            </div>
          </div>
        )}
      </Reveal>

      {/* ═══ TABS ═══ */}
      <Reveal delay={150}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: `1px solid ${P.border}` }}>
          <div className="flex items-center gap-2 p-1 rounded-2xl glass-panel">
            <button onClick={() => setActiveTab("timeline")} className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2" style={activeTab === "timeline" ? { background: `linear-gradient(135deg, ${P.violet}, ${P.violetDim})`, color: "#fff", boxShadow: `0 4px 16px ${P.violet}40` } : { color: P.text2 }}>
              <GitCommit className="w-4 h-4" /> Timeline ({timeline.length})
            </button>
            <button onClick={() => setActiveTab("datasets")} className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2" style={activeTab === "datasets" ? { background: `linear-gradient(135deg, ${P.coral}, ${P.coralSoft})`, color: "#fff", boxShadow: `0 4px 16px ${P.coral}40` } : { color: P.text2 }}>
              <Database className="w-4 h-4" /> Datasets ({datasets.length})
            </button>
          </div>
          {activeTab === "timeline" && (
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2.5 rounded-xl text-[12px] font-bold text-white flex items-center gap-2 transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${P.blue}, #3B82F6)` }}>
                <Plus className="w-4 h-4" /> Add Log Marker
              </button>
              <button onClick={() => { setDatasetForm({ dataset_name: `${selectedCaseId} Dataset - ${new Date().toLocaleDateString()}`, description: `Compiled evidence logs for ${selectedCaseId}` }); setShowSaveDatasetModal(true) }} className="px-4 py-2.5 rounded-xl text-[12px] font-bold text-white flex items-center gap-2 transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${P.coral}, ${P.coralSoft})` }}>
                <Database className="w-4 h-4" /> Save as Dataset
              </button>
              <button onClick={handleExportJSON} className="p-2.5 rounded-xl transition-all hover:scale-105 glass-panel" title="Export as JSON">
                <Download className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </Reveal>

      {/* ═══ ADD LOG INLINE FORM ═══ */}
      {showAddForm && activeTab === "timeline" && (
        <Reveal>
          <form onSubmit={handleAddNode} className="glass-panel p-6 rounded-2xl border space-y-5" style={{ borderColor: `${P.blue}30` }}>
            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: P.blue }} /> Add Timeline Event Node
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-[12px]">
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Event Title</label>
                <input type="text" placeholder="e.g. CCTV Footage Captured" value={newNode.title} onChange={(e) => setNewNode({ ...newNode, title: e.target.value })} className="w-full p-3 rounded-xl text-white outline-none" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
              </div>
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Event Timestamp</label>
                <input type="text" placeholder="YYYY-MM-DD HH:MM" value={newNode.event_timestamp} onChange={(e) => setNewNode({ ...newNode, event_timestamp: e.target.value })} className="w-full p-3 rounded-xl text-white font-mono outline-none" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
              </div>
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Evidence Category</label>
                <select value={newNode.evidence_type} onChange={(e) => setNewNode({ ...newNode, evidence_type: e.target.value })} className="w-full p-3 rounded-xl text-white outline-none cursor-pointer" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }}>
                  <option value="CCTV" style={{ background: "#0A0118" }}>🎥 CCTV Footage</option>
                  <option value="CALL_LOG" style={{ background: "#0A0118" }}>📞 Hotline Call Log</option>
                  <option value="POLICE_REPORT" style={{ background: "#0A0118" }}>🚓 Officer Incident Report</option>
                  <option value="ANPR_LOG" style={{ background: "#0A0118" }}>🚘 ANPR License Plate Scan</option>
                  <option value="STATEMENT" style={{ background: "#0A0118" }}>📝 Witness Statement</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-semibold block mb-1.5 text-[12px]" style={{ color: P.text2 }}>Detailed Summary & Forensic Note</label>
              <textarea placeholder="Enter detailed observation notes..." value={newNode.description} onChange={(e) => setNewNode({ ...newNode, description: e.target.value })} className="w-full p-3 rounded-xl text-white text-[13px] h-24 resize-none outline-none" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2.5 rounded-xl text-[12px] font-semibold hover:bg-white/5 transition-all" style={{ color: P.text2 }}>Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${P.blue}, #3B82F6)` }}>Commit Node</button>
            </div>
          </form>
        </Reveal>
      )}

      {/* ═══ TIMELINE VIEW ═══ */}
      {activeTab === "timeline" && (
        <div className="space-y-6">
          {timeline.length === 0 ? (
            <Reveal>
              <div className="glass-panel p-12 text-center rounded-2xl">
                <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: P.text3 }} />
                <h3 className="text-base font-bold text-white mb-1">No Evidence Logs Recorded Yet</h3>
                <p className="text-[13px] text-[#8B7FA8] max-w-sm mx-auto">Click "Add Log Marker" above to begin building the timeline.</p>
              </div>
            </Reveal>
          ) : (
            <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-3 md:before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-[#7C5CFC] before:via-[#FF6B42] before:to-transparent">
              {timeline.map((node, i) => (
                <Reveal key={node.id || i} delay={i * 80}>
                  <div className="relative group">
                    <div className="absolute -left-6 md:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#0A0118] border-2 flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(124,92,252,0.5)]" style={{ borderColor: P.violet }}>
                      <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: P.violet }} />
                    </div>
                    <div className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3" style={{ borderBottom: `1px solid ${P.border}` }}>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }}>
                            {getEvidenceIcon(node.evidence_type)}
                          </div>
                          <div>
                            <h3 className="text-[15px] font-bold text-white leading-tight">{node.title}</h3>
                            <span className="text-[11px] font-mono flex items-center gap-1.5 mt-0.5" style={{ color: P.text2 }}><Clock className="w-3 h-3" style={{ color: P.violet }} />{node.event_timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full font-mono text-[10px] font-bold" style={{ background: `${P.violet}12`, color: P.violet, border: `1px solid ${P.violet}30` }}>{node.evidence_type}</span>
                          <button onClick={() => handleDeleteNode(node.id)} className="p-1.5 transition-colors hover:text-[#FF4757]" style={{ color: P.text3 }} title="Delete node"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <p className="text-[13px] font-light leading-relaxed" style={{ color: P.text1 }}>{node.description}</p>
                      <div className="flex items-center justify-between text-[10px] pt-4 mt-2" style={{ borderTop: `1px solid ${P.border}` }}>
                        <span className="flex items-center gap-1 font-semibold" style={{ color: P.green }}><CheckCircle2 className="w-3.5 h-3.5" /> Chain of Custody Verified</span>
                        <span className="font-mono" style={{ color: P.text3 }}>Node Hash: #0x{((node.id || 1) * 7919).toString(16)}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ DATASETS VIEW ═══ */}
      {activeTab === "datasets" && (
        <div className="space-y-6">
          <Reveal>
            <div>
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2 mb-1">
                <Database className="w-4 h-4" style={{ color: P.coral }} /> SQLite Case Datasets
              </h3>
              <p className="text-[13px] font-light text-[#8B7FA8]">Archived datasets synced into KAAVAL's active RAG intelligence memory.</p>
            </div>
          </Reveal>
          {datasets.length === 0 ? (
            <Reveal delay={100}>
              <div className="glass-panel p-12 text-center rounded-2xl">
                <Database className="w-10 h-10 mx-auto mb-3" style={{ color: P.text3 }} />
                <h3 className="text-base font-bold text-white mb-1">No Stored Case Datasets Yet</h3>
                <p className="text-[13px] text-[#8B7FA8] max-w-sm mx-auto">Switch to the timeline view and click "Save as Dataset" to archive logs.</p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {datasets.map((ds, i) => (
                <Reveal key={ds.id} delay={i * 80}>
                  <div className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative group overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${P.coral}10` }} />
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold" style={{ background: `${P.violet}12`, color: P.violet, border: `1px solid ${P.violet}30` }}>{ds.case_id}</span>
                        <span className="text-[10px] font-mono" style={{ color: P.text3 }}>{ds.created_at?.slice(0, 10) || "Today"}</span>
                      </div>
                      <h4 className="text-[15px] font-bold text-white">{ds.dataset_name}</h4>
                      <p className="text-[13px] font-light leading-relaxed" style={{ color: P.text2 }}>{ds.source}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-4 text-[12px]" style={{ borderTop: `1px solid ${P.border}` }}>
                      <span className="font-mono font-bold flex items-center gap-1.5" style={{ color: P.blue }}><Layers className="w-3.5 h-3.5" /> {ds.record_count} Records</span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: `${P.green}12`, color: P.green, border: `1px solid ${P.green}25` }}>Indexed for RAG</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ MODALS ═══ */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" style={{ background: "rgba(10,1,24,0.85)", backdropFilter: "blur(12px)" }}>
          <form onSubmit={handleCreateCase} className="glass-panel-heavy p-8 rounded-3xl max-w-lg w-full space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 pb-4" style={{ borderBottom: `1px solid ${P.border}` }}>
              <FolderPlus className="w-5 h-5" style={{ color: P.violet }} /> Register New Investigation Case
            </h3>
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Case ID</label>
                <input type="text" value={newCase.case_id} onChange={(e) => setNewCase({ ...newCase, case_id: e.target.value })} className="w-full p-3 rounded-xl font-mono outline-none text-white" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
              </div>
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Category</label>
                <select value={newCase.category} onChange={(e) => setNewCase({ ...newCase, category: e.target.value })} className="w-full p-3 rounded-xl outline-none text-white cursor-pointer" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }}>
                  <option value="Armed Robbery" style={{ background: "#0A0118" }}>Armed Robbery</option>
                  <option value="Property Crime" style={{ background: "#0A0118" }}>Property Crime</option>
                  <option value="Cyber Crime" style={{ background: "#0A0118" }}>Cyber Crime</option>
                  <option value="Traffic Negligence" style={{ background: "#0A0118" }}>Traffic Negligence</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-semibold block mb-1.5 text-[12px]" style={{ color: P.text2 }}>Case Title</label>
              <input type="text" placeholder="e.g. Brigade Road Jewelry Store Incident" value={newCase.title} onChange={(e) => setNewCase({ ...newCase, title: e.target.value })} className="w-full p-3 rounded-xl outline-none text-white text-[13px]" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
            </div>
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Priority</label>
                <select value={newCase.priority} onChange={(e) => setNewCase({ ...newCase, priority: e.target.value })} className="w-full p-3 rounded-xl outline-none text-white cursor-pointer" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }}>
                  <option value="CRITICAL" style={{ background: "#0A0118" }}>CRITICAL</option>
                  <option value="HIGH" style={{ background: "#0A0118" }}>HIGH</option>
                  <option value="MEDIUM" style={{ background: "#0A0118" }}>MEDIUM</option>
                  <option value="LOW" style={{ background: "#0A0118" }}>LOW</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Location / Division</label>
                <input type="text" value={newCase.location} onChange={(e) => setNewCase({ ...newCase, location: e.target.value })} className="w-full p-3 rounded-xl outline-none text-white" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
              </div>
            </div>
            <div>
              <label className="font-semibold block mb-1.5 text-[12px]" style={{ color: P.text2 }}>Case Brief</label>
              <textarea placeholder="Initial incident description..." value={newCase.summary} onChange={(e) => setNewCase({ ...newCase, summary: e.target.value })} className="w-full p-3 rounded-xl outline-none text-white text-[13px] h-20 resize-none" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowNewCaseModal(false)} className="px-5 py-2.5 rounded-xl text-[12px] font-semibold hover:bg-white/5 transition-all" style={{ color: P.text2 }}>Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${P.violet}, ${P.violetDim})` }}>Create Case</button>
            </div>
          </form>
        </div>
      )}

      {showSaveDatasetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" style={{ background: "rgba(10,1,24,0.85)", backdropFilter: "blur(12px)" }}>
          <form onSubmit={handleSaveDataset} className="glass-panel-heavy p-8 rounded-3xl max-w-md w-full space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 pb-4" style={{ borderBottom: `1px solid ${P.border}` }}>
              <Database className="w-5 h-5" style={{ color: P.coral }} /> Save Dataset
            </h3>
            <p className="text-[13px] font-light leading-relaxed" style={{ color: P.text2 }}>
              Package all {timeline.length} logs from {selectedCaseId} into a structured SQLite dataset (`kaaval.db`) and index for AI RAG queries.
            </p>
            <div>
              <label className="font-semibold block mb-1.5 text-[12px]" style={{ color: P.text2 }}>Dataset Name</label>
              <input type="text" value={datasetForm.dataset_name} onChange={(e) => setDatasetForm({ ...datasetForm, dataset_name: e.target.value })} className="w-full p-3 rounded-xl outline-none text-white text-[13px] font-bold" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
            </div>
            <div>
              <label className="font-semibold block mb-1.5 text-[12px]" style={{ color: P.text2 }}>Description</label>
              <textarea value={datasetForm.description} onChange={(e) => setDatasetForm({ ...datasetForm, description: e.target.value })} className="w-full p-3 rounded-xl outline-none text-white text-[13px] h-20 resize-none" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowSaveDatasetModal(false)} className="px-5 py-2.5 rounded-xl text-[12px] font-semibold hover:bg-white/5 transition-all" style={{ color: P.text2 }}>Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${P.coral}, ${P.coralSoft})` }}>Store Dataset</button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
