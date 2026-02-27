"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TECH_CATEGORIES, STARTUP_STAGES } from "@/lib/constants"
import type { WizardFormData } from "@/components/startup/submit-wizard"

interface StepCategoryProps {
  formData: WizardFormData
  updateFormData: (updates: Partial<WizardFormData>) => void
  errors: Record<string, string>
}

const SUB_CATEGORY_OPTIONS = [
  "Crop Monitoring",
  "Soil Health",
  "Irrigation Management",
  "Pest Detection",
  "Yield Prediction",
  "Weather Analytics",
  "Farm Management Software",
  "Seed Technology",
  "Organic Farming",
  "Post-Harvest Technology",
  "Cold Chain Solutions",
  "Farm-to-Fork Traceability",
  "Livestock Management",
  "Dairy Technology",
  "Fisheries Technology",
  "Agricultural Drones",
  "Satellite Imagery",
  "Blockchain for Agriculture",
  "Rural Fintech",
  "Crop Insurance Tech",
]

export function StepCategory({ formData, updateFormData, errors }: StepCategoryProps) {
  function toggleSubCategory(sub: string) {
    const current = formData.subCategories
    if (current.includes(sub)) {
      updateFormData({
        subCategories: current.filter((s) => s !== sub),
      })
    } else if (current.length < 5) {
      updateFormData({
        subCategories: [...current, sub],
      })
    }
  }

  return (
    <div className="space-y-5">
      {/* Tech Category */}
      <div className="space-y-2">
        <Label>
          Tech Category <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.techCategory}
          onValueChange={(value) => updateFormData({ techCategory: value })}
        >
          <SelectTrigger className={errors.techCategory ? "border-destructive" : ""}>
            <SelectValue placeholder="Select a tech category" />
          </SelectTrigger>
          <SelectContent>
            {TECH_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.techCategory && (
          <p className="text-sm text-destructive">{errors.techCategory}</p>
        )}
      </div>

      {/* Sub-Categories */}
      <div className="space-y-3">
        <div>
          <Label>Sub-Categories</Label>
          <p className="text-xs text-muted-foreground">
            Select up to 5 sub-categories that best describe your focus areas.
            ({formData.subCategories.length}/5 selected)
          </p>
        </div>
        {errors.subCategories && (
          <p className="text-sm text-destructive">{errors.subCategories}</p>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SUB_CATEGORY_OPTIONS.map((sub) => {
            const isChecked = formData.subCategories.includes(sub)
            const isDisabled = !isChecked && formData.subCategories.length >= 5
            return (
              <label
                key={sub}
                className={`flex cursor-pointer items-center gap-2 rounded-md border p-2.5 text-sm transition-colors ${
                  isChecked
                    ? "border-primary bg-primary/5"
                    : isDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleSubCategory(sub)}
                  disabled={isDisabled}
                />
                <span>{sub}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Stage */}
      <div className="space-y-2">
        <Label>
          Current Stage <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.stage}
          onValueChange={(value) =>
            updateFormData({
              stage: value as WizardFormData["stage"],
            })
          }
        >
          <SelectTrigger className={errors.stage ? "border-destructive" : ""}>
            <SelectValue placeholder="Select your current stage" />
          </SelectTrigger>
          <SelectContent>
            {STARTUP_STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.stage && (
          <p className="text-sm text-destructive">{errors.stage}</p>
        )}
      </div>
    </div>
  )
}
