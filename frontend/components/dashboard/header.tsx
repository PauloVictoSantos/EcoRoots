"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, User, Settings, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [hasNotifications] = useState(true)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md",
        className
      )}
    >
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative hidden w-full max-w-md md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar sensores, plantas, configurações..."
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-10 w-10 rounded-xl"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500">
              <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
            </span>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-10 items-center gap-2 rounded-xl pl-2 pr-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden text-sm font-medium md:inline">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
