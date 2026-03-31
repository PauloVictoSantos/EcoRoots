"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Lightbulb,
  Droplets,
  Wind,
  Thermometer,
  Power,
} from "lucide-react"

interface ControlItem {
  id: string
  label: string
  icon: React.ElementType
  enabled: boolean
  color: string
  bgColor: string
}

function ControlButton({ 
  control, 
  onToggle 
}: { 
  control: ControlItem
  onToggle: () => void 
}) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = control.icon

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-3 rounded-2xl p-4 transition-all duration-300",
        "border-2 bg-card",
        control.enabled 
          ? "border-transparent shadow-lg" 
          : "border-border hover:border-muted-foreground/30"
      )}
    >
      {control.enabled && (
        <div
          className="absolute inset-0 rounded-2xl opacity-20"
        />
      )}

      <div
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300",
          control.enabled ? control.bgColor : "bg-muted"
        )}
        style={{
          boxShadow: control.enabled
            ? `inset 0 -3px 8px -3px rgba(0,0,0,0.2), inset 0 3px 8px -3px rgba(255,255,255,0.2)`
            : "inset 0 -2px 4px -2px rgba(0,0,0,0.1)",
          transform: isHovered ? "scale(1.1) translateY(-2px)" : "scale(1)",
        }}
      >
        {/* Shine effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
          }}
        />
        <Icon 
          className={cn(
            "h-7 w-7 relative z-10 transition-colors duration-300",
            control.enabled ? control.color : "text-muted-foreground"
          )} 
        />
      </div>

      {/* Label */}
      <span className={cn(
        "text-xs font-medium transition-colors duration-300",
        control.enabled ? "text-card-foreground" : "text-muted-foreground"
      )}>
        {control.label}
      </span>

      {/* Status indicator */}
      <div className={cn(
        "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider",
        control.enabled ? "text-emerald-500" : "text-muted-foreground"
      )}>
        <div className={cn(
          "h-1.5 w-1.5 rounded-full transition-all duration-300",
          control.enabled 
            ? "bg-emerald-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.5)]" 
            : "bg-muted-foreground"
        )} />
        {control.enabled ? "ON" : "OFF"}
      </div>
    </button>
  )
}

export function ControlPanel({ className }: { className?: string }) {
  const [controls, setControls] = useState<ControlItem[]>([
    {
      id: "light",
      label: "Luz",
      icon: Lightbulb,
      enabled: true,
      color: "text-amber-900 dark:text-amber-100",
      bgColor: "bg-amber-400",
    },
    {
      id: "pump",
      label: "Bomba",
      icon: Droplets,
      enabled: false,
      color: "text-blue-900 dark:text-blue-100",
      bgColor: "bg-blue-400",
    },
    {
      id: "fan",
      label: "Ventilação",
      icon: Wind,
      enabled: true,
      color: "text-cyan-900 dark:text-cyan-100",
      bgColor: "bg-cyan-400"
    },
    {
      id: "heater",
      label: "Aquecedor",
      icon: Thermometer,
      enabled: false,
      color: "text-red-900 dark:text-red-100",
      bgColor: "bg-red-400",
    },
  ])

  const [isHovered, setIsHovered] = useState(false)

  const toggleControl = (id: string) => {
    setControls((prev) =>
      prev.map((control) =>
        control.id === id ? { ...control, enabled: !control.enabled } : control
      )
    )
  }

  const activeCount = controls.filter(c => c.enabled).length

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border bg-card transition-all duration-500",
        "hover:shadow-xl hover:shadow-primary/5",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle glow */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          "bg-linear-to-br from-primary/5 via-transparent to-transparent",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-base font-semibold text-card-foreground">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110"
            >
              <Power className="h-5 w-5 text-primary" />
            </div>
            Controles
          </CardTitle>
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_1px_rgba(34,197,94,0.5)]" />
            <span className="text-xs font-medium text-muted-foreground">
              {activeCount} ativos
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {controls.map((control) => (
            <ControlButton
              key={control.id}
              control={control}
              onToggle={() => toggleControl(control.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
