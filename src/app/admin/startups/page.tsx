import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { StartupActions } from "@/components/admin/startup-actions"
import { StartupStatusFilter } from "@/components/admin/startup-status-filter"
import { formatDate } from "@/lib/utils"
import { TECH_CATEGORIES, STARTUP_STAGES, VERIFICATION_LEVELS } from "@/lib/constants"
import { Star } from "lucide-react"

export const dynamic = "force-dynamic"

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  VERIFIED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
}

const verificationColors: Record<string, string> = {
  NONE: "bg-slate-100 text-slate-600",
  COMMUNITY: "bg-blue-100 text-blue-700",
  EXPERT: "bg-emerald-100 text-emerald-700",
  FULL: "bg-emerald-200 text-emerald-800",
}

function getCategoryLabel(value: string) {
  return TECH_CATEGORIES.find((c) => c.value === value)?.label || value
}

function getStageLabel(value: string) {
  return STARTUP_STAGES.find((s) => s.value === value)?.label || value
}

async function getStartups(status?: string) {
  const where = status && status !== "ALL" ? { status: status as any } : {}

  return prisma.startup.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      founder: {
        select: { fullName: true, email: true },
      },
    },
  })
}

export default async function StartupsManagementPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const startups = await getStartups(searchParams.status)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Startup Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all startups on the platform.
          </p>
        </div>
        <StartupStatusFilter currentStatus={searchParams.status} />
      </div>

      <Card>
        <CardContent className="p-0">
          {startups.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-slate-500">No startups found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Name</TableHead>
                  <TableHead>Founder</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Verification</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Upvotes</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {startups.map((startup: any) => (
                  <TableRow key={startup.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {startup.name}
                        </span>
                        {startup.isFeatured && (
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{startup.tagline}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-700">
                        {startup.founder.fullName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {startup.founder.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-slate-600">
                        {getCategoryLabel(startup.techCategory)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-slate-600">
                        {getStageLabel(startup.stage)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          statusColors[startup.status] || "bg-slate-100 text-slate-600"
                        } hover:opacity-90`}
                      >
                        {startup.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        className={`${
                          verificationColors[startup.verificationLevel] ||
                          "bg-slate-100 text-slate-600"
                        } hover:opacity-90`}
                      >
                        {(VERIFICATION_LEVELS as Record<string, { label: string }>)[startup.verificationLevel]?.label || startup.verificationLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right">
                      <span className="text-sm font-medium text-slate-700">
                        {startup.upvoteCount}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-slate-500">
                        {formatDate(startup.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <StartupActions
                        startupId={startup.id}
                        startupSlug={startup.slug}
                        isFeatured={startup.isFeatured}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
