import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateReadinessScore } from "@/lib/readiness-score"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const startupId = searchParams.get("startupId")

    if (!startupId) {
      return NextResponse.json({ error: "startupId is required" }, { status: 400 })
    }

    const startup = await prisma.startup.findFirst({
      where: { id: startupId, founderId: session.user.id },
      include: {
        _count: { select: { teamMembers: true, comments: true } },
      },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    const result = calculateReadinessScore({
      ...startup,
      _count: startup._count,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Readiness score error:", error)
    return NextResponse.json({ error: "Failed to calculate score" }, { status: 500 })
  }
}
