import { prisma } from "@/lib/prisma"
import { CoFounderList } from "@/components/cofounder/cofounder-list"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Co-Founder Matchmaker | AgriVentures India",
  description: "Find your perfect agritech co-founder. Match with complementary skills across India's agricultural ecosystem.",
}

export default async function CoFoundersPage() {
  const [profiles, total] = await Promise.all([
    prisma.coFounderProfile.findMany({
      where: { isActive: true },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
        startup: { select: { id: true, name: true, slug: true, logoUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.coFounderProfile.count({ where: { isActive: true } }),
  ])

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <Badge variant="outline" className="mb-4 border-emerald/30 bg-emerald/5 px-4 py-1.5 text-emerald">
          <Users className="mr-1.5 h-3.5 w-3.5" />
          Co-Founder Matchmaker
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Find Your Perfect Co-Founder
        </h1>
        <p className="mt-3 text-muted-foreground">
          {total} agritech builders are looking for their other half. Match with complementary skills and build together.
        </p>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CoFounderList initialProfiles={JSON.parse(JSON.stringify(profiles)) as any} initialTotal={total} />
    </div>
  )
}
