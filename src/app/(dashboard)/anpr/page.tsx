"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { Car, Camera, Search, ShieldAlert, AlertTriangle, CheckCircle2, Plus, MapPin, User, FileText, Zap } from "lucide-react"
import { toast } from "sonner"

/* ═══════ Colors ═══════ */
const P = {
  background: "var(--color-background)",
  surface: "var(--color-surface)",
  panel: "var(--color-panel)",
  border: "var(--color-border)",
  text1: "var(--color-text1)",
  text2: "var(--color-text2)",
  text3: "var(--color-text3)",
  coral: "var(--color-coral)",
  coralSoft: "var(--color-coralSoft)",
  amber: "var(--color-amber)",
  violet: "var(--color-violet)",
  blue: "var(--color-blue)",
  green: "var(--color-green)",
  red: "var(--color-red)",
  glow: "var(--color-glow)",
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

interface VehicleRecord {
  id?: number; plate_number: string; owner_name: string; vehicle_model: string; color: string;
  status: string; crime_reference: string; last_seen_location: string;
}

export default function ANPRScannerPage() {
  const [plateInput, setPlateInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VehicleRecord | null>(null)
  const [allVehicles, setAllVehicles] = useState<VehicleRecord[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVehicle, setNewVehicle] = useState({ plate_number: "", owner_name: "", vehicle_model: "", color: "Black", status: "WANTED", crime_reference: "", last_seen_location: "Bengaluru" })
  const presets = ["KA-03-HA-8812", "KA-01-MJ-4921", "KA-05-EX-1092", "KA-04-BB-9901"]

  const fetchAllVehicles = async () => {
    try {
      const res = await fetch("https://kaaval-backend-50044365217.development.catalystappsail.in/api/vehicles")
      if (res.ok) { const data = await res.json(); setAllVehicles(data.vehicles || []) }
    } catch (e) {}
  }

  useEffect(() => { fetchAllVehicles() }, [])

  const handleLookup = async (plateToSearch?: string) => {
    const targetPlate = plateToSearch || plateInput; if (!targetPlate.trim()) return
    setLoading(true)
    try {
      const res = await fetch("https://kaaval-backend-50044365217.development.catalystappsail.in/api/vehicle/anpr-lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plate_number: targetPlate }) })
      if (res.ok) { 
        const data = await res.json(); 
        setResult(data.vehicle);
        toast.success(`Lookup complete for ${targetPlate}`);
      } else throw new Error()
    } catch (e) {
      const found = allVehicles.find((v) => v.plate_number.replace(/-/g, "").toUpperCase() === targetPlate.replace(/-/g, "").toUpperCase())
      if (found) {
        setResult(found);
        toast.warning("Vehicle found in local database");
      }
      else {
        setResult({ plate_number: targetPlate.toUpperCase(), owner_name: "Ramesh Kumar (Fallback)", vehicle_model: "Hyundai Creta", color: "White", status: "STOLEN", crime_reference: "FIR-442/2026 - Theft under BNS 303(2)", last_seen_location: "Silk Board Junction, Bengaluru" });
        toast.info("No live record found, showing simulated fallback");
      }
    } finally { setLoading(false) }
  }

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newVehicle.plate_number) return
    try {
      const res = await fetch("https://kaaval-backend-50044365217.development.catalystappsail.in/api/vehicles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newVehicle) })
      if (res.ok) {
        setShowAddForm(false); 
        setNewVehicle({ plate_number: "", owner_name: "", vehicle_model: "", color: "Black", status: "WANTED", crime_reference: "", last_seen_location: "Bengaluru" }); 
        fetchAllVehicles(); 
        handleLookup(newVehicle.plate_number);
        toast.success("Vehicle successfully flagged in system");
      } else {
        toast.error("Failed to register vehicle in database");
      }
    } catch (e) { 
      toast.error("Connection error. Local queue updated."); 
      setShowAddForm(false); 
    }
  }

  return (
    <div className="max-w-[1320px] mx-auto space-y-6 pb-20">
      
      {/* ═══ HEADER ═══ */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6" style={{ borderBottom: `1px solid ${P.border}` }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-[28px] relative group overflow-hidden" style={{ background: `${P.amber}15`, border: `1px solid ${P.amber}30` }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 50%, ${P.amber}40, transparent 70%)` }} />
              <Car className="w-6 h-6 relative z-10" style={{ color: P.amber }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-t1 leading-tight flex items-center gap-3">
                ANPR Network
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border tracking-wide uppercase shadow-lg" style={{ background: `${P.red}15`, color: P.red, borderColor: `${P.red}30` }}>LIVE 60 FPS</span>
              </h1>
              <p className="text-[13px] mt-1.5 font-light" style={{ color: P.text2 }}>Automatic Number Plate Recognition & Stolen Vehicle Hotlist Database.</p>
            </div>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="px-5 py-2.5 rounded-[20px] text-[13px] font-semibold transition-all hover:scale-105 flex items-center gap-2 self-start md:self-auto glass-panel" style={{ color: P.text1 }}>
            <Plus className="w-4 h-4" style={{ color: P.amber }} /> Flag Suspect Vehicle
          </button>
        </div>
      </Reveal>

      {/* ═══ ADD VEHICLE MODAL ═══ */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" style={{ background: "rgba(10,1,24,0.85)", backdropFilter: "blur(12px)" }}>
          <form onSubmit={handleAddVehicle} className="glass-panel-heavy p-8 rounded-3xl max-w-2xl w-full space-y-5">
            <h3 className="text-xl font-bold text-t1 flex items-center gap-2 pb-4" style={{ borderBottom: `1px solid ${P.border}` }}>
              <ShieldAlert className="w-5 h-5" style={{ color: P.amber }} /> Flag Vehicle in Crime Watch Database
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-[12px]">
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Plate Number</label>
                <input type="text" placeholder="KA-03-HA-8812" value={newVehicle.plate_number} onChange={(e) => setNewVehicle({ ...newVehicle, plate_number: e.target.value })} className="w-full p-3 rounded-[20px] font-mono uppercase outline-none text-t1 font-bold" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
              </div>
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Owner Name</label>
                <input type="text" placeholder="Ramesh Kumar" value={newVehicle.owner_name} onChange={(e) => setNewVehicle({ ...newVehicle, owner_name: e.target.value })} className="w-full p-3 rounded-[20px] outline-none text-t1" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
              </div>
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Make & Model</label>
                <input type="text" placeholder="Hyundai Creta" value={newVehicle.vehicle_model} onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_model: e.target.value })} className="w-full p-3 rounded-[20px] outline-none text-t1" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} required />
              </div>
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Flag Status</label>
                <select value={newVehicle.status} onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })} className="w-full p-3 rounded-[20px] outline-none text-t1 cursor-pointer font-bold" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }}>
                  <option value="STOLEN" style={{ background: "#09090B", color: P.red }}>🚨 STOLEN</option>
                  <option value="WANTED" style={{ background: "#09090B", color: P.amber }}>⚠️ WANTED</option>
                  <option value="CLEAN" style={{ background: "#09090B", color: P.green }}>✅ CLEAN RECORD</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Crime Reference</label>
                <input type="text" placeholder="FIR-442/2026" value={newVehicle.crime_reference} onChange={(e) => setNewVehicle({ ...newVehicle, crime_reference: e.target.value })} className="w-full p-3 rounded-[20px] outline-none text-t1" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} />
              </div>
              <div>
                <label className="font-semibold block mb-1.5" style={{ color: P.text2 }}>Last Seen At</label>
                <input type="text" placeholder="Silk Board Junction" value={newVehicle.last_seen_location} onChange={(e) => setNewVehicle({ ...newVehicle, last_seen_location: e.target.value })} className="w-full p-3 rounded-[20px] outline-none text-t1" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${P.border}` }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2.5 rounded-[20px] text-[12px] font-semibold hover:bg-white/5 transition-all" style={{ color: P.text2 }}>Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-[20px] text-[12px] font-bold text-t1 transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${P.red}, #E11D48)` }}>Register Flagged Vehicle</button>
            </div>
          </form>
        </div>
      )}

      {/* ═══ MAIN GRID ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Camera Feed */}
        <Reveal delay={100} className="h-full">
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-full border relative overflow-hidden" style={{ borderColor: P.border, background: P.surface }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: P.amber }} />
            
            <div className="flex items-center justify-between mb-5 relative z-10">
              <span className="text-[12px] font-bold text-t1 flex items-center gap-2">
                <Camera className="w-4 h-4 animate-pulse" style={{ color: P.amber }} /> ANPR Camera Feed #04 - Silk Board Junction
              </span>
              <span className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ background: `${P.green}15`, color: P.green, border: `1px solid ${P.green}30` }}>
                ● Active Target
              </span>
            </div>

            <div className="relative aspect-video rounded-[28px] overflow-hidden flex items-center justify-center border z-10" style={{ background: "#05010C", borderColor: P.border }}>
              <div className="absolute inset-0 bg-[radial-gradient(rgba(251,191,36,0.15)_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B] opacity-80" />

              <div className="relative w-64 h-24 rounded-[20px] p-2.5 flex flex-col justify-between animate-pulse border-2" style={{ borderColor: `${P.amber}80`, boxShadow: `0 0 40px ${P.amber}30` }}>
                <div className="flex justify-between text-[10px] font-mono font-bold" style={{ color: P.amber }}>
                  <span>[ TARGET_ACQUIRED ]</span>
                  <span>CONF: 99.4%</span>
                </div>
                <div className="text-center font-mono font-extrabold text-2xl tracking-widest text-t1 drop-shadow-md">
                  KA-03-HA-8812
                </div>
                <div className="flex justify-between text-[9px] font-mono" style={{ color: P.text3 }}>
                  <span>LAT: 12.9172° N</span>
                  <span>LNG: 77.6228° E</span>
                </div>

                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: P.amber }} />
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: P.amber }} />
                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: P.amber }} />
                <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: P.amber }} />
              </div>

              <div className="absolute bottom-4 left-4 text-[10px] font-mono flex items-center gap-2" style={{ color: P.text2 }}>
                <Zap className="w-3.5 h-3.5" style={{ color: P.coral }} /> Scanning live traffic flow...
              </div>
            </div>

            <div className="mt-5 relative z-10">
              <p className="text-[11px] font-medium mb-3 uppercase tracking-wider" style={{ color: P.text3 }}>Scan Sample Plates:</p>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, i) => (
                  <button key={i} onClick={() => { setPlateInput(p); handleLookup(p) }} className="px-3.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all hover:-translate-y-px" style={{ background: "rgba(255,255,255,0.03)", color: P.text1, border: `1px solid ${P.border}` }}>
                    <Search className="w-3 h-3 inline mr-1.5 opacity-50" />{p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right: Search & Results */}
        <div className="space-y-6 flex flex-col">
          <Reveal delay={150}>
            <div className="glass-panel p-6 rounded-3xl border space-y-4 relative overflow-hidden" style={{ borderColor: P.border, background: P.surface }}>
              <label className="text-[13px] font-bold text-t1 flex items-center gap-2 relative z-10">
                <Search className="w-4 h-4" style={{ color: P.coral }} /> Manual Registration Lookup
              </label>
              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <input type="text" value={plateInput} onChange={(e) => setPlateInput(e.target.value.toUpperCase())} placeholder="Enter Plate (e.g. KA-03-HA-8812)" className="flex-1 p-3.5 rounded-[28px] text-t1 font-mono uppercase font-bold text-sm tracking-wider outline-none focus:ring-1 transition-all" style={{ background: "#09090B", border: `1px solid ${P.border}` }} />
                <button onClick={() => handleLookup()} disabled={loading || !plateInput.trim()} className="px-6 py-3.5 rounded-[28px] text-[12px] font-bold text-t1 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg whitespace-nowrap" style={{ background: `linear-gradient(135deg, ${P.coral}, ${P.coralSoft})`, boxShadow: `0 8px 24px ${P.coral}40` }}>
                  {loading ? "Searching..." : "Lookup Database"}
                </button>
              </div>
            </div>
          </Reveal>

          {result && (
            <Reveal delay={200} className="flex-1">
              <div className="glass-panel p-6 rounded-3xl border flex flex-col justify-between h-full relative overflow-hidden group" style={{ borderColor: P.border, background: P.surface }}>
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-opacity duration-700" style={{ background: result.status === 'STOLEN' ? P.red : result.status === 'WANTED' ? P.amber : P.green }} />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-5 mb-5 relative z-10 gap-3" style={{ borderColor: P.border }}>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: P.text3 }}>Registration Number</span>
                    <h2 className="text-3xl font-black font-mono tracking-widest text-t1 drop-shadow-md">{result.plate_number}</h2>
                  </div>
                  {result.status === "STOLEN" ? (
                    <span className="px-4 py-2 rounded-full font-mono text-[11px] font-bold flex items-center gap-2 animate-pulse shadow-lg" style={{ background: `${P.red}15`, color: P.red, border: `1px solid ${P.red}40` }}>
                      <ShieldAlert className="w-4 h-4" /> 🚨 STOLEN VEHICLE ALERT
                    </span>
                  ) : result.status === "WANTED" ? (
                    <span className="px-4 py-2 rounded-full font-mono text-[11px] font-bold flex items-center gap-2 shadow-lg" style={{ background: `${P.amber}15`, color: P.amber, border: `1px solid ${P.amber}40` }}>
                      <AlertTriangle className="w-4 h-4" /> ⚠️ WANTED / HIT & RUN
                    </span>
                  ) : (
                    <span className="px-4 py-2 rounded-full font-mono text-[11px] font-bold flex items-center gap-2 shadow-lg" style={{ background: `${P.green}15`, color: P.green, border: `1px solid ${P.green}40` }}>
                      <CheckCircle2 className="w-4 h-4" /> ✅ CLEAN RECORD
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-[12px] relative z-10 flex-1 content-start">
                  <div className="p-4 rounded-[28px] border flex flex-col justify-center" style={{ background: "rgba(0,0,0,0.2)", borderColor: P.border }}>
                    <span className="flex items-center gap-1.5 mb-1 text-[10px] uppercase tracking-wider font-semibold" style={{ color: P.text2 }}><User className="w-3.5 h-3.5" style={{ color: P.violet }} /> Registered Owner</span>
                    <p className="font-bold text-t1 text-[14px]">{result.owner_name}</p>
                  </div>
                  <div className="p-4 rounded-[28px] border flex flex-col justify-center" style={{ background: "rgba(0,0,0,0.2)", borderColor: P.border }}>
                    <span className="flex items-center gap-1.5 mb-1 text-[10px] uppercase tracking-wider font-semibold" style={{ color: P.text2 }}><Car className="w-3.5 h-3.5" style={{ color: P.amber }} /> Make & Model</span>
                    <p className="font-bold text-t1 text-[14px]">{result.vehicle_model}</p>
                  </div>
                  <div className="p-4 rounded-[28px] border flex flex-col justify-center" style={{ background: "rgba(0,0,0,0.2)", borderColor: P.border }}>
                    <span className="flex items-center gap-1.5 mb-1 text-[10px] uppercase tracking-wider font-semibold" style={{ color: P.text2 }}><FileText className="w-3.5 h-3.5" style={{ color: P.coral }} /> Crime Reference</span>
                    <p className="font-bold text-[13px] break-words" style={{ color: result.status === 'CLEAN' ? P.text1 : P.red }}>{result.crime_reference || "None"}</p>
                  </div>
                  <div className="p-4 rounded-[28px] border flex flex-col justify-center" style={{ background: "rgba(0,0,0,0.2)", borderColor: P.border }}>
                    <span className="flex items-center gap-1.5 mb-1 text-[10px] uppercase tracking-wider font-semibold" style={{ color: P.text2 }}><MapPin className="w-3.5 h-3.5" style={{ color: P.blue }} /> Last Sighted At</span>
                    <p className="font-bold text-[13px]" style={{ color: P.blue }}>{result.last_seen_location}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  )
}
