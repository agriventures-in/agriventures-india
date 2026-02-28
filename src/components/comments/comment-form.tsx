"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare } from "lucide-react"

const MAX_CHARS = 2000

interface CommentFormProps {
  startupId: string
  parentId?: string
  onSubmit: () => void
  onCancel?: () => void
  placeholder?: string
}

export function CommentForm({
  startupId,
  parentId,
  onSubmit,
  onCancel,
  placeholder,
}: CommentFormProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isReply = !!parentId
  const charCount = content.length

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        <MessageSquare className="h-4 w-4" />
        <span>
          <a href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </a>{" "}
          to leave a comment
        </span>
      </div>
    )
  }

  async function handleSubmit() {
    const trimmed = content.trim()
    if (!trimmed) return

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/startups/${startupId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: trimmed,
          ...(parentId ? { parentId } : {}),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || "Failed to post comment")
        return
      }

      setContent("")
      onSubmit()
    } catch {
      setError("Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CHARS) {
            setContent(e.target.value)
          }
        }}
        placeholder={placeholder || (isReply ? "Write a reply..." : "Share your thoughts...")}
        rows={isReply ? 2 : 3}
        className={isReply ? "text-sm" : ""}
        disabled={isSubmitting}
      />
      <div className="flex items-center justify-between">
        <span
          className={`text-xs ${
            charCount > MAX_CHARS * 0.9
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {charCount}/{MAX_CHARS}
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "Posting..." : isReply ? "Reply" : "Comment"}
          </Button>
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
