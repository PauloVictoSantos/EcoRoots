'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen, Code, Cpu, Server, Terminal, Wifi,
  Layers, ChevronRight, Check, Copy, Zap, Database, Brain, Globe,
} from 'lucide-react'
import { SectionWrapper } from '@/components/section-wrapper'
import { GlassCard } from '@/components/glass-card'
import { CodeBlock } from '@/components/ui/code-block'
import { Terminal as TerminalComp } from '@/components/ui/terminal'

const sections = [
  {
    id: 'overview', title: 'Visão Geral', icon: BookOpen,
    content: `O Smart Greenhouse é um sistema completo de monitoramento inteligente de estufas que integra hardware IoT com IA avançada. Sensores ESP32-CAM capturam imagens e dados ambientais, enviando tudo em tempo real para análise com Gemini Vision.

O sistema detecta pragas, doenças e condições ambientais com 15 dimensões de análise — incluindo score de saúde 0–100%, impacto financeiro estimado e plano de ação com produtos específicos.`,
  },
  {
    id: 'architecture', title: 'Arquitetura', icon: Layers,
    content: `O sistema é dividido em quatro camadas:

**Camada Hardware**: ESP32-CAM com DHT22 (temperatura/umidade) e sensor capacitivo de solo. Bomba de aquário 5V controlada por relay.

**Camada IA (Python)**: FastAPI + Gemini Vision API. Analisa imagens em 15 dimensões agrícolas com prompt profissional e validação Pydantic.

**Camada Backend (Node.js)**: Express + Socket.IO + Prisma. Orquestra o pipeline IoT → IA → insights → banco → frontend.

**Camada Frontend**: Next.js 16 + React Three Fiber. Dashboard em tempo real + gêmeo digital 3D interativo.`,
  },
  {
    id: 'hardware', title: 'Hardware', icon: Cpu,
    content: `**ESP32-CAM (AI-Thinker)**: Microcontrolador principal com câmera OV2640 2MP integrada e Wi-Fi 802.11 b/g/n.

**DHT22**: Sensor de temperatura (±0.5°C) e umidade (±2%). Conectado ao GPIO 13.

**Sensor Capacitivo de Solo**: Leitura analógica no ADC1 (GPIO 34). Calibrado: 3200 = seco, 1400 = encharcado.

**Bomba de Aquário 5V**: Controlada por módulo relay 5V. Acionada pelo backend via resposta JSON ao ESP32.

**Estrutura Física**: Acrílico/MDF 120×60×60cm. Tubulação PVC 15cm. Reservatório 2–5L.`,
  },
  {
    id: 'api', title: 'API Reference', icon: Server,
    content: `**POST /iot/data** — Recebe dados do ESP32 (multipart: image + temperature + humidity + soilMoisture). Retorna: \`{ irrigation, alert, message }\`

**POST /analyze** — Python AI. Recebe imagem, retorna análise completa com 15 dimensões.

**GET /dashboard** — Último registro com sensor + analysis + insights.

**GET /history?limit=20** — Histórico paginado.

**GET /health** — Status dos serviços.

**WebSocket greenhouse:update** — Emitido após cada análise completa com payload total.`,
  },
  {
    id: 'installation', title: 'Instalação', icon: Terminal,
    content: `**Pré-requisitos**: Node.js 20+, Python 3.10+, MySQL 8+, Arduino IDE.

1. Configure \`.env\` em \`node-backend/\` com DATABASE_URL e GEMINI_API_KEY
2. Configure \`.env\` em \`python-ai/\` com GEMINI_API_KEY
3. Abra \`esp32/greenhouse_esp32.ino\`, configure WIFI_SSID, WIFI_PASSWORD e SERVER_URL
4. Execute os três serviços em paralelo

**Chave Gemini gratuita**: https://aistudio.google.com/apikey`,
  },
  {
    id: 'communication', title: 'Comunicação IoT', icon: Wifi,
    content: `**ESP32 → Node.js**: HTTP POST multipart/form-data enviando imagem JPEG + dados dos sensores a cada 30 segundos.

**Node.js → Python AI**: HTTP POST com a imagem para análise Gemini Vision.

**Node.js → Frontend**: Socket.IO evento \`greenhouse:update\` com payload completo incluindo aiAnalysis (15 dimensões) + insights Gemini.

**Node.js → ESP32**: Resposta JSON com \`{ irrigation: boolean, alert: string, message: string }\` para acionamento do relay.`,
  },
]

