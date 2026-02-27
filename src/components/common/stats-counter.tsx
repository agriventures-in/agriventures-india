"use client"

import { cn } from "@/lib/utils"

interface StatsCounterProps {
  value: string | number
  label: string
  className?: string
}

export function StatsCounter({ value, label, className }: StatsCounterProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <span className="text-3xl font-bold tracking-tight md:text-4xl">
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
