import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET — single profile
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await prisma.coFounderProfile.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true, role: true, bio: true, linkedinUrl: true, organization: true } },
        startup: { select: { id: true, name: true, slug: true, logoUrl: true, tagline: true, stage: true, techCategory: true } },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Compute match suggestions (profiles with overlapping skills)
    const otherProfiles = await prisma.coFounderProfile.findMany({
      where: {
        isActive: true,
        id: { not: profile.id },
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      take: 50,
    })

    // Score matches: overlap between this profile's desiredSkills and other's skills + vice versa
    const profileSkills = (profile.skills as string[]) || []
    const profileDesired = (profile.desiredSkills as string[]) || []

    const matches = otherProfiles
      .map((other) => {
        const otherSkills = (other.skills as string[]) || []
        const otherDesired = (other.desiredSkills as string[]) || []

        // How well does the other person match what I'm looking for?
        const theyMatchMe = profileDesired.filter((s) =>
          otherSkills.some((os) => os.toLowerCase() === s.toLowerCase())
        ).length

        // How well do I match what they're looking for?
        const iMatchThem = otherDesired.filter((s) =>
          profileSkills.some((ms) => ms.toLowerCase() === s.toLowerCase())
        ).length

        // Bonus for same category
        const categoryMatch = other.category === profile.category ? 2 : 0

        // Bonus for complementary commitment
        const commitmentMatch = other.commitment === profile.commitment ? 1 : 0

        const score = theyMatchMe * 3 + iMatchThem * 2 + categoryMatch + commitmentMatch

        return { profile: other, score }
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((m) => m.profile)

    return NextResponse.json({ profile, matches })
  } catch (error) {
    console.error("Co-founder get error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

// PUT — update profile (owner only)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = await prisma.coFounderProfile.findUnique({
      where: { id: params.id },
    })

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const profile = await prisma.coFounderProfile.update({
      where: { id: params.id },
      data: {
        title: body.title,
        bio: body.bio,
        lookingFor: body.lookingFor,
        skills: body.skills,
        desiredSkills: body.desiredSkills,
        category: body.category,
        preferredStage: body.preferredStage,
        state: body.state || null,
        commitment: body.commitment,
        hasStartup: body.hasStartup,
        startupId: body.startupId || null,
        linkedinUrl: body.linkedinUrl || null,
        isActive: body.isActive ?? true,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Co-founder update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

// DELETE — remove profile (owner only)
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = await prisma.coFounderProfile.findUnique({
      where: { id: params.id },
    })

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
    }

    await prisma.coFounderProfile.delete({ where: { id: params.id } })

    return NextResponse.json({ message: "Profile deleted" })
  } catch (error) {
    console.error("Co-founder delete error:", error)
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 })
  }
}
