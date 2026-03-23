"use client";
import { motion } from "motion/react";
import { Thermometer, Droplets, Gauge, Brain, ArrowRight, Cpu, Monitor, Camera, Wifi, Leaf, Zap, Shield } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
});

const galleryItems = [
  { title: "ESP32-CAM + OV2640",         desc: "Módulo principal — câmera 2MP integrada, Wi-Fi 802.11 b/g/n, alimentado por 5V com relay de irrigação.",            icon: Cpu,      color: "#FFB74D", stat: "2MP · 30fps" },
  { title: "Sensores DHT22 + Solo",      desc: "Temperatura ±0.5°C, umidade ±2%, sensor capacitivo de umidade do solo com leitura analógica no ADC1.",               icon: Thermometer, color: "#FF6B6B", stat: "±0.5°C precisão" },
  { title: "Gêmeo Digital 3D",           desc: "Estufa interativa construída com React Three Fiber — plantas animadas, solo dinâmico, irrigação com partículas.",     icon: Monitor,  color: "#4FC3F7", stat: "60fps · WebGL" },
  { title: "Gemini Vision API",          desc: "IA analisa cada imagem em 15 dimensões: planta, praga, doença, severidade, urgência, impacto financeiro e mais.",    icon: Brain,    color: "#a78bfa", stat: "15 dimensões" },
  { title: "Dashboard Tempo Real",       desc: "Socket.IO emite eventos em <100ms. Gráficos de temperatura, umidade e solo atualizados continuamente.",               icon: Gauge,    color: "#58D68D", stat: "<100ms latência" },
  { title: "Irrigação Automatizada",     desc: "Bomba de aquário 5V controlada por relay. A IA decide quando irrigar considerando tipo de doença e umidade atual.",   icon: Droplets, color: "#60A5FA", stat: "2–5L reservatório" },
  { title: "Pipeline de Dados IoT",      desc: "ESP32 → Node.js → Python AI → Gemini → Socket.IO → Dashboard. Tudo persistido em MySQL via Prisma ORM.",             icon: Wifi,     color: "#34d399", stat: "End-to-end" },
  { title: "Alertas Inteligentes",       desc: "Alerta crítico dispara em até 2 dias para doenças avançadas. Score de saúde 0–100% visível no overlay da estufa 3D.", icon: Shield,   color: "#f87171", stat: "0–100% score" },
  { title: "Acríl./MDF 120×60×60cm",    desc: "Estrutura física: base e laterais em MDF, parte superior em acrílico transparente, espaçamento de 10cm entre plantas.",icon: Leaf,     color: "#86efac", stat: "120×60×60cm" },
];

export default function GallerySection() {
  return (
    <section id="galeria" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-[#58D68D] uppercase">Galeria</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Componentes do Projeto</h2>
          <p className="text-[#9CA3AF] max-w-xl mx-auto">
            Cada peça do sistema — do circuito à nuvem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map(({ title, desc, icon: Icon, color, stat }, i) => (
            <motion.div key={title} {...fadeUp(i * 0.06)}
              whileHover={{ y: -4 }}
              className="group relative p-7 rounded-2xl border border-white/6 bg-white/[0.015] overflow-hidden cursor-default"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}08 0%, transparent 70%)` }} />
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />

              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full border font-mono" style={{ color, borderColor: `${color}25`, backgroundColor: `${color}08` }}>
                  {stat}
                </span>
              </div>

              <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
