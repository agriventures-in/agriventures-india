import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const [
      recentUsers,
      recentStartups,
      categoryGroups,
      stageGroups,
      topStartups,
      recentNewUsers,
      recentNewStartups,
      recentVerifications,
      totalStartups,
      totalUsers,
      totalUpvotes,
      totalComments,
      totalJobs,
      viewsAggregate,
    ] = await Promise.all([
      // Users registered in last 30 days (for time series)
      prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      // Startups created in last 30 days (for time series)
      prisma.startup.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      // Category distribution
      prisma.startup.groupBy({
        by: ["techCategory"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      // Stage distribution
      prisma.startup.groupBy({
        by: ["stage"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      // Top 10 startups by upvotes
      prisma.startup.findMany({
        take: 10,
        orderBy: { upvoteCount: "desc" },
        select: {
          name: true,
          slug: true,
          upvoteCount: true,
          viewCount: true,
        },
      }),
      // Recent new users (for activity log)
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: { id: true, fullName: true, role: true, createdAt: true },
      }),
      // Recent new startups (for activity log)
      prisma.startup.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
          founder: { select: { fullName: true } },
        },
      }),
      // Recent verifications (for activity log)
      prisma.verificationRequest.findMany({
        take: 10,
        orderBy: { submittedAt: "desc" },
        where: { status: { not: "pending" } },
        select: {
          id: true,
          status: true,
          reviewedAt: true,
          submittedAt: true,
          startup: { select: { name: true } },
        },
      }),
      // Totals
      prisma.startup.count(),
      prisma.user.count(),
      prisma.upvote.count(),
      prisma.comment.count(),
      prisma.job.count(),
      // Sum of viewCount
      prisma.startup.aggregate({
        _sum: { viewCount: true },
      }),
    ])

    // --- Build registrationsOverTime ---
    const regByDay: Record<string, number> = {}
    recentUsers.forEach((r) => {
      const day = r.createdAt.toISOString().split("T")[0]
      regByDay[day] = (regByDay[day] || 0) + 1
    })

    const startupByDay: Record<string, number> = {}
    recentStartups.forEach((s) => {
      const day = s.createdAt.toISOString().split("T")[0]
      startupByDay[day] = (startupByDay[day] || 0) + 1
    })

    // Fill in all 30 days
    const registrationsOverTime: { date: string; users: number; startups: number }[] = []
    for (
      let d = new Date(thirtyDaysAgo);
      d <= new Date();
      d.setDate(d.getDate() + 1)
    ) {
      const day = d.toISOString().split("T")[0]
      registrationsOverTime.push({
        date: day,
        users: regByDay[day] || 0,
        startups: startupByDay[day] || 0,
      })
    }

    // --- Category distribution ---
    const categoryDistribution = categoryGroups.map((g) => ({
      category: g.techCategory,
      count: g._count.id,
    }))

    // --- Stage distribution ---
    const stageDistribution = stageGroups.map((g) => ({
      stage: g.stage,
      count: g._count.id,
    }))

    // --- Recent activity (merge and sort) ---
    type ActivityItem = {
      type: "user" | "startup" | "verification"
      description: string
      timestamp: string
    }

    const activities: ActivityItem[] = []

    recentNewUsers.forEach((u) => {
      activities.push({
        type: "user",
        description: `${u.fullName} registered as ${u.role.toLowerCase()}`,
        timestamp: u.createdAt.toISOString(),
      })
    })

    recentNewStartups.forEach((s) => {
      activities.push({
        type: "startup",
        description: `${s.founder.fullName} submitted "${s.name}"`,
        timestamp: s.createdAt.toISOString(),
      })
    })

    recentVerifications.forEach((v) => {
      const ts = v.reviewedAt || v.submittedAt
      activities.push({
        type: "verification",
        description: `Verification ${v.status} for "${v.startup.name}"`,
        timestamp: ts.toISOString(),
      })
    })

    // Sort by timestamp descending, take 20
    activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    const recentActivity = activities.slice(0, 20)

    // --- Total stats ---
    const totalStats = {
      totalStartups,
      totalUsers,
      totalUpvotes,
      totalViews: viewsAggregate._sum.viewCount || 0,
      totalComments,
      totalJobs,
    }

    return NextResponse.json({
      registrationsOverTime,
      categoryDistribution,
      stageDistribution,
      topStartups,
      recentActivity,
      totalStats,
    })
  } catch (error) {
    console.error("Admin analytics error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
