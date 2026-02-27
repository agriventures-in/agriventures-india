"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface ImpactMetric {
  name: string
  value: string
  unit: string
  verified?: boolean
}

interface ImpactMetricsDisplayProps {
  metrics: ImpactMetric[]
}

export function ImpactMetricsDisplay({ metrics }: ImpactMetricsDisplayProps) {
  if (!metrics || metrics.length === 0) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.name}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
              </div>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  metric.verified
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            {metric.verified && (
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Verified metric
              </div>
            )}
          </CardContent>
          {/* Decorative gradient */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/60 to-primary/20" />
        </Card>
      ))}
    </div>
  )
}
