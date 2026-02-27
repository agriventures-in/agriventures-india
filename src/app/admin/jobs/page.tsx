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
import { JobActions } from "@/components/admin/job-actions"
import { formatDate } from "@/lib/utils"
import { JOB_TYPES } from "@/lib/constants"

export const dynamic = "force-dynamic"

const typeColors: Record<string, string> = {
  FULL_TIME: "bg-blue-100 text-blue-700",
  PART_TIME: "bg-purple-100 text-purple-700",
  INTERNSHIP: "bg-amber-100 text-amber-700",
  CONTRACT: "bg-emerald-100 text-emerald-700",
}

function getJobTypeLabel(value: string) {
  return JOB_TYPES.find((t) => t.value === value)?.label || value
}

async function getJobs() {
  return prisma.job.findMany({
    orderBy: { postedAt: "desc" },
    include: {
      startup: {
        select: { name: true, slug: true },
      },
    },
  })
}

function isExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

export default async function JobsManagementPage() {
  const jobs = await getJobs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Jobs Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          View and manage all job postings on the platform.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {jobs.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-slate-500">No job postings yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Title</TableHead>
                  <TableHead>Startup</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Posted</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job: any) => {
                  const expired = isExpired(job.expiresAt)
                  const status = !job.isActive
                    ? "Inactive"
                    : expired
                    ? "Expired"
                    : "Active"

                  return (
                    <TableRow key={job.id}>
                      <TableCell className="pl-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {job.title}
                          </p>
                          {job.salaryRange && (
                            <p className="text-xs text-slate-500">
                              {job.salaryRange}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {job.startup.name}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          className={`${
                            typeColors[job.type] || "bg-slate-100 text-slate-600"
                          } hover:opacity-90`}
                        >
                          {getJobTypeLabel(job.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-slate-600">
                          {job.location}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : status === "Expired"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-600"
                          } hover:opacity-90`}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm text-slate-500">
                          {formatDate(job.postedAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <JobActions jobId={job.id} isActive={job.isActive} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
