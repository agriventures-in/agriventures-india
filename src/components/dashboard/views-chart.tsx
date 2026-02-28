"use client"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"

interface ViewsChartProps {
  data: Array<{ date: string; count: number }>
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function ViewsChart({ data }: ViewsChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatDateLabel(item.date),
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Eye className="h-5 w-5 text-emerald-600" />
        <CardTitle className="text-base font-semibold">
          Views &mdash; Last 30 Days
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            No views data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: number | undefined) => [value ?? 0, "Views"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#16A34A"
                strokeWidth={2}
                fill="url(#viewsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
