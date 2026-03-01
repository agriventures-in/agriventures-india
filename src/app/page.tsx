import Link from "next/link"
import {
  ArrowRight,
  Target,
  Dna,
  ShoppingCart,
  Wallet,
  CloudSun,
  Bot,
  Upload,
  Users,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Sprout,
  BarChart3,
  Globe,
  Handshake,
  BadgeCheck,
  Eye,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCounter } from "@/components/common/stats-counter"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TECH_CATEGORIES } from "@/lib/constants"

/* ---------- icon mapping for the first 6 categories ---------- */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  precision_agriculture: Target,
  biotech: Dna,
  market_linkage: ShoppingCart,
  agri_fintech: Wallet,
  climate_tech: CloudSun,
  robotics: Bot,
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  precision_agriculture:
    "AI-powered crop monitoring, satellite imagery, and data-driven farming decisions for higher yields.",
  biotech:
    "Seed innovation, genetic research, and bio-solutions tackling crop resilience and nutrition.",
  market_linkage:
    "Direct-to-consumer platforms, FPO marketplaces, and transparent price discovery for farmers.",
  agri_fintech:
    "Micro-credit, crop insurance, and digital payment solutions designed for rural India.",
  climate_tech:
    "Carbon tracking, sustainable practices, and climate-resilient agriculture technologies.",
  robotics:
    "Farm automation, autonomous harvesters, and smart machinery reducing manual labor.",
}

const HERO_STATS = [
  { value: "500+", label: "Startups" },
  { value: "65+", label: "Investors" },
  { value: "15%", label: "Verified" },
]

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Submit Your Profile",
    description:
      "Upload your startup data, impact metrics, and field trial evidence. It takes less than 10 minutes.",
    icon: Upload,
  },
  {
    step: 2,
    title: "Community Validates",
    description:
      "The AgriVentures community reviews and upvotes genuine impact. Expert reviewers verify claims.",
    icon: Users,
  },
  {
    step: 3,
    title: "Investors Discover",
    description:
      "Verified startups get matched with thesis-aligned investors. Real traction gets real attention.",
    icon: TrendingUp,
  },
]

const FOUNDER_BENEFITS = [
  "Free forever platform -- no hidden charges",
  "Verified impact badge builds credibility",
  "Direct visibility to 65+ active investors",
  "Community upvotes surface real traction",
  "Government scheme matching & alerts",
  "Job board to attract top agritech talent",
]

const INVESTOR_BENEFITS = [
  "Curated, thesis-matched deal flow",
  "Verified impact data you can trust",
  "Filter by stage, category, and geography",
  "Community validation as social proof",
  "Direct founder connect -- no middlemen",
  "Quarterly verified impact reports",
]

