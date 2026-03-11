"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Search,
  Trash2,
  Loader2,
  EyeOff,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CommentUser {
  id: string
  fullName: string
  avatarUrl: string | null
  email: string
  role: string
}

interface CommentStartup {
  id: string
  name: string
  slug: string
}

interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string | null
  userId: string
  startupId: string
  parentId: string | null
  user: CommentUser
  startup: CommentStartup
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const HIDDEN_PREFIX = "[HIDDEN BY ADMIN]"

export function CommentModeration() {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null)

  const fetchComments = useCallback(
    async (page: number, searchQuery: string) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
        })
        if (searchQuery) {
          params.set("search", searchQuery)
        }

        const res = await fetch(`/api/admin/comments?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch comments")

        const data = await res.json()
        setComments(data.comments)
        setPagination(data.pagination)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load comments"
        )
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchComments(pagination.page, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearch() {
    setSearch(searchInput)
    fetchComments(1, searchInput)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  function handlePageChange(newPage: number) {
    fetchComments(newPage, search)
  }

  function isHidden(comment: Comment) {
    return comment.content.startsWith(HIDDEN_PREFIX)
  }

  async function handleToggleVisibility(comment: Comment) {
    setActionLoading(comment.id)
    try {
      const hidden = isHidden(comment)
      let newContent: string

      if (hidden) {
        // Restore: remove the hidden prefix
        newContent = comment.content.replace(HIDDEN_PREFIX + " ", "")
      } else {
        // Hide: prepend hidden prefix
        newContent = `${HIDDEN_PREFIX} ${comment.content}`
      }

      const res = await fetch(`/api/admin/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to update comment")
      }

      toast.success(hidden ? "Comment restored" : "Comment hidden")
      fetchComments(pagination.page, search)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update comment"
      )
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setActionLoading(deleteTarget.id)
    try {
      const res = await fetch(`/api/admin/comments/${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to delete comment")
      }

      toast.success("Comment deleted permanently")
      setDeleteTarget(null)
      fetchComments(pagination.page, search)
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete comment"
      )
    } finally {
      setActionLoading(null)
    }
  }

  function truncate(text: string, maxLength: number) {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Comment Moderation
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and moderate all comments on the platform.
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          {pagination.total} total comments
        </Badge>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by user, startup, or content..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} variant="outline">
          Search
        </Button>
        {search && (
          <Button
            onClick={() => {
              setSearchInput("")
              setSearch("")
              fetchComments(1, "")
            }}
            variant="ghost"
            size="sm"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            <span className="ml-2 text-sm text-slate-500">
              Loading comments...
            </span>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              {search ? "No comments match your search." : "No comments yet."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">User</TableHead>
                <TableHead>Startup</TableHead>
                <TableHead className="hidden md:table-cell">Comment</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => {
                const hidden = isHidden(comment)
                return (
                  <TableRow
                    key={comment.id}
                    className={hidden ? "bg-red-50/50" : ""}
                  >
                    <TableCell className="pl-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {comment.user.fullName}
                        </div>
                        <div className="text-xs text-slate-400">
                          {comment.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/startups/${comment.startup.slug}`}
                        target="_blank"
                        className="text-sm text-emerald-700 hover:underline inline-flex items-center gap-1"
                      >
                        {comment.startup.name}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs">
                      <p
                        className={`text-sm ${hidden ? "text-red-500 italic" : "text-slate-600"}`}
                        title={comment.content}
                      >
                        {truncate(comment.content, 100)}
                      </p>
                      {comment.parentId && (
                        <span className="text-xs text-slate-400">
                          (reply)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-xs text-slate-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {hidden ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          Hidden
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          Visible
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleVisibility(comment)}
                          disabled={actionLoading === comment.id}
                          title={hidden ? "Show comment" : "Hide comment"}
                        >
                          {actionLoading === comment.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : hidden ? (
                            <Eye className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(comment)}
                          disabled={actionLoading === comment.id}
                          title="Delete comment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
              comments)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              comment
              {deleteTarget?.user.fullName
                ? ` by ${deleteTarget.user.fullName}`
                : ""}
              {" "}and any replies to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!!actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete Comment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
