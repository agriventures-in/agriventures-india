"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TECH_CATEGORIES } from "@/lib/constants"

interface FeaturedStartup {
  id: string
  name: string
  slug: string
  tagline: string
  logoUrl: string | null
  techCategory: string
  state: string | null
  upvoteCount: number
  verificationLevel: string
}

interface FeaturedStartupsProps {
  startups: FeaturedStartup[]
}

const CATEGORY_COLORS: Record<string, string> = {
  precision_agriculture: "bg-blue-100 text-blue-800",
  biotech: "bg-purple-100 text-purple-800",
  market_linkage: "bg-orange-100 text-orange-800",
  agri_fintech: "bg-green-100 text-green-800",
  climate_tech: "bg-teal-100 text-teal-800",
  robotics: "bg-red-100 text-red-800",
  supply_chain: "bg-yellow-100 text-yellow-800",
  iot_sensors: "bg-indigo-100 text-indigo-800",
  drone_tech: "bg-sky-100 text-sky-800",
  storage_processing: "bg-amber-100 text-amber-800",
  animal_husbandry: "bg-pink-100 text-pink-800",
  aquaculture: "bg-cyan-100 text-cyan-800",
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export function FeaturedStartups({ startups }: FeaturedStartupsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  if (startups.length === 0) return null

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
            className="mb-4 border-[#F59E0B]/30 bg-[#F59E0B]/5 px-4 py-1.5 text-[#F59E0B]"
          >
            Featured Startups
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Featured on AgriVentures
          </h2>
          <p className="mt-4 text-muted-foreground">
            Handpicked startups making real impact in Indian agriculture.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {startups.map((startup) => {
            const categoryLabel =
              TECH_CATEGORIES.find((c) => c.value === startup.techCategory)
                ?.label || startup.techCategory
            const categoryColor =
              CATEGORY_COLORS[startup.techCategory] ||
              "bg-gray-100 text-gray-800"
            const initial = startup.name.charAt(0).toUpperCase()

            return (
              <motion.div key={startup.id} variants={itemVariants}>
                <Link href={`/startups/${startup.slug}`}>
                  <Card className="group h-full cursor-pointer overflow-hidden border transition-all duration-300 hover:border-[#16A34A]/30 hover:shadow-lg hover:shadow-[#16A34A]/5">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Logo / Initial */}
                        {startup.logoUrl ? (
                          <Image
                            src={startup.logoUrl}
                            alt={startup.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#16A34A]/10 text-lg font-bold text-[#16A34A]">
                            {initial}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-base font-semibold text-foreground">
                              {startup.name}
                            </h3>
                            <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                          {startup.state && (
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {startup.state}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {startup.tagline}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${categoryColor}`}
                        >
                          {categoryLabel}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {startup.upvoteCount} upvotes
                        </span>
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
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link href="/discover">
            <Button
              variant="outline"
              className="gap-2 border-[#0A4A23]/20 text-[#0A4A23] hover:bg-[#0A4A23]/5"
            >
              View All Startups
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
