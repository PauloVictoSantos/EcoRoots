"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Leaf, Bug, AlertTriangle, CheckCircle2, Scan } from "lucide-react"

type PlantStatus = "healthy" | "attention" | "critical"

interface PlantStatusCardProps {
  status: PlantStatus
  pestRisk: number
  pestDetected?: string
  lastAnalysis?: string
  className?: string
}

const statusConfig = {
  healthy: {
    label: "Saudável",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.3)",
    icon: CheckCircle2,
  },
  attention: {
    label: "Atenção",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.3)",
    icon: AlertTriangle,
  },
  critical: {
    label: "Crítico",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    glowColor: "rgba(239, 68, 68, 0.3)",
    icon: AlertTriangle,
  },
}

export function PlantStatusCard({
  status,
  pestRisk,
  pestDetected,
  lastAnalysis,
  className,
}: PlantStatusCardProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border bg-card transition-all duration-500",
        "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="relative pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          Status da Planta (IA)
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {/* Status Indicator */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border p-4 transition-all duration-500",
            config.bgColor,
            config.borderColor
          )}
          style={{
            boxShadow: isHovered ? `0 4px 20px ${config.glowColor}` : "none",
          }}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500",
              config.bgColor,
              "group-hover:scale-110"
            )}
          >
            <StatusIcon className={cn("h-6 w-6", config.color)} />
          </div>
          <div>
            <p className={cn("text-lg font-bold", config.color)}>
              {config.label}
            </p>
            {lastAnalysis && (
              <p className="text-xs text-muted-foreground">
                Última análise: {lastAnalysis}
              </p>
            )}
          </div>
          <div className="ml-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/80 backdrop-blur transition-all duration-300 group-hover:bg-primary/10">
              <Scan className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
            </div>
          </div>
        </div>

        {/* Pest Detection */}
        <div className="space-y-3 rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300",
                  pestRisk < 30 && "bg-emerald-500/10",
                  pestRisk >= 30 && pestRisk < 70 && "bg-amber-500/10",
                  pestRisk >= 70 && "bg-red-500/10"
                )}
              >
                <Bug
                  className={cn(
                    "h-4 w-4",
                    pestRisk < 30 && "text-emerald-500",
                    pestRisk >= 30 && pestRisk < 70 && "text-amber-500",
                    pestRisk >= 70 && "text-red-500"
                  )}
                />
              </div>
              <span className="text-sm font-medium text-card-foreground">
                Detecção de Pragas
              </span>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                pestRisk < 30 && "bg-emerald-500/10 text-emerald-500",
                pestRisk >= 30 && pestRisk < 70 && "bg-amber-500/10 text-amber-500",
                pestRisk >= 70 && "bg-red-500/10 text-red-500"
              )}
            >
              {pestRisk}% risco
            </span>
          </div>
          <Progress
            value={pestRisk}
            className="h-2"
          />
          {pestDetected && (
            <p className="text-xs text-muted-foreground">
              Praga detectada: <span className="font-medium text-amber-500">{pestDetected}</span>
            </p>
          )}
        </div>
      </CardContent>

      {/* Bottom glow line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500",
          "bg-linear-to-r from-transparent via-primary to-transparent",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />
    </Card>
  )
}
