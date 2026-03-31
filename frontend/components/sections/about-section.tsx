'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Leaf, Zap, Globe } from 'lucide-react'
import { SectionWrapper } from '@/components/section-wrapper'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'

const highlights = [
  {
    icon: Leaf,
    title: 'Sustentável',
    description: 'Inspirado na natureza amazônica',
  },
  {
    icon: Zap,
    title: 'Eficiente',
    description: 'Monitoramento em tempo real',
  },
  {
    icon: Globe,
    title: 'Conectado',
    description: 'IoT e automação inteligente',
  },
]

export function AboutSection() {
  return (
    <SectionWrapper className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-semibold tracking-widest text-accent uppercase mb-4"
          >
            Sobre o Projeto
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance"
          >
            Tecnologia Inspirada na{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              Floresta Amazônica
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg leading-relaxed mb-8"
          >
            O Smart Greenhouse combina o melhor da tecnologia IoT com princípios 
            de sustentabilidade. Nosso sistema monitora e controla automaticamente 
            todos os parâmetros ambientais para garantir o crescimento saudável 
            das plantas, economizando água e energia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className="flex items-center gap-3 px-4 py-2 rounded-xl glass"
              >
                <item.icon className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button
              asChild
              variant="default"
              className="border-border hover:text-foreground text-foreground rounded-xl"
            >
              <Link href="/estufa">
                Veja a Estufa
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <GlassCard className="p-8 relative overflow-hidden" hover={true}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />

            <div className="relative grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="col-span-2 p-6 rounded-2xl bg-linear-to-br from-primary to-secondary text-center"
              >
                <span className="text-5xl font-bold text-accent-foreground">98%</span>
                <p className="text-sm text-foreground/80 mt-2">Precisão dos Sensores</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-2xl glass text-center"
              >
                <span className="text-3xl font-bold text-foreground">40%</span>
                <p className="text-xs text-muted-foreground mt-1">Economia de Água</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="p-5 rounded-2xl glass text-center"
              >
                <span className="text-3xl font-bold text-foreground">24/7</span>
                <p className="text-xs text-muted-foreground mt-1">Monitoramento</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="col-span-2 p-5 rounded-2xl glass text-center"
              >
                <span className="text-3xl font-bold text-accent">5+</span>
                <p className="text-sm text-muted-foreground mt-1">Sensores Integrados</p>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
