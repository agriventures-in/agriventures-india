import { CommentModeration } from "@/components/admin/comment-moderation"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Comment Moderation | Admin",
}

export default function AdminCommentsPage() {
  return <CommentModeration />
}
