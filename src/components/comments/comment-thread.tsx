"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Reply,
  Pencil,
  Trash2,
  CornerDownRight,
  AlertTriangle,
} from "lucide-react"
import { timeAgo } from "@/lib/utils"
import { CommentForm } from "@/components/comments/comment-form"

interface CommentUser {
  id: string
  fullName: string
  avatarUrl: string | null
  role: string
}

interface CommentWithReplies {
  id: string
  content: string
  createdAt: string
  updatedAt: string | null
  parentId: string | null
  user: CommentUser
  replies: CommentWithReplies[]
}

const EDIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_CHARS = 2000

interface CommentThreadProps {
  comment: CommentWithReplies
  startupId: string
  currentUserId?: string
  currentUserRole?: string
  onRefresh: () => void
  depth?: number
}

function getRoleBadge(role: string) {
  switch (role) {
    case "FOUNDER":
      return (
        <Badge variant="secondary" className="text-xs px-1.5 py-0">
          Founder
        </Badge>
      )
    case "INVESTOR":
      return (
        <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-emerald-100 text-emerald-800">
          Investor
        </Badge>
      )
    case "ADMIN":
      return (
        <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-amber-100 text-amber-800">
          Admin
        </Badge>
      )
    default:
      return null
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()
}

export function CommentThread({
  comment,
  startupId,
  currentUserId,
  currentUserRole,
  onRefresh,
  depth = 0,
}: CommentThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isAuthor = currentUserId === comment.user.id
  const isAdmin = currentUserRole === "ADMIN"
  const canDelete = isAuthor || isAdmin
  const canEdit =
    isAuthor &&
    Date.now() - new Date(comment.createdAt).getTime() < EDIT_WINDOW_MS
  const canReply = depth < 1 // Only allow replies at depth 0 (top-level) to keep 2-level max
  const isEdited =
    comment.updatedAt &&
    comment.updatedAt !== comment.createdAt

  async function handleEdit() {
    const trimmed = editContent.trim()
    if (!trimmed || trimmed === comment.content) {
      setIsEditing(false)
      setEditContent(comment.content)
      return
    }

    setIsEditSubmitting(true)
    setEditError(null)

    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      })

      if (!res.ok) {
        const data = await res.json()
        setEditError(data.message || "Failed to edit comment")
        return
      }

      setIsEditing(false)
      onRefresh()
    } catch {
      setEditError("Failed to edit comment. Please try again.")
    } finally {
      setIsEditSubmitting(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        console.error("Failed to delete comment:", data.message)
      }

      setShowDeleteConfirm(false)
      onRefresh()
    } catch {
      console.error("Failed to delete comment")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={depth > 0 ? "ml-6 sm:ml-10" : ""}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          {comment.user.avatarUrl && (
            <AvatarImage
              src={comment.user.avatarUrl}
              alt={comment.user.fullName}
            />
          )}
          <AvatarFallback className="text-xs">
            {getInitials(comment.user.fullName)}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-medium">{comment.user.fullName}</span>
            {getRoleBadge(comment.user.role)}
            <span className="text-xs text-muted-foreground">
              {timeAgo(comment.createdAt)}
            </span>
            {isEdited && (
              <span className="text-xs text-muted-foreground italic">
                (edited)
              </span>
            )}
          </div>

          {/* Body */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setEditContent(e.target.value)
                  }
                }}
                rows={2}
                className="text-sm"
                disabled={isEditSubmitting}
              />
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs ${
                    editContent.length > MAX_CHARS * 0.9
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {editContent.length}/{MAX_CHARS}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false)
                      setEditContent(comment.content)
                      setEditError(null)
                    }}
                    disabled={isEditSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleEdit}
                    disabled={isEditSubmitting || !editContent.trim()}
                  >
                    {isEditSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
              {editError && (
                <p className="text-xs text-destructive">{editError}</p>
              )}
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="mt-1.5 flex items-center gap-1">
              {canReply && currentUserId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  <Reply className="mr-1 h-3 w-3" />
                  Reply
                </Button>
              )}
              {canEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </Button>
              )}
              {canDelete && !showDeleteConfirm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              )}
            </div>
          )}

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="mt-2 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2">
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
              <span className="text-xs text-destructive">
                Delete this comment{comment.replies?.length > 0 ? " and its replies" : ""}?
              </span>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          )}

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-3">
              <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
                <CornerDownRight className="h-3 w-3" />
                <span>Replying to {comment.user.fullName}</span>
              </div>
              <CommentForm
                startupId={startupId}
                parentId={comment.id}
                onSubmit={() => {
                  setShowReplyForm(false)
                  onRefresh()
                }}
                onCancel={() => setShowReplyForm(false)}
                placeholder={`Reply to ${comment.user.fullName}...`}
              />
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentThread
                  key={reply.id}
                  comment={reply}
                  startupId={startupId}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                  onRefresh={onRefresh}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {depth === 0 && <Separator className="mt-4" />}
    </div>
  )
}
