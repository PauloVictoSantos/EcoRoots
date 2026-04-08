"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface CustomCursorProps {
  isActive: boolean
}

export function CustomCursor({ isActive }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>()

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }

      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${positionRef.current.x - 12}px, ${positionRef.current.y - 12}px, 0)`
        }
        rafRef.current = undefined
      })
    }

    window.addEventListener("mousemove", updatePosition, { passive: true })

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={cn(
        "fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-9999 transition-opacity duration-200",
        "bg-white/80 shadow-lg shadow-white/20 will-change-transform",
        isActive ? "opacity-100" : "opacity-0",
      )}
      style={{
        transform: "translate3d(-50vw, -50vh, 0)",
      }}
    />
  )
}
