"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Star, StarOff, Trash2, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"
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

interface StartupActionsProps {
  startupId: string
  startupSlug: string
  isFeatured: boolean
}

export function StartupActions({
  startupId,
  startupSlug,
  isFeatured,
}: StartupActionsProps) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [featureLoading, setFeatureLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleFeatureToggle() {
    setFeatureLoading(true)
    try {
      const res = await fetch(`/api/startups/${startupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update")
      }

      toast.success(isFeatured ? "Startup unfeatured" : "Startup featured")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update")
    } finally {
      setFeatureLoading(false)
    }
  }

  async function handleDelete() {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/startups/${startupId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete")
      }

      toast.success("Startup deleted")
      setDeleteOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="h-8 w-8"
      >
        <Link href={`/startups/${startupSlug}`} target="_blank">
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleFeatureToggle}
        disabled={featureLoading}
      >
        {featureLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isFeatured ? (
          <StarOff className="h-3.5 w-3.5 text-amber-500" />
        ) : (
          <Star className="h-3.5 w-3.5 text-slate-400" />
        )}
      </Button>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Startup</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              startup and all associated data including upvotes, comments, and
              verification requests.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Startup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
