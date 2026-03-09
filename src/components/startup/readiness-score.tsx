"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface ScoreBreakdown {
  category: string
  label: string
  score: number
  maxScore: number
  tips: string[]
}

interface ReadinessData {
  totalScore: number
  grade: string
  breakdown: ScoreBreakdown[]
}

const GRADE_COLORS: Record<string, string> = {
  "A+": "bg-emerald text-white",
  A: "bg-emerald/80 text-white",
  "B+": "bg-lime text-forest",
  B: "bg-gold text-white",
  "C+": "bg-saffron text-white",
  C: "bg-orange-500 text-white",
  D: "bg-destructive text-white",
}

export function ReadinessScore({ startupId }: { startupId: string }) {
  const [data, setData] = useState<ReadinessData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/startups/readiness?startupId=${startupId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [startupId])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-emerald" />
            Investor Readiness Score
          </CardTitle>
          <Badge className={`text-lg font-bold ${GRADE_COLORS[data.grade] || "bg-muted"}`}>
            {data.grade}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Overall score */}
        <div>
          <div className="mb-1 flex items-end justify-between">
            <span className="text-3xl font-bold text-foreground">{data.totalScore}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <Progress value={data.totalScore} className="h-3" />
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          {data.breakdown.map((b) => (
            <div key={b.category}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{b.label}</span>
                <span className="text-muted-foreground">{b.score}/{b.maxScore}</span>
              </div>
              <Progress value={(b.score / b.maxScore) * 100} className="h-2" />
              {b.tips.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  {b.tips.map((tip) => (
                    <p key={tip} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                      {tip}
                    </p>
                  ))}
                </div>
              )}
              {b.tips.length === 0 && (
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald">
                  <CheckCircle2 className="h-3 w-3" /> Complete
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
