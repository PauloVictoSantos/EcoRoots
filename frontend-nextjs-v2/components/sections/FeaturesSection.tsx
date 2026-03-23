"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { motion } from "motion/react";
import {
  Cpu,
  Brain,
  Server,
  Monitor,
  Wifi,
  Database,
  Activity,
} from "lucide-react";
import { TerminalDemo } from "./TerminalDevSection";
import { SocialOrbit } from "../social-orbit";
import { ArchitectureConnector } from "../architecture-connector";


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
      skeleton: <SkeletonImages />,
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
      <div className="px-8 text-center">
        <h4 className="text-4xl md:text-5xl font-bold">
          Sistema em Tempo Real
        </h4>
        <p className="mt-4 text-neutral-500 max-w-xl mx-auto">
          Um pipeline contínuo onde hardware, IA e software operam em conjunto,
          transformando dados em decisões automáticas.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-6 border dark:border-neutral-800">
        {features.map((feature) => (
          <div key={feature.title} className={cn("p-6", feature.className)}>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-neutral-500 mb-6">
              {feature.description}
            </p>
            {feature.skeleton}
          </div>
        ))}
      </div>
    </div>
  );
}


const SkeletonPipeline = () => {
  const steps = [
    { icon: Cpu, label: "ESP32", color: "#FFB74D" },
    { icon: Wifi, label: "API", color: "#58D68D" },
    { icon: Brain, label: "IA", color: "#a78bfa" },
    { icon: Database, label: "DB", color: "#34d399" },
    { icon: Monitor, label: "UI", color: "#4FC3F7" },
  ];

  return (
    <div className="flex items-center justify-between gap-4">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex flex-col items-center gap-2"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${step.color}20` }}
          >
            <step.icon size={18} color={step.color} />
          </div>
          <span className="text-xs text-neutral-400">{step.label}</span>
        </motion.div>
      ))}
    </div>
  );
};


const SkeletonImages = () => {
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
    </div>
  );
};


const SkeletonTelemetry = () => {
  return (
    <div>
      <ArchitectureConnector />
    </div>
  )
};