import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/email"

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be 2000 characters or less"),
  parentId: z.string().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const startupId = params.id
    const { searchParams } = new URL(req.url)

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1)
    const limit = Math.max(
      1,
      Math.min(parseInt(searchParams.get("limit") || "20", 10) || 20, 50)
    )
    const skip = (page - 1) * limit

    // Fetch top-level comments with nested replies (2 levels)
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          startupId,
          parentId: null,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              role: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                  role: true,
                },
              },
              replies: {
                include: {
                  user: {
                    select: {
                      id: true,
                      fullName: true,
                      avatarUrl: true,
                      role: true,
                    },
                  },
                },
                orderBy: { createdAt: "asc" },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: {
          startupId,
          parentId: null,
        },
      }),
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
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const startupId = params.id

    // Check if startup exists and get founder info
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      select: { id: true, founderId: true, name: true, slug: true },
    })

    if (!startup) {
      return NextResponse.json({ message: "Startup not found" }, { status: 404 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    const parsed = createCommentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { content, parentId } = parsed.data
    let resolvedParentId = parentId || null

    // If parentId is provided, validate it
    if (resolvedParentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: resolvedParentId },
        select: { id: true, startupId: true, parentId: true },
      })

      if (!parentComment) {
        return NextResponse.json(
          { message: "Parent comment not found" },
          { status: 404 }
        )
      }

      if (parentComment.startupId !== startupId) {
        return NextResponse.json(
          { message: "Parent comment does not belong to this startup" },
          { status: 400 }
        )
      }

      // Prevent nesting deeper than 2 levels:
      // If the parent already has a parentId, flatten by using the parent's parentId
      if (parentComment.parentId) {
        resolvedParentId = parentComment.parentId
      }
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        startupId,
        content,
        parentId: resolvedParentId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    })

    // Notify startup founder (if commenter is not the founder)
    if (session.user.id !== startup.founderId) {
      createNotification(
        startup.founderId,
        "new_comment",
        "New Comment",
        `${session.user.name || "Someone"} commented on ${startup.name}`,
        { startupId, startupSlug: startup.slug, commentId: comment.id }
      ).catch(console.error)
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
