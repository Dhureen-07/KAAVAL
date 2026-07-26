"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageSquare, Mic, Video, Languages, Scale, Car, GitCommit, Siren } from "lucide-react"

const dockItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "AI Assistant", url: "/assistant", icon: MessageSquare },
  { title: "Voice-to-FIR", url: "/voice-fir", icon: Mic },
  { title: "OCR & Translation", url: "/ocr-translation", icon: Languages },
  { title: "Legal Matcher", url: "/legal-matcher", icon: Scale },
  { title: "ANPR Scanner", url: "/anpr", icon: Car },
  { title: "Case Timeline", url: "/timeline", icon: GitCommit },
  { title: "SOS Dispatch", url: "/sos-dispatch", icon: Siren },
  { title: "Surveillance", url: "/surveillance", icon: Video },
]

export function OmniDock() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none w-max max-w-[95vw]">
      <div 
        className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-[2rem] sm:rounded-full overflow-x-auto scrollbar-none"
        style={{ 
          background: "rgba(255, 255, 255, 0.75)", 
          border: "1px solid rgba(255, 255, 255, 0.9)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)"
        }}
      >
        {dockItems.map((item) => {
          const isActive = pathname === item.url
          return (
            <Link key={item.title} href={item.url} className="relative group shrink-0 flex flex-col items-center justify-center">
              
              {/* Tooltip */}
              <div className="absolute -top-12 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 z-50">
                <div className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-t1 whitespace-nowrap shadow-xl border border-white/10" style={{ background: "rgba(24,24,27,0.95)", backdropFilter: "blur(10px)" }}>
                  {item.title}
                </div>
              </div>

              {/* Icon Container */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-[18px] transition-all duration-300
                  ${isActive 
                    ? "" 
                    : "hover:bg-black/5"}
                `}
                style={{ 
                  background: isActive ? "rgba(0, 122, 255, 0.12)" : "transparent",
                  border: "none"
                }}
              >
                <item.icon 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-all duration-300 ${isActive ? "w-5 h-5 sm:w-5 sm:h-5 text-[#007AFF]" : "w-5 h-5 sm:w-5 sm:h-5 text-t2 group-hover:text-t1"}`} 
                />
              </div>
              
              {/* Active indicator dot */}
              <div 
                className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} 
                style={{ 
                  background: "#007AFF", 
                  boxShadow: "0 0 10px 2px rgba(0,122,255,0.4)" 
                }} 
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
