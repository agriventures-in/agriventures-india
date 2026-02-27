import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkAndUpgradeVerification } from "@/lib/verification"

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

    // Check if startup exists
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      select: { id: true },
    })

    if (!startup) {
      return NextResponse.json({ message: "Startup not found" }, { status: 404 })
    }

    // Check if already upvoted
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_startupId: {
          userId: session.user.id,
          startupId,
        },
      },
    })

    if (existingUpvote) {
      return NextResponse.json(
        { message: "Already upvoted", upvoted: true },
        { status: 409 }
      )
    }

    // Create upvote and increment count in transaction
    const result = await prisma.$transaction(async (tx) => {
      const upvote = await tx.upvote.create({
        data: {
          userId: session.user.id,
          startupId,
        },
      })

      const updatedStartup = await tx.startup.update({
        where: { id: startupId },
        data: { upvoteCount: { increment: 1 } },
        select: { upvoteCount: true },
      })

      return { upvote, upvoteCount: updatedStartup.upvoteCount }
    })

    // Check if the startup qualifies for automatic verification upgrade
    const upgraded = await checkAndUpgradeVerification(startupId)

    return NextResponse.json({
      upvoted: true,
      upvoteCount: result.upvoteCount,
      verificationLevel: upgraded?.verificationLevel ?? undefined,
    })
  } catch (error) {
    console.error("Error creating upvote:", error)
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

    const startupId = params.id

    // Check if upvote exists
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_startupId: {
          userId: session.user.id,
          startupId,
        },
      },
    })

    if (!existingUpvote) {
      return NextResponse.json(
        { message: "Not upvoted", upvoted: false },
        { status: 404 }
      )
    }

    // Remove upvote and decrement count in transaction
    const result = await prisma.$transaction(async (tx) => {
      await tx.upvote.delete({
        where: {
          userId_startupId: {
            userId: session.user.id,
            startupId,
          },
        },
      })

      const updatedStartup = await tx.startup.update({
        where: { id: startupId },
        data: { upvoteCount: { decrement: 1 } },
        select: { upvoteCount: true },
      })

      return { upvoteCount: updatedStartup.upvoteCount }
    })

    return NextResponse.json({
      upvoted: false,
      upvoteCount: result.upvoteCount,
    })
  } catch (error) {
    console.error("Error removing upvote:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
