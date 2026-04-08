"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { LuCheck as Check, LuCopy as Copy } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  className?: string;
}

export function CodeBlock({ code, language = "tsx", filename, highlightLines = [], className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-2xl border border-[#58D68D]/15 bg-[#0d0d0d] overflow-hidden shadow-xl", className)}>
      <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]/70" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]/70" />
            <div className="w-3 h-3 rounded-full bg-[#58D68D]/70" />
          </div>
          {filename && <span className="text-xs text-[#6B7280] font-mono">{filename}</span>}
          {language && <span className="text-xs px-2 py-0.5 rounded-full bg-[#58D68D]/10 text-[#58D68D] font-mono">{language}</span>}
        </div>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-white transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-[#58D68D]" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <div className="overflow-x-auto p-4 [scrollbar-width:thin] [scrollbar-color:#58D68D20_transparent]">
        <table className="w-full border-collapse font-mono text-sm">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className={cn("leading-6", highlightLines.includes(i + 1) && "bg-[#58D68D]/8 rounded")}>
                <td className="select-none pr-6 text-right text-[#4B5563] w-8 text-xs">{i + 1}</td>
                <td className={cn("whitespace-pre", highlightLines.includes(i + 1) ? "text-[#a7f3d0]" : "text-[#9CA3AF]")}>
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
