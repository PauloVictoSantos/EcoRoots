'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Thermometer, Droplets, Leaf, Activity, Zap, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, Upload, Brain, Bug, Sprout, Flame,
  DollarSign, Eye, Wind, BarChart3, Wifi, WifiOff, RefreshCw, X,
} from 'lucide-react'
import { useRealtimeData, type HealthStatus, type PlantAnalysis } from '@/hooks/use-realtime-data'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function StatusIndicator({ status }: { status: HealthStatus }) {
  const cfg = {
    good:     { icon: CheckCircle,   color: '#58D68D', label: 'Normal',  bg: 'bg-[#58D68D]/10' },
    warning:  { icon: AlertTriangle, color: '#F59E0B', label: 'Atenção', bg: 'bg-[#F59E0B]/10' },
    critical: { icon: AlertTriangle, color: '#EF4444', label: 'Crítico', bg: 'bg-[#EF4444]/10' },
  }
  const Icon = cfg[status].icon
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${cfg[status].bg}`}>
      <Icon className="w-4 h-4" style={{ color: cfg[status].color }} />
      <span className="text-sm font-medium" style={{ color: cfg[status].color }}>{cfg[status].label}</span>
    </div>
  )
}

// ── Sensor stat card ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, unit, status, trend, delay }: {
  icon: typeof Thermometer; label: string; value: number; unit: string
  status: HealthStatus; trend?: 'up' | 'down' | 'stable'; delay: number
}) {
  const c = { good: '#58D68D', warning: '#F59E0B', critical: '#EF4444' }[status]
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null
  return (
    <GlassCard delay={delay} className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20" style={{ backgroundColor: c }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${c}20` }}>
          <Icon className="w-6 h-6" style={{ color: c }} />
        </div>
        <StatusIndicator status={status} />
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <motion.span key={value} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-foreground">
          {value.toFixed(1)}
        </motion.span>
        <span className="text-muted-foreground">{unit}</span>
        {TrendIcon && <TrendIcon className={`w-4 h-4 ml-2 ${trend === 'up' ? 'text-[#EF4444]' : 'text-[#58D68D]'}`} />}
      </div>
      <div className="mt-4 h-1.5 rounded-full overflow-hidden bg-muted/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((value / (label === 'Temperatura' ? 50 : 100)) * 100, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full" style={{ backgroundColor: c }}
        />
      </div>
    </GlassCard>
  )
}

