"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ArticleFormProps {
  initialData?: {
    id: string
    title: string
    category: string
    content: string
    excerpt: string
    tags: string[]
  }
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(initialData?.title || "")
  const [category, setCategory] = useState(initialData?.category || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "")

  const isEditing = !!initialData

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !category || !content.trim()) {
      toast.error("Title, category, and content are required")
      return
    }

    setLoading(true)
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const body = {
        title: title.trim(),
        category,
        content: content.trim(),
        excerpt: excerpt.trim() || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
      }

      const url = isEditing
        ? `/api/knowledge/${initialData.id}`
        : "/api/knowledge"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save article")
      }

      toast.success(isEditing ? "Article updated" : "Article created")
      router.push("/admin/knowledge")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save article")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Article" : "Create New Article"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GUIDE">Guide</SelectItem>
                <SelectItem value="SCHEME">Government Scheme</SelectItem>
                <SelectItem value="REPORT">Research Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief summary of the article..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write the article content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              required
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g. farming, technology, subsidies"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Article" : "Create Article"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/knowledge")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
