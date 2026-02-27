import type { Metadata } from "next"
import { DiscoveryFeed } from "@/components/discovery/discovery-feed"
import { DiscoverySidebar } from "@/components/discovery/discovery-sidebar"

export const metadata: Metadata = {
  title: "Discover Startups",
  description:
    "Discover and support innovative agritech startups across India. Browse verified startups by category, stage, and location.",
}

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Discover Startups
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore India&apos;s most innovative agritech startups. Upvote your favorites and help them get noticed.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <DiscoveryFeed />
          <div className="hidden lg:block">
            <DiscoverySidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
