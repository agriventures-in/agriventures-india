import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET — Fetch current investor profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        linkedinUrl: true,
        organization: true,
        bio: true,
        investorProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        linkedinUrl: user.linkedinUrl,
        organization: user.organization,
        bio: user.bio,
      },
      investorProfile: user.investorProfile,
    })
  } catch (error) {
    console.error("Investor profile GET error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH — Update investor profile fields
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
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

    const {
      // User fields
      linkedinUrl,
      organization,
      bio,
      // InvestorProfile fields
      firmName,
      thesis,
      checkSizeMin,
      checkSizeMax,
      preferredStages,
      preferredCategories,
      websiteUrl,
    } = body as {
      linkedinUrl?: string
      organization?: string
      bio?: string
      firmName?: string
      thesis?: string
      checkSizeMin?: number
      checkSizeMax?: number
      preferredStages?: string[]
      preferredCategories?: string[]
      websiteUrl?: string
    }

    // Update User fields if provided
    const userUpdate: Record<string, unknown> = {}
    if (linkedinUrl !== undefined) userUpdate.linkedinUrl = linkedinUrl
    if (organization !== undefined) userUpdate.organization = organization
    if (bio !== undefined) userUpdate.bio = bio

    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: userUpdate,
      })
    }

    // Upsert InvestorProfile fields
    const profileData: Record<string, unknown> = {}
    if (firmName !== undefined) profileData.firmName = firmName
    if (thesis !== undefined) profileData.thesis = thesis
    if (checkSizeMin !== undefined) profileData.checkSizeMin = checkSizeMin
    if (checkSizeMax !== undefined) profileData.checkSizeMax = checkSizeMax
    if (preferredStages !== undefined)
      profileData.preferredStages = preferredStages
    if (preferredCategories !== undefined)
      profileData.preferredCategories = preferredCategories
    if (websiteUrl !== undefined) profileData.websiteUrl = websiteUrl

    let investorProfile = null
    if (Object.keys(profileData).length > 0) {
      investorProfile = await prisma.investorProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          ...profileData,
        },
        update: profileData,
      })
    } else {
      // Still fetch existing profile if no profile updates
      investorProfile = await prisma.investorProfile.findUnique({
        where: { userId: session.user.id },
      })
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        linkedinUrl: true,
        organization: true,
        bio: true,
      },
    })

    return NextResponse.json({
      user: updatedUser,
      investorProfile,
    })
  } catch (error) {
    console.error("Investor profile PATCH error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
