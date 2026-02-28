import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { BarChart3 } from "lucide-react"
import { authOptions } from "@/lib/auth"
import { FounderDashboard } from "@/components/dashboard/founder-dashboard"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard | AgriVentures India",
  description: "Track your startup performance with analytics and insights.",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard")
  }

  if (session.user.role !== "FOUNDER" && session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div>
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 mb-4">
            <BarChart3 className="h-7 w-7 text-forest" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-forest sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your startup performance
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <FounderDashboard />
      </section>
    </div>
  )
}
