import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "FOUNDER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Only founders can access analytics" },
        { status: 403 }
      )
    }

    // Fetch all startups owned by the founder
    const startups = await prisma.startup.findMany({
      where: { founderId: session.user.id },
      select: {
        id: true,
        name: true,
        slug: true,
        viewCount: true,
        upvoteCount: true,
        stage: true,
        status: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    if (startups.length === 0) {
      return NextResponse.json({
        totals: {
          startups: 0,
          totalViews: 0,
          totalUpvotes: 0,
          totalComments: 0,
        },
        viewsByDay: [],
        upvotesByDay: [],
        startupStats: [],
      })
    }

    const startupIds = startups.map((s) => s.id)

    // Calculate totals
    const totalViews = startups.reduce((sum, s) => sum + s.viewCount, 0)
    const totalUpvotes = startups.reduce((sum, s) => sum + s.upvoteCount, 0)
    const totalComments = startups.reduce(
      (sum, s) => sum + s._count.comments,
      0
    )

    // Get date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    // Views grouped by day (last 30 days)
    const viewsByDay = (await prisma.$queryRaw`
      SELECT DATE(sv."createdAt") as date, COUNT(*)::int as count
      FROM startup_views sv
      WHERE sv."startupId" = ANY(${startupIds}::text[])
      AND sv."createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE(sv."createdAt")
      ORDER BY date ASC
    `) as Array<{ date: Date; count: number }>

    // Upvotes grouped by day (last 30 days)
    const upvotesByDay = (await prisma.$queryRaw`
      SELECT DATE(u."createdAt") as date, COUNT(*)::int as count
      FROM upvotes u
      WHERE u."startupId" = ANY(${startupIds}::text[])
      AND u."createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE(u."createdAt")
      ORDER BY date ASC
    `) as Array<{ date: Date; count: number }>

    // Format dates as strings for the response
    const formattedViewsByDay = viewsByDay.map((row) => ({
      date: new Date(row.date).toISOString().split("T")[0],
      count: row.count,
    }))

    const formattedUpvotesByDay = upvotesByDay.map((row) => ({
      date: new Date(row.date).toISOString().split("T")[0],
      count: row.count,
    }))

    // Build startup stats
    const startupStats = startups
      .map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        views: s.viewCount,
        upvotes: s.upvoteCount,
        comments: s._count.comments,
        stage: s.stage,
        status: s.status,
      }))
      .sort((a, b) => b.views - a.views)

    return NextResponse.json({
      totals: {
        startups: startups.length,
        totalViews,
        totalUpvotes,
        totalComments,
      },
      viewsByDay: formattedViewsByDay,
      upvotesByDay: formattedUpvotesByDay,
      startupStats,
    })
  } catch (error) {
    console.error("Error fetching founder analytics:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
