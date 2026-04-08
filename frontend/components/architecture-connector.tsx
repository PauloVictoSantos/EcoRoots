"use client";

import { motion } from "motion/react";
import { LuCpu, LuServer, LuMonitor, LuBrain, LuDatabase, LuLeaf } from "react-icons/lu";
import { DottedGlowBackground } from "./ui/dotted-glow-background";

export function ArchitectureConnector() {
  return (
    <div className="relative mt-20 rounded-2xl overflow-hidden w-full max-w-250">
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100"
        opacity={1}
        gap={10}
        radius={0.9}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.1}
        speedMax={0.5}
        speedScale={1}
      />

      <div className="relative h-75 w-full justify-center items-center -ml-10 flex">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="absolute left-22 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10"
        >
          <div className="w-14 h-14 rounded-xl border border-green-500/30 flex items-center justify-center">
            <LuLeaf className="w-7 h-7 text-green-400" />
          </div>
          <span className="text-sm font-medium">Estufa</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="absolute left-61 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10"
        >
          <div
            className="w-14 h-14 rounded-xl border border-green-500/30 flex items-center justify-center"
            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(20, 100, 30, 0.17)" }}
          >
            <LuCpu className="w-7 h-7 text-green-400" />
          </div>
          <span className="text-xs font-medium">ESP32</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="absolute left-100 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10"
        >
          <div
            className="w-14 h-14 rounded-xl  border border-orange-500/30 flex items-center justify-center"
            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(249, 115, 22, 0.15)" }}
          >
            <LuServer className="w-7 h-7 text-orange-400" />
          </div>
          <span className="text-xs font-medium">Backend</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute left-162.5 top-4.5 flex items-center gap-3 z-10"
        >
          <div
            className="w-14 h-14 rounded-xl  border border-blue-400 flex items-center justify-center"
            style={{ boxShadow: "0 4px 20px rgba(10, 80, 100, 0.2)" }}
          >
            <LuMonitor className="w-7 h-7 text-blue-400" />
          </div>
          <span className="text-xs font-medium">Frontend</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="absolute left-162.5 bottom-26 -translate-y-1/2 flex items-center gap-3 z-10"
        >
          <div
            className="w-14 h-14 rounded-xl  border border-purple-400 flex items-center justify-center"
            style={{ boxShadow: "0 4px 20px rgba(197, 43, 90, 0.2)" }}
          >
            <LuBrain className="w-7 h-7 text-purple-400" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">Python + IA</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute left-162.5 bottom-10.5 flex items-center gap-3 z-10"
        >
          <div
            className="w-14 h-14 rounded-xl  border border-cyan-400 flex items-center justify-center"
            style={{ boxShadow: "0 4px 20px rgba(0,195,255,0.2)" }}
          >
            <LuDatabase className="w-7 h-7 text-cyan-400" />
          </div>
          <span className="text-xs font-medium">Banco de Dados</span>
        </motion.div>

        {/* ===== LINHAS DE CONEXÃO ===== */}

        {/* Linha 1 */}
        <div
          className="absolute bg-linear-to-r from-neutral-500/40 via-neutral-500/80 to-neutral-500/40 overflow-hidden"
          style={{ left: 144, top: 138, width: 100, height: 1 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-1/3 
               bg-linear-to-r from-transparent via-green-700 to-transparent
               shadow-[10px_0_25px_-3px_rgba(11,155, 49, 0.9)]"
            animate={{ x: ["-100%", "250%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 0 }}
          />
        </div>

        {/* Linha 2 */}
        <div
          className="absolute bg-linear-to-r from-neutral-500/40 via-neutral-500/80 to-neutral-500/40 overflow-hidden"
          style={{ left: 299, top: 138, width: 100, height: 1 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-1/3 
               bg-linear-to-r from-transparent via-green-500 to-transparent
               shadow-[10px_0_25px_-3px_rgba(0, 255, 0, 0.9)]"
            animate={{ x: ["-100%", "250%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 0.2 }}
          />
        </div>

        {/* Linha 3 */}
        <div
          className="absolute bg-linear-to-r from-neutral-500/40 via-neutral-500/80 to-neutral-500/40 overflow-hidden"
          style={{ left: 456, top: 138, width: 100, height: 1 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-1/3 
               bg-linear-to-r from-transparent via-orange-500 to-transparent
               shadow-[10px_0_25px_-3px_rgba(249, 115, 22, 0.9)]"
            animate={{ x: ["-100%", "250%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 0.4 }}
          />
        </div>

        {/* Linha vertical */}
        <div
          className="absolute bg-linear-to-b from-neutral-500/40 via-neutral-500/80 to-neutral-500/40 overflow-hidden"
          style={{ left: 556, top: 45, width: 1, height: 94 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1/3 
bg-linear-to-r from-transparent via-orange-500 to-transparent
               shadow-[10px_0_25px_-3px_rgba(249, 115, 22, 0.9)]"
            animate={{ y: ["250%", "-250%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 0.10 }}
          />
        </div>
        <div
          className="absolute bg-linear-to-b from-neutral-500/40 via-neutral-500/80 to-neutral-500/40 overflow-hidden"
          style={{ left: 556, top: 138, width: 1, height: 94 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1/3 
bg-linear-to-r from-transparent via-orange-500 to-transparent
               shadow-[10px_0_25px_-3px_rgba(249, 115, 22, 0.9)]"
            animate={{ y: ["-250%", "250%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 0.8 }}
          />
        </div>

        {/* Linha 4 */}
        <div
          className="absolute bg-linear-to-r from-neutral-500/60 to-neutral-500/30 overflow-hidden"
          style={{ left: 557, top: 46, width: 93, height: 1 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-1/3 
               bg-linear-to-r from-transparent via-blue-500 to-transparent
               shadow-[10px_0_25px_-3px_rgba(59,130,246,0.9)]"
            animate={{ x: ["-100%", "250%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 0.10 }}
          />
        </div>

        {/* Linha 5 */}
        <div
          className="absolute bg-linear-to-r from-neutral-500/60 to-neutral-500/30 overflow-hidden"
          style={{ left: 557, top: 138, width: 93, height: 1 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-1/3 
               bg-linear-to-r from-transparent via-purple-500 to-transparent
               shadow-[10px_0_25px_-3px_rgba(197, 43, 90, 0.9)]"
            animate={{ x: ["-100%", "250%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 0.10 }}
          />
        </div>

        {/* Linha 6 */}
        <div
          className="absolute bg-linear-to-r from-neutral-500/60 to-neutral-500/30 overflow-hidden"
          style={{ left: 557, top: 231, width: 93, height: 1 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-1/3 
               bg-linear-to-r from-transparent via-cyan-500 to-transparent
               shadow-[10px_0_25px_-3px_rgba(0,195,255,0.9)]"
            animate={{ x: ["-100%", "250%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 0.10 }}
          />
        </div>
      </div>
    </div>
  );
}
