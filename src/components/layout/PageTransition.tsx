"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    setShow(false)
    // brief delay to let exit happen, then swap content
    const t = setTimeout(() => {
      setDisplayChildren(children)
      requestAnimationFrame(() => setShow(true))
    }, 120)
    return () => clearTimeout(t)
  }, [pathname, children])

  // initial mount
  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
  }, [])

  return (
    <div
      className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0) scale(1)" : "translateY(12px) scale(0.99)",
        filter: show ? "blur(0px)" : "blur(4px)",
      }}
    >
      {displayChildren}
    </div>
  )
}
