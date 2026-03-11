import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle2,
  ClipboardCheck,
  Search,
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  Share2,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Startup Submitted Successfully!",
  description:
    "Your agritech startup has been submitted to AgriVentures India. Our team will review it within 24-48 hours.",
}

const NEXT_STEPS = [
  {
    icon: ClipboardCheck,
    title: "Review",
    description:
      "Our team will review your startup listing within 24-48 hours to ensure quality and accuracy.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Search,
    title: "Verification",
    description:
      "Once approved, your startup enters the verification pipeline. Build community trust through upvotes and evidence.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Sparkles,
    title: "Discovery",
    description:
      "Your startup goes live on our platform, visible to investors, mentors, and the agritech community across India.",
    color: "bg-emerald-100 text-emerald-700",
  },
]

export default function SubmitSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Confetti-like decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {/* Top-left cluster */}
        <div className="absolute -left-4 top-20 h-16 w-16 rotate-12 rounded-lg bg-emerald-200/30" />
        <div className="absolute left-16 top-8 h-8 w-8 -rotate-6 rounded-full bg-amber-200/40" />
        <div className="absolute left-8 top-40 h-6 w-6 rotate-45 bg-primary/10" />

        {/* Top-right cluster */}
        <div className="absolute -right-4 top-32 h-20 w-20 -rotate-12 rounded-full bg-emerald-200/20" />
        <div className="absolute right-20 top-12 h-10 w-10 rotate-45 rounded-lg bg-amber-100/40" />
        <div className="absolute right-12 top-52 h-5 w-5 rotate-12 bg-primary/10" />

        {/* Mid decorations */}
        <div className="absolute left-1/4 top-1/3 h-4 w-4 -rotate-12 rounded-full bg-emerald-300/20" />
        <div className="absolute right-1/3 top-1/4 h-6 w-6 rotate-45 rounded-sm bg-amber-200/20" />

        {/* Bottom decorations */}
        <div className="absolute bottom-40 left-12 h-12 w-12 rotate-12 rounded-full bg-emerald-200/20" />
        <div className="absolute bottom-20 right-16 h-8 w-8 -rotate-45 rounded-lg bg-primary/10" />
        <div className="absolute bottom-32 right-1/3 h-5 w-5 rotate-6 rounded-full bg-amber-100/30" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Success Hero */}
        <div className="mb-10 text-center">
          {/* Green checkmark with glow */}
          <div className="relative mx-auto mb-6 inline-flex">
            <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/20 blur-xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your Startup Has Been Submitted!
          </h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            Our team will review your listing within{" "}
            <span className="font-semibold text-foreground">24-48 hours</span>.
            You will receive an email notification once it is approved.
          </p>
        </div>

        {/* What Happens Next */}
        <Card className="mb-8 border-emerald-200/50">
          <CardContent className="p-6 sm:p-8">
            <h2 className="mb-6 text-center text-xl font-semibold text-foreground">
              What Happens Next
            </h2>
            <div className="space-y-6">
              {NEXT_STEPS.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  {/* Step number and connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${step.color}`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    {index < NEXT_STEPS.length - 1 && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="pb-6">
                    <h3 className="mb-1 text-base font-semibold text-foreground">
                      Step {index + 1}: {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2 bg-[#0A4A23] hover:bg-[#0A4A23]/90">
            <Link href="/dashboard/startups">
              <LayoutDashboard className="h-4 w-4" />
              View Your Dashboard
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/startups/submit">
              <PlusCircle className="h-4 w-4" />
              Submit Another
            </Link>
          </Button>
        </div>

        {/* Social Sharing Prompt */}
        <Card className="border-dashed bg-muted/30">
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-medium text-foreground">
                Share the news!
              </p>
              <p className="text-sm text-muted-foreground">
                Let the world know you have listed your startup on AgriVentures India.
                Spread the word on social media and build early traction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mascot */}
        <div className="mt-10 flex flex-col items-center text-center">
          <Image
            src="/images/mascot.png"
            alt="AgriVentures India mascot celebrating your submission"
            width={140}
            height={140}
            className="mb-4"
          />
          <p className="text-sm text-muted-foreground">
            Welcome to the AgriVentures India community!
          </p>
        </div>
      </div>
    </div>
  )
}
