"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Thermometer, Droplets, Brain, Wifi, Shield, Camera, Sprout, Gauge, Cpu, Zap } from "lucide-react";

const features = [
  {
    title: "Análise IA com Gemini Vision",
    description: "15 dimensões de diagnóstico: pragas, doenças, severidade, impacto financeiro e score de saúde 0–100%.",
    skeleton: <SkeletonAI />,
    className: "col-span-1 lg:col-span-4 border-b lg:border-r border-[#58D68D]/8",
  },
  {
    title: "Visão Computacional em Tempo Real",
    description: "OV2640 integrada ao ESP32-CAM captura e envia imagens automaticamente para análise.",
    skeleton: <SkeletonCamera />,
    className: "border-b col-span-1 lg:col-span-2 border-[#58D68D]/8",
  },
  {
    title: "Socket.IO — Dados ao Vivo",
    description: "Latência inferior a 100ms. Dashboard sincronizado instantaneamente com os sensores da estufa.",
    skeleton: <SkeletonSocket />,
    className: "col-span-1 lg:col-span-3 lg:border-r border-[#58D68D]/8",
  },
  {
    title: "Irrigação Inteligente Automatizada",
    description: "A IA cruza dados de solo com diagnóstico de doenças antes de decidir irrigar — evitando propagar fungos.",
    skeleton: <SkeletonIrrigation />,
    className: "col-span-1 lg:col-span-3",
  },
];

function SkeletonAI() {
  const metrics = [
    { label: "Saúde", value: 94, color: "#58D68D" },
    { label: "Severidade", value: 12, color: "#4FC3F7" },
    { label: "Confiança", value: 96, color: "#a78bfa" },
  ];
  return (
    <div className="relative flex flex-col gap-4 p-4 pt-8">
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#58D68D]/5 border border-[#58D68D]/15">
        <Brain className="w-5 h-5 text-[#58D68D] shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">Tomateiro saudável detectado</p>
          <p className="text-xs text-[#9CA3AF]">Gemini 2.5 Flash · 96% confiança · 0 ameaças</p>
        </div>
        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-[#58D68D]/15 text-[#58D68D]">✅ Saudável</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {metrics.map(({ label, value, color }) => (
          <div key={label} className="p-3 rounded-xl bg-white/3 border border-white/6 text-center">
            <div className="text-2xl font-bold mb-1" style={{ color }}>{value}%</div>
            <div className="text-xs text-[#6B7280]">{label}</div>
            <div className="mt-2 h-1.5 rounded-full bg-white/8 overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${value}%` }}
                transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full"
                style={{ backgroundColor: color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}

function SkeletonCamera() {
  return (
    <div className="relative flex flex-col items-center justify-center p-6 pt-8 gap-4">
      <motion.div animate={{ scale: [1, 1.04, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.5, repeat: Infinity }}
        className="w-20 h-20 rounded-full bg-[#58D68D]/10 border-2 border-[#58D68D]/30 flex items-center justify-center">
        <Camera className="w-9 h-9 text-[#58D68D]" />
      </motion.div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white">OV2640 · ESP32-CAM</p>
        <p className="text-xs text-[#9CA3AF] mt-1">Captura · Análise · Resposta</p>
      </div>
      {[0,1,2].map(i => (
        <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity }}
          className="w-full h-px bg-gradient-to-r from-transparent via-[#58D68D]/40 to-transparent" />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}

function SkeletonSocket() {
  const events = [
    { t: "18:32:01", msg: "greenhouse:update — temp=27.3°C", c: "#58D68D" },
    { t: "18:32:03", msg: "greenhouse:update — soil=62%",    c: "#4FC3F7" },
    { t: "18:32:05", msg: "greenhouse:update — alert=healthy", c: "#a78bfa" },
    { t: "18:32:07", msg: "AI analysis complete — score 94/100", c: "#58D68D" },
  ];
  return (
    <div className="relative p-4 pt-8 space-y-2">
      {events.map((e, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/2 border border-white/5">
          <span className="text-xs text-[#4B5563] font-mono w-16 shrink-0">{e.t}</span>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: e.c }} />
          <span className="text-xs text-[#9CA3AF] font-mono truncate">{e.msg}</span>
        </motion.div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}

function SkeletonIrrigation() {
  return (
    <div className="relative p-4 pt-8 flex items-center justify-center gap-8">
      <div className="text-center">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-14 h-14 rounded-full bg-[#4FC3F7]/10 border-2 border-[#4FC3F7]/30 flex items-center justify-center mx-auto mb-2">
          <Droplets className="w-7 h-7 text-[#4FC3F7]" />
        </motion.div>
        <p className="text-xs text-[#9CA3AF]">Bomba <span className="text-[#58D68D]">ATIVA</span></p>
      </div>
      <div className="flex flex-col gap-1">
        {[80, 60, 40].map((w, i) => (
          <motion.div key={i} animate={{ x: [0, 12, 0] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
            className="h-1 rounded-full bg-[#4FC3F7]/50" style={{ width: w }} />
        ))}
      </div>
      <div className="text-center">
        <Sprout className="w-7 h-7 text-[#58D68D] mx-auto mb-2" />
        <p className="text-xs text-[#9CA3AF]">Solo <span className="text-[#58D68D]">62%</span></p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}

const FeatureCard = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn("relative overflow-hidden p-6 sm:p-8 bg-[#0a0a0a]", className)}>{children}</div>
);

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => (
  <p className="text-left text-lg font-semibold tracking-tight text-white md:text-xl">{children}</p>
);

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => (
  <p className="text-left text-sm text-[#9CA3AF] mt-2 max-w-sm leading-relaxed">{children}</p>
);

export function FeaturesSection() {
  return (
    <div className="relative z-20 mx-auto max-w-7xl py-20 lg:py-32 px-4">
      <div className="text-center mb-16">
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[#58D68D] uppercase">Recursos</motion.span>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold mt-3 mb-4">
          Monitoramento Completo
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }} className="text-[#9CA3AF] max-w-xl mx-auto">
          Tecnologia de ponta para garantir o ambiente perfeito — do sensor à IA em milissegundos.
        </motion.p>
      </div>
      <div className="relative">
        <div className="grid grid-cols-1 rounded-2xl lg:grid-cols-6 border border-[#58D68D]/8 overflow-hidden">
          {features.map((f) => (
            <FeatureCard key={f.title} className={f.className}>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDescription>{f.description}</FeatureDescription>
              <div className="h-full w-full mt-4">{f.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}
