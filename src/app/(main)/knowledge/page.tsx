import { Metadata } from "next"
import { BookOpen } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { KnowledgeHubClient } from "@/components/knowledge/knowledge-hub-client"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Knowledge Hub",
  description:
    "Founder guides, government schemes, and research reports for India's agritech ecosystem.",
}

export default async function KnowledgeHubPage() {
  const articles = await prisma.knowledgeArticle.findMany({
    where: { isPublished: true },
    include: {
      author: {
        select: { fullName: true },
      },
    },
    orderBy: { publishedAt: "desc" },
  })

  // Serialize dates for client component
  const serializedArticles = articles.map((article: typeof articles[number]) => ({
    ...article,
    tags: (article.tags ?? []) as string[],
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
    createdAt: new Date(article.createdAt),
  }))

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 mb-4">
            <BookOpen className="h-7 w-7 text-forest" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-forest sm:text-4xl lg:text-5xl">
            Knowledge Hub
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Founder guides, government schemes, and research reports for
            India&apos;s agritech ecosystem
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>{serializedArticles.length} articles published</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <KnowledgeHubClient articles={serializedArticles} />
      </section>
    </div>
  )
}
