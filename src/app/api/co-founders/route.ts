import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET — list co-founder profiles with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const stage = searchParams.get("stage")
    const commitment = searchParams.get("commitment")
    const state = searchParams.get("state")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1)
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12") || 12))

    const where: Record<string, unknown> = { isActive: true }
    if (category) where.category = category
    if (stage) where.preferredStage = stage
    if (commitment) where.commitment = commitment
    if (state) where.state = state

    const [profiles, total] = await Promise.all([
      prisma.coFounderProfile.findMany({
        where,
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
          startup: { select: { id: true, name: true, slug: true, logoUrl: true, stage: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.coFounderProfile.count({ where }),
    ])

    return NextResponse.json({ profiles, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    console.error("Co-founder list error:", error)
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
  }
}

// POST — create co-founder profile
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has a profile
    const existing = await prisma.coFounderProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (existing) {
      return NextResponse.json({ error: "You already have a co-founder profile" }, { status: 409 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { title, bio, lookingFor, skills, desiredSkills, category, preferredStage, state, commitment, hasStartup, startupId, linkedinUrl } = body

    if (!title || !bio || !lookingFor || !skills?.length || !desiredSkills?.length || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // If startupId provided, verify ownership
    if (startupId) {
      const startup = await prisma.startup.findFirst({
        where: { id: startupId, founderId: session.user.id },
      })
      if (!startup) {
        return NextResponse.json({ error: "Startup not found or not owned by you" }, { status: 403 })
      }
    }

    const profile = await prisma.coFounderProfile.create({
      data: {
        userId: session.user.id,
        title,
        bio,
        lookingFor,
        skills,
        desiredSkills,
        category,
        preferredStage: preferredStage || "IDEATION",
        state: state || null,
        commitment: commitment || "FULL_TIME",
        hasStartup: hasStartup || false,
        startupId: startupId || null,
        linkedinUrl: linkedinUrl || null,
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    })

    return NextResponse.json({ profile }, { status: 201 })
  } catch (error) {
    console.error("Co-founder create error:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
