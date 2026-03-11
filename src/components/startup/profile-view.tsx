"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import type { JsonValue } from "@prisma/client/runtime/library"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  ExternalLink,
  Globe,
  MapPin,
  MessageSquare,
  Pencil,
  Users,
  Briefcase,
  Eye,
  FileText,
  Video,
  HandCoins,
  Linkedin,
  Youtube,
  Instagram,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { TECH_CATEGORIES, STARTUP_STAGES, FUNDING_STATUSES } from "@/lib/constants"
import { VerificationBadge } from "@/components/startup/verification-badge"
import { VerificationProgress } from "@/components/startup/verification-progress"
import { UpvoteButton } from "@/components/startup/upvote-button"
import { ImpactMetricsDisplay } from "@/components/startup/impact-metrics-display"
import { TeamGrid } from "@/components/startup/team-grid"
import { IntroRequestDialog } from "@/components/startup/intro-request-dialog"
import { CommentsSection } from "@/components/comments/comments-section"
import { ShareButtons } from "@/components/startup/share-buttons"

type VerificationLevel = "NONE" | "COMMUNITY" | "EXPERT" | "FULL"

interface StartupProfileViewProps {
  startup: {
    id: string
    name: string
    slug: string
    tagline: string
    description: string | null
    logoUrl: string | null
    bannerUrl: string | null
    websiteUrl: string | null
    foundedYear: number | null
    stage: string
    techCategory: string
    subCategories: JsonValue
    state: string | null
    district: string | null
    teamSize: number | null
    fundingStatus: string | null
    fundingAmount: string | null
    problemStatement: string | null
    solution: string | null
    businessModel: string | null
    impactMetrics: JsonValue
    fieldTrialData: JsonValue
    pitchDeckUrl: string | null
    demoVideoUrl: string | null
    galleryUrls: JsonValue
    socialLinks: JsonValue
    verificationLevel: VerificationLevel
    upvoteCount: number
    viewCount: number
    isFeatured: boolean
    createdAt: Date
    founder: {
      id: string
      fullName: string
      avatarUrl: string | null
      email: string
      linkedinUrl: string | null
      organization: string | null
    }
    teamMembers: {
      id: string
      name: string
      role: string
      linkedinUrl: string | null
      avatarUrl: string | null
    }[]
    _count: {
      upvotes: number
      comments: number
      jobs: number
    }
  }
}

