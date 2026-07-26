"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Shield, Siren } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { toast } from "sonner"

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const mod = pathname === "/" ? "HOME" : pathname.replace("/", "").toUpperCase()

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="pointer-events-auto glass-panel px-5 py-2.5 rounded-[28px] flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#007AFF] shadow-[0_4px_12px_rgba(0,122,255,0.3)]">
            <Shield className="w-3.5 h-3.5 text-t1" />
          </div>
          <span className="font-bold tracking-[0.12em] uppercase text-[13px] text-t1">
            Kaaval
          </span>
        </Link>
        
        <div className="w-px h-4 bg-white/10" />
        
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]" />
          </span>
          <span className="text-[11px] font-bold tracking-wider uppercase text-t2">
            {mod}
          </span>
          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
          <ThemeToggle />
        </div>

        <div className="w-px h-4 bg-white/10" />

        <button 
          onClick={() => {
            toast.error("CRITICAL SOS TRIGGERED", {
              description: "Dispatching units. Command Center notified.",
              duration: 5000,
            })
            router.push("/sos-dispatch")
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 bg-[#EF4444]/12 text-[#F87171] border border-[#EF4444]/20"
        >
          <Siren className="w-3 h-3 animate-pulse" />
          <span>SOS</span>
        </button>
      </div>
    </div>
  )
}
