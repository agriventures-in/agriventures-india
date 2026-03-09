import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CoFounderDetail } from "@/components/cofounder/cofounder-detail"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const profile = await prisma.coFounderProfile.findUnique({
    where: { id: params.id },
    include: { user: { select: { fullName: true } } },
  })

  if (!profile) return { title: "Not Found" }

  return {
    title: `${profile.title} — ${profile.user.fullName} | AgriVentures India`,
    description: profile.lookingFor.slice(0, 160),
  }
}

export default async function CoFounderDetailPage({ params }: { params: { id: string } }) {
  const profile = await prisma.coFounderProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, fullName: true, avatarUrl: true, role: true, bio: true, linkedinUrl: true, organization: true } },
      startup: { select: { id: true, name: true, slug: true, logoUrl: true, tagline: true, stage: true, techCategory: true } },
    },
  })

  if (!profile) notFound()

  // Get match suggestions
  const otherProfiles = await prisma.coFounderProfile.findMany({
    where: { isActive: true, id: { not: profile.id } },
    include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
    take: 50,
  })

  const profileSkills = (profile.skills as string[]) || []
  const profileDesired = (profile.desiredSkills as string[]) || []

  const matches = otherProfiles
    .map((other) => {
      const otherSkills = (other.skills as string[]) || []
      const otherDesired = (other.desiredSkills as string[]) || []
      const theyMatchMe = profileDesired.filter((s) => otherSkills.some((os) => os.toLowerCase() === s.toLowerCase())).length
      const iMatchThem = otherDesired.filter((s) => profileSkills.some((ms) => ms.toLowerCase() === s.toLowerCase())).length
      const categoryMatch = other.category === profile.category ? 2 : 0
      const score = theyMatchMe * 3 + iMatchThem * 2 + categoryMatch
      return { profile: other, score }
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((m) => m.profile)

  return (
    <div className="container mx-auto px-4 py-10">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CoFounderDetail profile={JSON.parse(JSON.stringify(profile)) as any} matches={JSON.parse(JSON.stringify(matches)) as any} />
    </div>
  )
}
