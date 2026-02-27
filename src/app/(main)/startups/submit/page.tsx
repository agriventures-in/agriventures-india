import type { Metadata } from "next"
import { SubmitWizard } from "@/components/startup/submit-wizard"

export const metadata: Metadata = {
  title: "Submit Your Startup",
  description:
    "Submit your agritech startup to AgriVentures India. Get discovered by investors, mentors, and collaborators across India.",
}

export default function SubmitStartupPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Submit Your Startup
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about your agritech venture. This takes about 10 minutes to complete.
          </p>
        </div>
        <SubmitWizard />
      </div>
    </div>
  )
}
