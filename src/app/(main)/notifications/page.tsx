"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
  Bell,
  CheckCheck,
  Rocket,
  ShieldCheck,
  UserPlus,
  MessageSquare,
  Info,
  Loader2,
  ThumbsUp,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  metadata: Record<string, string> | null
  createdAt: string
}

interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
  total: number
  page: number
  totalPages: number
}

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  welcome: UserPlus,
  startup_submitted: Rocket,
  startup_verified: ShieldCheck,
  verification_approved: ShieldCheck,
  verification_rejected: ShieldCheck,
  verification_update: ShieldCheck,
  intro_request: MessageSquare,
  intro_response: MessageSquare,
  new_upvote: ThumbsUp,
  new_comment: MessageSquare,
}

const NOTIFICATION_COLORS: Record<string, string> = {
  welcome: "bg-emerald-100 text-emerald-700",
  startup_submitted: "bg-blue-100 text-blue-700",
  startup_verified: "bg-green-100 text-green-700",
  verification_approved: "bg-green-100 text-green-700",
  verification_rejected: "bg-red-100 text-red-700",
  intro_request: "bg-purple-100 text-purple-700",
  intro_response: "bg-purple-100 text-purple-700",
  new_upvote: "bg-amber-100 text-amber-700",
  new_comment: "bg-sky-100 text-sky-700",
}

function getNotificationLink(notification: Notification): string | null {
  const meta = notification.metadata
  switch (notification.type) {
    case "startup_submitted":
    case "startup_verified":
    case "verification_approved":
    case "verification_rejected":
    case "verification_update":
      return meta?.startupSlug ? `/startups/${meta.startupSlug}` : meta?.startupId ? `/dashboard` : null
    case "new_upvote":
    case "new_comment":
      return meta?.startupSlug ? `/startups/${meta.startupSlug}` : null
    case "intro_request":
    case "intro_response":
      return "/intros"
    case "welcome":
      return "/discover"
    default:
      return null
  }
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchNotifications = useCallback(
    async (pageNum: number, append = false) => {
      if (append) setIsLoadingMore(true)
      else setIsLoading(true)

      try {
        const res = await fetch(`/api/notifications?page=${pageNum}&limit=20`)
        if (!res.ok) return
        const data: NotificationsResponse = await res.json()

        if (append) {
          setNotifications((prev) => [...prev, ...data.notifications])
        } else {
          setNotifications(data.notifications)
        }
        setUnreadCount(data.unreadCount)
        setTotal(data.total)
        setPage(data.page)
        setTotalPages(data.totalPages)
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchNotifications(1)
  }, [fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
      if (!res.ok) return
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // Silently fail
    }
  }

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", { method: "PATCH" })
      if (!res.ok) return
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {
      // Silently fail
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    const link = getNotificationLink(notification)
    if (link) {
      router.push(link)
    }
  }

  const getIcon = (type: string) => {
    const Icon = NOTIFICATION_ICONS[type] || Info
    return Icon
  }

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Notifications
            </h1>
            <p className="mt-1 text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <h2 className="text-lg font-semibold text-foreground">
                No notifications yet
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                When you get upvotes, comments, or intro requests, they&apos;ll show up here.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/discover")}
              >
                Explore Startups
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type)
              const link = getNotificationLink(notification)
              const colorClass = NOTIFICATION_COLORS[notification.type] || "bg-gray-100 text-gray-700"

              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all hover:shadow-md ${
                    !notification.isRead
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-border bg-card hover:bg-accent/30"
                  } ${link ? "cursor-pointer" : "cursor-default"}`}
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm leading-tight ${
                          !notification.isRead
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground/80"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        {!notification.isRead && (
                          <Badge variant="default" className="bg-emerald-500 text-[10px] px-1.5 py-0">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground/60">
                        {formatTime(notification.createdAt)}
                      </span>
                      {link && (
                        <span className="flex items-center gap-1 text-xs font-medium text-primary">
                          View details
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}

            {/* Load More */}
            {page < totalPages && (
              <>
                <Separator className="my-4" />
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNotifications(page + 1, true)}
                    disabled={isLoadingMore}
                    className="min-w-[200px]"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      `Load More (${total - notifications.length} remaining)`
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
