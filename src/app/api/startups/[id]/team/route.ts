import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function verifyOwnership(startupId: string, userId: string, userRole: string) {
  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    select: { founderId: true },
  })

  if (!startup) {
    return { error: "Startup not found", status: 404 }
  }

  if (startup.founderId !== userId && userRole !== "ADMIN") {
    return { error: "Not authorized to modify this startup's team", status: 403 }
  }

  return { ok: true }
}

// POST: Add a single team member
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const ownership = await verifyOwnership(
      params.id,
      session.user.id,
      session.user.role
    )
    if ("error" in ownership) {
      return NextResponse.json(
        { message: ownership.error },
        { status: ownership.status }
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

    const { name, role, linkedinUrl, avatarUrl } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { message: "Team member name is required" },
        { status: 400 }
      )
    }

    if (!role || typeof role !== "string" || role.trim().length === 0) {
      return NextResponse.json(
        { message: "Team member role is required" },
        { status: 400 }
      )
    }

    const member = await prisma.teamMember.create({
      data: {
        startupId: params.id,
        name: name.trim(),
        role: role.trim(),
        linkedinUrl: linkedinUrl?.trim() || null,
        avatarUrl: avatarUrl?.trim() || null,
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error("POST /api/startups/[id]/team error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT: Bulk replace all team members
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const ownership = await verifyOwnership(
      params.id,
      session.user.id,
      session.user.role
    )
    if ("error" in ownership) {
      return NextResponse.json(
        { message: ownership.error },
        { status: ownership.status }
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

    const { members } = body

    if (!Array.isArray(members)) {
      return NextResponse.json(
        { message: "Members must be an array" },
        { status: 400 }
      )
    }

    // Validate each member
    for (let i = 0; i < members.length; i++) {
      const m = members[i]
      if (!m.name || typeof m.name !== "string" || m.name.trim().length === 0) {
        return NextResponse.json(
          { message: `Team member at position ${i + 1} is missing a name` },
          { status: 400 }
        )
      }
      if (!m.role || typeof m.role !== "string" || m.role.trim().length === 0) {
        return NextResponse.json(
          { message: `Team member at position ${i + 1} is missing a role` },
          { status: 400 }
        )
      }
    }

    // Transaction: delete all existing members, then create new ones
    const result = await prisma.$transaction(async (tx) => {
      await tx.teamMember.deleteMany({
        where: { startupId: params.id },
      })

      if (members.length > 0) {
        await tx.teamMember.createMany({
          data: members.map(
            (m: { name: string; role: string; linkedinUrl?: string; avatarUrl?: string }) => ({
              startupId: params.id,
              name: m.name.trim(),
              role: m.role.trim(),
              linkedinUrl: m.linkedinUrl?.trim() || null,
              avatarUrl: m.avatarUrl?.trim() || null,
            })
          ),
        })
      }

      return tx.teamMember.findMany({
        where: { startupId: params.id },
      })
    })

    return NextResponse.json({ members: result })
  } catch (error) {
    console.error("PUT /api/startups/[id]/team error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
