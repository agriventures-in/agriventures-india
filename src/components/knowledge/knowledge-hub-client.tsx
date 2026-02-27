"use client"

import { useState, useMemo } from "react"
import { Search, BookOpen, FileText, Landmark, ScrollText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArticleCard } from "@/components/knowledge/article-card"
import type { ArticleCategory } from "@prisma/client"

type Article = {
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

interface KnowledgeHubClientProps {
  articles: Article[]
}

const CATEGORY_TABS = [
  { value: "ALL", label: "All", icon: BookOpen },
  { value: "GUIDE", label: "Founder Guides", icon: FileText },
  { value: "SCHEME", label: "Government Schemes", icon: Landmark },
  { value: "REPORT", label: "Research Reports", icon: ScrollText },
] as const

export function KnowledgeHubClient({ articles }: KnowledgeHubClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("ALL")

  const filteredArticles = useMemo(() => {
    let filtered = articles

    if (activeTab !== "ALL") {
      filtered = filtered.filter(
        (article) => article.category === activeTab
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          (article.excerpt?.toLowerCase().includes(query) ?? false) ||
          ((article.tags as string[]) ?? []).some((tag: string) =>
            tag.toLowerCase().includes(query)
          )
      )
    }

    return filtered
  }, [articles, activeTab, searchQuery])

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles, guides, schemes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center">
          <TabsList className="h-auto flex-wrap gap-1">
            {CATEGORY_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 text-sm"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Article Grid - same for all tabs since filtering is done in state */}
        {CATEGORY_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  No articles found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Articles will appear here once published"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
