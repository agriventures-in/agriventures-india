import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail, createNotification } from "@/lib/email"
import { statusChangeEmail } from "@/lib/email-templates"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const startup = await prisma.startup.findUnique({
      where: { id: params.id },
      include: {
        founder: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            linkedinUrl: true,
            organization: true,
          },
        },
        teamMembers: true,
        _count: {
          select: {
            upvotes: true,
            comments: true,
            jobs: true,
          },
        },
      },
    })

    if (!startup) {
      return NextResponse.json({ message: "Startup not found" }, { status: 404 })
    }

    return NextResponse.json(startup)
  } catch (error) {
    console.error("Error fetching startup:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const startup = await prisma.startup.findUnique({
      where: { id: params.id },
      select: { founderId: true, name: true, slug: true, status: true, founder: { select: { fullName: true, email: true } } },
    })

    if (!startup) {
      return NextResponse.json({ message: "Startup not found" }, { status: 404 })
    }

    // Only founder or admin can update
    if (startup.founderId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Not authorized to update this startup" },
        { status: 403 }
      )
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    const isAdmin = session.user.role === "ADMIN"

    // Build update data based on role
    const updateData: Record<string, unknown> = {}

    if (isAdmin) {
      // Admins can update featured status, verification level, and status
      const adminFields = ["isFeatured", "verificationLevel", "status"]
      for (const field of adminFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field]
        }
      }
    }

    // Both admins and founders can update content fields
    const contentFields = [
      "name", "tagline", "description", "logoUrl", "bannerUrl",
      "websiteUrl", "foundedYear", "stage", "techCategory", "subCategories",
      "state", "district", "teamSize", "fundingStatus", "fundingAmount",
      "problemStatement", "solution", "businessModel", "impactMetrics",
      "fieldTrialData", "pitchDeckUrl", "demoVideoUrl", "galleryUrls", "socialLinks",
    ]
    for (const field of contentFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const updated = await prisma.startup.update({
      where: { id: params.id },
      data: updateData,
      include: {
        founder: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
        teamMembers: true,
        _count: {
          select: {
            upvotes: true,
            comments: true,
            jobs: true,
          },
        },
      },
    })

    // If admin changed the status, notify the founder via email + in-app
    if (isAdmin && body.status && body.status !== startup.status) {
      const { BASE_URL: baseUrl } = await import("@/lib/config")
      const startupUrl = `${baseUrl}/startups/${startup.slug}`

      createNotification(
        startup.founderId,
        "status_change",
        `Startup ${body.status === "VERIFIED" ? "Verified!" : "Status Updated"}`,
        `Your startup "${startup.name}" status has been updated to ${body.status.replace(/_/g, " ")}.`,
        { startupId: params.id, startupSlug: startup.slug, status: body.status }
      ).catch(console.error)

      sendEmail(
        startup.founder.email,
        `${startup.name} — Status Updated`,
        statusChangeEmail(
          startup.founder.fullName,
          startup.name,
          body.status,
          startupUrl
        )
      ).catch(console.error)
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating startup:", error)
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

    const startup = await prisma.startup.findUnique({
      where: { id: params.id },
    })

    if (!startup) {
      return NextResponse.json({ message: "Startup not found" }, { status: 404 })
    }

    // Allow admin or the founder who owns this startup
    const isAdmin = session.user.role === "ADMIN"
    const isOwner = startup.founderId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { message: "You can only delete your own startups" },
        { status: 403 }
      )
    }

    await prisma.startup.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Startup deleted successfully" })
  } catch (error) {
    console.error("Error deleting startup:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
