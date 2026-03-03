import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations/auth"
import { sendEmail, createNotification } from "@/lib/email"
import { welcomeEmail } from "@/lib/email-templates"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = getClientIp(req)
    const rl = rateLimit(ip, 10, 60_000)
    if (rl.limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }
    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      )
    }

    const { fullName, email, password, role } = parsed.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        hashedPassword,
        role,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // Send welcome email (fire-and-forget)
    sendEmail(
      user.email,
      "Welcome to AgriVentures India!",
      welcomeEmail(user.fullName)
    ).catch(console.error)

    createNotification(
      user.id,
      "welcome",
      "Welcome to AgriVentures!",
      "Your account has been created. Start exploring India's agritech ecosystem."
    ).catch(console.error)

    return NextResponse.json(
      { user, message: "Account created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