export default function HomePage() {
  const firstSixCategories = TECH_CATEGORIES.slice(0, 6)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ===================== HERO ===================== */}
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-white via-emerald/5 to-lime/10">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-lime/10 blur-3xl" />

          <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-36">
            <div className="mx-auto max-w-4xl text-center">
              <Badge
                variant="outline"
                className="mb-6 border-emerald/30 bg-emerald/5 px-4 py-1.5 text-emerald"
              >
                <Sprout className="mr-1.5 h-3.5 w-3.5" />
                India&apos;s Verified Agritech Platform
              </Badge>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-forest sm:text-4xl md:text-5xl lg:text-6xl">
                Making India&apos;s Invisible{" "}
                <span className="bg-gradient-to-r from-emerald to-lime bg-clip-text text-transparent">
                  Agritech Founders
                </span>{" "}
                Visible
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                The verified impact discovery platform where 4,255+ unfunded
                agritech startups meet investors, corporates, and the farming
                community.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link href="/discover">
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-forest text-white shadow-lg shadow-forest/20 hover:bg-forest/90 sm:w-auto"
                  >
                    Explore Startups
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/startups/submit">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2 border-forest/20 text-forest hover:bg-forest/5 sm:w-auto"
                  >
                    Submit Your Startup
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mx-auto mt-14 flex max-w-lg items-center justify-center gap-4 sm:gap-8 md:gap-12">
                {HERO_STATS.map((stat, idx) => (
                  <div key={stat.label} className="flex items-center gap-4 sm:gap-8 md:gap-12">
                    {idx > 0 && (
                      <div className="h-10 w-px bg-border" />
                    )}
                    <StatsCounter
                      value={stat.value}
                      label={stat.label}
                      className="text-forest"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== HOW IT WORKS ===================== */}
        <section className="border-b bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <Badge
                variant="outline"
                className="mb-4 border-gold/30 bg-gold/5 px-4 py-1.5 text-gold"
              >
                How It Works
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                From Invisible to Investable in Three Steps
              </h2>
              <p className="mt-4 text-muted-foreground">
                A transparent, community-driven process that surfaces real
                impact and connects it with the right capital.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3 md:gap-8">
              {HOW_IT_WORKS.map((item) => (
                <Card
                  key={item.step}
                  className="relative overflow-hidden border-0 bg-gradient-to-b from-white to-muted/30 shadow-md transition-shadow hover:shadow-lg"
                >
                  {/* Step number badge */}
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-emerald/10 text-sm font-bold text-emerald">
                    {item.step}
                  </div>
                  <CardContent className="p-6 pt-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10">
                      <item.icon className="h-6 w-6 text-forest" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Connecting arrows for desktop */}
            <div className="mx-auto mt-2 hidden max-w-5xl items-center justify-around md:flex">
              <div className="flex-1" />
              <ArrowRight className="h-5 w-5 text-emerald/40" />
              <div className="flex-1" />
              <ArrowRight className="h-5 w-5 text-emerald/40" />
              <div className="flex-1" />
            </div>
          </div>
        </section>

        {/* ===================== IMPACT CATEGORIES ===================== */}
        <section className="border-b bg-muted/30 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <Badge
                variant="outline"
                className="mb-4 border-emerald/30 bg-emerald/5 px-4 py-1.5 text-emerald"
              >
                <Globe className="mr-1.5 h-3.5 w-3.5" />
                Impact Categories
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Explore the Full Spectrum of Indian Agritech
              </h2>
              <p className="mt-4 text-muted-foreground">
                From precision farming to agri-fintech, discover startups
                solving real problems across the agricultural value chain.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {firstSixCategories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.value] || Target
                return (
                  <Link href={`/discover?category=${cat.value}`} key={cat.value}>
                    <Card className="group h-full cursor-pointer border bg-white transition-all hover:border-emerald/30 hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald/10 transition-colors group-hover:bg-emerald/20">
                          <Icon className="h-5 w-5 text-emerald" />
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {cat.label}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {CATEGORY_DESCRIPTIONS[cat.value]}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            <div className="mt-10 text-center">
              <Link href="/discover">
                <Button
                  variant="outline"
                  className="gap-2 border-forest/20 text-forest hover:bg-forest/5"
                >
                  View All Categories
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== FOR FOUNDERS / FOR INVESTORS ===================== */}
        <section className="border-b bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                {/* For Founders */}
                <div className="rounded-2xl border bg-gradient-to-br from-emerald/5 to-lime/5 p-8 md:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/15">
                      <Sprout className="h-5 w-5 text-emerald" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      For Founders
                    </h3>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Free forever. Submit your startup, get verified, be
                    discovered by the right investors and partners.
                  </p>
                  <ul className="space-y-3">
                    {FOUNDER_BENEFITS.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald" />
                        <span className="text-sm text-foreground/80">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/startups/submit">
                      <Button className="gap-2 bg-emerald hover:bg-emerald/90 text-white">
                        Submit Your Startup
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* For Investors */}
                <div className="rounded-2xl border bg-gradient-to-br from-gold/5 to-saffron/5 p-8 md:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
                      <BarChart3 className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      For Investors
                    </h3>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Curated deal flow. Thesis-matched. Verified impact data you
                    can trust and act on.
                  </p>
                  <ul className="space-y-3">
                    {INVESTOR_BENEFITS.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                        <span className="text-sm text-foreground/80">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/discover">
                      <Button className="gap-2 bg-gold hover:bg-gold/90 text-white">
                        Explore Deal Flow
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== TRUST INDICATORS ===================== */}
        <section className="border-b bg-muted/20 py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 md:gap-14">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BadgeCheck className="h-5 w-5 text-emerald" />
                <span className="text-sm font-medium">
                  Community Verified
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-5 w-5 text-emerald" />
                <span className="text-sm font-medium">
                  Transparent Impact Data
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Handshake className="h-5 w-5 text-emerald" />
                <span className="text-sm font-medium">
                  Direct Founder Connect
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-5 w-5 text-emerald" />
                <span className="text-sm font-medium">Free for Founders</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== CTA BANNER ===================== */}
        <section className="bg-gradient-to-r from-forest to-emerald py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <ShieldCheck className="mx-auto mb-6 h-12 w-12 text-lime/80" />
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                Join the AgriVentures Community Today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
                Be part of India&apos;s largest verified agritech ecosystem.
                Whether you are building, funding, or farming -- there is a
                place for you here.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-white text-forest shadow-lg hover:bg-white/90 sm:w-auto"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/discover">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2 border-white/30 text-white hover:bg-white/10 sm:w-auto"
                  >
                    Explore Startups
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== BUILT WITH CLAUDE ===================== */}
        <section className="border-t bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex items-center gap-2.5 rounded-full border border-border/60 bg-white px-5 py-2.5 shadow-sm">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#D97706]"
                >
                  <path
                    d="M15.788 3.214c-.492-1.619-2.784-1.619-3.276 0l-1.12 3.682a1.72 1.72 0 0 1-1.082 1.082L6.628 9.098c-1.619.492-1.619 2.784 0 3.276l3.682 1.12a1.72 1.72 0 0 1 1.082 1.082l1.12 3.682c.492 1.619 2.784 1.619 3.276 0l1.12-3.682a1.72 1.72 0 0 1 1.082-1.082l3.682-1.12c1.619-.492 1.619-2.784 0-3.276l-3.682-1.12a1.72 1.72 0 0 1-1.082-1.082l-1.12-3.682Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6.5 2.5c-.2-.8-1.3-.8-1.5 0l-.4 1.3a.8.8 0 0 1-.5.5l-1.3.4c-.8.2-.8 1.3 0 1.5l1.3.4a.8.8 0 0 1 .5.5l.4 1.3c.2.8 1.3.8 1.5 0l.4-1.3a.8.8 0 0 1 .5-.5l1.3-.4c.8-.2.8-1.3 0-1.5l-1.3-.4a.8.8 0 0 1-.5-.5l-.4-1.3Z"
                    fill="currentColor"
                    opacity="0.6"
                  />
                </svg>
                <span className="text-sm font-medium text-foreground/80">
                  Built with{" "}
                  <a
                    href="https://claude.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#D97706] hover:underline"
                  >
                    Claude
                  </a>
                  {" "}by{" "}
                  <a
                    href="https://anthropic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-foreground hover:underline"
                  >
                    Anthropic
                  </a>
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                AI-powered development from architecture to deployment
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
