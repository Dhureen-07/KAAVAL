"use client"

import { useState, useEffect } from "react"
import { WifiOff, RefreshCw, CheckCircle2 } from "lucide-react"

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)
  const [syncedCount, setSyncedCount] = useState<number | null>(null)

  useEffect(() => {
    // Set initial status
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine)
    }

    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => {
      setIsOffline(false)
      // Check for pending offline items in LocalStorage
      try {
        const pending = localStorage.getItem("kaaval_offline_queue")
        if (pending) {
          const items = JSON.parse(pending)
          if (Array.isArray(items) && items.length > 0) {
            setSyncedCount(items.length)
            localStorage.removeItem("kaaval_offline_queue")
            setTimeout(() => setSyncedCount(null), 4000)
          }
        }
      } catch (e) {
        console.error("Offline sync error:", e)
      }
    }

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  if (!isOffline && syncedCount === null) return null

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
      {isOffline ? (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-950/80 border border-amber-500/50 backdrop-blur-md rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] text-amber-200 text-xs font-semibold">
          <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
          <div>
            <p className="font-bold text-amber-300">OFFLINE FIELD MODE ACTIVE</p>
            <p className="text-[10px] text-amber-300/80">Drafts & SOS alerts saved locally. Auto-sync on reconnect.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-950/80 border border-emerald-500/50 backdrop-blur-md rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] text-emerald-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="font-bold text-emerald-300">CONNECTIVITY RESTORED</p>
            <p className="text-[10px] text-emerald-300/80">Auto-synced {syncedCount} queued field logs to KAAVAL Database.</p>
          </div>
        </div>
      )}
    </div>
  )
}
