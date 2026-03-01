import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const location = searchParams.get("location")
    const search = searchParams.get("search")?.slice(0, 200) || null
    const isActive = searchParams.get("isActive")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1)
    const limit = Math.max(1, Math.min(parseInt(searchParams.get("limit") || "20") || 20, 100))
    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {}

    if (type) {
      where.type = type
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" }
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true"
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { postedAt: "desc" },
        include: {
          startup: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              state: true,
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ])

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    const {
      startupId,
      title,
      description,
      location,
      type,
      salaryRange,
      requirements,
      applicationUrl,
      expiresAt,
    } = body

    if (!startupId || !title || !description || !location || !type) {
      return NextResponse.json(
        { error: "startupId, title, description, location, and type are required" },
        { status: 400 }
      )
    }

    if (!["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid job type" },
        { status: 400 }
      )
    }

    // Verify the user owns the startup (must be a founder) or is admin
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
    })

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      )
    }

    const isAdmin = session.user.role === "ADMIN"
    const isFounder = startup.founderId === session.user.id

    if (!isAdmin && !isFounder) {
      return NextResponse.json(
        { error: "Only startup founders or admins can post jobs" },
        { status: 403 }
      )
    }

    // Check startup is submitted or verified
    if (!isAdmin && !["SUBMITTED", "VERIFIED"].includes(startup.status)) {
      return NextResponse.json(
        { error: "Startup must be submitted or verified to post jobs" },
        { status: 403 }
      )
    }

    const job = await prisma.job.create({
      data: {
        startupId,
        title,
        description,
        location,
        type,
        salaryRange: salaryRange || null,
        requirements: requirements || null,
        applicationUrl: applicationUrl || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        startup: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