export function StartupProfileView({ startup }: StartupProfileViewProps) {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  const isFounder = session?.user?.id === startup.founder.id

  // Track startup view (fire once on mount)
  useEffect(() => {
    fetch(`/api/startups/${startup.id}/view`, { method: "POST" }).catch(() => {
      // Silently fail — view tracking should never block the page
    })
  }, [startup.id])

  const categoryLabel =
    TECH_CATEGORIES.find((c) => c.value === startup.techCategory)?.label ||
    startup.techCategory
  const stageLabel =
    STARTUP_STAGES.find((s) => s.value === startup.stage)?.label || startup.stage
  const fundingLabel =
    FUNDING_STATUSES.find((f) => f.value === startup.fundingStatus)?.label ||
    startup.fundingStatus

  const initials = startup.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const subCategories: string[] = Array.isArray(startup.subCategories)
    ? (startup.subCategories as string[])
    : []

  const impactMetrics: { name: string; value: string; unit: string }[] =
    Array.isArray(startup.impactMetrics) ? (startup.impactMetrics as { name: string; value: string; unit: string }[]) : []

  const fieldTrialData = startup.fieldTrialData as {
    hasTrials?: boolean
    trialDescription?: string
    trialLocation?: string
    sampleSize?: string
    results?: string
  } | null

  const socialLinks = (startup.socialLinks && typeof startup.socialLinks === "object" && !Array.isArray(startup.socialLinks))
    ? (startup.socialLinks as { twitterUrl?: string; linkedinUrl?: string; youtubeUrl?: string; instagramUrl?: string })
    : null

  const hasSocialLinks = socialLinks && (
    socialLinks.twitterUrl || socialLinks.linkedinUrl ||
    socialLinks.youtubeUrl || socialLinks.instagramUrl
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row">
                {/* Logo / Initials */}
                <div className="flex-shrink-0">
                  {startup.logoUrl ? (
                    <Image
                      src={startup.logoUrl}
                      alt={startup.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                      {startup.name}
                    </h1>
                    <VerificationBadge level={startup.verificationLevel} />
                    {startup.isFeatured && (
                      <Badge className="bg-amber-100 text-amber-800">Featured</Badge>
                    )}
                  </div>

                  <p className="text-lg text-muted-foreground">{startup.tagline}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {startup.state && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {startup.district
                          ? `${startup.district}, ${startup.state}`
                          : startup.state}
                      </span>
                    )}
                    {startup.foundedYear && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Founded {startup.foundedYear}
                      </span>
                    )}
                    {startup.teamSize && (
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {startup.teamSize} members
                      </span>
                    )}
                    {startup.websiteUrl && (
                      <a
                        href={startup.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <UpvoteButton
                      startupId={startup.id}
                      initialCount={startup.upvoteCount}
                      size="lg"
                    />
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {startup._count.comments} comments
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {startup.viewCount} views
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                      {isFounder && (
                        <Button asChild size="sm" variant="outline" className="gap-1.5">
                          <Link href={`/dashboard/startups/${startup.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>
                      )}
                      <ShareButtons
                        startupName={startup.name}
                        startupSlug={startup.slug}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden">
              <TabsTrigger value="about" className="shrink-0">About</TabsTrigger>
              <TabsTrigger value="impact" className="shrink-0">Impact</TabsTrigger>
              <TabsTrigger value="evidence" className="shrink-0">Evidence</TabsTrigger>
              <TabsTrigger value="team" className="shrink-0">Team</TabsTrigger>
              <TabsTrigger value="gallery" className="shrink-0">Gallery</TabsTrigger>
              <TabsTrigger value="funding" className="shrink-0">Funding</TabsTrigger>
              <TabsTrigger value="comments" className="shrink-0">
                Comments ({startup._count.comments})
              </TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              {startup.problemStatement && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Problem Statement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                      {startup.problemStatement}
                    </p>
                  </CardContent>
                </Card>
              )}

              {startup.solution && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Our Solution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                      {startup.solution}
                    </p>
                  </CardContent>
                </Card>
              )}

              {startup.businessModel && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Model</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                      {startup.businessModel}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Impact Tab */}
            <TabsContent value="impact">
              {impactMetrics.length > 0 ? (
                <ImpactMetricsDisplay metrics={impactMetrics} />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">
                      No impact metrics have been added yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Evidence Tab */}
            <TabsContent value="evidence" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <VerificationBadge level={startup.verificationLevel} />
                    <span className="text-sm text-muted-foreground">
                      {startup.verificationLevel === "NONE" &&
                        "This startup has not yet been verified."}
                      {startup.verificationLevel === "COMMUNITY" &&
                        "Validated by community upvotes and engagement."}
                      {startup.verificationLevel === "EXPERT" &&
                        "Reviewed and approved by AgriVentures experts."}
                      {startup.verificationLevel === "FULL" &&
                        "Third-party validated with full evidence review."}
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Verification Timeline</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>
                          Submitted on{" "}
                          {new Date(startup.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {startup.verificationLevel !== "NONE" && (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>Verification achieved</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {fieldTrialData?.hasTrials && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Field Trial Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fieldTrialData.trialDescription && (
                      <div>
                        <h4 className="mb-1 text-sm font-medium">Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {fieldTrialData.trialDescription}
                        </p>
                      </div>
                    )}
                    {fieldTrialData.trialLocation && (
                      <div>
                        <h4 className="mb-1 text-sm font-medium">Location</h4>
                        <p className="text-sm text-muted-foreground">
                          {fieldTrialData.trialLocation}
                        </p>
                      </div>
                    )}
                    {fieldTrialData.sampleSize && (
                      <div>
                        <h4 className="mb-1 text-sm font-medium">Sample Size</h4>
                        <p className="text-sm text-muted-foreground">
                          {fieldTrialData.sampleSize}
                        </p>
                      </div>
                    )}
                    {fieldTrialData.results && (
                      <div>
                        <h4 className="mb-1 text-sm font-medium">Results</h4>
                        <p className="text-sm text-muted-foreground">
                          {fieldTrialData.results}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              {startup.teamMembers.length > 0 ? (
                <TeamGrid members={startup.teamMembers} />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">
                      No team members have been added yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {startup.pitchDeckUrl && (
                      <a
                        href={startup.pitchDeckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Pitch Deck</p>
                          <p className="text-xs text-muted-foreground">View presentation</p>
                        </div>
                        <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
                      </a>
                    )}

                    {startup.demoVideoUrl && (
                      <a
                        href={startup.demoVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                          <Video className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Demo Video</p>
                          <p className="text-xs text-muted-foreground">Watch demo</p>
                        </div>
                        <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>

                  {!startup.pitchDeckUrl && !startup.demoVideoUrl && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-muted-foreground">
                        No media has been added yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Funding Tab */}
            <TabsContent value="funding">
              <Card>
                <CardContent className="space-y-6 p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <HandCoins className="h-4 w-4" />
                        Funding Status
                      </div>
                      <p className="text-lg font-semibold">
                        {fundingLabel || "Not disclosed"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        Funding Amount
                      </div>
                      <p className="text-lg font-semibold">
                        {startup.fundingAmount || "Not disclosed"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments">
              <CommentsSection startupId={startup.id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category & Stage */}
          <Card>
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Category
                </p>
                <Badge variant="secondary" className="text-sm">
                  {categoryLabel}
                </Badge>
              </div>

              {subCategories.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Focus Areas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {subCategories.map((sub: string) => (
                      <Badge key={sub} variant="outline" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Stage
                </p>
                <Badge variant="outline" className="text-sm">
                  {stageLabel}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          {hasSocialLinks && (
            <Card>
              <CardContent className="space-y-3 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Social Links
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.twitterUrl && (
                    <a
                      href={socialLinks.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
                      title="Twitter / X"
                    >
                      <svg
                        className="h-4 w-4 text-foreground"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.linkedinUrl && (
                    <a
                      href={socialLinks.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4 text-foreground" />
                    </a>
                  )}
                  {socialLinks.youtubeUrl && (
                    <a
                      href={socialLinks.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
                      title="YouTube"
                    >
                      <Youtube className="h-4 w-4 text-foreground" />
                    </a>
                  )}
                  {socialLinks.instagramUrl && (
                    <a
                      href={socialLinks.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4 text-foreground" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Progress */}
          <VerificationProgress
            currentLevel={startup.verificationLevel}
            upvoteCount={startup.upvoteCount}
          />

          {/* Founder */}
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Founder
              </p>
              <div className="flex items-center gap-3">
                {startup.founder.avatarUrl ? (
                  <Image
                    src={startup.founder.avatarUrl}
                    alt={startup.founder.fullName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {startup.founder.fullName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{startup.founder.fullName}</p>
                  {startup.founder.organization && (
                    <p className="text-xs text-muted-foreground">
                      {startup.founder.organization}
                    </p>
                  )}
                </div>
              </div>
              {startup.founder.linkedinUrl && (
                <a
                  href={startup.founder.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  LinkedIn Profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>

          {/* Request Introduction */}
          {isLoggedIn && !isFounder && (
            <Card>
              <CardContent className="p-5">
                <IntroRequestDialog
                  startupId={startup.id}
                  startupName={startup.name}
                  founderId={startup.founder.id}
                  founderName={startup.founder.fullName}
                />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Connect with the founder through AgriVentures
                </p>
              </CardContent>
            </Card>
          )}

          {/* Jobs */}
          {startup._count.jobs > 0 && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {startup._count.jobs} open position
                    {startup._count.jobs > 1 ? "s" : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
