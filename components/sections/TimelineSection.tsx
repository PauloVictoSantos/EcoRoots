"use client";

import { useEffect, useState } from "react";
import { Timeline } from "@/components/ui/timeline";
import { TimelineMediaGrid } from "@/components/timeline-media-grid";
import { fetchWeeks, type WeekData } from "@/lib/drive";

const WEEK_DESCRIPTIONS: Record<string, React.ReactNode> = {
  "Semana 1": (
    <>
      <p className="mb-3">
        Definição do escopo do projeto e primeira reunião de alinhamento
        da equipe. Estabelecemos os objetivos do <strong>Smart Greenhouse</strong>{" "}
        e dividimos as frentes de trabalho.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Pesquisa sobre sistemas hidropônicos NFT e DWC</li>
        <li>Levantamento de componentes: ESP32, DHT11, GUVA-S12S</li>
        <li>Criação do repositório e estrutura inicial do Next.js</li>
        <li>Design do banner e identidade visual do projeto</li>
      </ul>
    </>
  ),

  "Semana 2": (
    <>
      <p className="mb-3">
        Montagem física da estufa e primeiros testes dos sensores.
        Começamos a integração entre hardware e backend.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Corte e montagem da estrutura de madeira</li>
        <li>Instalação dos sensores no ESP32</li>
        <li>Primeiros testes de leitura de umidade e temperatura</li>
      </ul>
    </>
  ),

  "Semana 3": (
    <>
      <p className="mb-3">
        Desenvolvimento do sistema de câmera XY e início da integração
        com IA para detecção de pragas.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Montagem do gantry XY com motores de passo</li>
        <li>Calibração do eixo de movimentação</li>
        <li>Testes iniciais com a API do Gemini Vision</li>
      </ul>
    </>
  ),

  "Semana 4": (
    <>
      <p className="mb-3">
        Finalização do frontend, visualização 3D e testes finais do
        sistema completo.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Polimento do gêmeo digital 3D em Three.js</li>
        <li>Dashboard de monitoramento em tempo real</li>
        <li>Testes integrados hardware + software + IA</li>
      </ul>
    </>
  ),
};

// Fallback caso você adicione uma pasta nova e esqueça de escrever aqui
const DEFAULT_DESCRIPTION = (
  <p className="italic text-neutral-500">
    Descrição em breve.
  </p>
);

export function TimelineSection() {
  const [weeks, setWeeks] = useState<WeekData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeeks()
      .then(setWeeks)
      .catch((err) => {
        console.error("[TimelineSection] erro:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div id="desevolvimento" className="relative w-full py-20 text-center">
        <p className="text-red-400">Erro: {error}</p>
      </div>
    );
  }

  if (!weeks) {
    return (
      <div id="desevolvimento" className="relative w-full py-20 text-center">
        <p className="text-neutral-400">Carregando timeline...</p>
      </div>
    );
  }

  const data = weeks.map((week) => ({
    title: week.title,
    content: (
      <div>
        <div className="mb-6 text-sm leading-relaxed text-neutral-700 md:text-base dark:text-neutral-300">
          {WEEK_DESCRIPTIONS[week.title] ?? DEFAULT_DESCRIPTION}
        </div>
        <p className="mb-6 text-xs font-medium text-[#58D68D]/80">
          {week.files.length} arquivo{week.files.length !== 1 ? "s" : ""} registrado{week.files.length !== 1 ? "s" : ""}
        </p>
        <TimelineMediaGrid files={week.files} />
      </div>
    ),
  }));

  if (data.length === 0) {
    return (
      <div id="desevolvimento" className="relative w-full py-20 text-center">
        <p className="text-neutral-400">Nenhuma semana encontrada.</p>
      </div>
    );
  }

  return (
    <div id="desevolvimento" className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}