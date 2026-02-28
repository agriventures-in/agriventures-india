import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

interface ActivityItem {
  type: "comment" | "upvote" | "intro_sent"
  id: string
  createdAt: string
  startup: { name: string; slug: string }
  content?: string
  status?: string
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch recent activities in parallel
    const [comments, upvotes, introRequests] = await Promise.all([
      prisma.comment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          content: true,
          createdAt: true,
          startup: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.upvote.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          createdAt: true,
          startup: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.introRequest.findMany({
        where: { fromUserId: userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          status: true,
          createdAt: true,
          startup: {
            select: { name: true, slug: true },
          },
        },
      }),
    ])

    // Merge into a unified activity list
    const activities: ActivityItem[] = []

    for (const c of comments) {
      activities.push({
        type: "comment",
        id: c.id,
        createdAt: c.createdAt.toISOString(),
        startup: { name: c.startup.name, slug: c.startup.slug },
        content: c.content.length > 100 ? c.content.slice(0, 100) + "..." : c.content,
      })
    }

    for (const u of upvotes) {
      activities.push({
        type: "upvote",
        id: u.id,
        createdAt: u.createdAt.toISOString(),
        startup: { name: u.startup.name, slug: u.startup.slug },
      })
    }

    for (const i of introRequests) {
      activities.push({
        type: "intro_sent",
        id: i.id,
        createdAt: i.createdAt.toISOString(),
        startup: { name: i.startup.name, slug: i.startup.slug },
        status: i.status,
      })
    }

    // Sort by createdAt descending and take top 20
    activities.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ activities: activities.slice(0, 20) })
  } catch (error) {
    console.error("GET /api/users/me/activity error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
