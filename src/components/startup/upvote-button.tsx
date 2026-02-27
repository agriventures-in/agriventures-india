"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Triangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UpvoteButtonProps {
  startupId: string
  initialCount: number
  initialUpvoted?: boolean
  size?: "sm" | "lg"
  className?: string
}

export function UpvoteButton({
  startupId,
  initialCount,
  initialUpvoted = false,
  size = "sm",
  className,
}: UpvoteButtonProps) {
  const router = useRouter()
  const { status } = useSession()
  const [upvoted, setUpvoted] = useState(initialUpvoted)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (status === "unauthenticated") {
      toast.error("Please sign in to upvote startups")
      router.push("/login")
      return
    }

    if (isLoading) return

    // Optimistic update
    const wasUpvoted = upvoted
    const prevCount = count
    setUpvoted(!wasUpvoted)
    setCount(wasUpvoted ? count - 1 : count + 1)
    setIsLoading(true)

    try {
      const res = await fetch(`/api/startups/${startupId}/upvote`, {
        method: wasUpvoted ? "DELETE" : "POST",
      })

      if (!res.ok) {
        // Revert optimistic update on error
        setUpvoted(wasUpvoted)
        setCount(prevCount)
        const data = await res.json()
        if (res.status === 409) {
          // Already upvoted, sync state
          setUpvoted(true)
        } else {
          toast.error(data.message || "Something went wrong")
        }
        return
      }

      const data = await res.json()
      setUpvoted(data.upvoted)
      setCount(data.upvoteCount)
    } catch {
      // Revert optimistic update on network error
      setUpvoted(wasUpvoted)
      setCount(prevCount)
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (size === "lg") {
    return (
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "flex h-auto flex-col items-center gap-1 px-5 py-3 transition-all",
          upvoted
            ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
            : "hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
          className
        )}
      >
        <Triangle
          className={cn(
            "h-5 w-5 transition-transform",
            upvoted ? "fill-emerald-600 text-emerald-600" : "text-muted-foreground"
          )}
        />
        <span className="text-lg font-bold">{count}</span>
      </Button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-all",
        upvoted
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-border text-muted-foreground hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
        isLoading && "opacity-50",
        className
      )}
    >
      <Triangle
        className={cn(
          "h-3.5 w-3.5",
          upvoted ? "fill-emerald-600 text-emerald-600" : ""
        )}
      />
      <span>{count}</span>
    </button>
  )
}
