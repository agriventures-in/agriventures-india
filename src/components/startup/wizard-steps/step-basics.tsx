"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INDIAN_STATES } from "@/lib/constants"
import type { WizardFormData } from "@/components/startup/submit-wizard"

interface StepBasicsProps {
  formData: WizardFormData
  updateFormData: (updates: Partial<WizardFormData>) => void
  errors: Record<string, string>
}

export function StepBasics({ formData, updateFormData, errors }: StepBasicsProps) {
  return (
    <div className="space-y-5">
      {/* Startup Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Startup Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g., FarmSense Technologies"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <Label htmlFor="tagline">
          Tagline <span className="text-destructive">*</span>
        </Label>
        <Input
          id="tagline"
          placeholder="e.g., AI-powered crop disease detection for smallholder farmers"
          value={formData.tagline}
          onChange={(e) => updateFormData({ tagline: e.target.value })}
          className={errors.tagline ? "border-destructive" : ""}
        />
        <p className="text-xs text-muted-foreground">
          {formData.tagline.length}/150 characters
        </p>
        {errors.tagline && (
          <p className="text-sm text-destructive">{errors.tagline}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          About Your Startup{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Tell us more about your startup — what you do, who you serve, and what makes you unique. This appears on your public profile."
          rows={4}
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          {formData.description.length}/2000 characters
        </p>
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label>
          State <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.state}
          onValueChange={(value) => updateFormData({ state: value })}
        >
          <SelectTrigger className={errors.state ? "border-destructive" : ""}>
            <SelectValue placeholder="Select your state" />
          </SelectTrigger>
          <SelectContent>
            {INDIAN_STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && (
          <p className="text-sm text-destructive">{errors.state}</p>
        )}
      </div>

      {/* District */}
      <div className="space-y-2">
        <Label htmlFor="district">District</Label>
        <Input
          id="district"
          placeholder="e.g., Pune"
          value={formData.district}
          onChange={(e) => updateFormData({ district: e.target.value })}
        />
      </div>

      {/* Founded Year & Website - Two columns */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="foundedYear">Founded Year</Label>
          <Input
            id="foundedYear"
            type="number"
            placeholder="e.g., 2023"
            min={2000}
            max={2026}
            value={formData.foundedYear ?? ""}
            onChange={(e) =>
              updateFormData({
                foundedYear: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className={errors.foundedYear ? "border-destructive" : ""}
          />
          {errors.foundedYear && (
            <p className="text-sm text-destructive">{errors.foundedYear}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            type="url"
            placeholder="https://example.com"
            value={formData.websiteUrl}
            onChange={(e) => updateFormData({ websiteUrl: e.target.value })}
            className={errors.websiteUrl ? "border-destructive" : ""}
          />
          {errors.websiteUrl && (
            <p className="text-sm text-destructive">{errors.websiteUrl}</p>
          )}
        </div>
      </div>
    </div>
  )
}
