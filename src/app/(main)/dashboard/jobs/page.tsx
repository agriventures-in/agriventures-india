export const dynamic = "force-dynamic"

import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { formatDistanceToNow } from "date-fns"
import {
  Briefcase,
  Plus,
  MapPin,
  Eye,
  Pencil,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "My Jobs | AgriVentures India",
  description: "Manage your job listings on AgriVentures India.",
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-Time",
  PART_TIME: "Part-Time",
  INTERNSHIP: "Internship",
  CONTRACT: "Contract",
}

export default async function MyJobsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/jobs")
  }

  if (session.user.role !== "FOUNDER" && session.user.role !== "ADMIN") {
    redirect("/")
  }

  // Get all startups owned by this founder
  const startupIds = await prisma.startup.findMany({
    where: { founderId: session.user.id },
    select: { id: true },
  })

  const ids = startupIds.map((s) => s.id)

  // Get all jobs for these startups
  const jobs = await prisma.job.findMany({
    where: { startupId: { in: ids } },
    include: {
      startup: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { postedAt: "desc" },
  })

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest/10">
            <Briefcase className="h-5 w-5 text-forest" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Jobs</h1>
            <p className="text-sm text-muted-foreground">
              Manage your job listings across all startups
            </p>
          </div>
        </div>
        <Button asChild className="bg-forest hover:bg-forest/90 text-white">
          <Link href="/jobs/post" className="gap-2">
            <Plus className="h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{jobs.length}</p>
              <p className="text-xs text-muted-foreground">Total Listings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">
                {jobs.filter((j) => j.isActive).length}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <XCircle className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-2xl font-bold">
                {jobs.filter((j) => !j.isActive).length}
              </p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              No job listings yet
            </h2>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Post your first job to attract top talent from India&apos;s
              agritech community.
            </p>
            <Button asChild className="bg-forest hover:bg-forest/90 text-white">
              <Link href="/jobs/post" className="gap-2">
                <Plus className="h-4 w-4" />
                Post Your First Job
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const isExpired = job.expiresAt && new Date(job.expiresAt) < new Date()
            return (
              <Card
                key={job.id}
                className={`transition-shadow hover:shadow-md ${
                  !job.isActive || isExpired ? "opacity-60" : ""
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {job.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs shrink-0"
                        >
                          {JOB_TYPE_LABELS[job.type] ?? job.type}
                        </Badge>
                        {!job.isActive && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            Inactive
                          </Badge>
                        )}
                        {isExpired && (
                          <Badge
                            variant="outline"
                            className="text-xs text-red-600 border-red-200 shrink-0"
                          >
                            Expired
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {job.startup.name}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Posted{" "}
                          {formatDistanceToNow(new Date(job.postedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={`/jobs/${job.id}/edit`}
                          className="gap-1.5"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
