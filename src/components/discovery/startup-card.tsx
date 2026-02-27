"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { TECH_CATEGORIES, STARTUP_STAGES } from "@/lib/constants"
import { VerificationBadge } from "@/components/startup/verification-badge"
import { UpvoteButton } from "@/components/startup/upvote-button"

type VerificationLevel = "NONE" | "COMMUNITY" | "EXPERT" | "FULL"

interface StartupCardProps {
  startup: {
    id: string
    name: string
    slug: string
    tagline: string
    logoUrl: string | null
    techCategory: string
    stage: string
    state: string | null
    district: string | null
    verificationLevel: string
    upvoteCount: number
    isFeatured: boolean
    founder: {
      fullName: string
      avatarUrl: string | null
    }
    _count: {
      upvotes: number
      comments: number
      jobs: number
    }
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  precision_agriculture: "bg-blue-100 text-blue-800",
  biotech: "bg-purple-100 text-purple-800",
  market_linkage: "bg-orange-100 text-orange-800",
  agri_fintech: "bg-green-100 text-green-800",
  climate_tech: "bg-teal-100 text-teal-800",
  robotics: "bg-red-100 text-red-800",
  supply_chain: "bg-yellow-100 text-yellow-800",
  iot_sensors: "bg-indigo-100 text-indigo-800",
  drone_tech: "bg-sky-100 text-sky-800",
  storage_processing: "bg-amber-100 text-amber-800",
  animal_husbandry: "bg-pink-100 text-pink-800",
  aquaculture: "bg-cyan-100 text-cyan-800",
}

export function StartupCard({ startup }: StartupCardProps) {
  const categoryLabel =
    TECH_CATEGORIES.find((c) => c.value === startup.techCategory)?.label ||
    startup.techCategory
  const stageLabel =
    STARTUP_STAGES.find((s) => s.value === startup.stage)?.label || startup.stage

  const initial = startup.name.charAt(0).toUpperCase()

  const categoryColor =
    CATEGORY_COLORS[startup.techCategory] || "bg-gray-100 text-gray-800"

  return (
    <Link href={`/startups/${startup.slug}`}>
      <Card
        className={cn(
          "transition-all hover:border-primary/30 hover:shadow-md",
          startup.verificationLevel === "FULL" &&
            "ring-2 ring-emerald/30 shadow-[0_0_15px_rgba(22,163,74,0.15)]"
        )}
      >
        <CardContent className="flex gap-4 p-5">
          {/* Logo / Initial */}
          <div className="flex-shrink-0">
            {startup.logoUrl ? (
              <img
                src={startup.logoUrl}
                alt={startup.name}
                className="h-14 w-14 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
                {initial}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">
                {startup.name}
              </h3>
              <VerificationBadge
                level={startup.verificationLevel as VerificationLevel}
              />
              {startup.isFeatured && (
                <Badge className="bg-amber-100 text-amber-800 text-xs">
                  Featured
                </Badge>
              )}
            </div>

            {/* Location */}
            {startup.state && (
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {startup.district
                  ? `${startup.district}, ${startup.state}`
                  : startup.state}
              </div>
            )}

            {/* Tagline */}
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
              {startup.tagline}
            </p>

            {/* Badges and Comments */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${categoryColor}`}
              >
                {categoryLabel}
              </span>
              <Badge variant="outline" className="text-xs">
                {stageLabel}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                {startup._count.comments}
              </span>
            </div>
          </div>

          {/* Upvote Button */}
          <div className="flex flex-shrink-0 items-start">
            <UpvoteButton
              startupId={startup.id}
              initialCount={startup.upvoteCount}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
