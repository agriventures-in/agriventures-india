"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-[#0A4A23] to-[#16A34A] py-20 md:py-28"
      ref={ref}
    >
      {/* Animated background blobs */}
      <motion.div
        className="pointer-events-none absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-[#4ADE80]/10 blur-3xl"
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1],
        }}
      />
      <motion.div
        className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-[#F59E0B]/5 blur-3xl"
        animate={{
          x: [0, -15, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1],
        }}
      />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <ShieldCheck className="mx-auto mb-6 h-12 w-12 text-[#4ADE80]/80" />
          </motion.div>

          <motion.h2
            className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Ready to Put Your Agritech Startup on the Map?
          </motion.h2>

          <motion.p
            className="mx-auto mt-4 max-w-xl text-lg text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Be part of India&apos;s largest verified agritech ecosystem.
            Whether you are building, funding, or farming -- there is a place
            for you here.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="w-full gap-2 bg-white text-[#0A4A23] shadow-lg transition-transform hover:scale-105 hover:bg-white/95 sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-white/30 text-white transition-transform hover:scale-105 hover:bg-white/10 sm:w-auto"
              >
                Explore Startups
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
