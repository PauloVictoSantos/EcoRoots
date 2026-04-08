'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Shield, Brain, ArrowRight, Cpu, Globe, 
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
})

export default function AboutSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section ref={ref} id="sobre" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_50%,#0B3D2E_0%,transparent_70%)] opacity-30" />
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.span {...fadeUp(0)} className="inline-block text-xs font-semibold tracking-widest text-[#58D68D] uppercase mb-4">
              Sobre o Projeto
            </motion.span>
            <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Tecnologia para{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#58D68D] to-[#1E8449]">
                Agricultura Inteligente
              </span>
            </motion.h2>
            <motion.p {...fadeUp(0.2)} className="text-[#9CA3AF] text-lg leading-relaxed mb-8">
              Inspirado na biodiversidade da Amazônia, o projeto nasceu da necessidade de tornar
              o cultivo mais preciso e sustentável. Com IoT, IA e um gêmeo digital 3D,
              entregamos visibilidade total sobre a saúde das plantas — em tempo real,
              de qualquer lugar.
            </motion.p>
            <motion.div {...fadeUp(0.3)} className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Cpu,    label: 'ESP32-CAM',     desc: 'Captura + sensores' },
                { icon: Brain,  label: 'Gemini Vision', desc: 'Análise IA em tempo real' },
                { icon: Globe,  label: 'Socket.IO',     desc: 'Dados ao vivo' },
                { icon: Shield, label: 'Alertas IA',    desc: '15 dimensões de análise' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/6 hover:border-[#58D68D]/20 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-[#58D68D]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#58D68D]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-[#6B7280]">{desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div {...fadeUp(0.4)}>
              <Link href="/documentacao"
                className="inline-flex items-center gap-2 text-[#58D68D] hover:text-white font-medium transition-colors">
                Ver documentação completa <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div style={{ y: imgY }} className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#58D68D]/15 bg-linear-to-br from-[#0B3D2E] to-[#0a0a0a]">
              <div className="p-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Saúde da Planta', value: '94%', color: '#58D68D' },
                  { label: 'Pragas Detectadas', value: '0', color: '#58D68D' },
                  { label: 'Umidade do Solo', value: '67%', color: '#4FC3F7' },
                  { label: 'Temperatura', value: '24°C', color: '#FF6B6B' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-5 rounded-xl bg-white/4 text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
                    <div className="text-xs text-[#6B7280]">{label}</div>
                  </div>
                ))}
                <div className="col-span-2 p-5 rounded-xl bg-[#58D68D]/8 border border-[#58D68D]/20 text-center">
                  <div className="text-sm font-medium text-[#58D68D]">✅ Tomateiro saudável — nenhuma ameaça detectada</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
