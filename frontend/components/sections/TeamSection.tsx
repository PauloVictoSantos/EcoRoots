"use client";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { motion } from 'framer-motion'
import {
  SiNextdotjs, SiNodedotjs, SiTypescript, SiJavascript, SiReact,
  SiSocketdotio, SiTailwindcss, SiFramer, SiThreedotjs,
  SiPython, SiFastapi, SiPydantic, SiMysql, SiPrisma, SiArduino,
} from 'react-icons/si'
import {
  LuCpu, LuCamera, LuDatabase, LuGlobe, LuGitBranch,
  LuWrench, LuPenTool, LuMessageSquare, LuSettings, LuZap,
} from 'react-icons/lu'
import { BarChart2 } from 'lucide-react'
import type { IconType } from 'react-icons'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
})

type TeamMember = { name: string; role: string; src: string }

const ROTATIONS = [-6, 4, -3, 7, -5, 3];

function TeamImageCards({ members, color }: { members: TeamMember[]; color: string }) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: `${color}99` }}>
          Equipe
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${color}30, transparent)` }} />
        <span className="text-xs" style={{ color: `${color}60` }}>{members.length} membros</span>
      </div>
      <div className="flex flex-wrap">
        {members.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            style={{ rotate: ROTATIONS[idx % ROTATIONS.length] }}
            whileHover={{ scale: 1.1, rotate: 0, zIndex: 100 }}
            whileTap={{ scale: 1.05, rotate: 0 }}
            className="relative rounded-2xl overflow-hidden cursor-pointer group shrink-0"
          >
            {/* glow */}
            <div
              className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300"
              style={{ background: color }}
            />
            <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: `${color}25` }}>
              <img
                src={member.src}
                alt={member.name}
                width="500"
                height="500"
                className="h-24 w-24 md:h-36 md:w-28 object-cover block"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/80 to-transparent p-3 pt-8">
                <p className="text-white text-[11px] font-bold leading-tight truncate">{member.name}</p>
                <p className="text-[10px] font-semibold truncate mt-0.5" style={{ color }}>{member.role}</p>
              </div>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${color}18, transparent 60%)` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const TECH_COLORS: Record<string, string> = {
  // JS / TS ecosystem
  "Next.js 16":      "#FFFFFF",
  "Next.js":         "#FFFFFF",
  "Node.js":         "#68A063",
  "TypeScript":      "#3178C6",
  "JavaScript":      "#F7DF1E",
  "React":           "#61DAFB",
  "Socket.IO":       "#FFFFFF",
  // Styling / animation
  "Tailwind":        "#06B6D4",
  "Framer Motion":   "#BB4B96",
  // 3D
  "Three.js":        "#FFFFFF",
  "R3F":             "#61DAFB",
  // Python
  "Python":          "#3776AB",
  "FastAPI":         "#009688",
  "Pydantic":        "#E92063",
  "Prompt Eng.":     "#F59E0B",
  // AI
  "Gemini Vision":   "#4285F4",
  "REST API":        "#6DB33F",
  // Database
  "MySQL":           "#4479A1",
  "Prisma":          "#5A67D8",
  "SQL":             "#CC2927",
  "Migrations":      "#6366F1",
  // IoT / Hardware
  "ESP32":           "#E7352C",
  "ESP32-CAM":       "#E7352C",
  "Arduino":         "#00979D",
  "DHT22":           "#FF6B35",
  "C++":             "#00599C",
  "Circuitos":       "#94A3B8",
  "PVC Pipes":       "#78909C",
  // Design
  "Design":          "#FF7262",
  // Generic
  "MLOps":           "#FF9800",
  "Data Scientist":  "#9C27B0",
  "DevOps":          "#E44D26",
};

const TECH_ICONS: Record<string, IconType> = {
  "Next.js 16":      SiNextdotjs,
  "Next.js":         SiNextdotjs,
  "Node.js":         SiNodedotjs,
  "TypeScript":      SiTypescript,
  "JavaScript":      SiJavascript,
  "React":           SiReact,
  "Socket.IO":       SiSocketdotio,
  "Tailwind":        SiTailwindcss,
  "Framer Motion":   SiFramer,
  "Three.js":        SiThreedotjs,
  "R3F":             SiThreedotjs,
  "Python":          SiPython,
  "FastAPI":         SiFastapi,
  "Pydantic":        SiPydantic,
  "Gemini Vision":   LuMessageSquare,
  "MySQL":           SiMysql,
  "Prisma":          SiPrisma,
  "Arduino":         SiArduino,
  "ESP32":           LuCpu,
  "ESP32-CAM":       LuCamera,
  "C++":             LuCpu,
  "Design":          LuPenTool,
  "REST API":        LuGlobe,
  "SQL":             LuDatabase,
  "Migrations":      LuGitBranch,
  "PVC Pipes":       LuWrench,
  "Circuitos":       LuZap,
  "MLOps":           LuSettings,
  "Data Scientist":  BarChart2,
  "DevOps":          LuSettings,
  "Prompt Eng.":     LuMessageSquare,
};

