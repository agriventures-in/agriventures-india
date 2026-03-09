import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Fetch recent upvotes, comments, and startup submissions in parallel
    const [recentUpvotes, recentComments, recentStartups] = await Promise.all([
      prisma.upvote.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
          startup: { select: { name: true, slug: true } },
        },
      }),
      prisma.comment.findMany({
        take: 10,
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
          startup: { select: { name: true, slug: true } },
        },
      }),
      prisma.startup.findMany({
        take: 5,
        where: { status: { in: ["SUBMITTED", "VERIFIED"] } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          founder: { select: { fullName: true, avatarUrl: true } },
        },
      }),
    ])

    // Map to unified ActivityItem format
    const activities = [
      ...recentUpvotes.map((u) => ({
        id: `upvote-${u.id}`,
        type: "upvote" as const,
        user: u.user,
        startup: u.startup,
        createdAt: u.createdAt.toISOString(),
      })),
      ...recentComments.map((c) => ({
        id: `comment-${c.id}`,
        type: "comment" as const,
        user: c.user,
        startup: c.startup,
        createdAt: c.createdAt.toISOString(),
        content: c.content.length > 100 ? c.content.slice(0, 100) + "..." : c.content,
      })),
      ...recentStartups.map((s) => ({
        id: `startup-${s.id}`,
        type: "startup" as const,
        user: s.founder,
        startup: { name: s.name, slug: s.slug },
        createdAt: s.createdAt.toISOString(),
      })),
    ]

    // Sort by date descending and take top 15
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ activities: activities.slice(0, 15) })
  } catch (error) {
    console.error("Activity feed error:", error)
    return NextResponse.json({ activities: [] })
  }
}
