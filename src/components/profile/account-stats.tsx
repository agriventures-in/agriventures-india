"use client"

import { CalendarDays, ThumbsUp, MessageSquare, Rocket } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

interface AccountStatsProps {
  memberSince: string
  upvoteCount: number
  commentCount: number
  startupCount?: number
}

export function AccountStats({
  memberSince,
  upvoteCount,
  commentCount,
  startupCount,
}: AccountStatsProps) {
  const stats = [
    {
      label: "Member since",
      value: formatDate(memberSince),
      icon: CalendarDays,
      iconColor: "text-forest",
      bgColor: "bg-forest/10",
    },
    {
      label: "Upvotes given",
      value: upvoteCount.toString(),
      icon: ThumbsUp,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "Comments",
      value: commentCount.toString(),
      icon: MessageSquare,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  if (startupCount !== undefined) {
    stats.push({
      label: "Startups submitted",
      value: startupCount.toString(),
      icon: Rocket,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100",
    })
  }

  return (
    <div className={`grid gap-4 ${stats.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bgColor}`}
              >
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground leading-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
