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
      {/* The main pill container mimicking the uploaded image */}
      <div 
        className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-[2rem] sm:rounded-full overflow-x-auto scrollbar-none"
        style={{ 
          background: "rgba(10, 5, 20, 0.6)", 
          backdropFilter: "blur(20px)", 
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
        }}
      >
        {dockItems.map((item) => {
          const isActive = pathname === item.url
          return (
            <Link key={item.title} href={item.url} className="relative group shrink-0 flex flex-col items-center justify-center">
              
              {/* Tooltip */}
              <div className="absolute -top-12 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 z-50">
                <div className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white whitespace-nowrap shadow-xl border border-white/10" style={{ background: "rgba(20,15,35,0.9)", backdropFilter: "blur(10px)" }}>
                  {item.title}
                </div>
              </div>

              {/* Icon Container (Squircle shape for active state like the image) */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-[14px] sm:rounded-2xl transition-all duration-300
                  ${isActive 
                    ? "" // Background handled in inline style for that soft blue glow
                    : "hover:bg-white/5"}
                `}
                style={{ 
                  background: isActive ? "rgba(74, 114, 255, 0.25)" : "transparent",
                  border: isActive ? "1px solid rgba(74, 114, 255, 0.2)" : "1px solid transparent"
                }}
              >
                <item.icon 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-all duration-300 ${isActive ? "w-5 h-5 sm:w-5 sm:h-5 text-[#60A5FA]" : "w-5 h-5 sm:w-5 sm:h-5 text-[#A19BB0] group-hover:text-white"}`} 
                />
              </div>
              
              {/* Glowing Dot underneath the active item */}
              <div 
                className={`absolute -bottom-1 w-1 h-1 rounded-full transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} 
                style={{ 
                  background: "#60A5FA", 
                  boxShadow: "0 0 8px 1px rgba(96,165,250,0.8)" 
                }} 
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
