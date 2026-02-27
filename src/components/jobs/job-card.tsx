import Link from "next/link"
import { MapPin, Calendar, ExternalLink, IndianRupee } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { JobType } from "@prisma/client"

interface JobCardProps {
  job: {
    id: string
    title: string
    location: string
    type: JobType
    salaryRange: string | null
    applicationUrl: string | null
    postedAt: Date
    startup: {
      name: string
      slug: string
      logoUrl: string | null
    }
  }
}

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

export function JobCard({ job }: JobCardProps) {
  const typeConfig = JOB_TYPE_CONFIG[job.type]

  return (
    <Card className="group transition-all duration-200 hover:shadow-lg hover:border-emerald/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link
              href={`/jobs/${job.id}`}
              className="block"
            >
              <h3 className="text-lg font-bold text-foreground group-hover:text-forest transition-colors line-clamp-1">
                {job.title}
              </h3>
            </Link>
            <Link
              href={`/startups/${job.startup.slug}`}
              className="text-sm text-emerald hover:underline font-medium mt-0.5 inline-block"
            >
              {job.startup.name}
            </Link>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 text-[11px] ${typeConfig.className}`}
          >
            {typeConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{job.location}</span>
          </div>
          {job.salaryRange && (
            <div className="flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 shrink-0" />
              <span>{job.salaryRange}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              {formatDistanceToNow(new Date(job.postedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link href={`/jobs/${job.id}`}>
            <Button variant="outline" size="sm" className="text-forest hover:text-forest">
              View Details
            </Button>
          </Link>
          {job.applicationUrl && (
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="bg-forest hover:bg-forest/90 text-white">
                Apply
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
