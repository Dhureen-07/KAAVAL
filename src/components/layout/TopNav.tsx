"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Siren } from "lucide-react"

export function TopNav() {
  const pathname = usePathname()
  const mod = pathname === "/" ? "HOME" : pathname.replace("/", "").toUpperCase()

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="pointer-events-auto glass-panel px-5 py-2.5 rounded-2xl flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#FF6B42] to-[#FF8F6B]">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold tracking-[0.12em] uppercase text-[13px] text-white">
            Kaaval
          </span>
        </Link>
        
        <div className="w-px h-4 bg-white/10" />
        
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
          </span>
          <span className="text-[11px] font-medium tracking-wider uppercase text-[#8B7FA8]">
            {mod}
          </span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        <Link 
          href="/sos-dispatch"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 bg-[#FF4757]/12 text-[#FF6B7A] border border-[#FF4757]/20"
        >
          <Siren className="w-3 h-3 animate-pulse" />
          <span>SOS</span>
        </Link>
      </div>
    </div>
  )
}
