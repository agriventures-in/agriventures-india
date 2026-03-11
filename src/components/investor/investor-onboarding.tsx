"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Target,
  User,
  Settings,
  PartyPopper,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TECH_CATEGORIES, STARTUP_STAGES, INDIAN_STATES } from "@/lib/constants"

const STEPS = [
  { id: 1, label: "Investment Thesis", icon: Target },
  { id: 2, label: "Background", icon: User },
  { id: 3, label: "Preferences", icon: Settings },
  { id: 4, label: "All Set!", icon: PartyPopper },
]

const CHECK_SIZE_RANGES = [
  { value: 100000, label: "1 Lakh" },
  { value: 500000, label: "5 Lakhs" },
  { value: 1000000, label: "10 Lakhs" },
  { value: 2500000, label: "25 Lakhs" },
  { value: 5000000, label: "50 Lakhs" },
  { value: 10000000, label: "1 Crore" },
  { value: 50000000, label: "5 Crores" },
  { value: 100000000, label: "10 Crores+" },
]

const DEAL_FLOW_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
]

interface FormData {
  // Step 1: Investment Thesis
  preferredCategories: string[]
  preferredStages: string[]
  checkSizeMin: number | null
  checkSizeMax: number | null
  thesis: string
  // Step 2: Background
  firmName: string
  organization: string
  linkedinUrl: string
  websiteUrl: string
  // Step 3: Preferences
  preferredStates: string[]
  dealFlowFrequency: string
}

