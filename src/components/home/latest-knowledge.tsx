"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, BookOpen, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string
  publishedAt: Date | null
  author: {
    fullName: string
  }
}

interface LatestKnowledgeProps {
  articles: Article[]
}

const CATEGORY_LABELS: Record<string, string> = {
  GUIDE: "Guide",
  SCHEME: "Government Scheme",
  REPORT: "Research Report",
}

const CATEGORY_COLORS: Record<string, string> = {
  GUIDE: "bg-blue-100 text-blue-800",
  SCHEME: "bg-[#F59E0B]/10 text-[#F59E0B]",
  REPORT: "bg-purple-100 text-purple-800",
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export function LatestKnowledge({ articles }: LatestKnowledgeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  if (articles.length === 0) return null

  return (
    <section className="border-b bg-white py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-4 border-[#16A34A]/30 bg-[#16A34A]/5 px-4 py-1.5 text-[#16A34A]"
          >
            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
            Knowledge Hub
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Latest from the Knowledge Hub
          </h2>
          <p className="mt-4 text-muted-foreground">
            Guides, government schemes, and research reports for the agritech
            community.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {articles.map((article) => {
            const categoryLabel =
              CATEGORY_LABELS[article.category] || article.category
            const categoryColor =
              CATEGORY_COLORS[article.category] || "bg-gray-100 text-gray-800"

            return (
              <motion.div key={article.id} variants={itemVariants}>
                <Link href={`/knowledge/${article.slug}`}>
                  <Card className="group h-full cursor-pointer border transition-all duration-300 hover:border-[#16A34A]/30 hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="p-6">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${categoryColor}`}
                      >
                        {categoryLabel}
                      </span>

                      <h3 className="mt-3 line-clamp-2 text-base font-semibold text-foreground group-hover:text-[#16A34A]">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{article.author.fullName}</span>
                        {article.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.publishedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/knowledge">
            <Button
              variant="outline"
              className="gap-2 border-[#0A4A23]/20 text-[#0A4A23] hover:bg-[#0A4A23]/5"
            >
              Explore Knowledge Hub
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
