import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET — list campus scouts (leaderboard)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const state = searchParams.get("state")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1)
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20") || 20))

    const where: Record<string, unknown> = { status: "ACTIVE" }
    if (state) where.state = state

    const [scouts, total] = await Promise.all([
      prisma.campusScout.findMany({
        where,
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true } },
        },
        orderBy: { points: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.campusScout.count({ where }),
    ])

    return NextResponse.json({ scouts, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    console.error("Campus scout list error:", error)
    return NextResponse.json({ error: "Failed to fetch scouts" }, { status: 500 })
  }
}

// POST — apply to be a campus scout
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = await prisma.campusScout.findUnique({
      where: { userId: session.user.id },
    })
    if (existing) {
      return NextResponse.json({ error: "You have already applied" }, { status: 409 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { collegeName, state, district, course, graduationYear, why, linkedinUrl } = body

    if (!collegeName || !state || !course || !graduationYear || !why) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const scout = await prisma.campusScout.create({
      data: {
        userId: session.user.id,
        collegeName,
        state,
        district: district || null,
        course,
        graduationYear: parseInt(graduationYear),
        why,
        linkedinUrl: linkedinUrl || null,
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    })

    return NextResponse.json({ scout }, { status: 201 })
  } catch (error) {
    console.error("Campus scout apply error:", error)
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 })
  }
}
