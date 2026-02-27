import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { KnowledgeActions } from "@/components/admin/knowledge-actions"
import { formatDate } from "@/lib/utils"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

const categoryColors: Record<string, string> = {
  GUIDE: "bg-blue-100 text-blue-700",
  SCHEME: "bg-emerald-100 text-emerald-700",
  REPORT: "bg-purple-100 text-purple-700",
}

async function getArticles() {
  return prisma.knowledgeArticle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { fullName: true },
      },
    },
  })
}

export default async function KnowledgeManagementPage() {
  const articles = await getArticles()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Knowledge Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage guides, government schemes, and research reports.
          </p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/admin/knowledge/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-slate-500">No articles yet.</p>
              <Button
                asChild
                variant="outline"
                className="mt-4"
              >
                <Link href="/admin/knowledge/create">Create your first article</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Created</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article: any) => (
                  <TableRow key={article.id}>
                    <TableCell className="pl-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {article.title}
                        </p>
                        {article.excerpt && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          categoryColors[article.category] ||
                          "bg-slate-100 text-slate-600"
                        } hover:opacity-90`}
                      >
                        {article.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-slate-600">
                        {article.author.fullName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={article.isPublished ? "default" : "outline"}
                        className={
                          article.isPublished
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : ""
                        }
                      >
                        {article.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-slate-500">
                        {formatDate(article.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <KnowledgeActions
                        articleId={article.id}
                        isPublished={article.isPublished}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
