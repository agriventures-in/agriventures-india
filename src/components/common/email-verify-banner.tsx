"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { AlertTriangle, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmailVerifyBanner() {
  const { data: session, update } = useSession()
  const [dismissed, setDismissed] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState("")

  // Don't show if no session, already verified, or dismissed
  if (!session?.user || session.user.emailVerified || dismissed) {
    return null
  }

  const handleResend = async () => {
    setResending(true)
    setMessage("")

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      })
      const data = await res.json()
      setMessage(data.message || "Verification email sent!")
      // Refresh session in case they verified between now and then
      update()
    } catch {
      setMessage("Something went wrong. Please try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="relative border-b border-gold/20 bg-gold/10 px-4 py-2.5">
      <div className="container mx-auto flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <AlertTriangle className="h-4 w-4 shrink-0 text-gold" />
          <span>Please verify your email to unlock all features.</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleResend}
          disabled={resending}
          className="h-7 gap-1.5 border-gold/30 text-xs hover:bg-gold/10"
        >
          {resending && <Loader2 className="h-3 w-3 animate-spin" />}
          Resend Verification Email
        </Button>
        {message && (
          <span className="text-xs text-muted-foreground">{message}</span>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground sm:static sm:translate-y-0"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
