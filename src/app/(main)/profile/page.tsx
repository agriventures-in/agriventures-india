import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { User } from "lucide-react"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProfileView } from "@/components/profile/profile-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your AgriVentures profile.",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile")
  }

  const userId = session.user.id

  // Fetch user data and stats counts in parallel
  const [user, upvoteCount, commentCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        role: true,
        phone: true,
        linkedinUrl: true,
        organization: true,
        bio: true,
        preferredLanguage: true,
        createdAt: true,
        startups: {
          select: {
            id: true,
            name: true,
            slug: true,
            tagline: true,
            status: true,
            techCategory: true,
            stage: true,
          },
          orderBy: { createdAt: "desc" },
        },
        investorProfile: {
          select: {
            firmName: true,
            thesis: true,
            checkSizeMin: true,
            checkSizeMax: true,
            portfolioCount: true,
            websiteUrl: true,
          },
        },
      },
    }),
    prisma.upvote.count({ where: { userId } }),
    prisma.comment.count({ where: { userId } }),
  ])

  if (!user) {
    redirect("/login")
  }

  const profileData = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    stats: {
      upvoteCount,
      commentCount,
      startupCount: user.startups.length,
    },
  }

  return (
    <div>
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 mb-4">
            <User className="h-7 w-7 text-forest" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-forest sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account and view your activity
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto max-w-3xl px-4 py-10">
        <ProfileView profile={profileData} />
      </section>
    </div>
  )
}
