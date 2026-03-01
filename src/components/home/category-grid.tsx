"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import {
  ArrowRight,
  Target,
  Dna,
  ShoppingCart,
  Wallet,
  CloudSun,
  Bot,
  Truck,
  Cpu,
  Plane,
  Warehouse,
  Heart,
  Fish,
  Globe,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TECH_CATEGORIES } from "@/lib/constants"

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  precision_agriculture: Target,
  biotech: Dna,
  market_linkage: ShoppingCart,
  agri_fintech: Wallet,
  climate_tech: CloudSun,
  robotics: Bot,
  supply_chain: Truck,
  iot_sensors: Cpu,
  drone_tech: Plane,
  storage_processing: Warehouse,
  animal_husbandry: Heart,
  aquaculture: Fish,
}

interface CategoryCount {
  techCategory: string
  _count: { id: number }
}

interface CategoryGridProps {
  categoryCounts: CategoryCount[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
}

export function CategoryGrid({ categoryCounts }: CategoryGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const countMap = new Map(
    categoryCounts.map((c) => [c.techCategory, c._count.id])
  )

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
            <Globe className="mr-1.5 h-3.5 w-3.5" />
            Impact Categories
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Explore the Full Spectrum of Indian Agritech
          </h2>
          <p className="mt-4 text-muted-foreground">
            From precision farming to agri-fintech, discover startups solving
            real problems across the agricultural value chain.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {TECH_CATEGORIES.slice(0, 6).map((cat) => {
            const Icon = CATEGORY_ICONS[cat.value] || Target
            const count = countMap.get(cat.value) || 0

            return (
              <motion.div key={cat.value} variants={itemVariants}>
                <Link href={`/discover?category=${cat.value}`}>
                  <Card className="group h-full cursor-pointer border bg-white transition-all duration-300 hover:border-[#16A34A]/30 hover:-translate-y-1 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#16A34A]/10 transition-colors group-hover:bg-[#16A34A]/20">
                          <Icon className="h-5 w-5 text-[#16A34A]" />
                        </div>
                        {count > 0 && (
                          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {count} startup{count !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {cat.label}
                      </h3>
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
          <Link href="/discover">
            <Button
              variant="outline"
              className="gap-2 border-[#0A4A23]/20 text-[#0A4A23] hover:bg-[#0A4A23]/5"
            >
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
