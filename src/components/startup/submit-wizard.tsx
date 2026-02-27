"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Loader2, Rocket } from "lucide-react"
import {
  startupBasicsSchema,
  problemSolutionSchema,
  categorySchema,
  impactMetricsSchema,
  fieldTrialSchema,
  teamSchema,
  mediaSchema,
} from "@/lib/validations/startup"
import type { CreateStartupInput } from "@/lib/validations/startup"
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

export type WizardFormData = {
  // Step 1: Basics
  name: string
  tagline: string
  state: string
  district: string
  foundedYear: number | undefined
  websiteUrl: string
  // Step 2: Problem & Solution
  problemStatement: string
  solution: string
  businessModel: string
  // Step 3: Category
  techCategory: string
  subCategories: string[]
  stage: "IDEATION" | "VALIDATION" | "EARLY_TRACTION" | "GROWTH" | "SCALING"
  // Step 4: Impact Metrics
  impactMetrics: { name: string; value: string; unit: string }[]
  // Step 5: Field Trials
  fieldTrialData: {
    hasTrials: boolean
    trialDescription: string
    trialLocation: string
    sampleSize: string
    results: string
  }
  // Step 6: Team
  teamSize: number
  teamMembers: { name: string; role: string; linkedinUrl: string }[]
  // Step 7: Media
  logoUrl: string
  galleryUrls: string[]
  pitchDeckUrl: string
  demoVideoUrl: string
  fundingStatus: string
  fundingAmount: string
}

const initialFormData: WizardFormData = {
  name: "",
  tagline: "",
  state: "",
  district: "",
  foundedYear: undefined,
  websiteUrl: "",
  problemStatement: "",
  solution: "",
  businessModel: "",
  techCategory: "",
  subCategories: [],
  stage: "IDEATION",
  impactMetrics: [{ name: "", value: "", unit: "" }],
  fieldTrialData: {
    hasTrials: false,
    trialDescription: "",
    trialLocation: "",
    sampleSize: "",
    results: "",
  },
  teamSize: 1,
  teamMembers: [{ name: "", role: "", linkedinUrl: "" }],
  logoUrl: "",
  galleryUrls: [],
  pitchDeckUrl: "",
  demoVideoUrl: "",
  fundingStatus: "",
  fundingAmount: "",
}

export function SubmitWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<WizardFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
          galleryUrls: formData.galleryUrls.length > 0 ? formData.galleryUrls : undefined,
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

  async function handleSubmit() {
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    try {
      const payload: CreateStartupInput = {
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
        teamMembers: formData.teamMembers,
        logoUrl: formData.logoUrl || undefined,
        galleryUrls: formData.galleryUrls.length > 0 ? formData.galleryUrls : undefined,
        pitchDeckUrl: formData.pitchDeckUrl || undefined,
        demoVideoUrl: formData.demoVideoUrl || undefined,
        fundingStatus: formData.fundingStatus || undefined,
        fundingAmount: formData.fundingAmount || undefined,
      }

      const res = await fetch("/api/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to submit startup")
      }

      toast.success("Your startup has been submitted successfully! It will be reviewed shortly.")
      router.push("/discover")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
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
                }
              }}
              className={`flex-1 rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors ${
                idx === currentStep
                  ? "bg-primary text-primary-foreground"
                  : idx < currentStep
                    ? "cursor-pointer bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-muted text-muted-foreground"
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

        {currentStep < STEPS.length - 1 ? (
          <Button type="button" onClick={handleNext} className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                Submit Startup
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
