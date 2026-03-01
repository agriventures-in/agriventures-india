import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail, createNotification } from "@/lib/email"
import { introRequestEmail } from "@/lib/email-templates"

const createIntroSchema = z.object({
  startupId: z.string().min(1, "Startup ID is required"),
  message: z.string().min(1, "Message is required").max(500, "Message must be 500 characters or less"),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    const parsed = createIntroSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { startupId, message } = parsed.data

    // Look up the startup and founder
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        founder: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    })

    if (!startup) {
      return NextResponse.json({ message: "Startup not found" }, { status: 404 })
    }

    // Cannot request intro to your own startup
    if (startup.founderId === session.user.id) {
      return NextResponse.json(
        { message: "You cannot request an introduction to your own startup" },
        { status: 400 }
      )
    }

    // Check for duplicate (unique constraint: fromUserId + startupId)
    const existing = await prisma.introRequest.findUnique({
      where: {
        fromUserId_startupId: {
          fromUserId: session.user.id,
          startupId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { message: "You have already requested an introduction to this startup" },
        { status: 409 }
      )
    }

    // Get requester details for the email
    const requester = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { fullName: true, organization: true },
    })

    const introRequest = await prisma.introRequest.create({
      data: {
        fromUserId: session.user.id,
        toUserId: startup.founderId,
        startupId,
        message,
      },
      include: {
        startup: { select: { name: true } },
        fromUser: { select: { fullName: true, organization: true } },
        toUser: { select: { fullName: true } },
      },
    })

    // Send email to founder (fire-and-forget)
    sendEmail(
      startup.founder.email,
      `New Introduction Request: ${startup.name}`,
      introRequestEmail(
        startup.founder.fullName,
        requester?.fullName || session.user.name || "An investor",
        requester?.organization || "Independent",
        startup.name,
        message
      )
    ).catch(console.error)

    // Create notification for founder (fire-and-forget)
    createNotification(
      startup.founderId,
      "intro_request",
      "New Introduction Request",
      `${requester?.fullName || "Someone"} wants to connect regarding ${startup.name}`,
      { introRequestId: introRequest.id, startupId, startupSlug: startup.slug }
    ).catch(console.error)

    return NextResponse.json(introRequest, { status: 201 })
  } catch (error) {
    console.error("Error creating intro request:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role") || "sent"
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1)
    const limit = Math.max(1, Math.min(parseInt(searchParams.get("limit") || "20") || 20, 100))
    const skip = (page - 1) * limit

    let where: Record<string, unknown>
    let include: Record<string, unknown>

    if (role === "received") {
      where = { toUserId: session.user.id }
      include = {
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
      }
    } else {
      where = { fromUserId: session.user.id }
      include = {
        startup: { select: { id: true, name: true, slug: true } },
        toUser: {
          select: {
            id: true,
            fullName: true,
            organization: true,
            avatarUrl: true,
          },
        },
      }
    }

    const [intros, total] = await Promise.all([
      prisma.introRequest.findMany({
        where,
        include,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.introRequest.count({ where }),
    ])

    return NextResponse.json({
      intros,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching intro requests:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
