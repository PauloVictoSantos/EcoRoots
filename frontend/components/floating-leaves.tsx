'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Leaf {
  id: number
  x: number
  size: number
  delay: number
  duration: number
  rotation: number
  opacity: number
  variant: number
}

// Realistic tropical leaf SVGs — 4 variants
function LeafShape({ variant, size }: { variant: number; size: number }) {
  const s = size
  if (variant === 0) return (
    // Monstera-style split leaf
    <svg width={s} height={s * 1.2} viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 5C30 5 8 15 8 38C8 52 17 62 30 65C43 62 52 52 52 38C52 15 30 5 30 5Z" fill="#1a6b3a" opacity="0.75"/>
      <path d="M30 5C30 5 20 20 22 42C23 52 27 60 30 65" stroke="#58D68D" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8"/>
      <path d="M30 28C30 28 18 24 14 18" stroke="#58D68D" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
      <path d="M30 36C30 36 20 34 16 30" stroke="#58D68D" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
      <path d="M30 44C30 44 40 42 45 36" stroke="#58D68D" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
      <path d="M30 28C30 28 42 24 46 18" stroke="#58D68D" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
      {/* Cuts */}
      <path d="M18 32C18 32 22 36 22 40" stroke="#0a2010" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
      <path d="M42 32C42 32 38 36 38 40" stroke="#0a2010" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
    </svg>
  )
  if (variant === 1) return (
    // Long tropical leaf
    <svg width={s * 0.55} height={s * 1.4} viewBox="0 0 33 84" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3C16 3 4 20 4 42C4 60 10 76 16 82C22 76 28 60 28 42C28 20 16 3 16 3Z" fill="#145A32" opacity="0.8"/>
      <path d="M16 82V8" stroke="#58D68D" strokeWidth="1" strokeLinecap="round" opacity="0.9"/>
      <path d="M16 20C16 20 8 18 5 14" stroke="#58D68D" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
      <path d="M16 30C16 30 8 28 6 22" stroke="#58D68D" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
      <path d="M16 40C16 40 9 38 7 33" stroke="#58D68D" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
      <path d="M16 20C16 20 24 18 27 14" stroke="#58D68D" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
      <path d="M16 30C16 30 24 28 26 22" stroke="#58D68D" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
      <path d="M16 40C16 40 23 38 25 33" stroke="#58D68D" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
  if (variant === 2) return (
    // Broad heart-shaped leaf
    <svg width={s} height={s * 0.95} viewBox="0 0 60 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 52C30 52 6 38 6 22C6 12 14 6 22 8C26 9 29 12 30 14C31 12 34 9 38 8C46 6 54 12 54 22C54 38 30 52 30 52Z" fill="#1a6b3a" opacity="0.7"/>
      <path d="M30 14V52" stroke="#58D68D" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
      <path d="M30 24C30 24 18 22 12 18" stroke="#58D68D" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
      <path d="M30 34C30 34 20 32 14 28" stroke="#58D68D" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
      <path d="M30 24C30 24 42 22 48 18" stroke="#58D68D" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
      <path d="M30 34C30 34 40 32 46 28" stroke="#58D68D" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
  // variant 3 — pointed palm-like
  return (
    <svg width={s * 0.6} height={s * 1.3} viewBox="0 0 36 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2C18 2 3 18 3 40C3 58 9 70 18 75C27 70 33 58 33 40C33 18 18 2 18 2Z" fill="#0e4d28" opacity="0.85"/>
      <path d="M18 75V6" stroke="#4ade80" strokeWidth="1.1" strokeLinecap="round" opacity="0.9"/>
      <path d="M18 22L8 16" stroke="#4ade80" strokeWidth="0.8" strokeLinecap="round" opacity="0.55"/>
      <path d="M18 32L7 28" stroke="#4ade80" strokeWidth="0.8" strokeLinecap="round" opacity="0.55"/>
      <path d="M18 42L8 40" stroke="#4ade80" strokeWidth="0.8" strokeLinecap="round" opacity="0.55"/>
      <path d="M18 22L28 16" stroke="#4ade80" strokeWidth="0.8" strokeLinecap="round" opacity="0.55"/>
      <path d="M18 32L29 28" stroke="#4ade80" strokeWidth="0.8" strokeLinecap="round" opacity="0.55"/>
      <path d="M18 42L28 40" stroke="#4ade80" strokeWidth="0.8" strokeLinecap="round" opacity="0.55"/>
    </svg>
  )
}

function generateLeaves(count: number): Leaf[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 5 + (i * (90 / count)) + (Math.random() * 8 - 4),
    size: 28 + Math.random() * 32,
    delay: Math.random() * 12,
    duration: 18 + Math.random() * 16,
    rotation: Math.random() * 360,
    opacity: 0.25 + Math.random() * 0.45,
    variant: i % 4,
  }))
}

export function FloatingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    setLeaves(generateLeaves(14))
  }, [])

  if (reduced || leaves.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-1">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute will-change-transform"
          style={{ left: `${leaf.x}%`, top: -120 }}
          initial={{ y: -120, rotate: leaf.rotation, opacity: 0 }}
          animate={{
            y: ['0vh', '108vh'],
            rotate: [leaf.rotation, leaf.rotation + (leaf.id % 2 === 0 ? 180 : -180)],
            x: [
              0,
              Math.sin(leaf.id * 1.5) * 60,
              Math.sin(leaf.id * 1.5 + 1) * 30,
              0,
            ],
            opacity: [0, leaf.opacity, leaf.opacity, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
            opacity: { duration: leaf.duration, times: [0, 0.08, 0.88, 1] },
          }}
        >
          <motion.div
            animate={{ rotateY: [0, 25, -25, 0], rotateX: [0, 10, -10, 0] }}
            transition={{ duration: 3 + leaf.id * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LeafShape variant={leaf.variant} size={leaf.size} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
