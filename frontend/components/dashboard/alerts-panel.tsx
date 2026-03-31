"use client"

import { AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { GreenhouseData } from "@/hooks/use-realtime-data"

interface AlertItem {
  id: string
  type: "critical" | "warning" | "info"
  message: string
  time: string
  sensor: string
}

function buildAlerts(data: GreenhouseData): AlertItem[] {
  const alerts: AlertItem[] = []
  const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  if (data.temperature > 35)
    alerts.push({ id: "tc", type: "critical", message: "Temperatura crítica — risco de queima", time, sensor: "Temperatura" })
  else if (data.temperature > 30)
    alerts.push({ id: "tw", type: "warning", message: "Temperatura acima do ideal", time, sensor: "Temperatura" })

  if (data.soilMoisture < 20)
    alerts.push({ id: "sc", type: "critical", message: "Solo muito seco — irrigar imediatamente", time, sensor: "Solo" })
  else if (data.soilMoisture < 35)
    alerts.push({ id: "sw", type: "warning", message: "Solo precisa de irrigação em breve", time, sensor: "Solo" })

  if (data.humidity < 40)
    alerts.push({ id: "hw", type: "warning", message: "Umidade do ar baixa", time, sensor: "Umidade Ar" })

  if (data.waterLevel < 20)
    alerts.push({ id: "wc", type: "critical", message: "Reservatório quase vazio", time, sensor: "Reservatório" })
  else if (data.waterLevel < 40)
    alerts.push({ id: "ww", type: "warning", message: "Reservatório abaixo de 40%", time, sensor: "Reservatório" })

  return alerts
}

const badgeCls: Record<AlertItem["type"], string> = {
  critical: "border-red-500/30 text-red-500",
  warning:  "border-yellow-500/30 text-yellow-500",
  info:     "border-blue-500/30 text-blue-500",
}

const badgeLabel: Record<AlertItem["type"], string> = {
  critical: "Crítico",
  warning:  "Atenção",
  info:     "Info",
}

export function AlertsPanel({ data }: { data: GreenhouseData }) {
  const alerts = buildAlerts(data)
  const hasCritical = alerts.some((a) => a.type === "critical")

  return (
    <div className="space-y-4">
      {/* ── Top banner ── */}
      {hasCritical ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Atenção Imediata</AlertTitle>
          <AlertDescription>
            {alerts.filter((a) => a.type === "critical").length} alerta(s) crítico(s) detectado(s).
          </AlertDescription>
        </Alert>
      ) : alerts.length > 0 ? (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Avisos Ativos</AlertTitle>
          <AlertDescription>{alerts.length} aviso(s) requer(em) atenção.</AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-green-500/30 bg-green-500/5">
          <CheckCircle className="size-4 text-green-500" />
          <AlertTitle className="text-green-600 dark:text-green-400">Tudo normal</AlertTitle>
          <AlertDescription>Nenhum alerta ativo no momento.</AlertDescription>
        </Alert>
      )}

      {/* ── Alerts table ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            Registro de Alertas
            <Badge variant="secondary">{alerts.length} ativo(s)</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">Nenhum alerta ativo</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Sensor</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead className="text-right">Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge variant="outline" className={badgeCls[alert.type]}>
                        {badgeLabel[alert.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{alert.sensor}</TableCell>
                    <TableCell className="text-sm">{alert.message}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs tabular-nums">
                      {alert.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
