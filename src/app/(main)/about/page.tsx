import { type Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, Target, Eye, Sprout, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us | AgriVentures India",
  description:
    "AgriVentures India is a verified impact discovery platform making invisible agritech founders visible to the world.",
}

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Verified Impact",
    description:
      "Every startup on our platform goes through a verification process. We believe trust is the foundation of any ecosystem.",
  },
  {
    icon: Eye,
    title: "Visibility for All",
    description:
      "India has thousands of agritech innovators working in the shadows. We exist to bring them into the spotlight.",
  },
  {
    icon: Target,
    title: "India-First Focus",
    description:
      "Built specifically for the Indian agritech ecosystem — from precision farming in Punjab to aquaculture in Kerala.",
  },
  {
    icon: Sprout,
    title: "Ecosystem Growth",
    description:
      "We connect founders with investors, share knowledge, and create pathways for sustainable growth in agriculture.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Making Invisible Founders Visible
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          AgriVentures India is a verified impact discovery platform built for
          the Indian agritech ecosystem. We connect startups, investors, and the
          community to accelerate innovation in agriculture.
        </p>
      </div>

      {/* Mission */}
      <div className="mt-16 rounded-2xl bg-forest/5 p-8 sm:p-10">
        <h2 className="text-xl font-bold text-forest">Our Mission</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          India feeds 1.4 billion people, yet thousands of agritech innovators
          building solutions for farmers remain invisible. They lack access to
          investors, mentors, and markets. AgriVentures India exists to change
          that — we are building the definitive platform where every agritech
          startup in India can be discovered, verified, and connected with the
          resources they need to grow.
        </p>
      </div>

      {/* Values */}
      <div className="mt-16">
        <h2 className="text-center text-xl font-bold text-slate-900">
          What We Stand For
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-slate-200 p-6 transition-shadow hover:shadow-md"
            >
              <value.icon className="h-8 w-8 text-emerald" />
              <h3 className="mt-3 font-semibold text-slate-900">
                {value.title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Built with Claude */}
      <div className="mt-16 rounded-2xl border border-amber-200 bg-amber-50/50 p-8 text-center sm:p-10">
        <p className="text-sm font-medium uppercase tracking-wider text-amber-700">
          Powered by AI
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Built with Claude by Anthropic
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
          AgriVentures India is proudly built with{" "}
          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-700 hover:underline"
          >
            Claude
          </a>
          , Anthropic&apos;s AI assistant. From code architecture to platform
          design, Claude serves as our AI co-founder and CTO.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">
          Join the Ecosystem
        </h2>
        <p className="mt-2 text-slate-600">
          Whether you&apos;re a founder, investor, or agriculture enthusiast —
          there&apos;s a place for you.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/startups/submit">
            <Button className="bg-forest hover:bg-forest/90 text-white">
              Submit Your Startup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/discover">
            <Button variant="outline">Explore Startups</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
