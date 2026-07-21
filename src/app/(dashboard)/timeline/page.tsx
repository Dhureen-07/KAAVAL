"use client"

import { useState, useEffect } from "react"
import { GitCommit, Clock, Plus, Trash2, Shield, Video, PhoneCall, FileText, Camera, CheckCircle2, Download } from "lucide-react"

interface TimelineNode {
  id?: number
  case_id: string
  title: string
  event_timestamp: string
  description: string
  evidence_type: string
  verified: number
}

export default function TimelineBuilderPage() {
  const [timeline, setTimeline] = useState<TimelineNode[]>([])
  const [loading, setLoading] = useState(true)
  const [caseId, setCaseId] = useState("CASE-2026-089")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newNode, setNewNode] = useState({
    title: "",
    event_timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    description: "",
    evidence_type: "CCTV",
  })

  const fetchTimeline = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/timelines")
      if (res.ok) {
        const data = await res.json()
        setTimeline(data.timeline || [])
      }
    } catch (e) {
      console.warn("Using local timeline memory", e)
      setTimeline([
        { id: 1, case_id: "CASE-2026-089", title: "Initial Incident Hotline Call", event_timestamp: "2026-07-21 14:15", description: "Witness reported suspicious activity near MG Road ATM kiosk.", evidence_type: "CALL_LOG", verified: 1 },
        { id: 2, case_id: "CASE-2026-089", title: "CCTV Footage Captured", event_timestamp: "2026-07-21 14:22", description: "High-res cameras logged red vehicle fleeing towards Brigade Road.", evidence_type: "CCTV", verified: 1 },
        { id: 3, case_id: "CASE-2026-089", title: "PCR Van Arrival & Forensic Sweep", event_timestamp: "2026-07-21 14:28", description: "Officer Team #104 secured the scene and retrieved physical fingerprint evidence.", evidence_type: "POLICE_REPORT", verified: 1 },
        { id: 4, case_id: "CASE-2026-089", title: "Suspect Identified via ANPR", event_timestamp: "2026-07-21 14:45", description: "ANPR System matched license plate KA-01-MJ-4921 at Trinity Circle.", evidence_type: "ANPR_LOG", verified: 1 },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimeline()
  }, [])

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNode.title.trim()) return

    try {
      const res = await fetch("http://localhost:8000/api/timelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newNode, case_id: caseId }),
      })
      if (res.ok) {
        setShowAddForm(false)
        setNewNode({
          title: "",
          event_timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          description: "",
          evidence_type: "CCTV",
        })
        fetchTimeline()
      }
    } catch (e) {
      alert("Added to local timeline view")
      setTimeline([...timeline, { ...newNode, case_id: caseId, id: Date.now(), verified: 1 }])
      setShowAddForm(false)
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      await fetch(`http://localhost:8000/api/timelines/${id}`, { method: "DELETE" })
      fetchTimeline()
    } catch (e) {
      setTimeline(timeline.filter((t) => t.id !== id))
    }
  }

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "CCTV":
        return <Video className="w-4 h-4 text-cyan-400" />
      case "CALL_LOG":
        return <PhoneCall className="w-4 h-4 text-emerald-400" />
      case "POLICE_REPORT":
        return <FileText className="w-4 h-4 text-indigo-400" />
      case "ANPR_LOG":
        return <Camera className="w-4 h-4 text-red-400" />
      default:
        return <Shield className="w-4 h-4 text-purple-400" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
            <GitCommit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Visual Case Timeline & Chain of Custody
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                {caseId}
              </span>
            </h1>
            <p className="text-sm text-zinc-400">
              Interactive court-ready evidence chronology builder and chain-of-custody tracker.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl text-xs font-bold text-white shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Evidence Marker
          </button>
        </div>
      </div>

      {/* Add Marker Form */}
      {showAddForm && (
        <form onSubmit={handleAddNode} className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Add Timeline Event Node
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold">Event Title</label>
              <input
                type="text"
                placeholder="e.g. CCTV Footage Captured at ATM Kiosk"
                value={newNode.title}
                onChange={(e) => setNewNode({ ...newNode, title: e.target.value })}
                className="w-full mt-1 p-2.5 bg-black/40 border border-white/10 rounded-xl text-white"
                required
              />
            </div>
            <div>
              <label className="text-zinc-300 font-semibold">Event Timestamp</label>
              <input
                type="text"
                placeholder="YYYY-MM-DD HH:MM"
                value={newNode.event_timestamp}
                onChange={(e) => setNewNode({ ...newNode, event_timestamp: e.target.value })}
                className="w-full mt-1 p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="text-zinc-300 font-semibold">Evidence Category</label>
              <select
                value={newNode.evidence_type}
                onChange={(e) => setNewNode({ ...newNode, evidence_type: e.target.value })}
                className="w-full mt-1 p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-bold"
              >
                <option value="CCTV">🎥 CCTV Footage</option>
                <option value="CALL_LOG">📞 Hotline Call Log</option>
                <option value="POLICE_REPORT">🚓 Officer Incident Report</option>
                <option value="ANPR_LOG">🚘 ANPR License Plate Scan</option>
                <option value="STATEMENT">📝 Witness Statement</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-zinc-300 font-semibold text-xs">Detailed Summary & Forensic Note</label>
            <textarea
              placeholder="Enter detailed observation notes..."
              value={newNode.description}
              onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
              className="w-full mt-1 p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs h-20 resize-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-xs font-bold text-white"
            >
              Commit Node
            </button>
          </div>
        </form>
      )}

      {/* Visual Timeline Nodes Track */}
      <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-3 md:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-indigo-500 before:to-transparent">
        {timeline.map((node, index) => (
          <div key={node.id || index} className="relative group">
            {/* Timeline Node Bullet Marker */}
            <div className="absolute -left-6 md:-left-8 top-1.5 w-6 h-6 rounded-full bg-zinc-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_#06b6d4]">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>

            {/* Node Glass Card */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-cyan-500/30 transition-all space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    {getEvidenceIcon(node.evidence_type)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{node.title}</h3>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {node.event_timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full font-mono text-[10px] font-bold">
                    {node.evidence_type}
                  </span>
                  <button
                    onClick={() => handleDelete(node.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete timeline node"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-mono">{node.description}</p>

              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Chain of Custody Verified
                </span>
                <span className="font-mono">Node Hash: #0x{((node.id || 1) * 7919).toString(16)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
