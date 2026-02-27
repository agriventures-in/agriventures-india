import { Metadata } from "next"
import Link from "next/link"
import { Briefcase, Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { JobsBoardClient } from "@/components/jobs/jobs-board-client"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Agritech Jobs Board",
  description:
    "Find your next opportunity in India's growing agritech ecosystem. Browse full-time, part-time, internship, and contract positions.",
}

export default async function JobsBoardPage() {
  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
    include: {
      startup: {
        select: {
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
    },
    orderBy: { postedAt: "desc" },
  })

  const serializedJobs = jobs.map((job: typeof jobs[number]) => ({
    ...job,
    postedAt: new Date(job.postedAt),
  }))

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 mb-4">
            <Briefcase className="h-7 w-7 text-forest" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-forest sm:text-4xl lg:text-5xl">
            Agritech Jobs Board
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find your next opportunity in India&apos;s growing agritech
            ecosystem
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">
              {serializedJobs.length} active{" "}
              {serializedJobs.length === 1 ? "position" : "positions"}
            </span>
            <Link href="/jobs/post">
              <Button className="bg-forest hover:bg-forest/90 text-white">
                <Plus className="mr-1.5 h-4 w-4" />
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <JobsBoardClient jobs={serializedJobs} />
      </section>
    </div>
  )
}
