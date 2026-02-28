"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { CommentForm } from "@/components/comments/comment-form"
import { CommentThread } from "@/components/comments/comment-thread"

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

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface CommentsSectionProps {
  startupId: string
}

export function CommentsSection({ startupId }: CommentsSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<CommentWithReplies[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (page === 1) {
          setIsLoading(true)
        } else {
          setIsLoadingMore(true)
        }
        setError(null)

        const res = await fetch(
          `/api/startups/${startupId}/comments?page=${page}&limit=20`
        )

        if (!res.ok) {
          throw new Error("Failed to load comments")
        }

        const data = await res.json()

        if (append) {
          setComments((prev) => [...prev, ...data.comments])
        } else {
          setComments(data.comments)
        }
        setPagination(data.pagination)
      } catch {
        setError("Failed to load comments. Please try again.")
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [startupId]
  )

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  function handleRefresh() {
    fetchComments(1)
  }

  function handleLoadMore() {
    if (pagination && pagination.page < pagination.totalPages) {
      fetchComments(pagination.page + 1, true)
    }
  }

  const totalComments = pagination?.total ?? 0
  const hasMore = pagination ? pagination.page < pagination.totalPages : false

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">
          {totalComments === 0
            ? "Comments"
            : `${totalComments} Comment${totalComments !== 1 ? "s" : ""}`}
        </h3>
      </div>

      {/* New comment form */}
      <Card>
        <CardContent className="p-4">
          <CommentForm startupId={startupId} onSubmit={handleRefresh} />
        </CardContent>
      </Card>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-3 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-muted" />
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-2/3 rounded bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => fetchComments(1)}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comments list */}
      {!isLoading && !error && comments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && comments.length > 0 && (
        <Card>
          <CardContent className="space-y-4 p-4">
            {comments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                startupId={startupId}
                currentUserId={session?.user?.id}
                currentUserRole={session?.user?.role}
                onRefresh={handleRefresh}
                depth={0}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load more comments"}
          </Button>
        </div>
      )}
    </div>
  )
}
