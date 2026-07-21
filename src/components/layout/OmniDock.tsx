"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageSquare, Mic, Video, Network, Map, TrendingUp, Languages, Scale, Car, GitCommit, Siren } from "lucide-react"

const dockItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "AI Assistant", url: "/assistant", icon: MessageSquare },
  { title: "Voice-to-FIR", url: "/voice-fir", icon: Mic },
  { title: "OCR & Translation", url: "/ocr-translation", icon: Languages },
  { title: "BNS Legal Matcher", url: "/legal-matcher", icon: Scale },
  { title: "ANPR Vehicle Lookup", url: "/anpr", icon: Car },
  { title: "Case Timeline", url: "/timeline", icon: GitCommit },
  { title: "SOS Dispatch", url: "/sos-dispatch", icon: Siren },
  { title: "Surveillance", url: "/surveillance", icon: Video },
]

export function OmniDock() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] sm:w-auto max-w-[100vw] overflow-x-auto scrollbar-none">
      <div className="glass-panel-heavy px-3 sm:px-4 py-2 sm:py-3 rounded-[2rem] flex items-center justify-start sm:justify-center gap-1 sm:gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 hover:border-white/20 transition-colors duration-500 w-max mx-auto">
        {dockItems.map((item) => {
          const isActive = pathname === item.url
          
          return (
            <Link 
              key={item.title} 
              href={item.url}
              className="relative group"
            >
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                {item.title}
                {/* Tooltip arrow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45"></div>
              </div>

              {/* Icon Container */}
              <div className={`
                w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ease-out
                hover:-translate-y-2 hover:scale-110 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]
                ${isActive ? 'bg-primary/20 text-primary border border-primary/30 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}
              `}>
                <item.icon className={`transition-all duration-300 ${isActive ? 'w-6 h-6' : 'w-5 h-5 group-hover:w-6 group-hover:h-6'}`} />
              </div>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#6366f1]"></div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
