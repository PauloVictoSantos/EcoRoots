"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./app-sidebar"
import { Header } from "./header"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setMounted(true)
    // Auto-collapse on mobile
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          isMobile
            ? "ml-0"
            : collapsed
              ? "ml-[72px]"
              : "ml-64"
        )}
      >
        <Header />
        <main className={cn("flex-1 p-4 lg:p-6", isMobile && "pt-4")}>
          {children}
        </main>
      </div>
    </div>
  )
}