const codeExamples: Record<string, { code: string; language: string; filename: string; highlightLines: number[] }> = {
  hardware: {
    language: "cpp", filename: "greenhouse_esp32.ino", highlightLines: [3, 4, 5, 10, 11],
    code: `void sendData() {
  float temp = dht.readTemperature()   // DHT22 GPIO 13
  float hum  = dht.readHumidity()
  float soil = readSoilMoisture()      // ADC1 GPIO 34

  digitalWrite(LED_FLASH_PIN, HIGH)
  camera_fb_t* fb = esp_camera_fb_get()
  digitalWrite(LED_FLASH_PIN, LOW)

  // POST multipart/form-data → Node.js :3000/iot/data
  HTTPClient http
  http.begin(SERVER_URL)
  int code = http.POST(buildPayload(temp, hum, soil, fb))
  handleServerResponse(http.getString())
  esp_camera_fb_return(fb)
}`,
  },
  api: {
    language: "typescript", filename: "src/controllers/iotController.ts", highlightLines: [4, 7, 10, 13],
    code: `export const handleIotData = async (req, res, next) => {
  const sensor = SensorDataSchema.parse(req.body)

  const aiResult = await pythonAi.analyzeImage(req.file.path)
  // aiResult.health.healthScore = 94
  // aiResult.oneLiner = "Tomateiro saudável"

  const insight = await geminiInsight.generateInsights(sensor, aiResult)

  await dbService.createFullRecord(sensor, req.file, aiResult, insight)

  io.emit("greenhouse:update", { sensor, aiAnalysis: aiResult, insights: insight })

  res.json({ irrigation: insight.irrigationRecommendation, alert: insight.alert })
}`,
  },
}

function NavItem({ section, isActive, onClick }: { section: typeof sections[0]; isActive: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
      isActive ? 'bg-[#58D68D]/10 text-[#58D68D] border border-[#58D68D]/20' : 'text-[#9CA3AF] hover:text-white hover:bg-white/4'
    }`}>
      <section.icon className="w-4 h-4 shrink-0" />
      <span className="text-sm font-medium">{section.title}</span>
      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
    </button>
  )
}

export default function DocumentationPage() {
  const [active, setActive] = useState('overview')
  const cur = sections.find(s => s.id === active)!

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0A0A0A]">
      <SectionWrapper className="container mx-auto px-4 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-[#58D68D]/10 text-[#58D68D] border border-[#58D68D]/20 mb-4">
            Documentação
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6">
            Documentação{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#58D68D] to-[#1E8449]">Técnica</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-[#9CA3AF] text-lg leading-relaxed">
            Guia completo sobre arquitetura, hardware, APIs e implementação do Smart Greenhouse.
          </motion.p>
        </div>
      </SectionWrapper>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-1">
            <GlassCard hover={false} className="sticky top-24 p-4">
              <h3 className="text-xs font-semibold text-[#6B7280] mb-4 px-3 uppercase tracking-wider">Navegação</h3>
              <nav className="space-y-1">
                {sections.map(s => <NavItem key={s.id} section={s} isActive={active === s.id} onClick={() => setActive(s.id)} />)}
              </nav>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-3 space-y-6">
            <GlassCard hover={false} className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#58D68D]/10 flex items-center justify-center">
                  <cur.icon className="w-5 h-5 text-[#58D68D]" />
                </div>
                <h2 className="text-2xl font-bold text-white">{cur.title}</h2>
              </div>
              <div className="space-y-4">
                {cur.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-[#9CA3AF] leading-relaxed text-sm">
                    {para.split('**').map((part, j) =>
                      j % 2 === 1
                        ? <strong key={j} className="text-white font-semibold">{part}</strong>
                        : part.split('`').map((cp, k) =>
                            k % 2 === 1
                              ? <code key={k} className="px-1.5 py-0.5 rounded bg-[#58D68D]/10 text-[#58D68D] text-xs font-mono">{cp}</code>
                              : cp
                          )
                    )}
                  </p>
                ))}
              </div>
              {(active === 'hardware' || active === 'api') && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-white mb-4">Código de Exemplo</h3>
                  <CodeBlock {...codeExamples[active === 'hardware' ? 'hardware' : 'api']} />
                </div>
              )}
            </GlassCard>

            {active === 'installation' && (
              <GlassCard hover={false} className="p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#58D68D]" />
                  Quick Start
                </h3>
                <TerminalComp
                  commands={[
                    "cd python-ai && pip install -r requirements.txt",
                    "uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload",
                    "cd node-backend && npm install && npm run dev",
                    "cd frontend-nextjs-v2 && npm install --legacy-peer-deps && npm run dev",
                  ]}
                  outputs={{
                    0: ["Successfully installed fastapi uvicorn google-genai pydantic pillow"],
                    1: ["✅ Gemini service initialized", "INFO: Application startup complete."],
                    2: ["🌿 Smart Greenhouse Backend running · Port: 3000"],
                    3: ["▲ Next.js 16 · ✓ Ready · Local: http://localhost:3000"],
                  }}
                  typingSpeed={35}
                  delayBetweenCommands={1000}
                />
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
