import { Resend } from "resend"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

let _resend: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const FROM_EMAIL =
  process.env.FROM_EMAIL || "AgriVentures India <onboarding@resend.dev>"

/**
 * Send an email via Resend.
 * Errors are logged but never thrown — email failures must not crash the app.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    const resend = getResend()
    if (!resend) {
      console.warn("Resend not configured — skipping email to", to)
      return
    }

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Resend email error:", error)
    }
  } catch (err) {
    console.error("Failed to send email:", err)
  }
}

/**
 * Create an in-app notification record.
 * Errors are logged but never thrown.
 */
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  metadata?: Prisma.InputJsonValue
): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        metadata: metadata ?? undefined,
      },
    })
  } catch (err) {
    console.error("Failed to create notification:", err)
  }
}
