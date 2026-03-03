import { MetadataRoute } from "next"
import { BASE_URL } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BASE_URL

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/profile"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
