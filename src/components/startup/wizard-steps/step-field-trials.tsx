"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FlaskConical } from "lucide-react"
import type { WizardFormData } from "@/components/startup/submit-wizard"

interface StepFieldTrialsProps {
  formData: WizardFormData
  updateFormData: (updates: Partial<WizardFormData>) => void
  errors: Record<string, string>
}

export function StepFieldTrials({
  formData,
  updateFormData,
}: StepFieldTrialsProps) {
  const { fieldTrialData } = formData

  function updateTrialField(
    field: keyof WizardFormData["fieldTrialData"],
    value: string | boolean
  ) {
    updateFormData({
      fieldTrialData: { ...fieldTrialData, [field]: value },
    })
  }

  return (
    <div className="space-y-5">
      {/* Toggle */}
      <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
        <Checkbox
          id="hasTrials"
          checked={fieldTrialData.hasTrials}
          onCheckedChange={(checked) =>
            updateTrialField("hasTrials", checked === true)
          }
        />
        <div className="space-y-1">
          <Label htmlFor="hasTrials" className="cursor-pointer text-sm font-medium">
            Do you have field trial data?
          </Label>
          <p className="text-xs text-muted-foreground">
            If you&apos;ve conducted field trials, pilots, or proof-of-concept tests, share the
            details here. This strengthens your verification application.
          </p>
        </div>
      </div>

      {fieldTrialData.hasTrials ? (
        <div className="space-y-5 rounded-lg border p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <FlaskConical className="h-4 w-4" />
            Field Trial Details
          </div>

          {/* Trial Description */}
          <div className="space-y-2">
            <Label htmlFor="trialDescription">Trial Description</Label>
            <Textarea
              id="trialDescription"
              placeholder="Describe the field trial: objectives, methodology, duration, and key findings..."
              rows={4}
              value={fieldTrialData.trialDescription}
              onChange={(e) => updateTrialField("trialDescription", e.target.value)}
            />
          </div>

          {/* Trial Location */}
          <div className="space-y-2">
            <Label htmlFor="trialLocation">Trial Location</Label>
            <Input
              id="trialLocation"
              placeholder="e.g., Nashik District, Maharashtra"
              value={fieldTrialData.trialLocation}
              onChange={(e) => updateTrialField("trialLocation", e.target.value)}
            />
          </div>

          {/* Sample Size */}
          <div className="space-y-2">
            <Label htmlFor="sampleSize">Sample Size</Label>
            <Input
              id="sampleSize"
              placeholder="e.g., 200 farmers across 5 villages"
              value={fieldTrialData.sampleSize}
              onChange={(e) => updateTrialField("sampleSize", e.target.value)}
            />
          </div>

          {/* Results */}
          <div className="space-y-2">
            <Label htmlFor="trialResults">Results & Outcomes</Label>
            <Textarea
              id="trialResults"
              placeholder="Quantify the results: yield improvement, cost savings, time saved, adoption rate, etc."
              rows={4}
              value={fieldTrialData.results}
              onChange={(e) => updateTrialField("results", e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <FlaskConical className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No field trial data to share? No worries! You can always add this later.
            Having trial data helps accelerate your verification.
          </p>
        </div>
      )}
    </div>
  )
}
