import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// DELETE — Hard-delete a comment (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const commentId = params.id

    // Check comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    })

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      )
    }

    // Delete all replies first (cascade doesn't handle self-referencing well)
    await prisma.comment.deleteMany({
      where: { parentId: commentId },
    })

    // Delete the comment itself
    await prisma.comment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ message: "Comment deleted successfully" })
  } catch (error) {
    console.error("Admin delete comment error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH — Update comment content (admin moderation edit)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const commentId = params.id

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, content: true },
    })

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      )
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      )
    }

    const { content } = body as { content?: string }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      )
    }

    // Update content — used for hiding by replacing with moderation message
    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
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
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Admin patch comment error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
