"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BarChart3 } from "lucide-react"

interface StartupStat {
  id: string
  name: string
  slug: string
  views: number
  upvotes: number
  comments: number
  stage: string
  status: string
}

interface StartupStatsTableProps {
  startups: StartupStat[]
}

const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  SUBMITTED: {
    label: "Submitted",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  VERIFIED: {
    label: "Verified",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
}

const stageLabels: Record<string, string> = {
  IDEATION: "Ideation",
  VALIDATION: "Validation",
  EARLY_TRACTION: "Early Traction",
  GROWTH: "Growth",
  SCALING: "Scaling",
}

export function StartupStatsTable({ startups }: StartupStatsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <BarChart3 className="h-5 w-5 text-forest" />
        <CardTitle className="text-base font-semibold">
          Startup Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {startups.length === 0 ? (
          <div className="flex h-[120px] items-center justify-center text-sm text-muted-foreground">
            No startups found. Submit your first startup to see analytics.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Upvotes</TableHead>
                <TableHead className="text-right">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {startups.map((startup) => {
                const status = statusConfig[startup.status] || statusConfig.DRAFT
                const stageLabel = stageLabels[startup.stage] || startup.stage
                return (
                  <TableRow key={startup.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/startups/${startup.slug}`}
                        className="text-forest hover:underline"
                      >
                        {startup.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={status.className}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {stageLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {startup.views.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {startup.upvotes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {startup.comments.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
