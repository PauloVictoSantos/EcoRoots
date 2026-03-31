"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  description?: string
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  iconGlowColor?: string
  trend?: "up" | "down" | "stable"
  trendValue?: string
  className?: string
}

function AnimatedNumber({ value, className }: { value: number | string; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current !== value) {
      setIsAnimating(true)
      
      const startValue = typeof prevValue.current === 'number' ? prevValue.current : parseFloat(String(prevValue.current)) || 0
      const endValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0
      const duration = 600
      const startTime = Date.now()
      const isDecimal = String(value).includes('.')
      const decimalPlaces = isDecimal ? (String(value).split('.')[1]?.length || 1) : 0

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Bounce easing for more dynamic feel
        const easeOutBack = 1 + 2.70158 * Math.pow(progress - 1, 3) + 1.70158 * Math.pow(progress - 1, 2)
        const currentValue = startValue + (endValue - startValue) * Math.min(easeOutBack, 1)
        
        if (isDecimal) {
          setDisplayValue(currentValue.toFixed(decimalPlaces))
        } else {
          setDisplayValue(Math.round(currentValue))
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setDisplayValue(value)
          setTimeout(() => setIsAnimating(false), 200)
        }
      }

      requestAnimationFrame(animate)
      prevValue.current = value
    }
  }, [value])

  return (
    <span
      className={cn(
        "inline-block transition-transform duration-300",
        isAnimating && "scale-110",
        className
      )}
    >
      {displayValue}
    </span>
  )
}

// 3D Icon component with depth effect
function Icon3D({ 
  icon: Icon, 
  color, 
  bgColor, 
  glowColor,
  isHovered 
}: { 
  icon: LucideIcon
  color: string
  bgColor: string
  glowColor: string
  isHovered: boolean 
}) {
  return (
    <div
      className={cn(
        "relative flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500",
        "transform-gpu perspective-1000",
        isHovered && "scale-110 -rotate-3"
      )}
      style={{
        transform: isHovered ? 'rotateX(-5deg) rotateY(10deg) translateZ(10px)' : 'rotateX(0) rotateY(0)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Shadow layer */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-40 blur-lg transition-all duration-500",
          bgColor
        )}
        style={{
          transform: 'translateZ(-20px) translateY(8px)',
        }}
      />
      
      {/* Main icon container */}
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-2xl transition-all duration-500",
          bgColor
        )}
        style={{
          boxShadow: isHovered 
            ? `0 20px 40px -10px ${glowColor}, 0 0 60px -15px ${glowColor}, inset 0 -4px 10px -5px rgba(0,0,0,0.2), inset 0 4px 10px -5px rgba(255,255,255,0.2)`
            : `0 8px 20px -8px ${glowColor}, inset 0 -2px 5px -3px rgba(0,0,0,0.1)`,
          transform: 'translateZ(0)',
        }}
      >
        {/* Highlight */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-50"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />
        <Icon className={cn("h-8 w-8 relative z-10 transition-all duration-300", color)} />
      </div>
    </div>
  )
}

export function MetricCard({
  title,
  value,
  unit,
  description,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  iconGlowColor = "rgba(93, 214, 44, 0.4)",
  trend,
  trendValue,
  className,
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border bg-card transition-all duration-500",
        "hover:-translate-y-2 hover:shadow-2xl",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(93, 214, 44, 0.12), transparent 60%)`,
        }}
      />

      {/* Border glow effect */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(93, 214, 44, 0.15), transparent 60%)`,
          padding: '1px',
        }}
      />

      <CardContent className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1.5">
              <AnimatedNumber
                value={value}
                className="text-4xl font-bold tracking-tight text-card-foreground"
              />
              {unit && (
                <span className="text-xl font-medium text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1.5 pt-1">
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                    trend === "up" && "bg-amber-500/10 text-amber-500",
                    trend === "down" && "bg-red-500/10 text-red-500",
                    trend === "stable" && "bg-emerald-500/10 text-emerald-500"
                  )}
                >
                  {trend === "up" && "↑"}
                  {trend === "down" && "↓"}
                  {trend === "stable" && "✓"}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend === "up" && "text-amber-500",
                    trend === "down" && "text-red-500",
                    trend === "stable" && "text-emerald-500"
                  )}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          
          <Icon3D
            icon={Icon}
            color={iconColor}
            bgColor={iconBgColor}
            glowColor={iconGlowColor}
            isHovered={isHovered}
          />
        </div>
      </CardContent>
    </Card>
  )
}
