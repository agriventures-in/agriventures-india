"use client"

import { useEffect } from "react"
import { ShieldAlert, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive/50" />
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-forest">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            An unexpected error occurred. Our team has been notified and is
            working to fix this issue.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={reset}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button className="gap-2 bg-forest hover:bg-forest/90 text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
