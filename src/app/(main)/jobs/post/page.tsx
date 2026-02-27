import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { JobPostForm } from "@/components/jobs/job-post-form"

export const metadata: Metadata = {
  title: "Post a Job",
  description: "Post a new job listing on the AgriVentures Jobs Board.",
}

export default async function PostJobPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/jobs/post")
  }

  if (session.user.role !== "FOUNDER" && session.user.role !== "ADMIN") {
    redirect("/jobs")
  }

  return (
    <div>
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-forest sm:text-3xl">
            Post a Job
          </h1>
          <p className="mt-2 text-muted-foreground">
            Attract top talent from India&apos;s agritech community
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="container mx-auto px-4 py-10">
        <JobPostForm />
      </section>
    </div>
  )
}
