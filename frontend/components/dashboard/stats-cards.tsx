"use client"

import { Thermometer, Droplets, Leaf, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"
import type { GreenhouseData, HealthStatus } from "@/hooks/use-realtime-data"

const statusConfig = {
  good:     { label: "Normal",  className: "border-green-500/30 text-green-500"  },
  warning:  { label: "Atenção", className: "border-yellow-500/30 text-yellow-500" },
  critical: { label: "Crítico", className: "border-red-500/30 text-red-500"      },
}

const iconColor: Record<HealthStatus, string> = {
  good:     "text-green-500",
  warning:  "text-yellow-500",
  critical: "text-red-500",
}

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: number
  unit: string
  status: HealthStatus
  trend: "up" | "down" | "stable"
  description: string
  isLoading?: boolean
}

function StatCard({ icon: Icon, label, value, unit, status, trend, description, isLoading }: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor =
    trend === "up"   ? "text-red-400"  :
    trend === "down" ? "text-green-400" :
    "text-muted-foreground"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card className="cursor-default transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            {isLoading
              ? <Spinner className="size-4 text-muted-foreground" />
              : <Icon className={`size-4 ${iconColor[status]}`} />
            }
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tabular-nums">{value.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">{unit}</span>
              </div>
              <TrendIcon className={`size-4 shrink-0 ${trendColor}`} />
            </div>
            <div className="mt-3">
              <Badge variant="outline" className={statusConfig[status].className}>
                {statusConfig[status].label}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-56 text-center">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}

interface StatsCardsProps {
  data: GreenhouseData
  getTemperatureStatus: () => HealthStatus
  getHumidityStatus: () => HealthStatus
  getSoilMoistureStatus: () => HealthStatus
  isLoading?: boolean
}

export function StatsCards({
  data,
  getTemperatureStatus,
  getHumidityStatus,
  getSoilMoistureStatus,
  isLoading,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Thermometer}
        label="Temperatura"
        value={data.temperature}
        unit="°C"
        status={getTemperatureStatus()}
        trend={data.temperature > 28 ? "up" : data.temperature < 20 ? "down" : "stable"}
        description="Temperatura interna da estufa. Ideal: 20–28 °C"
        isLoading={isLoading}
      />
      <StatCard
        icon={Droplets}
        label="Umidade do Ar"
        value={data.humidity}
        unit="%"
        status={getHumidityStatus()}
        trend="stable"
        description="Umidade relativa do ar. Ideal: 60–80%"
        isLoading={isLoading}
      />
      <StatCard
        icon={Leaf}
        label="Umidade do Solo"
        value={data.soilMoisture}
        unit="%"
        status={getSoilMoistureStatus()}
        trend={data.irrigation ? "up" : "down"}
        description="Umidade do solo. Ideal: 40–70%. Irrigação automática abaixo de 30%"
        isLoading={isLoading}
      />
      <StatCard
        icon={Zap}
        label="Nível de Luz"
        value={data.lightLevel}
        unit="%"
        status="good"
        trend="stable"
        description="Intensidade luminosa captada pelo sensor. Ideal: 60–100%"
        isLoading={isLoading}
      />
    </div>
  )
}
