import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const startupId = params.id

    // Check startup exists
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      select: { id: true },
    })

    if (!startup) {
      return NextResponse.json({ message: "Startup not found" }, { status: 404 })
    }

    // Get user ID if logged in (optional — anonymous views are tracked too)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || null

    // Deduplicate: for logged-in users, check if a view was recorded in last 24hrs
    if (userId) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const recentView = await prisma.startupView.findFirst({
        where: {
          startupId,
          userId,
          createdAt: { gte: twentyFourHoursAgo },
        },
        select: { id: true },
      })

      if (recentView) {
        return NextResponse.json({ success: true, deduplicated: true })
      }
    }

    // Record view + increment aggregate counter in parallel
    await Promise.all([
      prisma.startupView.create({
        data: {
          startupId,
          userId,
        },
      }),
      prisma.startup.update({
        where: { id: startupId },
        data: { viewCount: { increment: 1 } },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording view:", error)
    // Views should never fail the page — return success silently
    return NextResponse.json({ success: true })
  }
}
