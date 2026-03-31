"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DataPoint {
  time: string
  value: number
}

interface SensorChartsProps {
  temperatureHistory: DataPoint[]
  humidityHistory: DataPoint[]
  soilHistory: DataPoint[]
}

const charts: {
  key: string
  label: string
  color: string
  config: ChartConfig
  description: string
}[] = [
  {
    key: "temperature",
    label: "Temperatura",
    color: "#ef4444",
    config: { value: { label: "Temperatura (°C)", color: "#ef4444" } },
    description: "Variação da temperatura interna da estufa",
  },
  {
    key: "humidity",
    label: "Umidade Ar",
    color: "#3b82f6",
    config: { value: { label: "Umidade do Ar (%)", color: "#3b82f6" } },
    description: "Umidade relativa do ar ao longo do tempo",
  },
  {
    key: "soil",
    label: "Solo",
    color: "#22c55e",
    config: { value: { label: "Umidade do Solo (%)", color: "#22c55e" } },
    description: "Nível de hidratação do solo",
  },
]

function AreaChartCard({
  data,
  color,
  config,
  title,
  description,
}: {
  data: DataPoint[]
  color: string
  config: ChartConfig
  title: string
  description: string
}) {
  const gradientId = `fill-${color.replace("#", "")}`

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <ChartContainer config={config} className="h-[200px] w-full">
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

export function SensorCharts({ temperatureHistory, humidityHistory, soilHistory }: SensorChartsProps) {
  const dataMap: Record<string, DataPoint[]> = {
    temperature: temperatureHistory,
    humidity: humidityHistory,
    soil: soilHistory,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Sensores</CardTitle>
        <CardDescription>Leituras em tempo real dos últimos 30 registros</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature">
          <TabsList className="mb-4">
            {charts.map((c) => (
              <TabsTrigger key={c.key} value={c.key}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {charts.map((c) => (
            <TabsContent key={c.key} value={c.key}>
              <AreaChartCard
                data={dataMap[c.key]}
                color={c.color}
                config={c.config}
                title={c.label}
                description={c.description}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
