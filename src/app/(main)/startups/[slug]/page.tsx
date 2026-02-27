import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StartupProfileView } from "@/components/startup/profile-view"
import { TECH_CATEGORIES } from "@/lib/constants"

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

  return {
    title: startup.name,
    description: startup.tagline,
    openGraph: {
      title: `${startup.name} | AgriVentures India`,
      description: startup.tagline,
      type: "website",
      images: startup.logoUrl ? [{ url: startup.logoUrl }] : [],
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

  // Increment view count (fire and forget)
  prisma.startup
    .update({
      where: { id: startup.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {
      // Silently ignore errors for view count increment
    })

  return (
    <div className="min-h-screen bg-background">
      <StartupProfileView startup={startup} />
    </div>
  )
}
