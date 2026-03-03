import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { passwordResetEmail } from "@/lib/email-templates"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    // Rate limit: 5 requests per minute per IP (stricter for password reset)
    const ip = getClientIp(req)
    const rl = rateLimit(ip, 5, 60_000)
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

    // Always return success (don't reveal if email exists)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, fullName: true, email: true, hashedPassword: true },
    })

    if (user && user.hashedPassword) {
      // Generate token
      const token = randomBytes(32).toString("hex")
      const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      // Delete any existing tokens for this email
      await prisma.verificationToken.deleteMany({
        where: { identifier: `password-reset:${normalizedEmail}` },
      })

      // Create new token
      await prisma.verificationToken.create({
        data: {
          identifier: `password-reset:${normalizedEmail}`,
          token,
          expires,
        },
      })

      // Build reset URL
      const { BASE_URL: baseUrl } = await import("@/lib/config")
      const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`

      // Send email (fire-and-forget)
      sendEmail(
        user.email,
        "Reset Your Password — AgriVentures India",
        passwordResetEmail(user.fullName, resetUrl)
      ).catch(console.error)
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
