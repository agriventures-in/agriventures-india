"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react"
import {
  startupBasicsSchema,
  problemSolutionSchema,
  categorySchema,
  impactMetricsSchema,
  fieldTrialSchema,
  teamSchema,
  mediaSchema,
} from "@/lib/validations/startup"
import type { WizardFormData } from "@/components/startup/submit-wizard"
import { StepBasics } from "@/components/startup/wizard-steps/step-basics"
import { StepProblemSolution } from "@/components/startup/wizard-steps/step-problem-solution"
import { StepCategory } from "@/components/startup/wizard-steps/step-category"
import { StepImpactMetrics } from "@/components/startup/wizard-steps/step-impact-metrics"
import { StepFieldTrials } from "@/components/startup/wizard-steps/step-field-trials"
import { StepTeam } from "@/components/startup/wizard-steps/step-team"
import { StepMedia } from "@/components/startup/wizard-steps/step-media"

const STEPS = [
  { name: "Basic Info", description: "Name, tagline, and location" },
  { name: "Problem & Solution", description: "What problem are you solving?" },
  { name: "Category & Stage", description: "Tech category and current stage" },
  { name: "Impact Metrics", description: "Measure your impact" },
  { name: "Field Trials", description: "Evidence and trial data" },
  { name: "Team", description: "Your founding team" },
  { name: "Media & Pitch", description: "Pitch deck and funding" },
] as const

const stepSchemas = [
  startupBasicsSchema,
  problemSolutionSchema,
  categorySchema,
  impactMetricsSchema,
  fieldTrialSchema,
  teamSchema,
  mediaSchema,
]

// Types for startup data passed from server component
interface StartupTeamMember {
  id: string
  name: string
  role: string
  linkedinUrl: string
  avatarUrl: string
}

interface StartupData {
  id: string
  name: string
  slug: string
  tagline: string
  description: string | null
  logoUrl: string | null
  bannerUrl: string | null
  websiteUrl: string | null
  foundedYear: number | null
  stage: string
  techCategory: string
  subCategories: unknown
  state: string | null
  district: string | null
  teamSize: number | null
  fundingStatus: string | null
  fundingAmount: string | null
  problemStatement: string | null
  solution: string | null
  businessModel: string | null
  impactMetrics: unknown
  fieldTrialData: unknown
  pitchDeckUrl: string | null
  demoVideoUrl: string | null
  galleryUrls: unknown
  socialLinks: unknown
  status: string
  teamMembers: StartupTeamMember[]
}

function convertStartupToFormData(startup: StartupData): WizardFormData {
  // Parse impactMetrics from JSON
  let impactMetrics: { name: string; value: string; unit: string }[] = [
    { name: "", value: "", unit: "" },
  ]
  if (Array.isArray(startup.impactMetrics) && startup.impactMetrics.length > 0) {
    impactMetrics = startup.impactMetrics as {
      name: string
      value: string
      unit: string
    }[]
  }

  // Parse fieldTrialData from JSON
  const defaultFieldTrial = {
    hasTrials: false,
    trialDescription: "",
    trialLocation: "",
    sampleSize: "",
    results: "",
  }
  let fieldTrialData = defaultFieldTrial
  if (
    startup.fieldTrialData &&
    typeof startup.fieldTrialData === "object" &&
    !Array.isArray(startup.fieldTrialData)
  ) {
    const ftd = startup.fieldTrialData as Record<string, unknown>
    fieldTrialData = {
      hasTrials: Boolean(ftd.hasTrials),
      trialDescription: String(ftd.trialDescription || ""),
      trialLocation: String(ftd.trialLocation || ""),
      sampleSize: String(ftd.sampleSize || ""),
      results: String(ftd.results || ""),
    }
  }

  // Parse subCategories from JSON
  const subCategories = Array.isArray(startup.subCategories)
    ? (startup.subCategories as string[])
    : []

  // Parse galleryUrls from JSON
  const galleryUrls = Array.isArray(startup.galleryUrls)
    ? (startup.galleryUrls as string[])
    : []

  // Parse team members
  const teamMembers =
    startup.teamMembers.length > 0
      ? startup.teamMembers.map((m) => ({
          name: m.name,
          role: m.role,
          linkedinUrl: m.linkedinUrl || "",
        }))
      : [{ name: "", role: "", linkedinUrl: "" }]

  return {
    name: startup.name,
    tagline: startup.tagline,
    description: startup.description || "",
    state: startup.state || "",
    district: startup.district || "",
    foundedYear: startup.foundedYear || undefined,
    websiteUrl: startup.websiteUrl || "",
    problemStatement: startup.problemStatement || "",
    solution: startup.solution || "",
    businessModel: startup.businessModel || "",
    techCategory: startup.techCategory,
    subCategories,
    stage: (startup.stage as WizardFormData["stage"]) || "IDEATION",
    impactMetrics,
    fieldTrialData,
    teamSize: startup.teamSize || 1,
    teamMembers,
    logoUrl: startup.logoUrl || "",
    galleryUrls,
    pitchDeckUrl: startup.pitchDeckUrl || "",
    demoVideoUrl: startup.demoVideoUrl || "",
    fundingStatus: startup.fundingStatus || "",
    fundingAmount: startup.fundingAmount || "",
  }
}

interface EditWizardProps {
  startup: StartupData
}

