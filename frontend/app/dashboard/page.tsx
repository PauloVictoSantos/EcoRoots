"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { MetricCard } from "@/components/dashboard/metric-card"
import { PlantStatusCard } from "@/components/dashboard/plant-status-card"
import { ControlPanel } from "@/components/dashboard/control-panel"
import { InteractiveAreaChart } from "@/components/dashboard/interactive-area-chart"
import { Thermometer, Droplets, FlaskConical, Zap } from "lucide-react"

function useSimulatedSensorData() {
  const [data, setData] = useState({
    temperature: 24.5,
    humidity: 68,
    ph: 6.2,
    ec: 1.8,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        temperature: +(22 + Math.random() * 6).toFixed(1),
        humidity: Math.round(60 + Math.random() * 20),
        ph: +(5.5 + Math.random() * 1.5).toFixed(1),
        ec: +(1.2 + Math.random() * 1).toFixed(1),
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return data
}

export default function DashboardPage() {
  const sensorData = useSimulatedSensorData()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Dashboard Principal
          </h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real da sua estufa inteligente
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Temperatura"
            value={sensorData.temperature}
            unit="°C"
            description="Ambiente interno"
            icon={Thermometer}
            iconColor="text-red-600 dark:text-red-400"
            iconGlowColor="rgba(239, 68, 68, 0.5)"
            trend={sensorData.temperature > 25 ? "up" : sensorData.temperature < 22 ? "down" : "stable"}
            trendValue={sensorData.temperature > 25 ? "Acima do ideal" : sensorData.temperature < 22 ? "Abaixo do ideal" : "Ideal"}
          />
          <MetricCard
            title="Umidade"
            value={sensorData.humidity}
            unit="%"
            description="Umidade relativa"
            icon={Droplets}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor=""
            iconGlowColor="rgba(59, 130, 246, 0.2)"
            trend={sensorData.humidity > 75 ? "up" : sensorData.humidity < 60 ? "down" : "stable"}
            trendValue={sensorData.humidity > 75 ? "Alta" : sensorData.humidity < 60 ? "Baixa" : "Ideal"}
          />
          <MetricCard
            title="pH"
            value={sensorData.ph}
            description="Solução nutritiva"
            icon={FlaskConical}
            iconColor="text-emerald-600 dark:text-emerald-400"
            iconGlowColor="rgba(16, 185, 129, 0.5)"
            trend={sensorData.ph > 6.5 ? "up" : sensorData.ph < 5.5 ? "down" : "stable"}
            trendValue={sensorData.ph > 6.5 ? "Alcalino" : sensorData.ph < 5.5 ? "Ácido" : "Neutro"}
          />
          <MetricCard
            title="Nutrientes (EC)"
            value={sensorData.ec}
            unit="mS/cm"
            description="Condutividade elétrica"
            icon={Zap}
            iconColor="text-amber-600 dark:text-amber-400"
            iconGlowColor="rgba(245, 158, 11, 0.5)"
            trend={sensorData.ec > 2.0 ? "up" : sensorData.ec < 1.5 ? "down" : "stable"}
            trendValue={sensorData.ec > 2.0 ? "Alto" : sensorData.ec < 1.5 ? "Baixo" : "Ideal"}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InteractiveAreaChart
            title="Temperatura"
            icon={<Thermometer className="h-4 w-4 text-red-500" />}
            dataKey="temperature"
            color="#EF2545"
            gradientId="temperatureGradient"
            unit="°C"
            minValue={15}
            maxValue={35}
            idealMin={20}
            idealMax={26}
          />
          <InteractiveAreaChart
            title="Umidade"
            icon={<Droplets className="h-4 w-4 text-blue-500" />}
            dataKey="humidity"
            color="#3B82F6"
            gradientId="humidityGradient"
            unit="%"
            minValue={40}
            maxValue={90}
            idealMin={60}
            idealMax={75}
          />
          <InteractiveAreaChart
            title="pH"
            icon={<FlaskConical className="h-4 w-4 text-emerald-500" />}
            dataKey="ph"
            color="#10B981"
            gradientId="phGradient"
            unit=""
            minValue={4}
            maxValue={8}
            idealMin={5.5}
            idealMax={6.5}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <PlantStatusCard
            status="healthy"
            pestRisk={12}
            lastAnalysis="há 5 minutos"
          />
          <ControlPanel />
        </div>
      </div>
    </DashboardLayout>
  )
}
