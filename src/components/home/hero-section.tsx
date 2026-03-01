"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedCounter } from "@/components/ui/animated-counter"

interface HeroSectionProps {
  totalStartups: number
  totalUsers: number
  stateCount: number
}

export function HeroSection({
  totalStartups,
  totalUsers,
  stateCount,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A4A23] via-[#0d5a2d] to-[#16A34A]">
      {/* Animated background blobs */}
      <motion.div
        className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#4ADE80]/10 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1],
        }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#F59E0B]/5 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1],
        }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#16A34A]/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1],
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-white/20 bg-white/10 px-4 py-1.5 text-white/90 backdrop-blur-sm"
            >
              <Sprout className="mr-1.5 h-3.5 w-3.5" />
              India&apos;s Verified Agritech Platform
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Making India&apos;s{" "}
            <span className="bg-gradient-to-r from-[#4ADE80] to-[#F59E0B] bg-clip-text text-transparent">
              Agritech Startups
            </span>{" "}
            Visible
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            The verified impact discovery platform where agritech startups meet
            investors, corporates, and the farming community.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Link href="/discover">
              <Button
                size="lg"
                className="w-full gap-2 bg-white text-[#0A4A23] shadow-lg shadow-black/20 transition-transform hover:scale-105 hover:bg-white/95 sm:w-auto"
              >
                Discover Startups
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/startups/submit">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-white/30 text-white transition-transform hover:scale-105 hover:bg-white/10 sm:w-auto"
              >
                Submit Your Startup
              </Button>
            </Link>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            className="mx-auto mt-14 flex max-w-lg items-center justify-center gap-8 sm:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col items-center gap-1">
              <AnimatedCounter
                value={totalStartups}
                suffix="+"
                className="text-3xl font-bold tracking-tight text-white md:text-4xl"
              />
              <span className="text-sm text-white/60">Startups</span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="flex flex-col items-center gap-1">
              <AnimatedCounter
                value={totalUsers}
                suffix="+"
                className="text-3xl font-bold tracking-tight text-white md:text-4xl"
              />
              <span className="text-sm text-white/60">Users</span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="flex flex-col items-center gap-1">
              <AnimatedCounter
                value={stateCount}
                className="text-3xl font-bold tracking-tight text-white md:text-4xl"
              />
              <span className="text-sm text-white/60">States</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L60 52C120 44 240 28 360 24C480 20 600 28 720 32C840 36 960 36 1080 32C1200 28 1320 20 1380 16L1440 12V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
