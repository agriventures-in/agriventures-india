import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .nullable(),
  organization: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  linkedinUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  preferredLanguage: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        role: true,
        phone: true,
        linkedinUrl: true,
        organization: true,
        bio: true,
        preferredLanguage: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("GET /api/users/me error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateProfileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      )
    }

    const { fullName, bio, organization, phone, linkedinUrl, avatarUrl, preferredLanguage } =
      parsed.data

    // Build update data, only including provided fields
    const updateData: Record<string, unknown> = {}
    if (fullName !== undefined) updateData.fullName = fullName
    if (bio !== undefined) updateData.bio = bio || null
    if (organization !== undefined) updateData.organization = organization || null
    if (phone !== undefined) updateData.phone = phone || null
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl || null
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl || null
    if (preferredLanguage !== undefined) updateData.preferredLanguage = preferredLanguage

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        role: true,
        phone: true,
        linkedinUrl: true,
        organization: true,
        bio: true,
        preferredLanguage: true,
      },
    })

    return NextResponse.json({ user, message: "Profile updated successfully" })
  } catch (error) {
    console.error("PATCH /api/users/me error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