// ── Health score ring ───────────────────────────────────────────────────────
function HealthRing({ score, status }: { score: number; status: string }) {
  const c = status === 'critical' ? '#EF4444' : status === 'stressed' ? '#F59E0B' : '#58D68D'
  const r = 44, circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke={c} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={`${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center">
        <div className="text-2xl font-bold" style={{ color: c }}>{score}</div>
        <div className="text-xs text-muted-foreground">saúde</div>
      </div>
    </div>
  )
}

// ── AI Analysis Panel ───────────────────────────────────────────────────────
function AIAnalysisPanel({ analysis, isAnalyzing, onUpload }: {
  analysis: PlantAnalysis | null; isAnalyzing: boolean
  onUpload: (f: File) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const alertColors: Record<string, string> = {
    critical:          '#EF4444',
    pest_detected:     '#F59E0B',
    disease_detected:  '#F59E0B',
    environmental_stress: '#60A5FA',
    healthy:           '#58D68D',
    none:              '#58D68D',
  }

  const severityBg: Record<string, string> = {
    high:   'bg-[#EF4444]/10 border-[#EF4444]/20',
    medium: 'bg-[#F59E0B]/10 border-[#F59E0B]/20',
    low:    'bg-[#58D68D]/10 border-[#58D68D]/20',
  }

  return (
    <GlassCard delay={0.4} hover={false} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#58D68D]" />
          <h3 className="text-lg font-semibold text-foreground">Análise IA</h3>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />
          <Button size="sm" variant="outline"
            className="rounded-xl border-[#58D68D]/30 hover:bg-[#58D68D]/10 text-[#58D68D] text-xs gap-1.5"
            onClick={() => fileRef.current?.click()} disabled={isAnalyzing}>
            {isAnalyzing
              ? <><RefreshCw className="w-3 h-3 animate-spin" />Analisando...</>
              : <><Upload className="w-3 h-3" />Enviar Foto</>}
          </Button>
        </div>
      </div>

      {!analysis ? (
        <div
          className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#58D68D]/20 rounded-xl cursor-pointer hover:border-[#58D68D]/40 hover:bg-[#58D68D]/5 transition-all"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-[#58D68D]/40 mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Envie uma foto da planta<br/>para análise completa
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">JPG · PNG · WEBP</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* One-liner alert */}
          <div className="rounded-xl p-3 border" style={{
            background: `${alertColors[analysis.health.alertType] || '#58D68D'}10`,
            borderColor: `${alertColors[analysis.health.alertType] || '#58D68D'}30`,
          }}>
            <p className="text-sm font-semibold" style={{ color: alertColors[analysis.health.alertType] || '#58D68D' }}>
              {analysis.oneLiner}
            </p>
          </div>

          {/* Plant + Health */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-card/50">
            <HealthRing score={analysis.health.healthScore} status={analysis.health.healthStatus} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{analysis.plant.commonName}</p>
              {analysis.plant.scientificName && (
                <p className="text-xs text-muted-foreground italic">{analysis.plant.scientificName}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{analysis.plant.growthStage}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{analysis.plant.stageObservation}</p>
            </div>
          </div>

          {/* Problem */}
          {analysis.problem.hasProblem && (
            <div className={`rounded-xl p-3 border ${severityBg[analysis.severity.severity] || severityBg.low}`}>
              <div className="flex items-center gap-2 mb-2">
                <Bug className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm font-semibold text-foreground">
                  {analysis.problem.name || analysis.problem.problemType}
                </span>
                {analysis.problem.isContagious && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#EF4444]/20 text-[#EF4444]">Contagioso</span>
                )}
              </div>
              {analysis.problem.symptoms.slice(0, 3).map((s, i) => (
                <p key={i} className="text-xs text-muted-foreground flex gap-1.5 items-start">
                  <span className="text-[#F59E0B] mt-0.5">•</span>{s}
                </p>
              ))}
            </div>
          )}

          {/* Severity & Urgency */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-3 bg-card/50">
              <p className="text-xs text-muted-foreground mb-1">Severidade</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-muted/30 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${analysis.severity.severityScore}%`, background: analysis.severity.severity === 'high' ? '#EF4444' : analysis.severity.severity === 'medium' ? '#F59E0B' : '#58D68D' }} />
                </div>
                <span className="text-xs font-mono text-foreground">{analysis.severity.severityScore}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analysis.severity.urgencyMessage}</p>
            </div>
            <div className="rounded-xl p-3 bg-card/50">
              <p className="text-xs text-muted-foreground mb-1">Impacto</p>
              <p className="text-lg font-bold" style={{ color: analysis.financial.isEmergency ? '#EF4444' : '#F59E0B' }}>
                {analysis.financial.estimatedLossMin === 0 && analysis.financial.estimatedLossMax === 0
                  ? '0%' : `${analysis.financial.estimatedLossMin}–${analysis.financial.estimatedLossMax}%`}
              </p>
              <p className="text-xs text-muted-foreground">perda estimada</p>
            </div>
          </div>

          {/* Actions */}
          {analysis.actions.immediateActions.length > 0 && (
            <div className="rounded-xl p-3 bg-[#EF4444]/5 border border-[#EF4444]/15">
              <p className="text-xs font-semibold text-[#EF4444] mb-2 flex items-center gap-1.5">
                <Flame className="w-3 h-3" />AGORA
              </p>
              {analysis.actions.immediateActions.map((a, i) => (
                <p key={i} className="text-xs text-muted-foreground flex gap-1.5 items-start">
                  <span className="text-[#EF4444] font-bold mt-0.5">→</span>{a}
                </p>
              ))}
            </div>
          )}
          {analysis.actions.shortTermActions.length > 0 && (
            <div className="rounded-xl p-3 bg-[#F59E0B]/5 border border-[#F59E0B]/15">
              <p className="text-xs font-semibold text-[#F59E0B] mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />1–3 DIAS
              </p>
              {analysis.actions.shortTermActions.map((a, i) => (
                <p key={i} className="text-xs text-muted-foreground flex gap-1.5 items-start">
                  <span className="text-[#F59E0B] font-bold mt-0.5">→</span>{a}
                </p>
              ))}
            </div>
          )}
          {analysis.actions.specificProduct && (
            <div className="rounded-xl p-3 bg-[#60A5FA]/5 border border-[#60A5FA]/20">
              <p className="text-xs font-semibold text-[#60A5FA] mb-1">💊 Produto indicado</p>
              <p className="text-xs text-muted-foreground">{analysis.actions.specificProduct}</p>
            </div>
          )}

          {/* Trend */}
          <div className="rounded-xl p-3 bg-card/50 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Vai piorar?</p>
              <p className={`font-medium ${analysis.trend.willWorsen ? 'text-[#EF4444]' : 'text-[#58D68D]'}`}>
                {analysis.trend.willWorsen ? 'Sim ⚠' : 'Não ✓'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Risco spread</p>
              <p className="font-medium text-foreground capitalize">{analysis.trend.spreadRisk}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Monitorar</p>
              <p className="font-medium text-foreground">{analysis.trend.monitoringFrequency}</p>
            </div>
          </div>

          {/* Smart tip */}
          {analysis.smart.bestTimeToApply && (
            <div className="rounded-xl p-3 bg-[#58D68D]/5 border border-[#58D68D]/15">
              <p className="text-xs font-semibold text-[#58D68D] mb-1 flex items-center gap-1.5">
                <Sprout className="w-3 h-3" />Dica inteligente
              </p>
              <p className="text-xs text-muted-foreground">{analysis.smart.bestTimeToApply}</p>
              <p className="text-xs text-muted-foreground mt-1">{analysis.smart.controlStrategy}</p>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  )
}

// ── Chart card ──────────────────────────────────────────────────────────────
function ChartCard({ title, data, dataKey, color, delay }: {
  title: string; data: { time: string; value: number }[]
  dataKey: string; color: string; delay: number
}) {
  return (
    <GlassCard delay={delay} hover={false} className="h-64">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
          <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
          <YAxis stroke="#6B7280" fontSize={10} />
          <Tooltip contentStyle={{ background: '#1C1C1C', border: '1px solid rgba(88,214,141,.2)', borderRadius: 10, color: '#EAEAEA' }} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#g-${dataKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}

// ── Alerts panel ────────────────────────────────────────────────────────────
function AlertsPanel({ data, analysis }: { data: any; analysis: PlantAnalysis | null }) {
  const alerts: { type: string; message: string; time: string }[] = []

  if (data.temperature > 35) alerts.push({ type: 'critical', message: 'Temperatura crítica!', time: 'Agora' })
  else if (data.temperature > 30) alerts.push({ type: 'warning', message: 'Temperatura acima do ideal', time: 'Agora' })
  if (data.soilMoisture < 20) alerts.push({ type: 'critical', message: 'Solo muito seco!', time: 'Agora' })
  else if (data.soilMoisture < 30) alerts.push({ type: 'warning', message: 'Solo precisa de irrigação', time: 'Agora' })
  if (data.humidity < 40) alerts.push({ type: 'warning', message: 'Umidade do ar baixa', time: 'Agora' })
  if (analysis?.financial.isEmergency) alerts.push({ type: 'critical', message: analysis.oneLiner, time: 'IA' })
  else if (analysis?.problem.hasProblem) alerts.push({ type: 'warning', message: analysis.oneLiner, time: 'IA' })

  return (
    <GlassCard delay={0.6} hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Alertas</h3>
        <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/30">{alerts.length} ativos</span>
      </div>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle className="w-10 h-10 text-[#58D68D] mb-2" />
            <p className="text-sm text-muted-foreground">Todos os sistemas normais</p>
          </div>
        ) : alerts.map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-3 p-3 rounded-xl ${a.type === 'critical' ? 'bg-[#EF4444]/10' : 'bg-[#F59E0B]/10'}`}>
            <AlertTriangle className={`w-4 h-4 mt-0.5 ${a.type === 'critical' ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`} />
            <div>
              <p className={`text-sm font-medium ${a.type === 'critical' ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>{a.message}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{a.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

// ── Connection banner ───────────────────────────────────────────────────────
function ConnBanner({ socket, backend, pythonAi, lastUpdate }: {
  socket: boolean; backend: boolean; pythonAi: boolean; lastUpdate: Date | null
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <span className="flex items-center gap-1.5">
        {socket ? <Wifi className="w-3 h-3 text-[#58D68D]" /> : <WifiOff className="w-3 h-3 text-[#EF4444]" />}
        <span className={socket ? 'text-[#58D68D]' : 'text-[#EF4444]'}>Socket.IO</span>
      </span>
      <span className={`flex items-center gap-1.5 ${backend ? 'text-[#58D68D]' : 'text-muted-foreground'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${backend ? 'bg-[#58D68D]' : 'bg-muted-foreground'}`} />
        Node.js :3000
      </span>
      <span className={`flex items-center gap-1.5 ${pythonAi ? 'text-[#58D68D]' : 'text-muted-foreground'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${pythonAi ? 'bg-[#58D68D]' : 'bg-muted-foreground'}`} />
        Python AI :8000
      </span>
      {lastUpdate && (
        <span className="text-muted-foreground">
          Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
        </span>
      )}
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const {
    data, analysis, isConnected, connStatus, lastUpdate, isAnalyzing,
    toggleIrrigation, analyzeImage,
    getTemperatureStatus, getHumidityStatus, getSoilMoistureStatus, getOverallStatus,
    refetch,
  } = useRealtimeData()

  const [history, setHistory] = useState<{
    temperature: { time: string; value: number }[]
    humidity:    { time: string; value: number }[]
    soil:        { time: string; value: number }[]
  }>({ temperature: [], humidity: [], soil: [] })

  useEffect(() => {
    const t = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setHistory(p => ({
      temperature: [...p.temperature.slice(-29), { time: t, value: +data.temperature.toFixed(1) }],
      humidity:    [...p.humidity.slice(-29),    { time: t, value: +data.humidity.toFixed(1)    }],
      soil:        [...p.soil.slice(-29),        { time: t, value: +data.soilMoisture.toFixed(1)}],
    }))
  }, [data])

  const overall = getOverallStatus()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Dashboard de Monitoramento</h1>
            <ConnBanner socket={connStatus.socket} backend={connStatus.backend} pythonAi={connStatus.pythonAi} lastUpdate={lastUpdate} />
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={refetch}>
              <RefreshCw className="w-4 h-4" />Atualizar
            </Button>
            <Button
              onClick={toggleIrrigation}
              className={`rounded-xl ${data.irrigation
                ? 'bg-[#4FC3F7] hover:bg-[#4FC3F7]/80 text-background'
                : 'bg-gradient-to-r from-[#1E8449] to-[#145A32] hover:from-[#58D68D] hover:to-[#1E8449] text-foreground'}`}>
              <Activity className="w-4 h-4 mr-2" />
              {data.irrigation ? 'Desligar Irrigação' : 'Ligar Irrigação'}
            </Button>
          </div>
        </motion.div>

        {/* Sensor cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Thermometer} label="Temperatura"    value={data.temperature}  unit="°C" status={getTemperatureStatus()}   trend={data.temperature > 28 ? 'up' : 'stable'} delay={0} />
          <StatCard icon={Droplets}    label="Umidade do Ar"  value={data.humidity}      unit="%" status={getHumidityStatus()}       trend="stable" delay={0.1} />
          <StatCard icon={Leaf}        label="Umidade Solo"   value={data.soilMoisture}  unit="%" status={getSoilMoistureStatus()}   trend={data.irrigation ? 'up' : 'down'} delay={0.2} />
          <StatCard icon={Zap}         label="Nível de Luz"   value={data.lightLevel}    unit="%" status="good" trend="stable" delay={0.3} />
        </div>

        {/* Main content: charts + AI panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Charts column (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChartCard title="Temperatura" data={history.temperature} dataKey="temperature" color="#FF6B6B" delay={0.3} />
              <ChartCard title="Umidade do Ar" data={history.humidity} dataKey="humidity" color="#4FC3F7" delay={0.4} />
            </div>
            <ChartCard title="Umidade do Solo" data={history.soil} dataKey="soil" color="#58D68D" delay={0.5} />
          </div>

          {/* AI panel (1/3) */}
          <div className="lg:col-span-1" style={{ minHeight: 500 }}>
            <AIAnalysisPanel analysis={analysis} isAnalyzing={isAnalyzing} onUpload={analyzeImage} />
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Water tank */}
          <GlassCard delay={0.7} hover={false}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Reservatório</h3>
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-28 rounded-xl border-2 border-[#4FC3F7]/30 overflow-hidden">
                <motion.div initial={{ height: 0 }} animate={{ height: `${data.waterLevel}%` }} transition={{ duration: 1 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0288D1] to-[#4FC3F7]" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#4FC3F7]">{data.waterLevel.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Nível atual</p>
                <p className="text-xs mt-1" style={{ color: data.waterLevel > 50 ? '#58D68D' : '#F59E0B' }}>
                  {data.waterLevel > 50 ? 'Nível adequado' : 'Reabastecer em breve'}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Irrigation */}
          <GlassCard delay={0.8} hover={false}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Irrigação</h3>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${data.irrigation ? 'bg-[#4FC3F7]/20' : 'bg-muted/20'}`}>
                <motion.div animate={data.irrigation ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 1, repeat: Infinity }}>
                  <Activity className={`w-7 h-7 ${data.irrigation ? 'text-[#4FC3F7]' : 'text-muted-foreground'}`} />
                </motion.div>
              </div>
              <div>
                <p className={`text-xl font-bold ${data.irrigation ? 'text-[#4FC3F7]' : 'text-muted-foreground'}`}>
                  {data.irrigation ? 'ATIVA' : 'INATIVA'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {analysis?.irrigation.advice || (data.irrigation ? 'Irrigando as plantas' : 'Aguardando necessidade')}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Alerts */}
          <AlertsPanel data={data} analysis={analysis} />
        </div>
      </div>
    </div>
  )
}
