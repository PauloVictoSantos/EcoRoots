"use client"

import { useState, useEffect } from "react"
import { Header } from "./header"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {

  return (
    <div className="m-10 w-full">
        {children}
    </div>
  )
}
