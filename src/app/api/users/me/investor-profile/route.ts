import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  firmName: z.string().max(200).optional().nullable(),
  thesis: z.string().max(2000).optional().nullable(),
  checkSizeMin: z.number().int().min(0).optional().nullable(),
  checkSizeMax: z.number().int().min(0).optional().nullable(),
  preferredStages: z.array(z.string()).optional().nullable(),
  preferredCategories: z.array(z.string()).optional().nullable(),
  portfolioCount: z.number().int().min(0).optional().nullable(),
  websiteUrl: z.string().url().optional().nullable().or(z.literal("")),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.investorProfile.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("GET investor-profile error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "INVESTOR" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Only investors can update investor profiles" },
        { status: 403 }
      )
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Clean empty string websiteUrl to null
    if (data.websiteUrl === "") {
      data.websiteUrl = null
    }

    // Build Prisma-compatible data (Json fields need special null handling)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbData: Record<string, any> = {
      firmName: data.firmName,
      thesis: data.thesis,
      checkSizeMin: data.checkSizeMin,
      checkSizeMax: data.checkSizeMax,
      portfolioCount: data.portfolioCount,
      websiteUrl: data.websiteUrl,
      preferredStages: data.preferredStages === null
        ? Prisma.DbNull
        : data.preferredStages ?? undefined,
      preferredCategories: data.preferredCategories === null
        ? Prisma.DbNull
        : data.preferredCategories ?? undefined,
    }

    // Remove undefined keys
    Object.keys(dbData).forEach((key) => {
      if (dbData[key] === undefined) delete dbData[key]
    })

    // Upsert — create if doesn't exist, update if it does
    const profile = await prisma.investorProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...dbData,
      },
      update: dbData,
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("PATCH investor-profile error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
