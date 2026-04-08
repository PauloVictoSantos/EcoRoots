"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  commands: string[];
  outputs?: Record<number, string[]>;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  className?: string;
}

export function Terminal({ commands, outputs = {}, typingSpeed = 50, delayBetweenCommands = 1000, className }: TerminalProps) {
  const [lines, setLines] = useState<{ type: "command" | "output"; text: string }[]>([]);
  const [typing, setTyping] = useState("");
  const [cmdIndex, setCmdIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "output" | "delay">("typing");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cmdIndex >= commands.length) return;
    if (phase === "typing") {
      if (charIndex < commands[cmdIndex].length) {
        const t = setTimeout(() => {
          setTyping(prev => prev + commands[cmdIndex][charIndex]);
          setCharIndex(c => c + 1);
        }, typingSpeed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setLines(l => [...l, { type: "command", text: typing }]);
          setTyping("");
          setCharIndex(0);
          setPhase("output");
        }, 150);
        return () => clearTimeout(t);
      }
    }
    if (phase === "output") {
      const out = outputs[cmdIndex] || [];
      if (out.length) {
        setLines(l => [...l, ...out.map(o => ({ type: "output" as const, text: o }))]);
      }
      const t = setTimeout(() => { setPhase("delay"); }, 100);
      return () => clearTimeout(t);
    }
    if (phase === "delay") {
      const t = setTimeout(() => { setCmdIndex(i => i + 1); setPhase("typing"); }, delayBetweenCommands);
      return () => clearTimeout(t);
    }
  }, [cmdIndex, charIndex, phase, typing, commands, outputs, typingSpeed, delayBetweenCommands]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines, typing]);

  return (
    <div className={cn("rounded-2xl border border-[#58D68D]/15 bg-[#0d0d0d] overflow-hidden shadow-2xl", className)}>
      <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-white/6">
        <div className="w-3 h-3 rounded-full bg-[#EF4444]/70" />
        <div className="w-3 h-3 rounded-full bg-[#F59E0B]/70" />
        <div className="w-3 h-3 rounded-full bg-[#58D68D]/70" />
        <span className="ml-2 text-xs text-[#6B7280] font-mono">greenhouse ~ terminal</span>
      </div>
      <div ref={ref} className="p-5 font-mono text-sm h-64 overflow-y-auto space-y-1 [scrollbar-width:none]">
        {lines.map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            className={cn("leading-relaxed",
              line.type === "command" ? "text-white" : "text-[#58D68D]/80 pl-2")}>
            {line.type === "command" && <span className="text-[#58D68D] mr-2">$</span>}
            {line.text}
          </motion.div>
        ))}
        {typing && (
          <div className="text-white leading-relaxed">
            
            <span className="text-[#58D68D] mr-2">$</span>
            {typing}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }}
              className="inline-block w-2 h-4 bg-[#58D68D] ml-0.5 align-middle" />
          </div>
        )}
      </div>
    </div>
  );
}
