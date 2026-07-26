import { OmniDock } from "@/components/layout/OmniDock"
import { TopNav } from "@/components/layout/TopNav"
import { OfflineIndicator } from "@/components/layout/OfflineIndicator"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[var(--color-background)]">
      
      {/* Ultra-clean minimalistic background (No orbs, just pure layout) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Edge vignette to add slight depth without color */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.02) 100%)" }} />
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
