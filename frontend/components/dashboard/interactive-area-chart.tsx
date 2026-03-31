"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type TimeRange = "1h" | "6h" | "24h" | "7d"

interface DataPoint {
  time: string
  value: number
}

interface InteractiveAreaChartProps {
  title: string
  description?: string
  icon: React.ReactNode
  dataKey: string
  color: string
  gradientId: string
  unit?: string
  minValue?: number
  maxValue?: number
  idealMin?: number
  idealMax?: number
  className?: string
}

function generateData(range: TimeRange, type: string): DataPoint[] {
  const data: DataPoint[] = []
  const now = new Date()
  let points: number
  let interval: number

  switch (range) {
    case "1h":
      points = 12
      interval = 5
      break
    case "6h":
      points = 18
      interval = 20
      break
    case "24h":
      points = 24
      interval = 60
      break
    case "7d":
      points = 21
      interval = 480
      break
    default:
      points = 24
      interval = 60
  }

  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval * 60 * 1000)
    let value: number

    switch (type) {
      case "temperature":
        const hour = time.getHours()
        const dayFactor = Math.sin((hour - 6) * Math.PI / 12)
        value = 22 + dayFactor * 4 + (Math.random() - 0.5) * 2
        break
      case "humidity":
        value = 65 + Math.random() * 15 - (Math.random() * 5)
        break
      case "ph":
        value = 6.0 + (Math.random() - 0.5) * 0.8
        break
      default:
        value = 50 + Math.random() * 30
    }

    let timeLabel: string
    if (range === "7d") {
      timeLabel = time.toLocaleDateString("pt-BR", { weekday: "short" })
    } else {
      timeLabel = time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }

    data.push({
      time: timeLabel,
      value: +value.toFixed(1),
    })
  }

  return data
}

export function InteractiveAreaChart({
  title,
  icon,
  dataKey,
  color,
  gradientId,
  unit = "",
  minValue,
  maxValue,
  idealMin,
  idealMax,
  className,
}: InteractiveAreaChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")
  const [isHovered, setIsHovered] = useState(false)

  const data = useMemo(() => generateData(timeRange, dataKey), [timeRange, dataKey])

  const currentValue = data[data.length - 1]?.value ?? 0
  const avgValue = +(data.reduce((acc, d) => acc + d.value, 0) / data.length).toFixed(1)

  const isInIdealRange = idealMin !== undefined && idealMax !== undefined
    ? currentValue >= idealMin && currentValue <= idealMax
    : true

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
      {/* Glow effect */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          "bg-linear-to-br from-primary/3 via-transparent to-transparent",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-sm font-semibold text-card-foreground">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 bg-primary/5"
            >
              {icon}
            </div>
            {title}
          </CardTitle>
          <div className="flex gap-1 rounded-lg bg-50 p-1">
            {(["1h", "6h", "24h", "7d"] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant="ghost"
                size="sm"
                onClick={() => setTimeRange(range)}
                className={cn(
                  "h-6 px-2 text-[10px] font-medium transition-all duration-200",
                  timeRange === range
                    ? "bg-card text-card-foreground shadow-sm"
                    : "text-foreground hover:text-foreground"
                )}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-baseline gap-3">
          <span
            className={cn(
              "text-3xl font-bold tracking-tight",
              isInIdealRange ? "text-emerald-500" : "text-amber-500"
            )}
          >
            {currentValue}{unit}
          </span>
          <span className="text-sm text-foreground">
            média {avgValue}{unit}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-4 pt-2">
        <div className="h-35 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.8}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--foreground))"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis
                stroke="hsl(var(--foreground))"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                domain={[minValue ?? "auto", maxValue ?? "auto"]}
                tickFormatter={(value) => `${value}`}
                tick={{ fill: 'hsl(var(--foreground))' }}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  color: "hsl(var(--foreground))",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                  padding: "8px 12px",
                }}
                labelStyle={{ 
                  color: "hsl(var(--foreground))", 
                  marginBottom: "4px",
                  fontSize: "11px"
                }}
                formatter={(value: number) => [`${value}${unit}`, title]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: color,
                  stroke: "hsl(var(--card))",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
