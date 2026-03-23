'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Brain, Cpu,Server, Monitor } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
})

const techStack = [
  { cat: 'Frontend', color: '#4FC3F7', icon: Monitor, items: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Three Fiber'] },
  { cat: 'Backend',  color: '#58D68D', icon: Server,  items: ['Node.js', 'Express.js', 'Socket.IO', 'Prisma ORM', 'MySQL', 'TypeScript'] },
  { cat: 'IA',       color: '#a78bfa', icon: Brain,   items: ['Gemini 2.5 Flash', 'Gemini Vision', 'FastAPI', 'Python', 'Pydantic', '15 dimensões'] },
  { cat: 'Hardware', color: '#FFB74D', icon: Cpu,     items: ['ESP32-CAM', 'DHT22', 'Sensor Solo', 'OV2640', 'Relay 5V', 'Bomba Água'] },
]

export default function TechSection() {
  return (
    <section id="tecnologias" className="py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-[#58D68D] uppercase">Stack</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">Tecnologias Utilizadas</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {techStack.map(({ cat, color, icon: Icon, items }, i) => (
            <motion.div key={cat} {...fadeUp(i * 0.1)}
              className="group relative p-6 rounded-2xl border border-white/6 bg-white/2 hover:bg-white/4 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: color }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}18` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="font-bold text-white mb-3">{cat}</h3>
              <ul className="space-y-1.5">
                {items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}