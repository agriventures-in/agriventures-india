"use client"

import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { PieLabelRenderProps } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const CHART_COLORS = [
  "#0A4A23",
  "#16A34A",
  "#4ADE80",
  "#F59E0B",
  "#FB923C",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
]

interface AnalyticsData {
  registrationsOverTime: { date: string; users: number; startups: number }[]
  categoryDistribution: { category: string; count: number }[]
  stageDistribution: { stage: string; count: number }[]
  topStartups: {
    name: string
    slug: string
    upvoteCount: number
    viewCount: number
  }[]
  recentActivity: {
    type: "user" | "startup" | "verification"
    description: string
    timestamp: string
  }[]
  totalStats: {
    totalStartups: number
    totalUsers: number
    totalUpvotes: number
    totalViews: number
    totalComments: number
    totalJobs: number
  }
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full" />
      </CardContent>
    </Card>
  )
}

const STAGE_LABELS: Record<string, string> = {
  IDEATION: "Ideation",
  VALIDATION: "Validation",
  EARLY_TRACTION: "Early Traction",
  GROWTH: "Growth",
  SCALING: "Scaling",
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

function truncateLabel(label: string, maxLen: number = 14) {
  if (label.length <= maxLen) return label
  return label.slice(0, maxLen - 1) + "\u2026"
}

export function AdminCharts() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics")
        if (!res.ok) {
          throw new Error("Failed to fetch analytics")
        }
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-slate-500">
            {error || "Failed to load analytics data."}
          </p>
        </CardContent>
      </Card>
    )
  }

  const stageData = data.stageDistribution.map((s) => ({
    ...s,
    label: STAGE_LABELS[s.stage] || s.stage,
  }))

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 1. Registrations & Startups Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Registrations & Startups (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.registrationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: "#64748b" }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <Tooltip
                labelFormatter={(label) =>
                  new Date(String(label)).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                }
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="users"
                name="Users"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="startups"
                name="Startups"
                stroke="#16A34A"
                fill="#16A34A"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data.categoryDistribution}
              layout="vertical"
              margin={{ left: 10, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                dataKey="category"
                type="category"
                width={120}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(val: string) => truncateLabel(val)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" name="Startups" radius={[0, 4, 4, 0]}>
                {data.categoryDistribution.map((_, idx) => (
                  <Cell
                    key={`cat-${idx}`}
                    fill={CHART_COLORS[idx % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Stage Distribution (Donut) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stage Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stageData}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                label={(props: PieLabelRenderProps) => {
                  const name = String(props.name ?? "")
                  const pct = typeof props.percent === "number" ? props.percent : 0
                  return `${name} ${(pct * 100).toFixed(0)}%`
                }}
                labelLine={false}
              >
                {stageData.map((_, idx) => (
                  <Cell
                    key={`stage-${idx}`}
                    fill={CHART_COLORS[idx % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. Top Startups by Upvotes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Startups by Upvotes</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topStartups.length === 0 ? (
            <p className="flex items-center justify-center py-12 text-sm text-slate-500">
              No startups yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data.topStartups}
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickFormatter={(val: string) => truncateLabel(val, 10)}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="upvoteCount"
                  name="Upvotes"
                  fill="#16A34A"
                  radius={[4, 4, 0, 0]}
                >
                  {data.topStartups.map((_, idx) => (
                    <Cell
                      key={`top-${idx}`}
                      fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
