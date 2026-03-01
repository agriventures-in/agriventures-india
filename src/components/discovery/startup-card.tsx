"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, MessageSquare, Briefcase } from "lucide-react"
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
  viewMode?: "list" | "grid"
}

const CATEGORY_COLORS: Record<string, string> = {
  precision_agriculture: "bg-blue-50 text-blue-700 border-blue-200",
  biotech: "bg-purple-50 text-purple-700 border-purple-200",
  market_linkage: "bg-orange-50 text-orange-700 border-orange-200",
  agri_fintech: "bg-green-50 text-green-700 border-green-200",
  climate_tech: "bg-teal-50 text-teal-700 border-teal-200",
  robotics: "bg-red-50 text-red-700 border-red-200",
  supply_chain: "bg-yellow-50 text-yellow-700 border-yellow-200",
  iot_sensors: "bg-indigo-50 text-indigo-700 border-indigo-200",
  drone_tech: "bg-sky-50 text-sky-700 border-sky-200",
  storage_processing: "bg-amber-50 text-amber-700 border-amber-200",
  animal_husbandry: "bg-pink-50 text-pink-700 border-pink-200",
  aquaculture: "bg-cyan-50 text-cyan-700 border-cyan-200",
}

export function StartupCard({ startup, viewMode = "list" }: StartupCardProps) {
  const categoryLabel =
    TECH_CATEGORIES.find((c) => c.value === startup.techCategory)?.label ||
    startup.techCategory
  const stageLabel =
    STARTUP_STAGES.find((s) => s.value === startup.stage)?.label || startup.stage

  const initial = startup.name.charAt(0).toUpperCase()

  const categoryColor =
    CATEGORY_COLORS[startup.techCategory] || "bg-gray-50 text-gray-700 border-gray-200"

  // Grid view card
  if (viewMode === "grid") {
    return (
      <Link href={`/startups/${startup.slug}`}>
        <Card
          className={cn(
            "group h-full transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-1",
            startup.verificationLevel === "FULL" &&
              "ring-2 ring-emerald/20 shadow-[0_0_20px_rgba(22,163,74,0.1)]"
          )}
        >
          <CardContent className="flex h-full flex-col p-5">
            {/* Top: Logo + Badges */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {startup.logoUrl ? (
                  <Image
                    src={startup.logoUrl}
                    alt={startup.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-xl object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary ring-1 ring-primary/20">
                    {initial}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {startup.name}
                    </h3>
                    <VerificationBadge
                      level={startup.verificationLevel as VerificationLevel}
                    />
                  </div>
                  {startup.state && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {startup.district
                          ? `${startup.district}, ${startup.state}`
                          : startup.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {startup.isFeatured && (
                <Badge className="shrink-0 bg-amber-100 text-amber-800 text-[10px] border-amber-200">
                  Featured
                </Badge>
              )}
            </div>

            {/* Tagline */}
            <p className="mt-3 line-clamp-2 flex-1 text-sm text-muted-foreground leading-relaxed">
              {startup.tagline}
            </p>

            {/* Category + Stage */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${categoryColor}`}
              >
                {categoryLabel}
              </span>
              <Badge variant="outline" className="text-[11px] h-5">
                {stageLabel}
              </Badge>
            </div>

            {/* Bottom: Stats + Upvote */}
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {startup._count.comments}
                </span>
                {startup._count.jobs > 0 && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {startup._count.jobs} jobs
                  </span>
                )}
              </div>
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

  // List view card (improved)
  return (
    <Link href={`/startups/${startup.slug}`}>
      <Card
        className={cn(
          "group transition-all hover:border-primary/30 hover:shadow-md",
          startup.verificationLevel === "FULL" &&
            "ring-2 ring-emerald/20 shadow-[0_0_20px_rgba(22,163,74,0.1)]"
        )}
      >
        <CardContent className="flex gap-4 p-5 sm:p-6">
          {/* Logo / Initial */}
          <div className="flex-shrink-0">
            {startup.logoUrl ? (
              <Image
                src={startup.logoUrl}
                alt={startup.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-xl object-cover ring-1 ring-border"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary ring-1 ring-primary/20">
                {initial}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {startup.name}
              </h3>
              <VerificationBadge
                level={startup.verificationLevel as VerificationLevel}
              />
              {startup.isFeatured && (
                <Badge className="bg-amber-100 text-amber-800 text-xs border-amber-200">
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
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {startup.tagline}
            </p>

            {/* Badges and Stats */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${categoryColor}`}
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
              {startup._count.jobs > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Briefcase className="h-3 w-3" />
                  {startup._count.jobs} jobs
                </span>
              )}
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
