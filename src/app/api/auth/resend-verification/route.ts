import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { emailVerificationEmail } from "@/lib/email-templates"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    // Rate limit: 3 requests per minute per IP
    const ip = getClientIp(req)
    const rl = rateLimit(ip, 3, 60_000)
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

    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, fullName: true, email: true, emailVerified: true },
    })

    // Always return success to prevent email enumeration
    if (!user || user.emailVerified) {
      return NextResponse.json({
        message: "If your email needs verification, we've sent a new link.",
      })
    }

    // Generate token
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Delete any existing verification tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: `email-verify:${normalizedEmail}` },
    })

    // Create new token
    await prisma.verificationToken.create({
      data: {
        identifier: `email-verify:${normalizedEmail}`,
        token,
        expires,
      },
    })

    // Build verification URL
    const { BASE_URL: baseUrl } = await import("@/lib/config")
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(normalizedEmail)}`

    // Send verification email
    sendEmail(
      user.email,
      "Verify Your Email — AgriVentures India",
      emailVerificationEmail(user.fullName, verifyUrl)
    ).catch(console.error)

    return NextResponse.json({
      message: "If your email needs verification, we've sent a new link.",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
