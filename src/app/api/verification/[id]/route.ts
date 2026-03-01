import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail, createNotification } from "@/lib/email"
import { verificationStatusEmail } from "@/lib/email-templates"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, verificationLevel, reviewNotes } = body

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'approved' or 'rejected'" },
        { status: 400 }
      )
    }

    // Find the verification request
    const verificationRequest = await prisma.verificationRequest.findUnique({
      where: { id: params.id },
      include: { startup: true },
    })

    if (!verificationRequest) {
      return NextResponse.json(
        { error: "Verification request not found" },
        { status: 404 }
      )
    }

    if (status === "approved") {
      if (!verificationLevel || !["COMMUNITY", "EXPERT", "FULL"].includes(verificationLevel)) {
        return NextResponse.json(
          { error: "Verification level required for approval" },
          { status: 400 }
        )
      }

      // Update verification request and startup in a transaction
      await prisma.$transaction([
        prisma.verificationRequest.update({
          where: { id: params.id },
          data: {
            status: "approved",
            reviewNotes: reviewNotes || null,
            reviewerId: session.user.id,
            reviewedAt: new Date(),
          },
        }),
        prisma.startup.update({
          where: { id: verificationRequest.startupId },
          data: {
            status: "VERIFIED",
            verificationLevel: verificationLevel,
          },
        }),
      ])
    } else {
      // Rejected
      await prisma.$transaction([
        prisma.verificationRequest.update({
          where: { id: params.id },
          data: {
            status: "rejected",
            reviewNotes: reviewNotes || null,
            reviewerId: session.user.id,
            reviewedAt: new Date(),
          },
        }),
        prisma.startup.update({
          where: { id: verificationRequest.startupId },
          data: {
            status: "REJECTED",
          },
        }),
      ])
    }

    // Notify the founder about the verification status change (fire-and-forget)
    const founder = await prisma.user.findUnique({
      where: { id: verificationRequest.startup.founderId },
      select: { id: true, email: true, fullName: true },
    })

    if (founder) {
      sendEmail(
        founder.email,
        `Verification Update: ${verificationRequest.startup.name}`,
        verificationStatusEmail(
          founder.fullName,
          verificationRequest.startup.name,
          status,
          reviewNotes || undefined
        )
      ).catch(console.error)

      const notificationType =
        status === "approved" ? "verification_approved" : "verification_rejected"
      const notificationTitle =
        status === "approved"
          ? "Startup Verified!"
          : "Verification Update"
      const notificationMessage =
        status === "approved"
          ? `Your startup "${verificationRequest.startup.name}" has been verified.`
          : `Your startup "${verificationRequest.startup.name}" verification was not approved.${reviewNotes ? ` Notes: ${reviewNotes}` : ""}`

      createNotification(
        founder.id,
        notificationType,
        notificationTitle,
        notificationMessage,
        { startupId: verificationRequest.startupId, startupSlug: verificationRequest.startup.slug, status }
      ).catch(console.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating verification request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
