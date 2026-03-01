"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Rocket, ShieldCheck, Handshake, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const STEPS = [
  {
    step: 1,
    title: "Submit Your Startup",
    description:
      "Upload your startup data, impact metrics, and field trial evidence. It takes less than 10 minutes.",
    icon: Rocket,
    color: "bg-[#16A34A]/10 text-[#16A34A]",
    borderColor: "group-hover:border-[#16A34A]/30",
  },
  {
    step: 2,
    title: "Get Verified",
    description:
      "The AgriVentures community reviews and upvotes genuine impact. Expert reviewers verify claims.",
    icon: ShieldCheck,
    color: "bg-[#F59E0B]/10 text-[#F59E0B]",
    borderColor: "group-hover:border-[#F59E0B]/30",
  },
  {
    step: 3,
    title: "Connect & Grow",
    description:
      "Verified startups get matched with thesis-aligned investors. Real traction gets real attention.",
    icon: Handshake,
    color: "bg-[#0A4A23]/10 text-[#0A4A23]",
    borderColor: "group-hover:border-[#0A4A23]/30",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="border-b bg-[#fafbfc] py-20 md:py-28" ref={ref}>
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
            How It Works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            From Invisible to Investable in Three Steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            A transparent, community-driven process that surfaces real impact
            and connects it with the right capital.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {STEPS.map((item) => (
            <motion.div key={item.step} variants={itemVariants}>
              <Card
                className={`group relative h-full overflow-hidden border bg-white transition-all duration-300 hover:shadow-lg ${item.borderColor}`}
              >
                {/* Step number */}
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A]/10 text-sm font-bold text-[#16A34A]">
                  {item.step}
                </div>
                <CardContent className="p-6 pt-8">
                  <motion.div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className="h-6 w-6" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Connecting arrows for desktop */}
        <motion.div
          className="mx-auto mt-2 hidden max-w-5xl items-center justify-around md:flex"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex-1" />
          <ArrowRight className="h-5 w-5 text-[#16A34A]/40" />
          <div className="flex-1" />
          <ArrowRight className="h-5 w-5 text-[#16A34A]/40" />
          <div className="flex-1" />
        </motion.div>
      </div>
    </section>
  )
}
