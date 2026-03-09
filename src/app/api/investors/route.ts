import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET — list investor profiles with thesis matching
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const stage = searchParams.get("stage")
    const minCheck = searchParams.get("minCheck")
    const maxCheck = searchParams.get("maxCheck")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1)
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12") || 12))

    // Build where clause for InvestorProfile
    const where: Record<string, unknown> = {}

    if (minCheck) where.checkSizeMax = { gte: parseInt(minCheck) }
    if (maxCheck) where.checkSizeMin = { lte: parseInt(maxCheck) }

    const [profiles, total] = await Promise.all([
      prisma.investorProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              linkedinUrl: true,
              organization: true,
            },
          },
        },
        orderBy: { portfolioCount: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.investorProfile.count({ where }),
    ])

    // Filter by category and stage in-memory (JSON fields)
    let filtered = profiles
    if (category) {
      filtered = filtered.filter((p) => {
        const cats = (p.preferredCategories as string[]) || []
        return cats.includes(category)
      })
    }
    if (stage) {
      filtered = filtered.filter((p) => {
        const stages = (p.preferredStages as string[]) || []
        return stages.includes(stage)
      })
    }

    return NextResponse.json({
      investors: filtered,
      total: category || stage ? filtered.length : total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Investor list error:", error)
    return NextResponse.json({ error: "Failed to fetch investors" }, { status: 500 })
  }
}
