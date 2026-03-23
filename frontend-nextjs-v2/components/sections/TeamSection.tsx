"use client";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { motion } from "motion/react";

function MemberDetail({ role, skills, bio, color }: { role: string; skills: string[]; bio: string; color: string }) {
  return (
    <div className="bg-[#111] border border-white/6 p-8 md:p-10 rounded-2xl mb-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-semibold px-3 py-1 rounded-full border" style={{ color, borderColor: `${color}30`, backgroundColor: `${color}10` }}>{role}</span>
      </div>
      <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">{bio}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map(s => (
          <span key={s} className="text-xs px-3 py-1 rounded-full bg-white/5 text-[#9CA3AF] border border-white/8">{s}</span>
        ))}
      </div>
    </div>
  );
}

const data = [
  {
    category: "Full-Stack & Líder",
    title: "Paulo — Arquiteto do Sistema",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    content: <MemberDetail role="Full-Stack Developer" color="#58D68D" bio="Responsável pela arquitetura completa: backend Node.js, integração Gemini IA, frontend Next.js e coordenação do hardware ESP32." skills={["Next.js 16","Node.js","TypeScript","Prisma","Socket.IO","ESP32"]} />,
  },
  {
    category: "IoT & Hardware",
    title: "Engenheiro de Hardware",
    src: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=800&auto=format&fit=crop",
    content: <MemberDetail role="IoT Specialist" color="#FFB74D" bio="Montagem dos circuitos, calibração de sensores DHT22 e solo, programação do firmware ESP32-CAM e sistema de irrigação automatizado." skills={["Arduino","ESP32-CAM","DHT22","C++","Circuitos","PVC Pipes"]} />,
  },
  {
    category: "IA & Visão Computacional",
    title: "Engenheiro de IA",
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    content: <MemberDetail role="ML Engineer" color="#a78bfa" bio="Desenvolvimento do serviço Python FastAPI, engenharia do prompt Gemini Vision com 15 dimensões agrícolas e validação com Pydantic." skills={["Python","FastAPI","Gemini Vision","Pydantic","Prompt Eng.","REST API"]} />,
  },
  {
    category: "UI/UX & Frontend",
    title: "Engenheiro Visual",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    content: <MemberDetail role="Visual Engineer" color="#4FC3F7" bio="Design e implementação do dashboard, estufa 3D com React Three Fiber, animações Framer Motion e experiência do usuário completa." skills={["React","Three.js","R3F","Framer Motion","Tailwind","Design"]} />,
  },
  {
    category: "Banco de Dados",
    title: "Engenheiro de Dados",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    content: <MemberDetail role="Data Engineer" color="#34d399" bio="Modelagem do banco MySQL, configuração Prisma ORM, queries otimizadas para histórico de sensores e análises agrícolas persistentes." skills={["MySQL","Prisma","SQL","Node.js","REST API","Migrations"]} />,
  },
];

export function TeamSection() {
  const cards = data.map((card, i) => <Card key={card.src} card={card} index={i} />);
  return (
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 mb-8">
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[#58D68D] uppercase">Equipe</motion.span>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold mt-3">
          Quem Construiu
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }} className="text-[#9CA3AF] mt-3 max-w-xl">
          Cada membro dominou uma camada crítica do sistema — do firmware ao modelo de IA.
        </motion.p>
      </div>
      <Carousel items={cards} />
    </div>
  );
}
