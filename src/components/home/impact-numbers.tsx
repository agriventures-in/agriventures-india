"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { TrendingUp, Users, MapPin, ShieldCheck } from "lucide-react"

interface ImpactNumbersProps {
  totalStartups: number
  totalUsers: number
  stateCount: number
  verifiedCount: number
}

const STATS_CONFIG = [
  {
    key: "startups",
    label: "Startups Listed",
    icon: TrendingUp,
    suffix: "+",
  },
  {
    key: "users",
    label: "Community Members",
    icon: Users,
    suffix: "+",
  },
  {
    key: "states",
    label: "States Covered",
    icon: MapPin,
    suffix: "",
  },
  {
    key: "verified",
    label: "Verified Startups",
    icon: ShieldCheck,
    suffix: "",
  },
] as const

export function ImpactNumbers({
  totalStartups,
  totalUsers,
  stateCount,
  verifiedCount,
}: ImpactNumbersProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const values: Record<string, number> = {
    startups: totalStartups,
    users: totalUsers,
    states: stateCount,
    verified: verifiedCount,
  }

  return (
    <section
      className="relative overflow-hidden border-b bg-[#fafbfc] py-20 md:py-28"
      ref={ref}
    >
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0A4A23 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Impact in Numbers
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real metrics from India&apos;s growing agritech ecosystem.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS_CONFIG.map((stat, idx) => (
            <motion.div
              key={stat.key}
              className="flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16A34A]/10">
                <stat.icon className="h-7 w-7 text-[#16A34A]" />
              </div>
              <AnimatedCounter
                value={values[stat.key]}
                suffix={stat.suffix}
                className="text-4xl font-bold tracking-tight text-[#0A4A23] md:text-5xl"
                duration={1.5}
              />
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
