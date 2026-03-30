'use client'

import { motion } from 'framer-motion'
import {
  Thermometer, Droplets, Gauge, Brain, ArrowRight, Cpu, Monitor,
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
})

const componentsItems = [
  { title: 'Circuito ESP32-CAM', desc: 'Módulo principal com câmera integrada', icon: Cpu, color: '#FFB74D' },
  { title: 'Sensores DHT22', desc: 'Medição de temperatura e umidade', icon: Thermometer, color: '#FF6B6B' },
  { title: 'Interface 3D', desc: 'Gêmeo digital da estufa em Three.js', icon: Monitor, color: '#4FC3F7' },
  { title: 'Análise Gemini Vision', desc: 'Detecção de pragas e doenças por IA', icon: Brain, color: '#a78bfa' },
  { title: 'Dashboard Real-Time', desc: 'Métricas ao vivo via Socket.IO', icon: Gauge, color: '#58D68D' },
  { title: 'Sistema de Irrigação', desc: 'Controle automático por bomba de aquário', icon: Droplets, color: '#60A5FA' },
]

export default function ComponentsSection() {
  return (
    <section id="galeria" className="py-28">
      <div className="container mx-auto px-4">
        <div>
          <motion.span {...fadeUp(0)} className="inline-block text-xs font-semibold tracking-widest text-accent uppercase mb-4">
            Equipe
          </motion.span>
          <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Quem{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              Contruiu
            </span>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-accent-foreground text-lg leading-relaxed mb-8">
            O Smart Greenhouse integra sensores ESP32, visão computacional com Gemini IA
            e um gêmeo digital 3D para monitorar e otimizar cada aspecto do crescimento
            das plantas — temperatura, umidade, solo, pragas e doenças.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {componentsItems.map(({ title, desc, icon: Icon, color }, i) => (
            <motion.div key={title} {...fadeUp(i * 0.08)}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative p-8 rounded-2xl border border-white/6 bg-white/2 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 50% 50%, ${color}10 0%, transparent 70%)` }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-7 h-7" style={{ color }} />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4" style={{ color }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}