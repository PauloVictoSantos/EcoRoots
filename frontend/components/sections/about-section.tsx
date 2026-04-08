'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { LuArrowRight, LuLeaf, LuZap, LuBrain } from 'react-icons/lu'
import { SectionWrapper } from '@/components/section-wrapper'
import { Button } from '@/components/ui/button'
import { Card } from '../ui/card'

const highlights = [
  {
    icon: LuLeaf,
    title: 'Sustentável',
    description: 'Eficiência com menor impacto ambiental',
  },
  {
    icon: LuLeaf,
    title: 'Sustentável',
    description: 'Eficiência com menor impacto ambiental',
  },
  {
    icon: LuBrain,
    title: 'Inteligência Artificial',
    description: 'Detecção de pragas e análise da planta',
  },
  {
    icon: LuZap,
    title: 'Automação',
    description: 'Controle inteligente em tempo real',
  },
]

export function AboutSection() {
  return (
    <SectionWrapper className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
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
            className="mb-4 bg-linear-to-r from-foreground via-amazon-highlight to-amazon-dark bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-6xl"
          >
            Tecnologia Inspirada na{' '}
            Floresta Amazônica
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base md:leading-loose mb-10"
          >
            O Smart Greenhouse une a precisão da tecnologia IoT com Inteligência Artificial
            para revolucionar o cultivo inteligente. Nosso sistema monitora e controla
            automaticamente os parâmetros ambientais, economizando água e energia,
            enquanto a IA analisa a saúde das plantas e detecta pragas em tempo real.
          </motion.p>

          {/* HIGHLIGHTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl 
                bg-background/60 backdrop-blur-md border border-border/50 
                hover:bg-accent/10 transition-all"
              >
                <item.icon className="w-5 h-5 text-accent" style={{ display: 'inline' }} />
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-52">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button
              asChild
              className="rounded-xl px-6 py-3 text-sm font-medium"
            >
              <Link href="/dashboard/estufa">
                Veja a Estufa
                <LuArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Card className="p-8 relative overflow-hidden rounded-2xl">

            {/* BG Effects */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />

            <div className="relative grid grid-cols-2 gap-4">

              {/* MAIN CARD */}
              <Card className="col-span-2 bg-linear-to-br from-primary/90 to-secondary/80 text-center p-6 rounded-2xl">
                <span className="text-4xl font-bold text-accent-foreground">
                  98%
                </span>
                <p className="text-sm text-foreground/80 mt-2">
                  Precisão dos Sensores
                </p>
              </Card>

              {/* SMALL CARDS */}
              <Card className="text-center p-4 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-md">
                <span className="text-2xl font-semibold text-foreground">
                  40%
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Economia de Água
                </p>
              </Card>

              <Card className="text-center p-4 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-md">
                <span className="text-2xl font-semibold text-foreground">
                  24/7
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitoramento
                </p>
              </Card>

              <Card className="col-span-2 text-center p-4 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-md">
                <span className="text-2xl font-semibold text-accent">
                  5+
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  Sensores Integrados
                </p>
              </Card>
            </div>
          </Card>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}