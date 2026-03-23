'use client'

import { motion } from 'framer-motion'
import { Thermometer, Droplets, Sprout, Gauge, Wifi, Shield } from 'lucide-react'
import { SectionWrapper, SectionHeader } from '@/components/section-wrapper'
import { GlassCard } from '@/components/glass-card'

const features = [
  {
    icon: Thermometer,
    title: 'Monitoramento de Temperatura',
    description: 'Acompanhe a temperatura em tempo real com sensores de alta precisão.',
    color: '#FF6B6B',
  },
  {
    icon: Droplets,
    title: 'Controle de Umidade',
    description: 'Monitore e ajuste os níveis de umidade para o crescimento ideal das plantas.',
    color: '#4FC3F7',
  },
  {
    icon: Sprout,
    title: 'Umidade do Solo',
    description: 'Sensores inteligentes que detectam quando suas plantas precisam de água.',
    color: '#58D68D',
  },
  {
    icon: Gauge,
    title: 'Irrigação Automática',
    description: 'Sistema de irrigação automatizado baseado em dados em tempo real.',
    color: '#FFB74D',
  },
  {
    icon: Wifi,
    title: 'Conectividade IoT',
    description: 'Conexão contínua com dispositivos e sensores da estufa.',
    color: '#7C4DFF',
  },
  {
    icon: Shield,
    title: 'Alertas Inteligentes',
    description: 'Notificações instantâneas quando os parâmetros saem do ideal.',
    color: '#F06292',
  },
]

export function FeaturesSection() {
  return (
    <SectionWrapper className="container mx-auto px-4">
      <SectionHeader
        badge="Recursos"
        title="Monitoramento Completo"
        description="Tecnologia de ponta para garantir o ambiente perfeito para suas plantas"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <GlassCard key={feature.title} delay={index * 0.1}>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${feature.color}20` }}
            >
              <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  )
}
