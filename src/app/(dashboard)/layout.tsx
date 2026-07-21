import { OmniDock } from "@/components/layout/OmniDock"
import { TopNav } from "@/components/layout/TopNav"
import { OfflineIndicator } from "@/components/layout/OfflineIndicator"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-background overflow-hidden">
      
      {/* The Spatial Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 animate-[ambient-drift_120s_linear_infinite]" />
        
        {/* Massive atmospheric glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[150px] animate-[pulse-glow_15s_ease-in-out_infinite] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/10 blur-[150px] animate-[pulse-glow_10s_ease-in-out_infinite_reverse] mix-blend-screen pointer-events-none" />
        
        {/* Vignette to darken the edges heavily */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-90 pointer-events-none" />
      </div>
      
      {/* Floating Navigation Layers */}
      <TopNav />
      <OmniDock />
      <OfflineIndicator />

      {/* 
        Strict CSS Grid Layout 
        Row 1: Top gap for TopNav (120px)
        Row 2: Scrollable content area (fills remaining space)
        Row 3: Bottom gap for OmniDock (100px)
        This physically prevents the content from overlapping the navigation.
      */}
      <main className="relative z-10 w-full h-full max-w-[1600px] mx-auto grid grid-rows-[120px_minmax(0,1fr)_100px] overflow-hidden">
        
        {/* The content wrapper sits exactly in Row 2 */}
        <div className="row-start-2 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none px-4 sm:px-6 lg:px-12 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out">
          {children}
        </div>
        
      </main>
      
    </div>
  )
}
