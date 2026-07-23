import { OmniDock } from "@/components/layout/OmniDock"
import { TopNav } from "@/components/layout/TopNav"
import { OfflineIndicator } from "@/components/layout/OfflineIndicator"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden" style={{ background: "#0A0118" }}>
      
      {/* Ambient liquid background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Mesh gradient orbs */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full blur-[160px]"
          style={{ background: "rgba(124,92,252,0.06)", animation: "ambient-drift 20s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-[15%] -right-[10%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full blur-[140px]"
          style={{ background: "rgba(255,107,66,0.04)", animation: "ambient-drift 25s ease-in-out infinite reverse" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full blur-[180px]"
          style={{ background: "rgba(124,92,252,0.03)" }}
        />
        
        {/* Edge vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, #0A0118 100%)" }} />
      </div>
      
      <TopNav />
      <OmniDock />
      <OfflineIndicator />

      <main className="relative z-10 w-full h-full max-w-[1440px] mx-auto grid grid-rows-[100px_minmax(0,1fr)_80px] overflow-hidden">
        <div className="row-start-2 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none px-4 sm:px-6 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  )
}
