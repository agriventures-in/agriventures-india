import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, User, Calendar, Tag } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import type { ArticleCategory } from "@prisma/client"

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

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.knowledgeArticle.findUnique({
    where: { slug: params.slug },
    select: { title: true, excerpt: true },
  })

  if (!article) {
    return { title: "Article Not Found" }
  }

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const article = await prisma.knowledgeArticle.findUnique({
    where: { slug: params.slug, isPublished: true },
    include: {
      author: {
        select: { fullName: true, avatarUrl: true, organization: true },
      },
    },
  })

  if (!article) {
    notFound()
  }

  // Fetch related articles (same category, exclude current)
  const relatedArticles = await prisma.knowledgeArticle.findMany({
    where: {
      category: article.category,
      isPublished: true,
      id: { not: article.id },
    },
    include: {
      author: {
        select: { fullName: true },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  })

  const categoryConfig = CATEGORY_CONFIG[article.category]
  const readTime = Math.max(1, Math.ceil(article.content.length / 1000))
  const tags = (article.tags ?? []) as string[]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-10">
          <Link href="/knowledge">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Knowledge Hub
            </Button>
          </Link>

          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className={`mb-4 ${categoryConfig.className}`}
            >
              {categoryConfig.label}
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-forest sm:text-4xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {article.author.fullName}
                </span>
                {article.author.organization && (
                  <span>at {article.author.organization}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(article.publishedAt ?? article.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Main Content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            <div
              className="prose prose-lg prose-gray max-w-none
                prose-headings:text-forest prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:leading-relaxed prose-p:text-foreground/80
                prose-a:text-emerald prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-ul:my-4 prose-li:text-foreground/80
                prose-blockquote:border-l-emerald prose-blockquote:text-muted-foreground"
            >
              {/* Render content as paragraphs (simple text rendering) */}
              {article.content.split("\n\n").map((paragraph: string, index: number) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-forest mt-8 mb-4">
                      {paragraph.replace("# ", "")}
                    </h2>
                  )
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h3 key={index} className="text-xl font-bold text-forest mt-6 mb-3">
                      {paragraph.replace("## ", "")}
                    </h3>
                  )
                }
                if (paragraph.startsWith("- ") || paragraph.startsWith("* ")) {
                  const items = paragraph.split("\n").map((item: string) =>
                    item.replace(/^[-*]\s/, "")
                  )
                  return (
                    <ul key={index} className="my-4 space-y-2 list-disc pl-6">
                      {items.map((item: string, i: number) => (
                        <li key={i} className="text-foreground/80">{item}</li>
                      ))}
                    </ul>
                  )
                }
                return (
                  <p key={index} className="leading-relaxed text-foreground/80 mb-4">
                    {paragraph}
                  </p>
                )
              })}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <>
                <Separator className="my-8" />
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            {relatedArticles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedArticles.map((related: typeof relatedArticles[number]) => (
                    <Link
                      key={related.id}
                      href={`/knowledge/${related.slug}`}
                      className="block group"
                    >
                      <Badge
                        variant="outline"
                        className={`text-[10px] mb-1.5 ${
                          CATEGORY_CONFIG[related.category].className
                        }`}
                      >
                        {CATEGORY_CONFIG[related.category].label}
                      </Badge>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-forest transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(related.publishedAt ?? related.createdAt)}
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}
