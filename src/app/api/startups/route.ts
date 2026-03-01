import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { nanoid } from "nanoid"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"
import { createStartupSchema } from "@/lib/validations/startup"
import { sendEmail, createNotification } from "@/lib/email"
import { startupSubmittedEmail } from "@/lib/email-templates"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "FOUNDER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Only founders and admins can submit startups" },
        { status: 403 }
      )
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    const parsed = createStartupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const slug = slugify(data.name) + "-" + nanoid(6)

    const startup = await prisma.$transaction(async (tx) => {
      const newStartup = await tx.startup.create({
        data: {
          founderId: session.user.id,
          name: data.name,
          slug,
          tagline: data.tagline,
          state: data.state,
          district: data.district || null,
          foundedYear: data.foundedYear || null,
          websiteUrl: data.websiteUrl || null,
          problemStatement: data.problemStatement,
          solution: data.solution,
          businessModel: data.businessModel || null,
          techCategory: data.techCategory,
          subCategories: data.subCategories,
          stage: data.stage,
          impactMetrics: data.impactMetrics,
          fieldTrialData: data.fieldTrialData,
          teamSize: data.teamSize,
          logoUrl: data.logoUrl || null,
          galleryUrls: data.galleryUrls ?? undefined,
          pitchDeckUrl: data.pitchDeckUrl || null,
          demoVideoUrl: data.demoVideoUrl || null,
          fundingStatus: data.fundingStatus || null,
          fundingAmount: data.fundingAmount || null,
          status: "SUBMITTED",
        },
      })

      // Create team members
      if (data.teamMembers && data.teamMembers.length > 0) {
        await tx.teamMember.createMany({
          data: data.teamMembers.map((member) => ({
            startupId: newStartup.id,
            name: member.name,
            role: member.role,
            linkedinUrl: member.linkedinUrl || null,
          })),
        })
      }

      // Create verification request
      await tx.verificationRequest.create({
        data: {
          startupId: newStartup.id,
          status: "pending",
        },
      })

      return newStartup
    })

    // Notify founder (fire-and-forget)
    const founderEmail = session.user.email
    if (founderEmail) {
      sendEmail(
        founderEmail,
        `Startup Submitted: ${data.name}`,
        startupSubmittedEmail(session.user.name || "Founder", data.name)
      ).catch(console.error)
    }

    createNotification(
      session.user.id,
      "startup_submitted",
      "Startup Submitted!",
      `Your startup "${data.name}" has been submitted for review.`,
      { startupId: startup.id, startupSlug: startup.slug }
    ).catch(console.error)

    return NextResponse.json(startup, { status: 201 })
  } catch (error) {
    console.error("Error creating startup:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const stage = searchParams.get("stage")
    const state = searchParams.get("state")
    const search = searchParams.get("search")?.slice(0, 200) || null
    const sort = searchParams.get("sort") || "hot"
    const verified = searchParams.get("verified")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1)
    const limit = Math.max(1, Math.min(parseInt(searchParams.get("limit") || "20") || 20, 100))
    const skip = (page - 1) * limit

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {
      status: { in: ["SUBMITTED", "UNDER_REVIEW", "VERIFIED"] },
    }

    if (category) {
      where.techCategory = category
    }

    if (stage && ["IDEATION", "VALIDATION", "EARLY_TRACTION", "GROWTH", "SCALING"].includes(stage)) {
      where.stage = stage
    }

    if (state) {
      where.state = state
    }

    if (verified === "true") {
      where.verificationLevel = { not: "NONE" }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Build orderBy
    let orderBy: Record<string, string> | Record<string, string>[]

    switch (sort) {
      case "top":
        orderBy = { upvoteCount: "desc" }
        break
      case "new":
        orderBy = { createdAt: "desc" }
        break
      case "hot":
      default:
        orderBy = [{ isFeatured: "desc" }, { upvoteCount: "desc" }]
        break
    }

    const [startups, total] = await Promise.all([
      prisma.startup.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          founder: {
            select: {
              fullName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              upvotes: true,
              comments: true,
              jobs: true,
            },
          },
        },
      }),
      prisma.startup.count({ where }),
    ])

    return NextResponse.json({
      startups,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching startups:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
