"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  LayoutDashboard,
  Box,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Leaf,
  Menu,
  X,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard Principal",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Estufa 3D",
    href: "/dashboard/estufa",
    icon: Box,
  },
  {
    title: "Documentação",
    href: "/dashboard/docs",
    icon: BookOpen,
  },
]

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isMobile = useIsMobile()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auto-collapse on mobile/small screens
  useEffect(() => {
    if (isMobile) {
      onCollapsedChange(true)
      setMobileOpen(false)
    }
  }, [isMobile, onCollapsedChange])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const toggleCollapse = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      onCollapsedChange(!collapsed)
    }
  }

  const isOpen = isMobile ? mobileOpen : !collapsed

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="fixed left-4 top-4 z-50 h-10 w-10 rounded-lg bg-card shadow-md lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300 ease-in-out",
          isMobile
            ? mobileOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full"
            : collapsed
              ? "w-[72px]"
              : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              {isOpen && (
                <span className="text-lg font-semibold text-sidebar-foreground transition-opacity duration-200">
                  Estufa IoT
                </span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                    )}
                  />
                  {isOpen && (
                    <span className="transition-opacity duration-200">
                      {item.title}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "mb-2 w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !isOpen && "justify-center px-0"
              )}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              {isOpen && <span>{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>}
            </Button>

            {/* Collapse Toggle - only show on desktop */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !isOpen && "justify-center px-0"
                )}
              >
                {collapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <>
                    <ChevronLeft className="h-5 w-5" />
                    <span>Recolher</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
