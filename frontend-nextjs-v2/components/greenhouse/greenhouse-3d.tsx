'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Html, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { GreenhouseData, HealthStatus } from '@/hooks/use-realtime-data'

interface Greenhouse3DProps {
  data: GreenhouseData
  onSensorClick?: (sensor: string) => void
  getOverallStatus: () => HealthStatus
}

function WoodenBase() {
  return (
    <mesh position={[0, -0.5, 0]}>
      <boxGeometry args={[3, 0.2, 2]} />
      <meshStandardMaterial color="#5D4037" roughness={0.8} />
    </mesh>
  )
}

function GlassTop() {
  return (
    <group position={[0, 0.6, 0]}>
      {/* Front */}
      <mesh position={[0, 0, 1]}>
        <boxGeometry args={[3, 1, 0.02]} />
        <meshPhysicalMaterial
          color="#58D68D"
          transparent
          opacity={0.15}
          roughness={0}
          metalness={0.1}
          transmission={0.9}
        />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0, -1]}>
        <boxGeometry args={[3, 1, 0.02]} />
        <meshPhysicalMaterial
          color="#58D68D"
          transparent
          opacity={0.15}
          roughness={0}
          metalness={0.1}
          transmission={0.9}
        />
      </mesh>
      {/* Left */}
      <mesh position={[-1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2, 1, 0.02]} />
        <meshPhysicalMaterial
          color="#58D68D"
          transparent
          opacity={0.15}
          roughness={0}
          metalness={0.1}
          transmission={0.9}
        />
      </mesh>
      {/* Right */}
      <mesh position={[1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2, 1, 0.02]} />
        <meshPhysicalMaterial
          color="#58D68D"
          transparent
          opacity={0.15}
          roughness={0}
          metalness={0.1}
          transmission={0.9}
        />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[3, 2, 0.02]} />
        <meshPhysicalMaterial
          color="#58D68D"
          transparent
          opacity={0.2}
          roughness={0}
          metalness={0.1}
          transmission={0.9}
        />
      </mesh>
    </group>
  )
}

function Soil({ moisture }: { moisture: number }) {
  const soilColor = new THREE.Color().lerpColors(
    new THREE.Color('#8B4513'),
    new THREE.Color('#3E2723'),
    moisture / 100
  )

  return (
    <mesh position={[0, -0.3, 0]}>
      <boxGeometry args={[2.8, 0.2, 1.8]} />
      <meshStandardMaterial color={soilColor} roughness={1} />
    </mesh>
  )
}

function Plant({ position, scale = 1, swayOffset = 0 }: { position: [number, number, number]; scale?: number; swayOffset?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime + swayOffset) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.3, 8]} />
        <meshStandardMaterial color="#2E7D32" />
      </mesh>
      {/* Leaves */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 2) * 0.1,
            0.25 + i * 0.05,
            Math.sin((i * Math.PI) / 2) * 0.1,
          ]}
          rotation={[Math.random() * 0.5, (i * Math.PI) / 2, Math.random() * 0.3]}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#43A047" />
        </mesh>
      ))}
    </group>
  )
}

