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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"

interface IntroRequestDialogProps {
  startupId: string
  startupName: string
  founderId: string
  founderName: string
  trigger?: React.ReactNode
}

export function IntroRequestDialog({
  startupId,
  startupName,
  founderName,
  trigger,
}: IntroRequestDialogProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const charCount = message.length
  const maxChars = 500

  async function handleSubmit() {
    if (!message.trim()) {
      setError("Please enter a message")
      return
    }

    if (message.length > maxChars) {
      setError(`Message must be ${maxChars} characters or less`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/intros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId, message: message.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (res.status === 409) {
          setError("You have already requested an introduction to this startup")
        } else {
          setError(data.message || "Something went wrong")
        }
        return
      }

      toast.success("Introduction request sent!", {
        description: `Your request has been sent to ${founderName}.`,
      })

      setMessage("")
      setOpen(false)
    } catch {
      setError("Failed to send request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value)
      if (!value) {
        setError(null)
      }
    }}>
      <DialogTrigger asChild>
        {trigger || <Button className="w-full">Request Introduction</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Introduction</DialogTitle>
          <DialogDescription>
            Send an introduction request to{" "}
            <span className="font-medium text-foreground">{founderName}</span>{" "}
            at{" "}
            <span className="font-medium text-foreground">{startupName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="intro-message"
              className="text-sm font-medium leading-none"
            >
              Your Message
            </label>
            <Textarea
              id="intro-message"
              placeholder="Introduce yourself and explain why you'd like to connect..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (error) setError(null)
              }}
              rows={5}
              className="resize-none"
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between">
              <p className={`text-xs ${charCount > maxChars ? "text-destructive" : "text-muted-foreground"}`}>
                {charCount}/{maxChars} characters
              </p>
              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !message.trim() || charCount > maxChars}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
