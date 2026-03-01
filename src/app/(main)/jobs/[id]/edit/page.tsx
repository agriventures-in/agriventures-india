import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { JobEditForm } from "@/components/jobs/job-edit-form"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Edit Job",
  description: "Edit your job listing on AgriVentures India.",
}

interface Props {
  params: { id: string }
}

export default async function EditJobPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/login?callbackUrl=/jobs/${params.id}/edit`)
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      startup: {
        select: {
          id: true,
          name: true,
          founderId: true,
        },
      },
    },
  })

  if (!job) {
    notFound()
  }

  // Only the founder who owns the startup or an admin can edit
  const isAdmin = session.user.role === "ADMIN"
  const isOwner = job.startup.founderId === session.user.id

  if (!isAdmin && !isOwner) {
    redirect("/jobs")
  }

  // Serialize for client component
  const serializedJob = {
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    type: job.type,
    salaryRange: job.salaryRange ?? "",
    requirements: Array.isArray(job.requirements)
      ? (job.requirements as string[]).join("\n")
      : "",
    applicationUrl: job.applicationUrl ?? "",
    expiresAt: job.expiresAt
      ? new Date(job.expiresAt).toISOString().split("T")[0]
      : "",
    isActive: job.isActive,
    startupName: job.startup.name,
  }

  return (
    <div>
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-forest sm:text-3xl">
            Edit Job Listing
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update the details for your job at{" "}
            <span className="font-medium text-foreground">
              {job.startup.name}
            </span>
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="container mx-auto px-4 py-10">
        <JobEditForm job={serializedJob} />
      </section>
    </div>
  )
}
