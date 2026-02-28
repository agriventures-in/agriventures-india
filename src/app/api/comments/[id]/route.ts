import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const EDIT_WINDOW_MINUTES = 15

const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be 2000 characters or less"),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const commentId = params.id

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true, createdAt: true },
    })

    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 })
    }

    // Only the author or an admin can edit
    const isAuthor = comment.userId === session.user.id
    const isAdmin = session.user.role === "ADMIN"

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { message: "Not authorized to edit this comment" },
        { status: 403 }
      )
    }

    // Check edit window (15 minutes) - applies even to admins for consistency
    const minutesSinceCreation =
      (Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60)

    if (minutesSinceCreation > EDIT_WINDOW_MINUTES) {
      return NextResponse.json(
        { message: "Comments can only be edited within 15 minutes of posting" },
        { status: 403 }
      )
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    const parsed = updateCommentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: parsed.data.content },
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

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const commentId = params.id

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true },
    })

    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 })
    }

    // Only the author or an admin can delete
    const isAuthor = comment.userId === session.user.id
    const isAdmin = session.user.role === "ADMIN"

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { message: "Not authorized to delete this comment" },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ message: "Comment deleted" })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
