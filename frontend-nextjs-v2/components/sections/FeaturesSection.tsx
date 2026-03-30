"use client";

import { cn } from "@/lib/utils";
import { motion } from 'framer-motion'
import { TerminalDemo } from "./TerminalDevSection";
import { SocialOrbit } from "../social-orbit";
import { ArchitectureConnector } from "../architecture-connector";


const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
})

export function FeaturesSection() {
  const features = [
    {
      title: "Fluxo completo do sistema",
      description:
        "Da captura física até a decisão automatizada. Cada etapa é processada, enriquecida e distribuída em tempo real.",
      skeleton: <SkeletonPipeline />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Visão computacional em campo",
      description:
        "Imagens reais da estufa são analisadas continuamente. A IA detecta padrões invisíveis e antecipa problemas.",
      skeleton: <SkeletonTech />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Execução real do sistema",
      description:
        "Terminal com execução simultânea de serviços. Backend, IA e frontend operando como um pipeline contínuo.",
      skeleton: <SkeletonTerminal />,
      className:
        "col-span-1 lg:col-span-2 lg:border-r dark:border-neutral-800",
    },
    {
      title: "Infraestrutura e escala",
      description:
        "Arquitetura preparada para expansão. Comunicação distribuída e processamento desacoplado.",
      skeleton: <SkeletonTelemetry />,
      className: "col-span-1 lg:col-span-4 border-b lg:border-none",
    },
  ];

  return (
    <div className="relative z-20 mx-auto max-w-7xl py-20 lg:py-40">
      <div>
        <motion.span {...fadeUp(0)} className="inline-block text-xs font-semibold tracking-widest text-[#58D68D] uppercase mb-4">
          Projeto
        </motion.span>
        <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Detalhes{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#58D68D] to-[#1E8449]">
            sobre
          </span>
        </motion.h2>
        <motion.p {...fadeUp(0.2)} className="text-[#9CA3AF] text-lg leading-relaxed mb-8">
          O Smart Greenhouse integra sensores ESP32, visão computacional com Gemini IA
          e um gêmeo digital 3D para monitorar e otimizar cada aspecto do crescimento
          das plantas — temperatura, umidade, solo, pragas e doenças.
        </motion.p>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-6 border dark:border-neutral-800">
        {features.map((feature) => (
          <div key={feature.title} className={cn("p-6", feature.className)}>
            <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-neutral-500 mb-6">
              {feature.description}
            </p>
            {feature.skeleton}
          </div>
        ))}
      </div>
    </div >
  );
}


const SkeletonPipeline = () => {
  return (
    <div className="flex items-center justify-center">
    </div>
  );
};


const SkeletonTech = () => {
  return (
    <div className="flex gap-3">
      <SocialOrbit />
    </div>
  );
};


const SkeletonTerminal = () => {
  return (
    <div>
      <TerminalDemo />
      <div className="pointer-events-none absolute inset-x-0 bottom-40 z-40 h-48 w-2/6 bg-linear-to-t from-background via-background to-transparent dark:from-background dark:via-background" />
    </div>
  );
};


const SkeletonTelemetry = () => {
  return (
    <div>
      <ArchitectureConnector />
      <div className="pointer-events-none absolute right-0 bottom-40 z-40 h-48 w-6/6 bg-linear-to-t from-background via-background to-transparent dark:from-background dark:via-background" />
    </div>
  )
};