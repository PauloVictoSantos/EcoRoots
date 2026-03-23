'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRealtimeData } from '@/hooks/use-realtime-data'
import { UIOverlay } from '@/components/greenhouse/ui-overlay'

const Greenhouse3D = dynamic(
  () => import('@/components/greenhouse/greenhouse-3d').then((m) => m.Greenhouse3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#58D68D]/30 border-t-[#58D68D] rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando estufa 3D...</p>
        </div>
      </div>
    ),
  }
)

export default function GreenhousePage() {
  const {
    data, analysis, isConnected,
    toggleIrrigation,
    getTemperatureStatus, getHumidityStatus, getSoilMoistureStatus, getOverallStatus,
  } = useRealtimeData()

  const [selectedSensor, setSelectedSensor] = useState<string | null>(null)
  const [cameraKey, setCameraKey] = useState(0)

  const handleSensorClick  = useCallback((s: string) => setSelectedSensor(s), [])
  const handleResetCamera  = useCallback(() => setCameraKey(p => p + 1), [])

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#145A32_0%,_transparent_50%)] opacity-20" />

      <div key={cameraKey} className="absolute inset-0 z-10">
        <Greenhouse3D data={data} onSensorClick={handleSensorClick} getOverallStatus={getOverallStatus} />
      </div>

      <UIOverlay
        data={data}
        analysis={analysis}
        isConnected={isConnected}
        onToggleIrrigation={toggleIrrigation}
        onResetCamera={handleResetCamera}
        getTemperatureStatus={getTemperatureStatus}
        getHumidityStatus={getHumidityStatus}
        getSoilMoistureStatus={getSoilMoistureStatus}
        getOverallStatus={getOverallStatus}
        selectedSensor={selectedSensor}
        onCloseSensor={() => setSelectedSensor(null)}
      />

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
        <p className="text-xs text-muted-foreground/60 text-center">
          Arraste para rotacionar • Scroll para zoom • Clique nos sensores para detalhes
        </p>
      </div>
    </div>
  )
}
