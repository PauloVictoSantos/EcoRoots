'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

// ── Backend URLs ────────────────────────────────────────────────────────────
const NODE_BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL  || 'http://localhost:3000'
const PYTHON_AI    = process.env.NEXT_PUBLIC_PYTHON_AI_URL || 'http://localhost:8000'

// ── Types ────────────────────────────────────────────────────────────────────
export interface GreenhouseData {
  temperature:  number
  humidity:     number
  soilMoisture: number
  irrigation:   boolean
  lightLevel:   number
  waterLevel:   number
}

export type HealthStatus = 'good' | 'warning' | 'critical'

// Full AI analysis from Python /analyze endpoint
export interface PlantAnalysis {
  plant: {
    commonName:       string
    scientificName:   string | null
    growthStage:      string
    stageNormal:      boolean
    stageObservation: string
  }
  problem: {
    hasProblem:   boolean
    problemType:  string
    name:         string | null
    isContagious: boolean
    stage:        string
    symptoms:     string[]
    location:     string
  }
  severity: {
    severity:       string
    severityScore:  number
    urgency:        string
    urgencyDays:    number
    urgencyMessage: string
  }
  financial: {
    estimatedLossMin:  number
    estimatedLossMax:  number
    estimatedLossText: string
    isEmergency:       boolean
  }
  actions: {
    immediateActions:  string[]
    shortTermActions:  string[]
    preventiveActions: string[]
    productType:       string
    specificProduct:   string | null
  }
  irrigation: {
    needed:     boolean
    excess:     boolean
    soilStatus: string
    advice:     string
  }
  environment: {
    temperatureStatus: string
    humidityStatus:    string
    lightStatus:       string
    observation:       string
  }
  trend: {
    willWorsen:          boolean
    willSelfRecover:     boolean
    spreadRisk:          string
    monitoringFrequency: string
    forecast:            string
  }
  health: {
    alertType:    string
    alertMessage: string
    healthScore:  number
    healthStatus: string
    confidence:   number
  }
  smart: {
    bestTimeToApply:    string
    monitoringSchedule: string
    controlStrategy:    string
    additionalTips:     string[]
  }
  oneLiner:  string
  riskLevel: string
}

export interface ConnectionStatus {
  socket:  boolean
  backend: boolean
  pythonAi: boolean
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useRealtimeData(initialData?: Partial<GreenhouseData>) {
  const [data, setData] = useState<GreenhouseData>({
    temperature:  initialData?.temperature  ?? 25,
    humidity:     initialData?.humidity     ?? 65,
    soilMoisture: initialData?.soilMoisture ?? 50,
    irrigation:   initialData?.irrigation   ?? false,
    lightLevel:   initialData?.lightLevel   ?? 70,
    waterLevel:   initialData?.waterLevel   ?? 80,
  })

  const [analysis,    setAnalysis]    = useState<PlantAnalysis | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connStatus,  setConnStatus]  = useState<ConnectionStatus>({
    socket: false, backend: false, pythonAi: false,
  })
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const socketRef = useRef<Socket | null>(null)

  // ── Load initial data from REST ──────────────────────────────────────────
  useEffect(() => {
    fetchDashboard()
    checkPythonHealth()
  }, [])

  async function fetchDashboard() {
    try {
      const r = await fetch(`${NODE_BACKEND}/dashboard`)
      if (!r.ok) return
      const d = await r.json()
      setConnStatus(s => ({ ...s, backend: true }))

      if (d.sensor) {
        setData(prev => ({
          ...prev,
          temperature:  d.sensor.temperature  ?? prev.temperature,
          humidity:     d.sensor.humidity      ?? prev.humidity,
          soilMoisture: d.sensor.soilMoisture  ?? prev.soilMoisture,
        }))
        setLastUpdate(new Date(d.sensor.timestamp || Date.now()))
      }

      // Map backend insights → PlantAnalysis format if available
      if (d.analysis && d.insights) {
        setAnalysis(mapBackendToAnalysis(d.analysis, d.insights))
      }
    } catch {
      setConnStatus(s => ({ ...s, backend: false }))
    }
  }

