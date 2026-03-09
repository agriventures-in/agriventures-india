export const dynamic = "force-dynamic"

import { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import {
  Building2,
  Eye,
  MessageSquare,
  Pencil,
  Plus,
  ThumbsUp,
} from "lucide-react"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ReadinessScore } from "@/components/startup/readiness-score"
import { ActivityFeed } from "@/components/common/activity-feed"

export const metadata: Metadata = {
  title: "My Startups",
  description: "Manage your startups on AgriVentures India.",
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  SUBMITTED: {
    label: "Submitted",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  VERIFIED: {
    label: "Verified",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
}

export default async function MyStartupsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/startups")
  }

  if (session.user.role !== "FOUNDER" && session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const startups = await prisma.startup.findMany({
    where: { founderId: session.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      logoUrl: true,
      status: true,
      stage: true,
      techCategory: true,
      upvoteCount: true,
      viewCount: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Startups</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your startup listings
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/startups/submit" className="gap-2">
            <Plus className="h-4 w-4" />
            Submit New
          </Link>
        </Button>
      </div>

      {/* Startups Grid */}
      {startups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              No startups yet
            </h2>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              You haven&apos;t submitted any startups. Get started by listing
              your agritech venture on AgriVentures India.
            </p>
            <Button asChild>
              <Link href="/startups/submit" className="gap-2">
                <Plus className="h-4 w-4" />
                Submit Your Startup
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {startups.map((startup) => {
            const statusStyle = STATUS_STYLES[startup.status] || STATUS_STYLES.DRAFT
            const initials = startup.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()

            return (
              <Card key={startup.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Logo / Initials */}
                    {startup.logoUrl ? (
                      <Image
                        src={startup.logoUrl}
                        alt={startup.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {initials}
                      </div>
                    )}

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h3 className="truncate font-semibold text-foreground">
                          {startup.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={statusStyle.className}
                        >
                          {statusStyle.label}
                        </Badge>
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {startup.tagline}
                      </p>

                      {/* Stats Row */}
                      <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {startup.upvoteCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {startup.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {startup._count.comments}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link
                            href={`/dashboard/startups/${startup.id}/edit`}
                            className="gap-1.5"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link
                            href={`/startups/${startup.slug}`}
                            className="gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Readiness Scores + Activity Feed */}
      {startups.length > 0 && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Investor Readiness</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {startups.map((startup) => (
                <div key={`readiness-${startup.id}`}>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">{startup.name}</p>
                  <ReadinessScore startupId={startup.id} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Platform Activity</h2>
            <ActivityFeed />
          </div>
        </div>
      )}
    </div>
  )
}
