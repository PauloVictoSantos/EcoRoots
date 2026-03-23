"use client";

import { motion } from "motion/react";
import { Cpu, Server, Monitor, Brain, Database, Leaf } from "lucide-react";

export function ArchitectureConnector() {
  return (
    <div className="relative rounded-2xl overflow-hidden w-full max-w-250">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs text-green-400/80">Sistema Ativo</span>
      </div>

      {/* Container com posições absolutas */}
      <div className="relative h-[300px] w-full">
        
        {/* ===== ÍCONES ===== */}
        
        {/* Estufa - posição: left 0, center vertical */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0, duration: 0.4 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10"
        >
          <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <Leaf className="w-7 h-7 text-green-400" />
          </div>
          <span className="text-sm text-white/70 font-medium">Estufa<br/>Inteligente</span>
        </motion.div>

        {/* ESP32 - posição: left 200px, center vertical */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="absolute left-[200px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10"
        >
          <div
            className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center"
            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}
          >
            <Cpu className="w-7 h-7 text-green-400" />
          </div>
          <span className="text-xs text-white/60 font-medium">ESP32</span>
        </motion.div>

        {/* Backend - posição: left 400px, center vertical */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="absolute left-[400px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10"
        >
          <div
            className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-orange-500/30 flex items-center justify-center"
            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(249, 115, 22, 0.15)" }}
          >
            <Server className="w-7 h-7 text-orange-400" />
          </div>
          <span className="text-xs text-white/60 font-medium">Backend</span>
        </motion.div>

        {/* Frontend - posição: left 650px, top */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute left-[650px] top-[30px] flex items-center gap-3 z-10"
        >
          <div
            className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center"
            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}
          >
            <Monitor className="w-7 h-7 text-blue-400" />
          </div>
          <span className="text-xs text-white/60 font-medium">Frontend</span>
        </motion.div>

        {/* Python + IA - posição: left 650px, center */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="absolute left-[650px] top-1/2 -translate-y-1/2 flex items-center gap-3 z-10"
        >
          <div
            className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center"
            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}
          >
            <Brain className="w-7 h-7 text-purple-400" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/60 font-medium">Python + IA</span>
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded w-fit">Conectado</span>
          </div>
        </motion.div>

        {/* Banco de Dados - posição: left 650px, bottom */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute left-[650px] bottom-[30px] flex items-center gap-3 z-10"
        >
          <div
            className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center"
            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}
          >
            <Database className="w-7 h-7 text-cyan-400" />
          </div>
          <span className="text-xs text-white/60 font-medium">Banco de Dados</span>
        </motion.div>

        {/* ===== LINHAS DE CONEXÃO ===== */}
        
        {/* Linha 1: Estufa (centro direito: ~110px) -> ESP32 (centro esquerdo: 200px) */}
        {/* Y = 150px (centro) */}
        <div 
          className="absolute bg-gradient-to-r from-green-500/40 via-green-500/80 to-green-500/40"
          style={{ left: 110, top: 150, width: 90, height: 1 }}
        />

        {/* Linha 2: ESP32 (centro direito: 214+56=270) -> Backend (centro esquerdo: 400px) */}
        <div 
          className="absolute bg-gradient-to-r from-green-500/40 via-green-500/80 to-green-500/40"
          style={{ left: 257, top: 150, width: 143, height: 1 }}
        />

        {/* Linha 3: Backend (centro direito: 400+56=456) -> ponto de junção (560px) */}
        <div 
          className="absolute bg-gradient-to-r from-green-500/40 via-green-500/80 to-green-500/40"
          style={{ left: 457, top: 150, width: 100, height: 1 }}
        />

        {/* Linha vertical: conecta os 3 ícones da direita */}
        {/* De Y=57 (centro Frontend) até Y=243 (centro Database) */}
        <div 
          className="absolute bg-gradient-to-b from-green-500/40 via-green-500/80 to-green-500/40"
          style={{ left: 557, top: 57, width: 1, height: 186 }}
        />

        {/* Linha 4: junção -> Frontend (centro esquerdo: 650px) */}
        <div 
          className="absolute bg-gradient-to-r from-green-500/60 to-green-500/30"
          style={{ left: 557, top: 57, width: 93, height: 1 }}
        />

        {/* Linha 5: junção -> Python IA (centro esquerdo: 650px) */}
        <div 
          className="absolute bg-gradient-to-r from-green-500/60 to-green-500/30"
          style={{ left: 557, top: 150, width: 93, height: 1 }}
        />

        {/* Linha 6: junção -> Database (centro esquerdo: 650px) */}
        <div 
          className="absolute bg-gradient-to-r from-green-500/60 to-green-500/30"
          style={{ left: 557, top: 243, width: 93, height: 1 }}
        />

      </div>
    </div>
  );
}
