import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StartupProfileView } from "@/components/startup/profile-view"
import { TECH_CATEGORIES, STARTUP_STAGES } from "@/lib/constants"

interface StartupPageProps {
  params: { slug: string }
}

async function getStartup(slug: string) {
  const startup = await prisma.startup.findUnique({
    where: { slug },
    include: {
      founder: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          email: true,
          linkedinUrl: true,
          organization: true,
        },
      },
      teamMembers: true,
      _count: {
        select: {
          upvotes: true,
          comments: true,
          jobs: true,
        },
      },
    },
  })

  return startup
}

export async function generateMetadata({
  params,
}: StartupPageProps): Promise<Metadata> {
  const startup = await getStartup(params.slug)

  if (!startup) {
    return { title: "Startup Not Found" }
  }

  const categoryLabel =
    TECH_CATEGORIES.find((c) => c.value === startup.techCategory)?.label ||
    startup.techCategory
  const stageLabel =
    STARTUP_STAGES.find((s) => s.value === startup.stage)?.label ||
    startup.stage

  const ogUrl = new URL(
    "/api/og",
    process.env.NEXTAUTH_URL || "https://agriventures.in"
  )
  ogUrl.searchParams.set("title", startup.name)
  ogUrl.searchParams.set("tagline", startup.tagline)
  ogUrl.searchParams.set("category", categoryLabel)
  ogUrl.searchParams.set("stage", stageLabel)
  if (startup.state) {
    ogUrl.searchParams.set(
      "location",
      startup.district
        ? `${startup.district}, ${startup.state}`
        : startup.state
    )
  }
  ogUrl.searchParams.set("upvotes", String(startup.upvoteCount))
  ogUrl.searchParams.set("views", String(startup.viewCount))
  if (startup.verificationLevel !== "NONE") {
    ogUrl.searchParams.set("verified", "true")
  }

  return {
    title: startup.name,
    description: startup.tagline,
    openGraph: {
      title: `${startup.name} | AgriVentures India`,
      description: startup.tagline,
      type: "website",
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${startup.name} | AgriVentures India`,
      description: startup.tagline,
      images: [ogUrl.toString()],
    },
    keywords: [
      startup.name,
      categoryLabel,
      "agritech",
      "India",
      startup.state || "",
    ].filter(Boolean),
  }
}

export default async function StartupPage({ params }: StartupPageProps) {
  const startup = await getStartup(params.slug)

  if (!startup) {
    notFound()
  }

  // View tracking is handled client-side via useEffect in StartupProfileView
  // which calls POST /api/startups/[id]/view (creates StartupView record + increments viewCount)

  return (
    <div className="min-h-screen bg-background">
      <StartupProfileView startup={startup} />
    </div>
  )
}