  async function checkPythonHealth() {
    try {
      const r = await fetch(`${PYTHON_AI}/health`)
      const d = await r.json()
      setConnStatus(s => ({ ...s, pythonAi: d.status === 'ok' }))
    } catch {
      setConnStatus(s => ({ ...s, pythonAi: false }))
    }
  }

  // ── Socket.IO ────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(NODE_BACKEND, {
      transports: ['websocket', 'polling'],
      reconnectionDelay: 3000,
      timeout: 10000,
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      setConnStatus(s => ({ ...s, socket: true, backend: true }))
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      setConnStatus(s => ({ ...s, socket: false }))
    })

    socket.on('greenhouse:update', (payload: any) => {
      const s  = payload.sensor     || {}
      const ai = payload.aiAnalysis || {}
      const i  = payload.insights   || {}

      setData(prev => ({
        ...prev,
        temperature:  typeof s.temperature  === 'number' ? s.temperature  : prev.temperature,
        humidity:     typeof s.humidity     === 'number' ? s.humidity     : prev.humidity,
        soilMoisture: typeof s.soilMoisture === 'number' ? s.soilMoisture : prev.soilMoisture,
        irrigation:   payload.irrigation ?? i.irrigationRecommendation ?? prev.irrigation,
        waterLevel:   Math.max(0, prev.waterLevel - 0.3),
      }))

      if (ai.plant?.commonName) {
        setAnalysis({
          plant:       ai.plant,
          problem:     ai.problem,
          severity:    ai.severity,
          financial:   ai.financial,
          actions:     ai.actions,
          irrigation:  ai.irrigation,
          environment: ai.environment,
          trend:       ai.trend,
          health:      ai.health,
          smart:       ai.smart,
          oneLiner:    ai.oneLiner  || i.summary    || 'Análise completa',
          riskLevel:   ai.riskLevel || i.riskLevel  || 'low',
        } as PlantAnalysis)
      }

      setLastUpdate(new Date())
    })

    return () => { socket.disconnect() }
  }, [])

  // ── Analyze image via Python AI directly ─────────────────────────────────
  const analyzeImage = useCallback(async (file: File): Promise<PlantAnalysis | null> => {
    setIsAnalyzing(true)
    try {
      const form = new FormData()
      form.append('image', file)
      const r = await fetch(`${PYTHON_AI}/analyze`, { method: 'POST', body: form })
      if (!r.ok) throw new Error(`AI error: ${r.status}`)
      const d: PlantAnalysis = await r.json()
      setAnalysis(d)
      // Sync irrigation advice
      if (d.irrigation) {
        setData(prev => ({ ...prev, irrigation: d.irrigation.needed }))
      }
      return d
    } catch (e) {
      console.error('Analysis failed:', e)
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  // ── Toggle irrigation (local + backend) ──────────────────────────────────
  const toggleIrrigation = useCallback(() => {
    setData(prev => ({ ...prev, irrigation: !prev.irrigation }))
  }, [])

  // ── Status helpers ────────────────────────────────────────────────────────
  const getTemperatureStatus = useCallback((): HealthStatus => {
    if (data.temperature < 18 || data.temperature > 35) return 'critical'
    if (data.temperature < 22 || data.temperature > 30) return 'warning'
    return 'good'
  }, [data.temperature])

  const getHumidityStatus = useCallback((): HealthStatus => {
    if (data.humidity < 30 || data.humidity > 90) return 'critical'
    if (data.humidity < 40 || data.humidity > 80) return 'warning'
    return 'good'
  }, [data.humidity])

  const getSoilMoistureStatus = useCallback((): HealthStatus => {
    if (data.soilMoisture < 20) return 'critical'
    if (data.soilMoisture < 35) return 'warning'
    return 'good'
  }, [data.soilMoisture])

  const getOverallStatus = useCallback((): HealthStatus => {
    // If AI says critical/pest/disease, escalate
    if (analysis?.health.alertType === 'critical') return 'critical'
    if (analysis?.health.alertType === 'pest_detected' || analysis?.health.alertType === 'disease_detected') return 'warning'
    const statuses = [getTemperatureStatus(), getHumidityStatus(), getSoilMoistureStatus()]
    if (statuses.includes('critical')) return 'critical'
    if (statuses.includes('warning'))  return 'warning'
    return 'good'
  }, [getTemperatureStatus, getHumidityStatus, getSoilMoistureStatus, analysis])

  return {
    data,
    analysis,
    isConnected,
    connStatus,
    lastUpdate,
    isAnalyzing,
    toggleIrrigation,
    analyzeImage,
    getTemperatureStatus,
    getHumidityStatus,
    getSoilMoistureStatus,
    getOverallStatus,
    refetch: fetchDashboard,
  }
}

// ── Map backend response → PlantAnalysis ─────────────────────────────────────
function mapBackendToAnalysis(a: any, i: any): PlantAnalysis {
  return {
    plant: {
      commonName:       a.plant        || 'Desconhecida',
      scientificName:   null,
      growthStage:      'Vegetativo',
      stageNormal:      true,
      stageObservation: '',
    },
    problem: {
      hasProblem:   a.hasPest || a.hasDisease,
      problemType:  a.hasPest ? 'pest' : a.hasDisease ? 'disease' : 'none',
      name:         a.pestType || a.diseaseType || null,
      isContagious: false,
      stage:        a.severity || '',
      symptoms:     [],
      location:     'unknown',
    },
    severity: {
      severity:       a.severity     || 'low',
      severityScore:  a.severity === 'high' ? 80 : a.severity === 'medium' ? 50 : 10,
      urgency:        i.urgencyDays <= 2 ? 'immediate' : i.urgencyDays <= 7 ? 'short_term' : 'monitor',
      urgencyDays:    i.urgencyDays  || 30,
      urgencyMessage: `Agir em ${i.urgencyDays || 30} dias`,
    },
    financial: {
      estimatedLossMin:  0,
      estimatedLossMax:  a.severity === 'high' ? 70 : a.severity === 'medium' ? 35 : 0,
      estimatedLossText: i.estimatedLoss || '0%',
      isEmergency:       i.alert === 'critical',
    },
    actions: {
      immediateActions:  i.recommendedActions?.slice(0, 2) || [],
      shortTermActions:  i.recommendedActions?.slice(2, 4) || [],
      preventiveActions: i.recommendedActions?.slice(4)    || [],
      productType:       'none',
      specificProduct:   null,
    },
    irrigation: {
      needed:     i.actions?.irrigation ?? true,
      excess:     false,
      soilStatus: 'normal',
      advice:     i.actions?.irrigation ? 'Irrigação recomendada' : 'Não irrigar agora',
    },
    environment: {
      temperatureStatus: 'optimal',
      humidityStatus:    'optimal',
      lightStatus:       'adequate',
      observation:       i.summary || '',
    },
    trend: {
      willWorsen:          i.riskLevel === 'high',
      willSelfRecover:     false,
      spreadRisk:          i.riskLevel || 'none',
      monitoringFrequency: 'Diário',
      forecast:            i.summary || 'Condição estável',
    },
    health: {
      alertType:    i.alert        || 'healthy',
      alertMessage: i.summary      || 'Planta saudável',
      healthScore:  a.confidence   ? Math.round(a.confidence * 100) : 90,
      healthStatus: i.riskLevel === 'high' ? 'critical' : i.riskLevel === 'medium' ? 'stressed' : 'healthy',
      confidence:   a.confidence   || 0.8,
    },
    smart: {
      bestTimeToApply:    'Manhã cedo (6-8h)',
      monitoringSchedule: 'Monitoramento diário recomendado',
      controlStrategy:    'MIP — Manejo Integrado de Pragas',
      additionalTips:     [],
    },
    oneLiner:  i.summary || `${a.plant || 'Planta'} — ${i.alert || 'healthy'}`,
    riskLevel: i.riskLevel || 'low',
  }
}
