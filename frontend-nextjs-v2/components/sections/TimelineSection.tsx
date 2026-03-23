"use client";
import { Timeline } from "@/components/ui/timeline";
import { motion } from "motion/react";
import { CheckCircle, Circle, Clock, Cpu, Globe, Brain, Monitor, Leaf } from "lucide-react";

function Phase({ items, done }: { items: string[]; done: boolean }) {
  return (
    <div>
      <div className="mb-6 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm text-[#9CA3AF]">
            {done
              ? <CheckCircle className="w-4 h-4 text-[#58D68D] shrink-0" />
              : <Circle className="w-4 h-4 text-[#374151] shrink-0" />}
            {item}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {done && (
          <div className="col-span-2 px-4 py-3 rounded-xl bg-[#58D68D]/5 border border-[#58D68D]/15 text-xs text-[#58D68D] font-medium">
            ✅ Fase concluída com sucesso
          </div>
        )}
      </div>
    </div>
  );
}

const timelineData = [
  {
    title: "Jan 2025",
    content: (
      <div>
        <p className="mb-6 text-sm font-semibold text-white">Fase 1 — Planejamento & Pesquisa</p>
        <Phase done items={["Definição dos requisitos do projeto","Pesquisa de componentes ESP32-CAM","Seleção da API Gemini Vision","Arquitetura do sistema IoT","Design inicial do banco de dados MySQL"]} />
      </div>
    ),
  },
  {
    title: "Fev 2025",
    content: (
      <div>
        <p className="mb-6 text-sm font-semibold text-white">Fase 2 — Hardware & Firmware</p>
        <Phase done items={["Montagem do circuito ESP32-CAM","Calibração do sensor DHT22","Sensor capacitivo de umidade do solo","Firmware Arduino com Wi-Fi","Sistema de irrigação com bomba e relay","Tubulação PVC 15cm"]} />
      </div>
    ),
  },
  {
    title: "Mar 2025",
    content: (
      <div>
        <p className="mb-6 text-sm font-semibold text-white">Fase 3 — Backend + IA Python</p>
        <Phase done items={["Node.js com Express e Socket.IO","Banco MySQL com Prisma ORM","Serviço Python FastAPI + Gemini","Prompt profissional com 15 dimensões","Validação Pydantic + análise de pragas","Pipeline IoT → IA → Dashboard"]} />
      </div>
    ),
  },
  {
    title: "Mar 2025",
    content: (
      <div>
        <p className="mb-6 text-sm font-semibold text-white">Fase 4 — Frontend & Gêmeo Digital 3D</p>
        <Phase done items={["Next.js 16 com App Router","React Three Fiber — estufa 3D","Dashboard com gráficos em tempo real","Framer Motion — motion design","Floating leaves + glassmorphism","Aceternity UI components"]} />
      </div>
    ),
  },
  {
    title: "Abr 2025",
    content: (
      <div>
        <p className="mb-6 text-sm font-semibold text-white">Fase 5 — Testes & Deploy</p>
        <Phase done={false} items={["Testes de integração end-to-end","Calibração final dos sensores","Testes de stress no Socket.IO","Deploy na rede local","Documentação técnica final","Apresentação do projeto"]} />
      </div>
    ),
  },
];

export function TimelineSection() {
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={timelineData} />
    </div>
  );
}
