"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { UserPlus, Rocket, ShieldCheck } from "lucide-react"

interface ActivityItem {
  type: "user" | "startup" | "verification"
  description: string
  timestamp: string
}

const ICON_MAP = {
  user: UserPlus,
  startup: Rocket,
  verification: ShieldCheck,
}

const COLOR_MAP = {
  user: "bg-blue-100 text-blue-600",
  startup: "bg-emerald-100 text-emerald-600",
  verification: "bg-amber-100 text-amber-600",
}

function formatRelativeTime(timestamp: string) {
  const now = new Date()
  const date = new Date(timestamp)
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  })
}

export function ActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/admin/analytics")
        if (!res.ok) throw new Error("Failed to load activity")
        const json = await res.json()
        setActivities(json.recentActivity || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-sm text-slate-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Platform Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity.</p>
        ) : (
          <div className="relative space-y-0">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 h-full w-px bg-slate-200" />

            {activities.map((activity, idx) => {
              const Icon = ICON_MAP[activity.type]
              const colorClass = COLOR_MAP[activity.type]

              return (
                <div
                  key={idx}
                  className="relative flex items-start gap-3 py-3"
                >
                  {/* Icon circle */}
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      {activity.description}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
