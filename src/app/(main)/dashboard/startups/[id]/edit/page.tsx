export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { EditWizard } from "@/components/startup/edit-wizard"

export const metadata: Metadata = {
  title: "Edit Startup",
  description: "Edit your startup listing on AgriVentures India.",
}

export default async function EditStartupPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/startups")
  }

  const startup = await prisma.startup.findUnique({
    where: { id: params.id },
    include: {
      teamMembers: {
        select: {
          id: true,
          name: true,
          role: true,
          linkedinUrl: true,
          avatarUrl: true,
        },
      },
    },
  })

  if (!startup) {
    notFound()
  }

  // Only the founder or an admin can edit
  if (startup.founderId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard/startups")
  }

  // Serialize the startup data for the client component
  const startupData = {
    id: startup.id,
    name: startup.name,
    slug: startup.slug,
    tagline: startup.tagline,
    description: startup.description,
    logoUrl: startup.logoUrl,
    bannerUrl: startup.bannerUrl,
    websiteUrl: startup.websiteUrl,
    foundedYear: startup.foundedYear,
    stage: startup.stage,
    techCategory: startup.techCategory,
    subCategories: startup.subCategories,
    state: startup.state,
    district: startup.district,
    teamSize: startup.teamSize,
    fundingStatus: startup.fundingStatus,
    fundingAmount: startup.fundingAmount,
    problemStatement: startup.problemStatement,
    solution: startup.solution,
    businessModel: startup.businessModel,
    impactMetrics: startup.impactMetrics,
    fieldTrialData: startup.fieldTrialData,
    pitchDeckUrl: startup.pitchDeckUrl,
    demoVideoUrl: startup.demoVideoUrl,
    galleryUrls: startup.galleryUrls,
    socialLinks: startup.socialLinks,
    status: startup.status,
    teamMembers: startup.teamMembers.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      linkedinUrl: m.linkedinUrl || "",
      avatarUrl: m.avatarUrl || "",
    })),
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <EditWizard startup={startupData} />
    </div>
  )
}