export function EditWizard({ startup }: EditWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<WizardFormData>(() =>
    convertStartupToFormData(startup)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const progressPercent = ((currentStep + 1) / STEPS.length) * 100

  function updateFormData(updates: Partial<WizardFormData>) {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  function getStepData(step: number) {
    switch (step) {
      case 0:
        return {
          name: formData.name,
          tagline: formData.tagline,
          state: formData.state,
          district: formData.district || undefined,
          foundedYear: formData.foundedYear,
          websiteUrl: formData.websiteUrl || undefined,
        }
      case 1:
        return {
          problemStatement: formData.problemStatement,
          solution: formData.solution,
          businessModel: formData.businessModel || undefined,
        }
      case 2:
        return {
          techCategory: formData.techCategory,
          subCategories: formData.subCategories,
          stage: formData.stage,
        }
      case 3:
        return {
          impactMetrics: formData.impactMetrics,
        }
      case 4:
        return {
          fieldTrialData: formData.fieldTrialData,
        }
      case 5:
        return {
          teamSize: formData.teamSize,
          teamMembers: formData.teamMembers,
        }
      case 6:
        return {
          logoUrl: formData.logoUrl || undefined,
          galleryUrls:
            formData.galleryUrls.length > 0
              ? formData.galleryUrls
              : undefined,
          pitchDeckUrl: formData.pitchDeckUrl || undefined,
          demoVideoUrl: formData.demoVideoUrl || undefined,
          fundingStatus: formData.fundingStatus || undefined,
          fundingAmount: formData.fundingAmount || undefined,
        }
      default:
        return {}
    }
  }

  function validateCurrentStep(): boolean {
    const schema = stepSchemas[currentStep]
    const data = getStepData(currentStep)

    const result = schema.safeParse(data)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".")
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message
        }
      })
      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }

  function handleNext() {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  function handleBack() {
    setErrors({})
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  async function handleSave() {
    if (!validateCurrentStep()) return

    setIsSaving(true)
    try {
      // 1. Update the startup fields
      const payload = {
        name: formData.name,
        tagline: formData.tagline,
        state: formData.state,
        district: formData.district || undefined,
        foundedYear: formData.foundedYear,
        websiteUrl: formData.websiteUrl || undefined,
        problemStatement: formData.problemStatement,
        solution: formData.solution,
        businessModel: formData.businessModel || undefined,
        techCategory: formData.techCategory,
        subCategories: formData.subCategories,
        stage: formData.stage,
        impactMetrics: formData.impactMetrics,
        fieldTrialData: formData.fieldTrialData,
        teamSize: formData.teamSize,
        logoUrl: formData.logoUrl || undefined,
        galleryUrls:
          formData.galleryUrls.length > 0 ? formData.galleryUrls : undefined,
        pitchDeckUrl: formData.pitchDeckUrl || undefined,
        demoVideoUrl: formData.demoVideoUrl || undefined,
        fundingStatus: formData.fundingStatus || undefined,
        fundingAmount: formData.fundingAmount || undefined,
      }

      const res = await fetch(`/api/startups/${startup.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to update startup")
      }

      // 2. Bulk update team members
      const teamRes = await fetch(`/api/startups/${startup.id}/team`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          members: formData.teamMembers
            .filter((m) => m.name.trim() !== "")
            .map((m) => ({
              name: m.name,
              role: m.role,
              linkedinUrl: m.linkedinUrl || undefined,
            })),
        }),
      })

      if (!teamRes.ok) {
        const error = await teamRes.json()
        throw new Error(error.message || "Failed to update team members")
      }

      toast.success("Your startup has been updated successfully!")
      router.push(`/startups/${startup.slug}`)
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsSaving(false)
    }
  }

  function renderStep() {
    const stepProps = { formData, updateFormData, errors }

    switch (currentStep) {
      case 0:
        return <StepBasics {...stepProps} />
      case 1:
        return <StepProblemSolution {...stepProps} />
      case 2:
        return <StepCategory {...stepProps} />
      case 3:
        return <StepImpactMetrics {...stepProps} />
      case 4:
        return <StepFieldTrials {...stepProps} />
      case 5:
        return <StepTeam {...stepProps} />
      case 6:
        return <StepMedia {...stepProps} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/startups" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Edit: {startup.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Update your startup information
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
        >
          <a
            href={`/startups/${startup.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Preview
          </a>
        </Button>
      </div>

      {/* Progress Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progressPercent)}% complete
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        {/* Step indicators */}
        <div className="hidden gap-1 sm:flex">
          {STEPS.map((step, idx) => (
            <button
              key={step.name}
              onClick={() => {
                if (idx < currentStep) {
                  setErrors({})
                  setCurrentStep(idx)
                } else if (idx > currentStep) {
                  // Allow jumping forward in edit mode (data is already filled)
                  if (validateCurrentStep()) {
                    setCurrentStep(idx)
                  }
                }
              }}
              className={`flex-1 rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors ${
                idx === currentStep
                  ? "bg-primary text-primary-foreground"
                  : idx < currentStep
                    ? "cursor-pointer bg-primary/10 text-primary hover:bg-primary/20"
                    : "cursor-pointer bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {step.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {STEPS[currentStep].name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {STEPS[currentStep].description}
            </p>
          </div>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={handleNext} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
