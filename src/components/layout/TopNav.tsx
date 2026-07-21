"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldAlert, Activity, Siren } from "lucide-react"

export function TopNav() {
  const pathname = usePathname()
  const moduleName = pathname === '/' ? 'CORE SYSTEM' : pathname.replace('/', '').toUpperCase()

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="glass-panel px-6 py-2 rounded-full flex items-center gap-4 shadow-2xl border border-white/10 pointer-events-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          <span className="font-extrabold tracking-widest uppercase text-sm text-white">KAAVAL</span>
        </Link>
        
        <div className="w-px h-4 bg-white/20"></div>
        
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
            // {moduleName} NODE ONLINE
          </span>
        </div>

        <div className="w-px h-4 bg-white/20"></div>

        <Link 
          href="/sos-dispatch"
          className="flex items-center gap-1.5 px-3 py-1 bg-red-600/30 hover:bg-red-600/50 text-red-300 hover:text-white rounded-full border border-red-500/40 transition-all text-xs font-bold shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse"
        >
          <Siren className="w-3.5 h-3.5" />
          <span>SOS DISPATCH</span>
        </Link>
      </div>
    </div>
  )
}
