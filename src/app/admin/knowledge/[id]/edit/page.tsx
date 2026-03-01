import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArticleForm } from "@/components/admin/article-form"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Edit Article",
}

interface Props {
  params: { id: string }
}

export default async function EditArticlePage({ params }: Props) {
  const article = await prisma.knowledgeArticle.findUnique({
    where: { id: params.id },
  })

  if (!article) {
    notFound()
  }

  const initialData = {
    id: article.id,
    title: article.title,
    category: article.category,
    content: article.content,
    excerpt: article.excerpt ?? "",
    tags: (article.tags as string[]) ?? [],
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Article</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update &ldquo;{article.title}&rdquo;
        </p>
      </div>

      <ArticleForm initialData={initialData} />
    </div>
  )
}
