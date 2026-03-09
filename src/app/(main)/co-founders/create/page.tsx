import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CoFounderForm } from "@/components/cofounder/cofounder-form"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Create Co-Founder Profile | AgriVentures India",
}

export default async function CreateCoFounderPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  // Check if already has a profile
  const existing = await prisma.coFounderProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (existing) redirect(`/co-founders/${existing.id}`)

  // Get user's startups for linking
  const startups = await prisma.startup.findMany({
    where: { founderId: session.user.id },
    select: { id: true, name: true, slug: true },
  })

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Create Your Co-Founder Profile</h1>
      <p className="mb-8 text-muted-foreground">
        Tell the community what you bring and what you are looking for in a co-founder.
      </p>
      <CoFounderForm startups={startups} />
    </div>
  )
}
