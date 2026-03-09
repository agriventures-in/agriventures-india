import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, MapPin, Trophy, ArrowRight, Star } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Campus Scout Program | AgriVentures India",
  description: "Join the campus scout program. Help discover agritech startups from your college and earn recognition.",
}

export default async function CampusScoutsPage() {
  const [scouts, totalApplicants, totalActive] = await Promise.all([
    prisma.campusScout.findMany({
      where: { status: "ACTIVE" },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { points: "desc" },
      take: 20,
    }),
    prisma.campusScout.count(),
    prisma.campusScout.count({ where: { status: "ACTIVE" } }),
  ])

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <Badge variant="outline" className="mb-4 border-gold/30 bg-gold/5 px-4 py-1.5 text-gold">
          <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
          Campus Scout Program
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Be the Eyes of AgriVentures on Your Campus
        </h1>
        <p className="mt-3 text-muted-foreground">
          Help us discover the next big agritech startup from your college. Earn points, get recognized, and build your network.
        </p>

        {/* Stats */}
        <div className="mt-6 flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-forest">{totalActive}</p>
            <p className="text-xs text-muted-foreground">Active Scouts</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-forest">{totalApplicants}</p>
            <p className="text-xs text-muted-foreground">Total Applicants</p>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/campus-scouts/apply">
            <Button size="lg" className="gap-2 bg-forest text-white hover:bg-forest/90">
              Apply to Be a Scout <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="mx-auto mb-12 max-w-3xl">
        <h2 className="mb-6 text-center text-xl font-semibold">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { step: "1", title: "Apply", desc: "Fill out a quick application with your college details" },
            { step: "2", title: "Scout", desc: "Discover agritech startups & founders in your college network" },
            { step: "3", title: "Earn", desc: "Get points for every referral, climb the leaderboard, get recognized" },
          ].map((item) => (
            <Card key={item.step}>
              <CardContent className="p-5 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">{item.step}</div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      {scouts.length > 0 && (
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Trophy className="h-5 w-5 text-gold" /> Scout Leaderboard
          </h2>
          <Card>
            <CardContent className="divide-y p-0">
              {scouts.map((scout, idx) => (
                <div key={scout.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${idx < 3 ? "bg-gold/10 text-gold" : "bg-muted text-muted-foreground"}`}>
                    {idx + 1}
                  </span>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={scout.user.avatarUrl || undefined} />
                    <AvatarFallback className="bg-forest/10 text-sm text-forest">{scout.user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{scout.user.fullName}</p>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {scout.collegeName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gold">
                    <Star className="h-3.5 w-3.5" /> {scout.points}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
