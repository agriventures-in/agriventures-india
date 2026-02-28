"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageSquare, ThumbsUp, Handshake, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { timeAgo } from "@/lib/utils"

interface ActivityItem {
  type: "comment" | "upvote" | "intro_sent"
  id: string
  createdAt: string
  startup: { name: string; slug: string }
  content?: string
  status?: string
}

const ACTIVITY_CONFIG = {
  comment: {
    icon: MessageSquare,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    label: "You commented on",
  },
  upvote: {
    icon: ThumbsUp,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-100",
    label: "You upvoted",
  },
  intro_sent: {
    icon: Handshake,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100",
    label: "You requested intro to",
  },
} as const

const INTRO_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700 border-amber-200" },
  ACCEPTED: { label: "Accepted", className: "bg-green-100 text-green-700 border-green-200" },
  DECLINED: { label: "Declined", className: "bg-red-100 text-red-700 border-red-200" },
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/users/me/activity")
        if (res.ok) {
          const data = await res.json()
          setActivities(data.activities ?? [])
        }
      } catch {
        // Silently fail — the feed is non-critical
      } finally {
        setIsLoading(false)
      }
    }
    fetchActivity()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center">
            <Activity className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">
              No activity yet
            </p>
            <p className="text-xs text-muted-foreground/70">
              Your comments, upvotes, and intro requests will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((activity) => {
              const config = ACTIVITY_CONFIG[activity.type]
              const Icon = config.icon
              return (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
                  >
                    <Icon className={`h-4 w-4 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      {config.label}{" "}
                      <Link
                        href={`/startups/${activity.startup.slug}`}
                        className="font-medium text-emerald hover:underline"
                      >
                        {activity.startup.name}
                      </Link>
                      {activity.type === "intro_sent" && activity.status && (
                        <Badge
                          variant="outline"
                          className={`ml-1.5 text-[10px] ${INTRO_STATUS_CONFIG[activity.status]?.className ?? ""}`}
                        >
                          {INTRO_STATUS_CONFIG[activity.status]?.label ?? activity.status}
                        </Badge>
                      )}
                    </p>
                    {activity.type === "comment" && activity.content && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        &ldquo;{activity.content}&rdquo;
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground/70">
                      {timeAgo(activity.createdAt)}
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
