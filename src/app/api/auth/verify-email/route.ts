import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/verify-email?status=invalid", req.url)
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: `email-verify:${normalizedEmail}`,
        token,
      },
    })

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/verify-email?status=invalid", req.url)
      )
    }

    // Check expiry
    if (new Date() > verificationToken.expires) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          },
        },
      })
      return NextResponse.redirect(
        new URL("/verify-email?status=expired", req.url)
      )
    }

    // Verify the email and delete the token
    await prisma.$transaction([
      prisma.user.update({
        where: { email: normalizedEmail },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          },
        },
      }),
    ])

    return NextResponse.redirect(
      new URL("/verify-email?status=success", req.url)
    )
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.redirect(
      new URL("/verify-email?status=error", req.url)
    )
  }
}
