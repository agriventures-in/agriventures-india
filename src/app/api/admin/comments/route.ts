import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1)
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "20") || 20)
    )
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { content: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { startup: { name: { contains: search, mode: "insensitive" } } },
      ]
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              email: true,
              role: true,
            },
          },
          startup: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ])

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Admin comments list error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