function MemberDetail({ name, role, skills, bio, color, teamMembers, src }: {
  name: string; role: string; skills: string[]; bio: string;
  color: string; teamMembers: TeamMember[]; src: string;
}) {
  return (
    <div className="mb-4 space-y-5">

      {/* ── Hero header ── */}
      <div
        className="relative h-52 rounded-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}18 0%, #0d0d0d 70%)` }}
      >
        {/* radial glow */}
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 25% 60%, ${color}28 0%, transparent 65%)` }}
        />
        {/* decorative rings */}
        <svg className="absolute -right-8 -top-8 w-64 h-64 opacity-[0.07]" viewBox="0 0 200 200" fill="none">
          <circle cx="160" cy="60" r="130" stroke={color} strokeWidth="0.6" />
          <circle cx="160" cy="60" r="90"  stroke={color} strokeWidth="0.6" />
          <circle cx="160" cy="60" r="50"  stroke={color} strokeWidth="0.6" />
        </svg>
        {/* dot grid */}
        <svg className="absolute bottom-0 right-0 w-48 h-32 opacity-[0.06]" viewBox="0 0 200 130">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 10 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 20 + 10} cy={r * 20 + 10} r="1.5" fill={color} />
            ))
          )}
        </svg>

        {/* avatar + info */}
        <div className="absolute inset-0 flex items-center px-8 gap-6">
          <div className="relative shrink-0">
            <div
              className="absolute -inset-1.5 rounded-full blur-xl"
              style={{ background: `${color}50` }}
            />
            <div className="relative p-0.5 rounded-full" style={{ background: `linear-gradient(135deg, ${color}80, ${color}20)` }}>
              <img
                src={src}
                alt={name}
                className="w-24 h-24 rounded-full object-cover block"
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: `${color}99` }}>
              Líder da Área
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{name}</h3>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{ color, borderColor: `${color}40`, backgroundColor: `${color}12` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bio ── */}
      <div className="relative px-7 py-5 rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <span
          className="absolute top-2 left-4 text-5xl font-serif leading-none select-none"
          style={{ color: `${color}25` }}
        >"</span>
        <p className="text-[#9CA3AF] text-sm leading-relaxed pl-5 relative z-10">{bio}</p>
        <span
          className="absolute bottom-0 right-5 text-5xl font-serif leading-none select-none"
          style={{ color: `${color}25` }}
        >"</span>
      </div>

      {/* ── Skills ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'rgba(107,114,128,0.8)' }}>
          Tecnologias
        </p>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => {
            const tc = TECH_COLORS[s] ?? color;
            return (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-xs px-3 py-1.5 rounded-full font-semibold cursor-default select-none flex items-center gap-1.5"
                style={{
                  color: tc,
                  backgroundColor: `${tc}15`,
                  border: `1px solid ${tc}35`,
                  boxShadow: `0 0 8px ${tc}12`,
                }}
              >
                {TECH_ICONS[s] && (() => {
                  const Icon = TECH_ICONS[s]
                  return <Icon className="text-[13px] shrink-0" />
                })()}
                {s}
              </motion.span>
            );
          })}
        </div>
      </div>

      {/* ── Team members ── */}
      {teamMembers.length > 0 && <TeamImageCards members={teamMembers} color={color} />}
    </div>
  );
}

const data = [
  {
    category: "Full-Stack & Líder",
    title: "Paulo — Arquiteto do Sistema",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    content: <MemberDetail
      name="Paulo"
      role="Full-Stack Developer"
      color="#58D68D"
      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
      bio="Responsável pela arquitetura completa: backend Node.js, integração Gemini IA, frontend Next.js e coordenação do hardware ESP32."
      skills={["Next.js 16", "Node.js", "TypeScript", "Prisma", "Socket.IO", "ESP32"]}
      teamMembers={[
        { name: "Ana Lima", role: "Backend Dev", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
        { name: "Ana Lima", role: "Backend Dev", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
        { name: "Ana Lima", role: "Backend Dev", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
        { name: "Ana Lima", role: "Backend Dev", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
        { name: "Ana Lima", role: "Backend Dev", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
        { name: "Ana Lima", role: "Backend Dev", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
        { name: "Ana Lima", role: "Backend Dev", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
        { name: "Carlos Mota", role: "DevOps", src: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=400&auto=format&fit=crop" },
        { name: "Beatriz Souza", role: "QA Engineer", src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop" },
      ]}
    />,
  },
  {
    category: "IoT & Hardware",
    title: "Engenheiro de Hardware",
    src: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=800&auto=format&fit=crop",
    content: <MemberDetail
      name="Rafael Torres"
      role="IoT Specialist"
      color="#FFB74D"
      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop"
      bio="Montagem dos circuitos, calibração de sensores DHT22 e solo, programação do firmware ESP32-CAM e sistema de irrigação automatizado."
      skills={["Arduino", "ESP32-CAM", "DHT22", "C++", "Circuitos", "PVC Pipes"]}
      teamMembers={[
        { name: "Diego Nunes", role: "Eletrônica", src: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop" },
        { name: "Fernanda Cruz", role: "Firmware Dev", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
        { name: "Fernanda Cruz", role: "Firmware Dev", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
        { name: "Fernanda Cruz", role: "Firmware Dev", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
        { name: "Fernanda Cruz", role: "Firmware Dev", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
      ]}
    />,
  },
  {
    category: "IA & Visão Computacional",
    title: "Engenheiro de IA",
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    content: <MemberDetail
      name="Lucas Ferreira"
      role="ML Engineer"
      color="#a78bfa"
      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop"
      bio="Desenvolvimento do serviço Python FastAPI, engenharia do prompt Gemini Vision com 15 dimensões agrícolas e validação com Pydantic."
      skills={["Python", "FastAPI", "Gemini Vision", "Pydantic", "Prompt Eng.", "REST API"]}
      teamMembers={[
        { name: "Mariana Costa", role: "Data Scientist", src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400&auto=format&fit=crop" },
        { name: "Thiago Alves", role: "MLOps", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
        { name: "Thiago Alves", role: "MLOps", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
        { name: "Thiago Alves", role: "MLOps", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
        { name: "Julia Ramos", role: "Prompt Engineer", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" },
      ]}
    />,
  },
  {
    category: "UI/UX & Frontend",
    title: "Engenheiro Visual",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    content: <MemberDetail
      name="Gabriel Mendes"
      role="Visual Engineer"
      color="#4FC3F7"
      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"
      bio="Design e implementação do dashboard, estufa 3D com React Three Fiber, animações Framer Motion e experiência do usuário completa."
      skills={["React", "Three.js", "R3F", "Framer Motion", "Tailwind", "Design"]}
      teamMembers={[
        { name: "Isabela Pinto", role: "UI Designer", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop" },
        { name: "Victor Lima", role: "3D Artist", src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" },
      ]}
    />,
  },
  {
    category: "Banco de Dados",
    title: "Engenheiro de Dados",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    content: <MemberDetail
      name="Bruno Oliveira"
      role="Data Engineer"
      color="#34d399"
      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
      bio="Modelagem do banco MySQL, configuração Prisma ORM, queries otimizadas para histórico de sensores e análises agrícolas persistentes."
      skills={["MySQL", "Prisma", "SQL", "Node.js", "REST API", "Migrations"]}
      teamMembers={[
        { name: "Camila Rocha", role: "DBA", src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&auto=format&fit=crop" },
        { name: "Eduardo Dias", role: "Data Analyst", src: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=400&auto=format&fit=crop" },
      ]}
    />,
  },
];



export function TeamSection() {
  const cards = data.map((card, i) => <Card key={card.src} card={card} index={i} />);
  return (
    <div id="time" className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 mb-8">
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[#58D68D] uppercase">Equipe</motion.span>
        <motion.span {...fadeUp(0)} className="inline-block text-xs font-semibold tracking-widest text-[#58D68D] uppercase mb-4">
          Desenvolvimento
        </motion.span>
        <motion.h2 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Quem{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-amazon-dark">
            Construiu
          </span>
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
