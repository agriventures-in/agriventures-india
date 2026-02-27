import Link from "next/link"
import { Clock, User, Tag } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { ArticleCategory } from "@prisma/client"

interface ArticleCardProps {
  article: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    category: ArticleCategory
    tags: string[] | null
    content: string
    publishedAt: Date | null
    createdAt: Date
    author: {
      fullName: string
    }
  }
}

const CATEGORY_CONFIG: Record<
  ArticleCategory,
  { label: string; className: string }
> = {
  GUIDE: {
    label: "Founder Guide",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  SCHEME: {
    label: "Government Scheme",
    className: "bg-emerald/10 text-emerald border-emerald/20",
  },
  REPORT: {
    label: "Research Report",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
}

function estimateReadTime(content: string): number {
  const minutes = Math.ceil(content.length / 1000)
  return Math.max(1, minutes)
}

export function ArticleCard({ article }: ArticleCardProps) {
  const categoryConfig = CATEGORY_CONFIG[article.category]
  const readTime = estimateReadTime(article.content)
  const tags = (article.tags ?? []) as string[]

  return (
    <Link href={`/knowledge/${article.slug}`}>
      <Card className="group h-full transition-all duration-200 hover:shadow-lg hover:border-emerald/30 hover:-translate-y-0.5">
        <CardHeader className="pb-3">
          <Badge
            variant="outline"
            className={`w-fit text-[11px] ${categoryConfig.className}`}
          >
            {categoryConfig.label}
          </Badge>
          <h3 className="mt-2 text-lg font-bold leading-tight text-foreground group-hover:text-forest transition-colors line-clamp-2">
            {article.title}
          </h3>
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-4">
          {article.excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] px-2 py-0 font-normal"
                >
                  <Tag className="mr-1 h-2.5 w-2.5" />
                  {tag}
                </Badge>
              ))}
              {tags.length > 4 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0 font-normal"
                >
                  +{tags.length - 4}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{article.author.fullName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>
                {formatDate(article.publishedAt ?? article.createdAt)}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
