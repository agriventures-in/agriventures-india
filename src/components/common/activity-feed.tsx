"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, ThumbsUp, MessageSquare, Rocket, Eye, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type: "upvote" | "comment" | "startup" | "view"
  user: { fullName: string; avatarUrl: string | null }
  startup: { name: string; slug: string }
  createdAt: string
  content?: string
}

const ACTIVITY_CONFIG = {
  upvote: { icon: ThumbsUp, color: "text-emerald", verb: "upvoted" },
  comment: { icon: MessageSquare, color: "text-blue-500", verb: "commented on" },
  startup: { icon: Rocket, color: "text-gold", verb: "submitted" },
  view: { icon: Eye, color: "text-muted-foreground", verb: "viewed" },
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then((data) => setActivities(data.activities || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No recent activity yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-emerald" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 divide-y p-0 px-6 pb-4">
        {activities.map((activity) => {
          const config = ACTIVITY_CONFIG[activity.type]
          const Icon = config.icon
          return (
            <div key={activity.id} className="flex items-start gap-3 py-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={activity.user.avatarUrl || undefined} />
                <AvatarFallback className="bg-forest/10 text-xs text-forest">
                  {activity.user.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.fullName}</span>{" "}
                  <span className="text-muted-foreground">{config.verb}</span>{" "}
                  <Link href={`/startups/${activity.startup.slug}`} className="font-medium text-emerald hover:underline">
                    {activity.startup.name}
                  </Link>
                </p>
                {activity.content && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">&quot;{activity.content}&quot;</p>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
              <Icon className={`mt-1 h-4 w-4 shrink-0 ${config.color}`} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
