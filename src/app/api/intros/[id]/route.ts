import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail, createNotification } from "@/lib/email"
import { introResponseEmail } from "@/lib/email-templates"

const respondSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED"]),
  responseNote: z.string().max(500).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    const parsed = respondSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { status, responseNote } = parsed.data

    // Fetch the intro request
    const introRequest = await prisma.introRequest.findUnique({
      where: { id },
      include: {
        startup: { select: { name: true } },
        fromUser: { select: { id: true, fullName: true, email: true } },
        toUser: { select: { id: true, fullName: true } },
      },
    })

    if (!introRequest) {
      return NextResponse.json({ message: "Introduction request not found" }, { status: 404 })
    }

    // Only the recipient (founder) can respond
    if (introRequest.toUserId !== session.user.id) {
      return NextResponse.json(
        { message: "Only the recipient can respond to this request" },
        { status: 403 }
      )
    }

    // Must be currently PENDING
    if (introRequest.status !== "PENDING") {
      return NextResponse.json(
        { message: "This request has already been responded to" },
        { status: 400 }
      )
    }

    const updated = await prisma.introRequest.update({
      where: { id },
      data: {
        status,
        responseNote: responseNote || null,
        respondedAt: new Date(),
      },
      include: {
        startup: { select: { id: true, name: true, slug: true } },
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
            organization: true,
            avatarUrl: true,
          },
        },
        toUser: {
          select: {
            id: true,
            fullName: true,
            organization: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Send email to the requester (fire-and-forget)
    sendEmail(
      introRequest.fromUser.email,
      `Introduction Request ${status === "ACCEPTED" ? "Accepted" : "Declined"}: ${introRequest.startup.name}`,
      introResponseEmail(
        introRequest.fromUser.fullName,
        introRequest.toUser.fullName,
        introRequest.startup.name,
        status,
        responseNote
      )
    ).catch(console.error)

    // Create notification for requester (fire-and-forget)
    createNotification(
      introRequest.fromUserId,
      "intro_response",
      `Introduction ${status === "ACCEPTED" ? "Accepted" : "Declined"}`,
      `${introRequest.toUser.fullName} has ${status.toLowerCase()} your introduction request for ${introRequest.startup.name}`,
      { introRequestId: id, startupId: introRequest.startupId, status }
    ).catch(console.error)

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error responding to intro request:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
