'use client'

import { motion } from 'framer-motion'
import {
 Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
})

const faqs = [
  { q: 'O que é o Smart Greenhouse?',                          a: 'É um sistema de monitoramento inteligente para estufas que integra sensores IoT (ESP32), visão computacional com Gemini IA, gêmeo digital 3D e dashboard em tempo real.' },
  { q: 'Como funciona a análise de plantas com IA?',           a: 'O ESP32-CAM captura fotos das plantas e envia para o serviço Python com Gemini Vision. A IA analisa 15 dimensões: identificação da planta, pragas, doenças, severidade, impacto financeiro, plano de ação, tendências e score de saúde (0–100%).' },
  { q: 'Quais sensores são utilizados?',                       a: 'Sensor DHT22 para temperatura e umidade do ar, sensor capacitivo de umidade do solo, câmera OV2640 integrada ao ESP32-CAM e módulo relay para controle da bomba de irrigação.' },
  { q: 'A irrigação é totalmente automática?',                 a: 'Sim. Com base nos dados do sensor de solo e na análise da IA (que considera se há doenças fúngicas que seriam agravadas pela umidade), o sistema decide automaticamente quando irrigar.' },
  { q: 'Quais tecnologias compõem o projeto?',                 a: 'Frontend: Next.js 16, React 19, React Three Fiber. Backend: Node.js, TypeScript, Express, Socket.IO, MySQL, Prisma. IA: Python, FastAPI, Gemini Vision API. Hardware: ESP32-CAM, DHT22, sensor de solo.' },
  { q: 'Como o gêmeo digital 3D funciona?',                   a: 'É uma representação 3D interativa da estufa construída com React Three Fiber. Exibe plantas com animação de balanço, solo com cor dinâmica baseada na umidade, sistema de irrigação com partículas e sensores clicáveis com dados em tempo real.' },
  { q: 'O sistema funciona sem internet?',                    a: 'Para as análises de IA, é necessário acesso à API do Gemini. Os sensores e o Socket.IO funcionam em rede local (LAN). O banco de dados MySQL mantém histórico mesmo offline.' },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-28">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-[#58D68D] uppercase">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Perguntas Frequentes</h2>
          <p className="text-[#9CA3AF]">Tudo que você precisa saber sobre o projeto.</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <motion.div key={i} {...fadeUp(i * 0.05)}
              className={cn('rounded-2xl border transition-all duration-300',
                open === i ? 'border-[#58D68D]/25 bg-[#58D68D]/5' : 'border-white/6 bg-white/2')}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-white pr-4">{q}</span>
                <motion.div animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                  className="shrink-0 w-6 h-6 rounded-full border border-white/15 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-[#9CA3AF]" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-6 text-sm text-[#9CA3AF] leading-relaxed">{a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}