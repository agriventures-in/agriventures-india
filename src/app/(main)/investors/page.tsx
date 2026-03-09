import { prisma } from "@/lib/prisma"
import { InvestorDiscovery } from "@/components/investor/investor-discovery"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Investor Discovery | AgriVentures India",
  description: "Discover thesis-aligned agritech investors. Filter by stage, category, and check size.",
}

export default async function InvestorsPage() {
  const [investors, total] = await Promise.all([
    prisma.investorProfile.findMany({
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true, linkedinUrl: true, organization: true },
        },
      },
      orderBy: { portfolioCount: "desc" },
      take: 12,
    }),
    prisma.investorProfile.count(),
  ])

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <Badge variant="outline" className="mb-4 border-gold/30 bg-gold/5 px-4 py-1.5 text-gold">
          <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
          Investor Discovery
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Find the Right Investor for Your Startup
        </h1>
        <p className="mt-3 text-muted-foreground">
          {total} investors actively looking at agritech deals. Filter by thesis, stage, and check size to find your match.
        </p>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <InvestorDiscovery initialInvestors={JSON.parse(JSON.stringify(investors)) as any} initialTotal={total} />
    </div>
  )
}
