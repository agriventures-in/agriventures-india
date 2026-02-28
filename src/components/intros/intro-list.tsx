"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle2, XCircle, Building2, User, Rocket } from "lucide-react"

interface IntroRequestItem {
  id: string
  message: string
  status: "PENDING" | "ACCEPTED" | "DECLINED"
  responseNote?: string | null
  createdAt: string
  respondedAt?: string | null
  startup: {
    id: string
    name: string
    slug?: string
  }
  fromUser?: {
    id: string
    fullName: string
    email?: string
    organization?: string | null
    avatarUrl?: string | null
  }
  toUser?: {
    id: string
    fullName: string
    organization?: string | null
    avatarUrl?: string | null
  }
}

interface IntroListProps {
  intros: IntroRequestItem[]
  perspective: "sent" | "received"
  onIntroClick?: (intro: IntroRequestItem) => void
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    variant: "outline" as const,
    className: "border-yellow-500 bg-yellow-50 text-yellow-700",
    icon: Clock,
  },
  ACCEPTED: {
    label: "Accepted",
    variant: "outline" as const,
    className: "border-green-500 bg-green-50 text-green-700",
    icon: CheckCircle2,
  },
  DECLINED: {
    label: "Declined",
    variant: "outline" as const,
    className: "border-red-500 bg-red-50 text-red-700",
    icon: XCircle,
  },
}

export function IntroList({ intros, perspective, onIntroClick }: IntroListProps) {
  if (intros.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            {perspective === "sent"
              ? "You haven't sent any introduction requests yet."
              : "You haven't received any introduction requests yet."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {intros.map((intro) => {
        const config = statusConfig[intro.status]
        const StatusIcon = config.icon
        const otherPerson =
          perspective === "sent" ? intro.toUser : intro.fromUser

        return (
          <Card
            key={intro.id}
            className={`transition-colors ${
              perspective === "received" && intro.status === "PENDING"
                ? "cursor-pointer hover:border-primary/50"
                : ""
            }`}
            onClick={() => {
              if (perspective === "received" && intro.status === "PENDING" && onIntroClick) {
                onIntroClick(intro)
              }
            }}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-2">
                  {/* Startup name */}
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">
                      {intro.startup.name}
                    </span>
                  </div>

                  {/* Other person */}
                  {otherPerson && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {otherPerson.fullName}
                      </span>
                      {otherPerson.organization && (
                        <>
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {otherPerson.organization}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Message preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {intro.message}
                  </p>

                  {/* Response note if present */}
                  {intro.responseNote && (
                    <div className="rounded-md border bg-muted/50 px-3 py-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Response note:
                      </p>
                      <p className="text-sm text-foreground">
                        {intro.responseNote}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end">
                  <Badge variant={config.variant} className={config.className}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(intro.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