export function InvestorOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    preferredCategories: [],
    preferredStages: [],
    checkSizeMin: null,
    checkSizeMax: null,
    thesis: "",
    firmName: "",
    organization: "",
    linkedinUrl: "",
    websiteUrl: "",
    preferredStates: [],
    dealFlowFrequency: "weekly",
  })

  // Load existing profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/investors/profile")
        if (!res.ok) return

        const data = await res.json()
        const { user, investorProfile } = data

        setFormData((prev) => ({
          ...prev,
          organization: user?.organization || "",
          linkedinUrl: user?.linkedinUrl || "",
          firmName: investorProfile?.firmName || "",
          thesis: investorProfile?.thesis || "",
          checkSizeMin: investorProfile?.checkSizeMin ?? null,
          checkSizeMax: investorProfile?.checkSizeMax ?? null,
          preferredStages: (investorProfile?.preferredStages as string[]) || [],
          preferredCategories:
            (investorProfile?.preferredCategories as string[]) || [],
          websiteUrl: investorProfile?.websiteUrl || "",
        }))
      } catch {
        // Ignore errors on initial load
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  async function saveStepData() {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {}

      if (currentStep === 1) {
        payload.preferredCategories = formData.preferredCategories
        payload.preferredStages = formData.preferredStages
        payload.checkSizeMin = formData.checkSizeMin
        payload.checkSizeMax = formData.checkSizeMax
        payload.thesis = formData.thesis
      } else if (currentStep === 2) {
        payload.firmName = formData.firmName
        payload.organization = formData.organization
        payload.linkedinUrl = formData.linkedinUrl
        payload.websiteUrl = formData.websiteUrl
      } else if (currentStep === 3) {
        // Store preferences in thesis field as JSON appendix or in bio
        // Since there's no dedicated field for states/frequency, store them in the thesis or as custom data
        payload.bio = JSON.stringify({
          preferredStates: formData.preferredStates,
          dealFlowFrequency: formData.dealFlowFrequency,
        })
      }

      const res = await fetch("/api/investors/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to save")
      }

      return true
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save progress"
      )
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleNext() {
    if (currentStep < 4) {
      const saved = await saveStepData()
      if (saved) {
        setCurrentStep((prev) => prev + 1)
        toast.success("Progress saved")
      }
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  function toggleArrayItem(
    field: "preferredCategories" | "preferredStages" | "preferredStates",
    value: string
  ) {
    setFormData((prev) => {
      const current = prev[field]
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [field]: updated }
    })
  }

  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* Step Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    isCompleted
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : isActive
                        ? "border-emerald-600 bg-white text-emerald-600"
                        : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    isActive
                      ? "text-emerald-700"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Step Content */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0A4A23]">
                Investment Thesis
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tell us what kind of AgriTech startups you are interested in.
              </p>
            </div>

            {/* Preferred Categories */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">
                Preferred Categories
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TECH_CATEGORIES.map((cat) => (
                  <label
                    key={cat.value}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      formData.preferredCategories.includes(cat.value)
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Checkbox
                      checked={formData.preferredCategories.includes(cat.value)}
                      onCheckedChange={() =>
                        toggleArrayItem("preferredCategories", cat.value)
                      }
                    />
                    <span className="text-sm text-slate-700">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Stages */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">
                Preferred Stages
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTUP_STAGES.map((stage) => (
                  <label
                    key={stage.value}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      formData.preferredStages.includes(stage.value)
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Checkbox
                      checked={formData.preferredStages.includes(stage.value)}
                      onCheckedChange={() =>
                        toggleArrayItem("preferredStages", stage.value)
                      }
                    />
                    <span className="text-sm text-slate-700">
                      {stage.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Check Size Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Min Check Size
                </Label>
                <Select
                  value={
                    formData.checkSizeMin !== null
                      ? String(formData.checkSizeMin)
                      : ""
                  }
                  onValueChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      checkSizeMin: val ? parseInt(val) : null,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select min" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHECK_SIZE_RANGES.map((r) => (
                      <SelectItem key={r.value} value={String(r.value)}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Max Check Size
                </Label>
                <Select
                  value={
                    formData.checkSizeMax !== null
                      ? String(formData.checkSizeMax)
                      : ""
                  }
                  onValueChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      checkSizeMax: val ? parseInt(val) : null,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select max" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHECK_SIZE_RANGES.map((r) => (
                      <SelectItem key={r.value} value={String(r.value)}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Thesis */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Investment Thesis (optional)
              </Label>
              <textarea
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
                placeholder="Describe your investment focus, what excites you in AgriTech..."
                value={formData.thesis}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, thesis: e.target.value }))
                }
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0A4A23]">Background</h2>
              <p className="mt-1 text-sm text-slate-500">
                Help startups understand who you are.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Organization / Fund Name
                </Label>
                <Input
                  placeholder="e.g. Accel Partners, Angel Investor"
                  value={formData.firmName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firmName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Role / Title
                </Label>
                <Input
                  placeholder="e.g. Partner, Angel Investor, Managing Director"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      organization: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Website
                </Label>
                <Input
                  type="url"
                  placeholder="https://yourfund.com"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      websiteUrl: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  LinkedIn Profile
                </Label>
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedinUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkedinUrl: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0A4A23]">Preferences</h2>
              <p className="mt-1 text-sm text-slate-500">
                Customize your deal flow and regional focus.
              </p>
            </div>

            {/* Preferred Indian States */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">
                Preferred Indian States
              </Label>
              <p className="text-xs text-slate-400">
                Select the states you are most interested in.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto rounded-lg border p-3">
                {INDIAN_STATES.map((state) => (
                  <label
                    key={state}
                    className={`flex items-center gap-3 rounded-md px-2 py-1.5 cursor-pointer transition-colors ${
                      formData.preferredStates.includes(state)
                        ? "bg-emerald-50 text-emerald-700"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <Checkbox
                      checked={formData.preferredStates.includes(state)}
                      onCheckedChange={() =>
                        toggleArrayItem("preferredStates", state)
                      }
                    />
                    <span className="text-sm">{state}</span>
                  </label>
                ))}
              </div>
              {formData.preferredStates.length > 0 && (
                <p className="text-xs text-emerald-600">
                  {formData.preferredStates.length} state
                  {formData.preferredStates.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Deal Flow Frequency */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Deal Flow Frequency
              </Label>
              <p className="text-xs text-slate-400">
                How often would you like to receive startup recommendations?
              </p>
              <Select
                value={formData.dealFlowFrequency}
                onValueChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    dealFlowFrequency: val,
                  }))
                }
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_FLOW_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0A4A23]">
                All Set!
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-md">
                Your investor profile is ready. Start discovering AgriTech
                startups that match your investment thesis.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                asChild
                className="bg-[#16A34A] hover:bg-[#0A4A23] text-white"
              >
                <Link href="/discover">Discover Startups</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1 || saving}
              className={currentStep === 1 ? "invisible" : ""}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={saving}
              className="bg-[#16A34A] hover:bg-[#0A4A23] text-white"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {currentStep === 3 ? "Complete Setup" : "Save & Continue"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
