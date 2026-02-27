"use client"

import { useState, useMemo } from "react"
import { Briefcase, MapPin, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/jobs/job-card"
import { JOB_TYPES } from "@/lib/constants"
import type { JobType } from "@prisma/client"

type Job = {
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

interface JobsBoardClientProps {
  jobs: Job[]
}

export function JobsBoardClient({ jobs }: JobsBoardClientProps) {
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [locationQuery, setLocationQuery] = useState("")

  const filteredJobs = useMemo(() => {
    let filtered = jobs

    if (typeFilter !== "ALL") {
      filtered = filtered.filter((job) => job.type === typeFilter)
    }

    if (locationQuery.trim()) {
      const query = locationQuery.toLowerCase()
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [jobs, typeFilter, locationQuery])

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            {JOB_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by location..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {(typeFilter !== "ALL" || locationQuery.trim()) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setTypeFilter("ALL")
              setLocationQuery("")
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {filteredJobs.length}
        </span>{" "}
        {filteredJobs.length === 1 ? "job" : "jobs"}
        {typeFilter !== "ALL" || locationQuery.trim()
          ? ` (of ${jobs.length} total)`
          : ""}
      </p>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No jobs found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {typeFilter !== "ALL" || locationQuery.trim()
              ? "Try adjusting your filters"
              : "Check back soon for new opportunities"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
