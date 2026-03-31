'use client'

import Greenhouse3D from '@/components/greenhouse/greenhouse-3d'


export default function GreenhousePage() {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#145A32_0%,transparent_50%)] opacity-20" />
      <div className="absolute inset-0 z-10">
        <Greenhouse3D  />
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
        <p className="text-xs text-muted-foreground/60 text-center">
          Arraste para rotacionar • Scroll para zoom • Clique nos sensores para detalhes
        </p>
      </div>
    </div>
  )
}
