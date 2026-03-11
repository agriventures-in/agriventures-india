import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { BASE_URL } from "@/lib/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/discover`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/knowledge`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/co-founders`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/investors`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/funding-radar`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/campus-scouts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/register`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: "monthly", priority: 0.3 },
  ]

  // Dynamic startup pages
  let startupPages: MetadataRoute.Sitemap = []
  try {
    const startups = await prisma.startup.findMany({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "VERIFIED"] } },
      select: { slug: true, updatedAt: true },
    })
    startupPages = startups.map((s) => ({
      url: `${baseUrl}/startups/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch {
    // Database may not be available during build
  }

  // Dynamic knowledge article pages
  let articlePages: MetadataRoute.Sitemap = []
  try {
    const articles = await prisma.knowledgeArticle.findMany({
      where: { isPublished: true },
      select: { slug: true, publishedAt: true, createdAt: true },
    })
    articlePages = articles.map((a) => ({
      url: `${baseUrl}/knowledge/${a.slug}`,
      lastModified: a.publishedAt ?? a.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch {
    // Database may not be available during build
  }

  return [...staticPages, ...startupPages, ...articlePages]
}
