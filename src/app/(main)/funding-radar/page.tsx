import { Metadata } from "next"
import { IndianRupee } from "lucide-react"
import { TECH_CATEGORIES, STARTUP_STAGES } from "@/lib/constants"
import { FUNDING_SCHEMES } from "@/lib/constants/funding-schemes"
import { FundingRadarClient } from "@/components/funding/funding-radar-client"

export const metadata: Metadata = {
  title: "Funding Radar | AgriVentures India",
  description:
    "Discover government grants, subsidies, loans, and funding programs for Indian agritech startups. Find the right scheme for your stage and sector.",
}

export default function FundingRadarPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 mb-4">
            <IndianRupee className="h-7 w-7 text-forest" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-forest sm:text-4xl lg:text-5xl">
            Funding Radar
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover government grants, subsidies, loans, and funding programs
            designed for India&apos;s agritech startups
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>
              {FUNDING_SCHEMES.filter((s) => s.isActive).length} active schemes
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <FundingRadarClient
          schemes={FUNDING_SCHEMES}
          techCategories={TECH_CATEGORIES}
          startupStages={STARTUP_STAGES}
        />
      </section>
    </div>
  )
}
