"use client"

import { useEffect, useState } from "react"
import { Rocket, Eye, TrendingUp, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ViewsChart } from "@/components/dashboard/views-chart"
import { UpvotesChart } from "@/components/dashboard/upvotes-chart"
import { StartupStatsTable } from "@/components/dashboard/startup-stats-table"

interface AnalyticsData {
  totals: {
    startups: number
    totalViews: number
    totalUpvotes: number
    totalComments: number
  }
  viewsByDay: Array<{ date: string; count: number }>
  upvotesByDay: Array<{ date: string; count: number }>
  startupStats: Array<{
    id: string
    name: string
    slug: string
    views: number
    upvotes: number
    comments: number
    stage: string
    status: string
  }>
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  colorClass: string
  bgGradient: string
}

function StatCard({ icon, label, value, colorClass, bgGradient }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 ${bgGradient} opacity-[0.06]`} />
      <CardContent className="relative flex items-center gap-4 p-6">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">
            {value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-6">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-14" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="mb-4 h-5 w-40" />
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="mb-4 h-5 w-40" />
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Table skeleton */}
      <Card>
        <CardContent className="p-6">
          <Skeleton className="mb-4 h-5 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function FounderDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics/founder")
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.message || "Failed to fetch analytics")
        }
        const data = await res.json()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex h-[200px] items-center justify-center p-6">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Rocket className="h-6 w-6 text-white" />}
          label="Total Startups"
          value={analytics.totals.startups}
          colorClass="bg-[#0A4A23]"
          bgGradient="bg-gradient-to-br from-[#0A4A23] to-[#16A34A]"
        />
        <StatCard
          icon={<Eye className="h-6 w-6 text-white" />}
          label="Total Views"
          value={analytics.totals.totalViews}
          colorClass="bg-[#16A34A]"
          bgGradient="bg-gradient-to-br from-[#16A34A] to-[#4ADE80]"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          label="Total Upvotes"
          value={analytics.totals.totalUpvotes}
          colorClass="bg-[#F59E0B]"
          bgGradient="bg-gradient-to-br from-[#F59E0B] to-[#FBBF24]"
        />
        <StatCard
          icon={<MessageSquare className="h-6 w-6 text-white" />}
          label="Total Comments"
          value={analytics.totals.totalComments}
          colorClass="bg-[#FB923C]"
          bgGradient="bg-gradient-to-br from-[#FB923C] to-[#FDBA74]"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ViewsChart data={analytics.viewsByDay} />
        <UpvotesChart data={analytics.upvotesByDay} />
      </div>

      {/* Startup Table */}
      <StartupStatsTable startups={analytics.startupStats} />
    </div>
  )
}
