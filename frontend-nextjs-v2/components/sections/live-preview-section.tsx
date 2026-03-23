'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Thermometer, Droplets, Leaf, Activity } from 'lucide-react'
import Link from 'next/link'
import { SectionWrapper, SectionHeader } from '@/components/section-wrapper'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'

interface SensorData {
  temperature: number
  humidity: number
  soilMoisture: number
  irrigation: boolean
}

function getStatus(value: number, type: 'temperature' | 'humidity' | 'soilMoisture') {
  if (type === 'temperature') {
    if (value < 18 || value > 35) return { status: 'critical', color: '#EF4444' }
    if (value < 22 || value > 30) return { status: 'warning', color: '#F59E0B' }
    return { status: 'good', color: '#58D68D' }
  }
  if (type === 'humidity') {
    if (value < 30 || value > 90) return { status: 'critical', color: '#EF4444' }
    if (value < 40 || value > 80) return { status: 'warning', color: '#F59E0B' }
    return { status: 'good', color: '#58D68D' }
  }
  if (value < 20) return { status: 'critical', color: '#EF4444' }
  if (value < 35) return { status: 'warning', color: '#F59E0B' }
  return { status: 'good', color: '#58D68D' }
}

function DataCard({
  icon: Icon,
  label,
  value,
  unit,
  type,
  delay,
}: {
  icon: typeof Thermometer
  label: string
  value: number
  unit: string
  type: 'temperature' | 'humidity' | 'soilMoisture'
  delay: number
}) {
  const { status, color } = getStatus(value, type)

  return (
    <GlassCard delay={delay} className="relative overflow-hidden">
      {/* Status glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: color }}
      />
      
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-foreground"
        >
          {value}
        </motion.span>
        <span className="text-muted-foreground">{unit}</span>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <div
          className="h-1.5 flex-1 rounded-full overflow-hidden"
          style={{ backgroundColor: `${color}20` }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${type === 'temperature' ? (value / 50) * 100 : value}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <span className="text-xs capitalize" style={{ color }}>
          {status === 'good' ? 'Normal' : status === 'warning' ? 'Atenção' : 'Crítico'}
        </span>
      </div>
    </GlassCard>
  )
}

export function LivePreviewSection() {
  const [data, setData] = useState<SensorData>({
    temperature: 26,
    humidity: 65,
    soilMoisture: 45,
    irrigation: false,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        temperature: Math.floor(22 + Math.random() * 10),
        humidity: Math.floor(50 + Math.random() * 30),
        soilMoisture: Math.floor(30 + Math.random() * 40),
        irrigation: Math.random() > 0.7,
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <SectionWrapper className="container mx-auto px-4">
      <SectionHeader
        badge="Dados ao Vivo"
        title="Monitoramento em Tempo Real"
        description="Visualize os dados da estufa atualizados a cada segundo"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DataCard
          icon={Thermometer}
          label="Temperatura"
          value={data.temperature}
          unit="°C"
          type="temperature"
          delay={0}
        />
        <DataCard
          icon={Droplets}
          label="Umidade do Ar"
          value={data.humidity}
          unit="%"
          type="humidity"
          delay={0.1}
        />
        <DataCard
          icon={Leaf}
          label="Umidade do Solo"
          value={data.soilMoisture}
          unit="%"
          type="soilMoisture"
          delay={0.2}
        />
        <GlassCard delay={0.3} className="relative overflow-hidden">
          <div
            className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${
              data.irrigation ? 'bg-[#4FC3F7]' : 'bg-muted'
            }`}
          />
          
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                data.irrigation ? 'bg-[#4FC3F7]/20' : 'bg-muted/20'
              }`}
            >
              <Activity
                className={`w-6 h-6 ${data.irrigation ? 'text-[#4FC3F7]' : 'text-muted-foreground'}`}
              />
            </div>
            <motion.div
              animate={data.irrigation ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
              className={`w-3 h-3 rounded-full ${data.irrigation ? 'bg-[#4FC3F7]' : 'bg-muted'}`}
            />
          </div>
          
          <p className="text-muted-foreground text-sm mb-1">Irrigação</p>
          <motion.span
            key={data.irrigation ? 'on' : 'off'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl font-bold ${data.irrigation ? 'text-[#4FC3F7]' : 'text-muted-foreground'}`}
          >
            {data.irrigation ? 'Ativa' : 'Inativa'}
          </motion.span>
          
          <div className="mt-4">
            <span className={`text-xs ${data.irrigation ? 'text-[#4FC3F7]' : 'text-muted-foreground'}`}>
              {data.irrigation ? 'Sistema irrigando' : 'Aguardando'}
            </span>
          </div>
        </GlassCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-[#1E8449] to-[#145A32] hover:from-[#58D68D] hover:to-[#1E8449] text-foreground px-8 py-6 text-lg rounded-2xl glow-green"
        >
          <Link href="/dashboard">Ver Dashboard Completo</Link>
        </Button>
      </motion.div>
    </SectionWrapper>
  )
}
