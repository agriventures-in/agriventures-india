"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, Building2, User } from "lucide-react"

interface IntroRequestData {
  id: string
  message: string
  status: "PENDING" | "ACCEPTED" | "DECLINED"
  createdAt: string
  startup: {
    id: string
    name: string
    slug?: string
  }
  fromUser?: {
    id: string
    fullName: string
    email?: string
    organization?: string | null
    avatarUrl?: string | null
  }
}

interface IntroResponseDialogProps {
  intro: IntroRequestData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRespond: () => void
}

export function IntroResponseDialog({
  intro,
  open,
  onOpenChange,
  onRespond,
}: IntroResponseDialogProps) {
  const [responseNote, setResponseNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [action, setAction] = useState<"ACCEPTED" | "DECLINED" | null>(null)

  async function handleRespond(status: "ACCEPTED" | "DECLINED") {
    if (!intro) return

    setIsSubmitting(true)
    setAction(status)

    try {
      const res = await fetch(`/api/intros/${intro.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          responseNote: responseNote.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.message || "Something went wrong")
        return
      }

      toast.success(
        status === "ACCEPTED"
          ? "Introduction accepted!"
          : "Introduction declined.",
        {
          description:
            status === "ACCEPTED"
              ? `You accepted the introduction from ${intro.fromUser?.fullName || "the requester"}.`
              : `You declined the introduction from ${intro.fromUser?.fullName || "the requester"}.`,
        }
      )

      setResponseNote("")
      onOpenChange(false)
      onRespond()
    } catch {
      toast.error("Failed to respond. Please try again.")
    } finally {
      setIsSubmitting(false)
      setAction(null)
    }
  }

  if (!intro) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Introduction Request</DialogTitle>
          <DialogDescription>
            Review and respond to this introduction request for{" "}
            <span className="font-medium text-foreground">
              {intro.startup.name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Requester info */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {intro.fromUser?.fullName || "Unknown"}
              </span>
            </div>
            {intro.fromUser?.organization && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {intro.fromUser.organization}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {new Date(intro.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Message</p>
            <div className="rounded-md border bg-background p-3">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {intro.message}
              </p>
            </div>
          </div>

          {/* Response note */}
          <div className="space-y-2">
            <label
              htmlFor="response-note"
              className="text-sm font-medium leading-none"
            >
              Response Note{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Textarea
              id="response-note"
              placeholder="Add an optional note to your response..."
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              {responseNote.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            onClick={() => handleRespond("DECLINED")}
            disabled={isSubmitting}
          >
            {isSubmitting && action === "DECLINED" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}
            Decline
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={() => handleRespond("ACCEPTED")}
            disabled={isSubmitting}
          >
            {isSubmitting && action === "ACCEPTED" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
