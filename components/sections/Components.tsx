'use client'

import { motion } from 'framer-motion'
import {
  Thermometer, Droplets, Gauge, Brain, ArrowRight, Cpu, Monitor,
} from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
})

const componentsItems = [
  {
    title: 'Circuito Câmera Arduino/ESP32',
    desc: 'Captura inteligente de imagens para visão computacional',
    icon: Cpu,
    color: '#FFB74D',
    details: `
Este módulo utiliza um microcontrolador ESP32-CAM com sensor OV2640, capaz de capturar imagens em tempo real diretamente da estufa.

As imagens são processadas localmente ou enviadas via Wi-Fi para um servidor ou API de IA, permitindo análise contínua das plantas.

A arquitetura foi projetada para operar com baixo consumo energético e alta eficiência, garantindo funcionamento contínuo mesmo em ambientes agrícolas remotos.

Integra-se com o sistema de análise de IA para identificação de pragas, doenças foliares e padrões de crescimento.
    `
  },

  {
    title: 'Sensores Ambientais (pH, Temp, Umidade)',
    desc: 'Monitoramento preciso das condições da estufa',
    icon: Thermometer,
    color: '#FF6B6B',
    details: `
Conjunto de sensores responsáveis pela coleta de dados críticos como pH da solução nutritiva, temperatura ambiente e umidade relativa do ar.

Esses dados são capturados em tempo real e enviados ao sistema central via ESP32, permitindo ajustes automáticos nas condições da estufa.

A calibração periódica garante precisão nas medições, essencial para culturas sensíveis.

Essas variáveis são fundamentais para alimentar modelos preditivos e evitar estresse nas plantas.
    `
  },

  {
    title: 'Interface 3D (Gêmeo Digital)',
    desc: 'Simulação virtual da estufa com dados reais',
    icon: Monitor,
    color: '#4FC3F7',
    details: `
A interface 3D foi desenvolvida com Three.js e representa um gêmeo digital da estufa física.

Cada elemento visual (plantas, sensores, iluminação) é atualizado em tempo real com base nos dados coletados.

Isso permite ao usuário visualizar o estado da plantação de forma intuitiva, identificar problemas rapidamente e simular cenários futuros.

O gêmeo digital também serve como base para integração com IA e automação avançada.
    `
  },

  {
    title: 'Análise com Inteligência Artificial',
    desc: 'Detecção automática de pragas e doenças',
    icon: Brain,
    color: '#a78bfa',
    details: `
Este módulo utiliza modelos de visão computacional e aprendizado de máquina para analisar imagens capturadas pela câmera.

A IA é capaz de identificar padrões visuais associados a pragas, fungos, deficiência nutricional e anomalias no crescimento.

Pode ser integrada com APIs como Gemini, OpenAI ou modelos customizados treinados com datasets agrícolas.

O sistema aprende continuamente, melhorando sua precisão ao longo do tempo e permitindo decisões automatizadas.
    `
  },

  {
    title: 'Dashboard em Tempo Real',
    desc: 'Visualização e controle dos dados da estufa',
    icon: Gauge,
    color: '#58D68D',
    details: `
Interface web que centraliza todos os dados do sistema, atualizados em tempo real via WebSockets (Socket.IO).

Exibe métricas como temperatura, umidade, pH, status da bomba, alertas e previsões da IA.

Permite controle manual e automático dos atuadores, além de fornecer insights baseados em dados históricos.

Projetado com foco em UX minimalista e alta legibilidade para uso contínuo.
    `
  },

  {
    title: 'Sistema de Hidroponia Automatizado',
    desc: 'Irrigação e nutrição inteligente das plantas',
    icon: Droplets,
    color: '#60A5FA',
    details: `
Sistema responsável pela circulação da solução nutritiva utilizando bombas submersas controladas eletronicamente.

Baseado nos dados dos sensores, o sistema ajusta automaticamente o fluxo de água e nutrientes.

Pode operar em ciclos programados ou de forma adaptativa com base em IA.

Garante economia de recursos, crescimento otimizado e redução de intervenção humana.
    `
  },
]

export default function ComponentsSection() {
  return (
    <section id="materias" className="py-28">
      <div className="container mx-auto px-4">
        <div>
          <motion.span {...fadeUp(0)} className="inline-block text-xs font-semibold tracking-widest text-accent uppercase mb-4">
            Equipe
          </motion.span>

          <motion.h2 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Matr{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-amazon-dark">
              utilizado
            </span>
          </motion.h2>

          <motion.p {...fadeUp(0.2)} className="text-accent-foreground text-lg leading-relaxed mb-8">
            O Smart Greenhouse integra sensores ESP32, visão computacional com IA
            e um gêmeo digital 3D para monitorar e otimizar cada aspecto do crescimento.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {componentsItems.map(({ title, desc, icon: Icon, color, details }, i) => (
            <Dialog key={title}>
              <DialogTrigger asChild>
                <motion.div {...fadeUp(i * 0.08)}>
                  <Card className="group relative p-8 rounded-2xl border border-card/6 bg-card/2 overflow-hidden cursor-pointer hover:scale-[1.02] transition-all">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at 50% 50%, ${color}10 0%, transparent 70%)`
                      }}
                    />

                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon className="w-7 h-7" style={{ color }} />
                    </div>

                    <CardTitle className="font-bold text-foreground">{title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed">{desc}</CardDescription>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4" style={{ color }} />
                    </div>

                  </Card>
                </motion.div>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center text-2xl gap-2">
                    <Icon style={{ color }} className="w-24 h-24" />
                    {title}
                  </DialogTitle>

                  <DialogDescription className="pt-2 text-sm tracking-wide leading-relaxed">
                    {details}
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4">
                  <Button className="w-full cursor-pointer">
                    Ver mais detalhes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  )
}