function WaterTank({ waterLevel, irrigation }: { waterLevel: number; irrigation: boolean }) {
  const waterRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (waterRef.current && irrigation) {
      waterRef.current.position.y = -0.15 + Math.sin(state.clock.elapsedTime * 3) * 0.01
    }
  })

  return (
    <group position={[-1.8, 0, 0]}>
      {/* Tank */}
      <mesh>
        <boxGeometry args={[0.4, 0.8, 0.4]} />
        <meshPhysicalMaterial
          color="#4FC3F7"
          transparent
          opacity={0.3}
          roughness={0}
          transmission={0.8}
        />
      </mesh>
      {/* Water */}
      <mesh ref={waterRef} position={[0, -0.15 + (waterLevel / 100) * 0.3, 0]}>
        <boxGeometry args={[0.35, (waterLevel / 100) * 0.6, 0.35]} />
        <meshStandardMaterial color="#0288D1" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function IrrigationPipes({ irrigation }: { irrigation: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (particlesRef.current && irrigation) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.02
        if (positions[i + 1] < -0.2) {
          positions[i + 1] = 0.3
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const particleCount = 20
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2
    positions[i * 3 + 1] = Math.random() * 0.5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5
  }

  return (
    <group>
      {/* Main pipe */}
      <mesh position={[-1.4, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#78909C" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Secondary pipes */}
      {[-0.5, 0, 0.5].map((z, i) => (
        <mesh key={i} position={[-1, 0.3, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#90A4AE" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      {/* Water particles */}
      {irrigation && (
        <points ref={particlesRef} position={[0, 0.1, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color="#4FC3F7" size={0.03} transparent opacity={0.8} />
        </points>
      )}
    </group>
  )
}

function Sensor({
  position,
  type,
  onClick,
  isHovered,
  onHover,
}: {
  position: [number, number, number]
  type: string
  onClick: () => void
  isHovered: boolean
  onHover: (hovered: boolean) => void
}) {
  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial
        color={isHovered ? '#58D68D' : '#FFB74D'}
        emissive={isHovered ? '#58D68D' : '#000000'}
        emissiveIntensity={isHovered ? 0.5 : 0}
      />
      {isHovered && (
        <Html center position={[0, 0.2, 0]}>
          <div className="px-2 py-1 rounded bg-card text-xs text-foreground whitespace-nowrap border border-border">
            {type}
          </div>
        </Html>
      )}
    </mesh>
  )
}

function GreenhouseScene({ data, onSensorClick, getOverallStatus }: Greenhouse3DProps) {
  const [hoveredSensor, setHoveredSensor] = useState<string | null>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)

  const status = getOverallStatus()
  const lightColor = status === 'critical' ? '#FF6B6B' : status === 'warning' ? '#FFB74D' : '#FFF9C4'

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.color.lerp(new THREE.Color(lightColor), 0.05)
    }
  })

  const plantScale = data.soilMoisture > 40 ? 1 : 0.8

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={1}
        castShadow
      />

      <WoodenBase />
      <GlassTop />
      <Soil moisture={data.soilMoisture} />

      {/* Plants */}
      <Plant position={[-0.8, -0.2, 0.3]} scale={plantScale} swayOffset={0} />
      <Plant position={[-0.3, -0.2, -0.4]} scale={plantScale * 0.9} swayOffset={1} />
      <Plant position={[0.4, -0.2, 0.5]} scale={plantScale * 1.1} swayOffset={2} />
      <Plant position={[0.9, -0.2, -0.2]} scale={plantScale * 0.95} swayOffset={3} />
      <Plant position={[0, -0.2, 0]} scale={plantScale * 1.05} swayOffset={4} />

      <WaterTank waterLevel={data.waterLevel} irrigation={data.irrigation} />
      <IrrigationPipes irrigation={data.irrigation} />

      {/* Sensors */}
      <Sensor
        position={[-0.5, 0.2, 0.8]}
        type="Temperatura"
        onClick={() => onSensorClick?.('temperature')}
        isHovered={hoveredSensor === 'temperature'}
        onHover={(h) => setHoveredSensor(h ? 'temperature' : null)}
      />
      <Sensor
        position={[0.5, 0.2, 0.8]}
        type="Umidade"
        onClick={() => onSensorClick?.('humidity')}
        isHovered={hoveredSensor === 'humidity'}
        onHover={(h) => setHoveredSensor(h ? 'humidity' : null)}
      />
      <Sensor
        position={[0, -0.15, 0.8]}
        type="Solo"
        onClick={() => onSensorClick?.('soil')}
        isHovered={hoveredSensor === 'soil'}
        onHover={(h) => setHoveredSensor(h ? 'soil' : null)}
      />

      <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={6} blur={2} />
    </>
  )
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#58D68D]/30 border-t-[#58D68D] rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Carregando estufa 3D...</p>
      </div>
    </Html>
  )
}

export function Greenhouse3D({ data, onSensorClick, getOverallStatus }: Greenhouse3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [4, 3, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <GreenhouseScene
            data={data}
            onSensorClick={onSensorClick}
            getOverallStatus={getOverallStatus}
          />
          <Environment preset="forest" />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
