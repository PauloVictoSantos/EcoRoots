"use client";
import { motion } from "motion/react";
import { Terminal } from "@/components/ui/terminal";
import { CodeBlock } from "@/components/ui/code-block";
import { useState } from "react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
});

const tabs = ["python-ai", "node-backend", "esp32"] as const;

const codeExamples = {
  "python-ai": {
    language: "python",
    filename: "app/services/gemini_service.py",
    highlightLines: [6, 7, 8, 9, 10],
    code: `ANALYSIS_PROMPT = """Você é um agrônomo especialista.
Analise a imagem e retorne APENAS JSON válido:

{
  "plant":    { "commonName": "...", "growthStage": "..." },
  "problem":  { "hasProblem": true, "name": "...", "isContagious": false },
  "severity": { "severity": "medium", "severityScore": 55 },
  "financial":{ "estimatedLossMin": 20, "estimatedLossMax": 40 },
  "health":   { "healthScore": 55, "alertType": "pest_detected" },
  "oneLiner": "Percevejo detectado — agir em 2-3 dias"
}
Retorne APENAS o JSON."""

class GeminiService:
    async def analyze_image(self, path: str):
        img = Image.open(path).convert("RGB")
        for model in MODELS:
            response = self.client.models.generate_content(
                model=model,
                contents=[ANALYSIS_PROMPT, img],
            )
            return extract_json_from_text(response.text)`,
  },
  "node-backend": {
    language: "typescript",
    filename: "src/controllers/iotController.ts",
    highlightLines: [5, 6, 7, 12, 13],
    code: `export const handleIotData = async (req, res, next) => {
  const sensor = SensorDataSchema.parse(req.body)

  // 1. Python AI — análise completa Gemini Vision
  const aiResult = await pythonAi.analyzeImage(req.file.path)

  // 2. Gemini enriquece com contexto dos sensores
  const insight  = await geminiInsight.generateInsights(sensor, aiResult)

  // 3. Persiste no MySQL via Prisma
  await dbService.createFullRecord(sensor, req.file, aiResult, insight)

  // 4. Emite payload completo via Socket.IO
  io.emit('greenhouse:update', { sensor, aiAnalysis: aiResult, insights: insight })

  // 5. Responde ao ESP32
  res.json({ irrigation: insight.irrigationRecommendation, alert: insight.alert })
}`,
  },
  "esp32": {
    language: "cpp",
    filename: "greenhouse_esp32.ino",
    highlightLines: [3, 4, 8, 9, 10],
    code: `void sendData() {
  // Lê sensores
  float temp = dht.readTemperature()
  float hum  = dht.readHumidity()
  float soil = readSoilMoisture()  // ADC1 calibrado

  // Captura imagem com LED flash
  digitalWrite(LED_FLASH_PIN, HIGH)
  camera_fb_t* fb = esp_camera_fb_get()
  digitalWrite(LED_FLASH_PIN, LOW)

  // POST multipart/form-data → Node.js :3000
  HTTPClient http
  http.begin("http://192.168.1.100:3000/iot/data")
  int code = http.POST(buildPayload(temp, hum, soil, fb))

  // Recebe e age: irrigation + alert
  handleServerResponse(http.getString())
  esp_camera_fb_return(fb)
}`,
  },
};

export function TerminalDevSection() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("python-ai");

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-[#58D68D] uppercase">Dev Tools</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Como Executar</h2>
          <p className="text-[#9CA3AF] max-w-xl mx-auto">
            Código real do projeto. Cada camada do sistema numa aba.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Terminal */}
          <motion.div {...fadeUp(0.1)}>
            <p className="text-xs text-[#6B7280] font-mono mb-3 uppercase tracking-wider">Quick start</p>
            <Terminal
              commands={[
                "cd python-ai && uvicorn app.main:app --port 8000 --reload",
                "cd node-backend && npm run dev",
                "cd frontend-nextjs-v2 && npm run dev",
                "curl -X POST localhost:8000/analyze -F image=@planta.jpg",
              ]}
              outputs={{
                0: ["✅ Gemini service initialized", "INFO: Application startup complete.", "INFO: Uvicorn running on http://0.0.0.0:8000"],
                1: ["🌿 Smart Greenhouse Backend running", "Port: 3000 · Gemini AI: configured", "Socket.IO server initialized"],
                2: ["▲ Next.js 16.1.6", "✓ Ready in 2.1s", "○ Local: http://localhost:3000"],
                3: ['{"plant":{"commonName":"Tomateiro"},"health":{"healthScore":94},"oneLiner":"Planta saudável"}'],
              }}
              typingSpeed={40}
              delayBetweenCommands={1200}
              className="h-full"
            />
          </motion.div>

          {/* Code block with tabs */}
          <motion.div {...fadeUp(0.2)}>
            <div className="flex gap-1 mb-3">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                    activeTab === tab
                      ? "bg-[#58D68D]/15 text-[#58D68D] border border-[#58D68D]/25"
                      : "text-[#6B7280] hover:text-white"
                  }`}>{tab}</button>
              ))}
            </div>
            <CodeBlock {...codeExamples[activeTab]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
