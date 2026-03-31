"use client"

import { useState } from "react"
import { Droplets, PowerOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

interface IrrigationDialogProps {
  isActive: boolean
  onToggle: () => void
  waterLevel: number
}

export function IrrigationDialog({ isActive, onToggle, waterLevel }: IrrigationDialogProps) {
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)

  const lowWater = waterLevel < 20 && !isActive

  async function handleConfirm() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    onToggle()
    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isActive ? "destructive" : "default"}
          size="sm"
          className="gap-2"
        >
          {isActive ? <PowerOff className="size-4" /> : <Droplets className="size-4" />}
          {isActive ? "Desligar Irrigação" : "Ligar Irrigação"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="size-5 text-blue-500" />
            {isActive ? "Desligar Irrigação" : "Ligar Irrigação"}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? "Confirme para desligar o sistema de irrigação automática."
              : "Confirme para acionar o sistema de irrigação."}
          </DialogDescription>
        </DialogHeader>

        {/* Status summary */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status atual</span>
            <Badge
              variant="outline"
              className={isActive ? "text-blue-500 border-blue-500/30" : "text-muted-foreground"}
            >
              {isActive ? "Ativa" : "Inativa"}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Reservatório</span>
            <Badge
              variant="outline"
              className={
                waterLevel < 20 ? "text-red-500 border-red-500/30"    :
                waterLevel < 40 ? "text-yellow-500 border-yellow-500/30" :
                "text-green-500 border-green-500/30"
              }
            >
              {waterLevel.toFixed(0)}%
            </Badge>
          </div>
          {lowWater && (
            <p className="text-xs text-red-500 bg-red-500/5 rounded-md p-2 border border-red-500/20">
              ⚠ Nível do reservatório crítico. Abasteça antes de irrigar.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={loading || lowWater}
            className="gap-2"
          >
            {loading && <Spinner className="size-4" />}
            {isActive ? "Desligar" : "Ligar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
