"use client"

import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock, AlertTriangle, Loader2, Mail } from "lucide-react"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status")
  const [resendEmail, setResendEmail] = useState("")
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")

  const handleResend = async () => {
    if (!resendEmail) return
    setResending(true)
    setResendMessage("")

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      })
      const data = await res.json()
      setResendMessage(data.message || data.error || "Verification email sent!")
    } catch {
      setResendMessage("Something went wrong. Please try again.")
    } finally {
      setResending(false)
    }
  }

  const statusConfig: Record<string, {
    icon: typeof CheckCircle2
    iconColor: string
    title: string
    description: string
    showLogin?: boolean
    showResend?: boolean
  }> = {
    success: {
      icon: CheckCircle2,
      iconColor: "text-emerald",
      title: "Email Verified!",
      description:
        "Your email has been successfully verified. You now have full access to AgriVentures India.",
      showLogin: true,
    },
    invalid: {
      icon: XCircle,
      iconColor: "text-destructive",
      title: "Invalid Verification Link",
      description:
        "This verification link is invalid. It may have already been used or the link is malformed.",
      showResend: true,
    },
    expired: {
      icon: Clock,
      iconColor: "text-gold",
      title: "Link Expired",
      description:
        "This verification link has expired. Please request a new verification email.",
      showResend: true,
    },
    error: {
      icon: AlertTriangle,
      iconColor: "text-destructive",
      title: "Something Went Wrong",
      description:
        "We encountered an error while verifying your email. Please try again or request a new verification link.",
      showResend: true,
    },
  }

  const config = status ? statusConfig[status] ?? null : null

  // Default: pending verification state (user just registered)
  if (!config) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10">
            <Mail className="h-8 w-8 text-emerald" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            We sent you a verification link. Please check your inbox and click
            the link to verify your email address.
          </p>
          <p className="text-sm text-muted-foreground">
            Did not receive the email? Check your spam folder or request a new one below.
          </p>

          <div className="space-y-3 pt-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <Button
              onClick={handleResend}
              disabled={resending || !resendEmail}
              variant="outline"
              className="w-full gap-2"
            >
              {resending && <Loader2 className="h-4 w-4 animate-spin" />}
              Resend Verification Email
            </Button>
            {resendMessage && (
              <p className="text-sm text-muted-foreground">{resendMessage}</p>
            )}
          </div>

          <div className="pt-2">
            <Link href="/login">
              <Button variant="ghost" className="text-sm text-muted-foreground">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const Icon = config.icon

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            config.iconColor === "text-emerald"
              ? "bg-emerald/10"
              : config.iconColor === "text-gold"
                ? "bg-gold/10"
                : "bg-destructive/10"
          }`}
        >
          <Icon className={`h-8 w-8 ${config.iconColor}`} />
        </div>
        <CardTitle className="text-2xl">{config.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-muted-foreground">{config.description}</p>

        {config.showLogin && (
          <Link href="/login">
            <Button className="w-full gap-2 bg-forest text-white hover:bg-forest/90">
              Sign In to Your Account
            </Button>
          </Link>
        )}

        {config.showResend && (
          <div className="space-y-3 pt-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <Button
              onClick={handleResend}
              disabled={resending || !resendEmail}
              variant="outline"
              className="w-full gap-2"
            >
              {resending && <Loader2 className="h-4 w-4 animate-spin" />}
              Resend Verification Email
            </Button>
            {resendMessage && (
              <p className="text-sm text-muted-foreground">{resendMessage}</p>
            )}
          </div>
        )}

        <div className="pt-2">
          <Link href="/">
            <Button variant="ghost" className="text-sm text-muted-foreground">
              Back to Home
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
