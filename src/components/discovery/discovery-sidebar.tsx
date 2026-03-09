"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, TrendingUp, BarChart3, Users, Building2 } from "lucide-react"
import { TECH_CATEGORIES } from "@/lib/constants"
import { ActivityFeed } from "@/components/common/activity-feed"

export function DiscoverySidebar() {
  return (
    <div className="sticky top-8 space-y-6">
      {/* Submit CTA */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Submit Your Startup
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get discovered by investors, corporates, and collaborators across India.
          </p>
          <Link href="/startups/submit">
            <Button className="mt-4 w-full">Submit Now</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Trending Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4" />
            Trending Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {TECH_CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.value}
              href={`/discover?category=${cat.value}`}
              className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
            >
              {cat.label}
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <ActivityFeed />

      {/* Platform Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="h-4 w-4" />
            Platform Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              Startups Listed
            </span>
            <span className="text-sm font-semibold">120+</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Community Members
            </span>
            <span className="text-sm font-semibold">2,500+</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Total Upvotes
            </span>
            <span className="text-sm font-semibold">8,400+</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
