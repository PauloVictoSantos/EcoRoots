'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Thermometer, Droplets, Leaf, Activity, Power, RotateCcw, X,
  AlertTriangle, CheckCircle, Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GreenhouseData, HealthStatus, PlantAnalysis } from '@/hooks/use-realtime-data'

interface UIOverlayProps {
  data: GreenhouseData
  analysis?: PlantAnalysis | null
  isConnected: boolean
  onToggleIrrigation: () => void
  onResetCamera: () => void
  getTemperatureStatus: () => HealthStatus
  getHumidityStatus: () => HealthStatus
  getSoilMoistureStatus: () => HealthStatus
  getOverallStatus: () => HealthStatus
  selectedSensor: string | null
  onCloseSensor: () => void
}

function StatusBadge({ status }: { status: HealthStatus }) {
  const cfg = {
    good:     { label: 'Normal', dot: 'bg-[#58D68D]', text: 'text-[#58D68D]' },
    warning:  { label: 'Atenção', dot: 'bg-[#F59E0B]', text: 'text-[#F59E0B]' },
    critical: { label: 'Crítico', dot: 'bg-[#EF4444]', text: 'text-[#EF4444]' },
  }
  const c = cfg[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  )
}

function DataCard({ icon: Icon, label, value, unit, status, delay }: {
  icon: typeof Thermometer; label: string; value: number; unit: string
  status: HealthStatus; delay: number
}) {
  const colors = { good: '#58D68D', warning: '#F59E0B', critical: '#EF4444' }
  const c = colors[status]
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
      className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${c}20` }}>
            <Icon className="w-4 h-4" style={{ color: c }} />
          </div>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span key={value} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground">{value.toFixed(1)}</motion.span>
        <span className="text-muted-foreground text-sm">{unit}</span>
      </div>
    </motion.div>
  )
}

function SensorDetailPanel({ sensor, data, onClose }: { sensor: string; data: GreenhouseData; onClose: () => void }) {
  const info: Record<string, { title: string; value: number; unit: string; description: string; ideal: string }> = {
    temperature: { title: 'Sensor de Temperatura', value: data.temperature, unit: '°C',
      description: 'Monitora a temperatura ambiente dentro da estufa.', ideal: '22°C – 28°C' },
    humidity:    { title: 'Sensor de Umidade',     value: data.humidity,    unit: '%',
      description: 'Mede a umidade relativa do ar.', ideal: '50% – 70%' },
    soil:        { title: 'Sensor de Solo',        value: data.soilMoisture,unit: '%',
      description: 'Detecta o nível de umidade do solo.', ideal: '40% – 60%' },
  }
  const i = info[sensor]; if (!i) return null
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-72">
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold text-foreground">{i.title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-3 mb-3 rounded-xl bg-[#58D68D]/10">
          <span className="text-3xl font-bold text-[#58D68D]">{i.value.toFixed(1)}</span>
          <span className="text-lg text-[#58D68D]">{i.unit}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{i.description}</p>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Faixa ideal:</span>
          <span className="text-[#58D68D] font-medium">{i.ideal}</span>
        </div>
      </div>
    </motion.div>
  )
}

export function UIOverlay({
  data, analysis, isConnected,
  onToggleIrrigation, onResetCamera,
  getTemperatureStatus, getHumidityStatus, getSoilMoistureStatus, getOverallStatus,
  selectedSensor, onCloseSensor,
}: UIOverlayProps) {
  const overall = getOverallStatus()
  const alertColor = analysis?.health.alertType === 'critical' ? '#EF4444'
    : analysis?.health.alertType === 'pest_detected' || analysis?.health.alertType === 'disease_detected' ? '#F59E0B'
    : '#58D68D'

  return (
    <>
      {/* Top-left: connection */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-30">
        <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#58D68D] animate-pulse' : 'bg-[#EF4444]'}`} />
          <span className="text-sm text-foreground">{isConnected ? 'Conectado' : 'Desconectado'}</span>
        </div>
      </motion.div>

      {/* Top-right: overall status */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="absolute top-4 right-4 z-30">
        <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <StatusBadge status={overall} />
        </div>
      </motion.div>

      {/* Left panel: sensor cards */}
      <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-60 space-y-3">
        <DataCard icon={Thermometer} label="Temperatura" value={data.temperature} unit="°C" status={getTemperatureStatus()} delay={0.3} />
        <DataCard icon={Droplets}    label="Umidade"     value={data.humidity}     unit="%" status={getHumidityStatus()}    delay={0.4} />
        <DataCard icon={Leaf}        label="Solo"        value={data.soilMoisture} unit="%" status={getSoilMoistureStatus()}delay={0.5} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
          className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data.irrigation ? 'bg-[#4FC3F7]/20' : 'bg-muted/20'}`}>
              <Activity className={`w-4 h-4 ${data.irrigation ? 'text-[#4FC3F7]' : 'text-muted-foreground'}`} />
            </div>
            <span className="text-sm text-muted-foreground">Irrigação</span>
          </div>
          <span className={`text-xl font-bold ${data.irrigation ? 'text-[#4FC3F7]' : 'text-muted-foreground'}`}>
            {data.irrigation ? 'Ativa' : 'Inativa'}
          </span>
        </motion.div>
      </motion.div>

      {/* AI alert bubble (top center, only when analysis available) */}
      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-xs">
            <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2"
              style={{ borderColor: `${alertColor}30` }}>
              <Brain className="w-4 h-4 shrink-0" style={{ color: alertColor }} />
              <p className="text-xs font-medium truncate" style={{ color: alertColor }}>
                {analysis.oneLiner}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <Button onClick={onToggleIrrigation} variant={data.irrigation ? 'default' : 'outline'}
          className={`rounded-xl ${data.irrigation
            ? 'bg-[#4FC3F7] hover:bg-[#4FC3F7]/80 text-background'
            : 'border-[#4FC3F7]/30 hover:bg-[#4FC3F7]/10 text-foreground'}`}>
          <Power className="w-4 h-4 mr-2" />
          {data.irrigation ? 'Desligar Irrigação' : 'Ligar Irrigação'}
        </Button>
        <Button onClick={onResetCamera} variant="outline"
          className="rounded-xl border-border/50 hover:bg-card text-foreground">
          <RotateCcw className="w-4 h-4 mr-2" />Resetar
        </Button>
      </motion.div>

      {/* Sensor detail popup */}
      <AnimatePresence>
        {selectedSensor && (
          <SensorDetailPanel sensor={selectedSensor} data={data} onClose={onCloseSensor} />
        )}
      </AnimatePresence>
    </>
  )
}
