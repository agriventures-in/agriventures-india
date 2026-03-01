"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Star,
  StarOff,
  Trash2,
  Loader2,
  ExternalLink,
  MoreHorizontal,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  FileEdit,
  Eye,
  Send,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface StartupActionsProps {
  startupId: string
  startupSlug: string
  currentStatus?: string
  currentVerification?: string
  isFeatured: boolean
}

const STATUSES = [
  { value: "DRAFT", label: "Draft", icon: FileEdit },
  { value: "SUBMITTED", label: "Submitted", icon: Send },
  { value: "UNDER_REVIEW", label: "Under Review", icon: Clock },
  { value: "VERIFIED", label: "Verified", icon: CheckCircle2 },
  { value: "REJECTED", label: "Rejected", icon: XCircle },
]

const VERIFICATION_LEVELS = [
  { value: "NONE", label: "None", icon: Shield },
  { value: "COMMUNITY", label: "Community", icon: ShieldAlert },
  { value: "EXPERT", label: "Expert", icon: ShieldCheck },
  { value: "FULL", label: "Full", icon: ShieldCheck },
]

export function StartupActions({
  startupId,
  startupSlug,
  currentStatus,
  currentVerification,
  isFeatured,
}: StartupActionsProps) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleUpdate(data: Record<string, unknown>) {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/startups/${startupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "Failed to update")
      }

      toast.success("Startup updated successfully")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update")
    } finally {
      setIsUpdating(false)
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
    <>
      <div className="flex items-center gap-1">
        {/* Quick view */}
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link href={`/startups/${startupSlug}`} target="_blank">
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </Button>

        {/* Quick feature toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleUpdate({ isFeatured: !isFeatured })}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isFeatured ? (
            <StarOff className="h-3.5 w-3.5 text-amber-500" />
          ) : (
            <Star className="h-3.5 w-3.5 text-slate-400" />
          )}
        </Button>

        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Manage Startup</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Change Status */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Change Status
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {STATUSES.map((status) => {
                  const Icon = status.icon
                  const isActive = currentStatus === status.value
                  return (
                    <DropdownMenuItem
                      key={status.value}
                      onClick={() => handleUpdate({ status: status.value })}
                      disabled={isActive}
                      className={isActive ? "bg-accent font-medium" : ""}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {status.label}
                      {isActive && (
                        <span className="ml-auto text-xs text-muted-foreground">Current</span>
                      )}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Change Verification Level */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verification Level
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {VERIFICATION_LEVELS.map((level) => {
                  const Icon = level.icon
                  const isActive = currentVerification === level.value
                  return (
                    <DropdownMenuItem
                      key={level.value}
                      onClick={() => handleUpdate({ verificationLevel: level.value })}
                      disabled={isActive}
                      className={isActive ? "bg-accent font-medium" : ""}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {level.label}
                      {isActive && (
                        <span className="ml-auto text-xs text-muted-foreground">Current</span>
                      )}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {/* Feature/Unfeature */}
            <DropdownMenuItem onClick={() => handleUpdate({ isFeatured: !isFeatured })}>
              {isFeatured ? (
                <>
                  <StarOff className="mr-2 h-4 w-4 text-amber-500" />
                  Remove from Featured
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  Add to Featured
                </>
              )}
            </DropdownMenuItem>

            {/* View public page */}
            <DropdownMenuItem asChild>
              <Link href={`/startups/${startupSlug}`} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Public Page
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Delete */}
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Startup
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Startup</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              startup and all associated data including upvotes, comments, jobs,
              and verification requests.
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
    </>
  )
}
