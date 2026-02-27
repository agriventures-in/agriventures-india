import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ExternalLink,
  IndianRupee,
  Building2,
  Globe,
  Clock,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import type { JobType } from "@prisma/client"

const JOB_TYPE_CONFIG: Record<
  JobType,
  { label: string; className: string }
> = {
  FULL_TIME: {
    label: "Full-Time",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  PART_TIME: {
    label: "Part-Time",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  INTERNSHIP: {
    label: "Internship",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  CONTRACT: {
    label: "Contract",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
}

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { startup: { select: { name: true } } },
  })

  if (!job) {
    return { title: "Job Not Found" }
  }

  return {
    title: `${job.title} at ${job.startup.name}`,
    description: job.description.slice(0, 160),
  }
}

export default async function JobDetailPage({ params }: Props) {
  const job = await prisma.job.findUnique({
    where: { id: params.id, isActive: true },
    include: {
      startup: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          tagline: true,
          state: true,
          websiteUrl: true,
          techCategory: true,
        },
      },
    },
  })

  if (!job) {
    notFound()
  }

  const typeConfig = JOB_TYPE_CONFIG[job.type]
  const requirements = (job.requirements ?? []) as string[]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-10">
          <Link href="/jobs">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Badge
                variant="outline"
                className={typeConfig.className}
              >
                {typeConfig.label}
              </Badge>
              {job.expiresAt && (
                <Badge variant="outline" className="text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  Expires {formatDate(job.expiresAt)}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-forest sm:text-4xl">
              {job.title}
            </h1>

            <Link
              href={`/startups/${job.startup.slug}`}
              className="mt-2 inline-block text-lg text-emerald hover:underline font-medium"
            >
              {job.startup.name}
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              {job.salaryRange && (
                <div className="flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4" />
                  <span>{job.salaryRange}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  Posted{" "}
                  {formatDistanceToNow(new Date(job.postedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            {job.applicationUrl && (
              <div className="mt-6">
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-forest hover:bg-forest/90 text-white"
                  >
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Job Description
              </h2>
              <div className="space-y-4">
                {job.description.split("\n\n").map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="leading-relaxed text-foreground/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {requirements.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {requirements.map((req, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-foreground/80"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Apply section */}
            {job.applicationUrl && (
              <>
                <Separator />
                <div className="rounded-xl border bg-forest/5 p-6 text-center">
                  <h3 className="text-lg font-semibold text-forest">
                    Interested in this position?
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Apply directly on the company&apos;s career page
                  </p>
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block"
                  >
                    <Button className="bg-forest hover:bg-forest/90 text-white">
                      Apply Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            {/* Company Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald" />
                  About the Company
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Link
                    href={`/startups/${job.startup.slug}`}
                    className="text-lg font-semibold text-foreground hover:text-forest transition-colors"
                  >
                    {job.startup.name}
                  </Link>
                  {job.startup.tagline && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {job.startup.tagline}
                    </p>
                  )}
                </div>

                {job.startup.state && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.startup.state}</span>
                  </div>
                )}

                {job.startup.websiteUrl && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <a
                      href={job.startup.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald hover:underline truncate"
                    >
                      {job.startup.websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}

                <Link href={`/startups/${job.startup.slug}`}>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Company Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Job Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{typeConfig.label}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                {job.salaryRange && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Salary</span>
                      <span className="font-medium">{job.salaryRange}</span>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Posted</span>
                  <span className="font-medium">
                    {formatDate(job.postedAt)}
                  </span>
                </div>
                {job.expiresAt && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expires</span>
                      <span className="font-medium">
                        {formatDate(job.expiresAt)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  )
}
