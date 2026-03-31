"use client"

import { Wifi, WifiOff, Server, Brain, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { ConnectionStatus as ConnStatus } from "@/hooks/use-realtime-data"

interface ConnectionStatusProps {
  connStatus: ConnStatus
  lastUpdate: Date | null
}

export function ConnectionStatus({ connStatus, lastUpdate }: ConnectionStatusProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`gap-1 ${connStatus.socket ? "border-green-500/30 text-green-500" : "border-red-500/30 text-red-500"}`}
          >
            {connStatus.socket ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
            Socket.IO
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>WebSocket: {connStatus.socket ? "Conectado" : "Desconectado"}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`gap-1 ${connStatus.backend ? "border-green-500/30 text-green-500" : "text-muted-foreground"}`}
          >
            <Server className="size-3" />
            Node.js
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Backend :3000 — {connStatus.backend ? "Online" : "Offline"}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`gap-1 ${connStatus.pythonAi ? "border-green-500/30 text-green-500" : "text-muted-foreground"}`}
          >
            <Brain className="size-3" />
            Python AI
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI Service :8000 — {connStatus.pythonAi ? "Online" : "Offline"}</p>
        </TooltipContent>
      </Tooltip>

      {lastUpdate && (
        <Badge variant="outline" className="text-muted-foreground gap-1">
          <Clock className="size-3" />
          {lastUpdate.toLocaleTimeString("pt-BR")}
        </Badge>
      )}
    </div>
  )
}
