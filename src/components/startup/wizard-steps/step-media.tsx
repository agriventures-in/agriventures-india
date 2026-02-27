"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FUNDING_STATUSES } from "@/lib/constants"
import { FileText, Video, Wallet } from "lucide-react"
import type { WizardFormData } from "@/components/startup/submit-wizard"

interface StepMediaProps {
  formData: WizardFormData
  updateFormData: (updates: Partial<WizardFormData>) => void
  errors: Record<string, string>
}

export function StepMedia({ formData, updateFormData, errors }: StepMediaProps) {
  return (
    <div className="space-y-6">
      {/* Pitch Deck */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="pitchDeckUrl">Pitch Deck URL</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Link to your pitch deck (Google Slides, Docsend, PDF link, etc.)
        </p>
        <Input
          id="pitchDeckUrl"
          type="url"
          placeholder="https://docs.google.com/presentation/..."
          value={formData.pitchDeckUrl}
          onChange={(e) => updateFormData({ pitchDeckUrl: e.target.value })}
          className={errors.pitchDeckUrl ? "border-destructive" : ""}
        />
        {errors.pitchDeckUrl && (
          <p className="text-sm text-destructive">{errors.pitchDeckUrl}</p>
        )}
      </div>

      {/* Demo Video */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="demoVideoUrl">Demo Video URL</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Link to a demo or explainer video (YouTube, Vimeo, Loom, etc.)
        </p>
        <Input
          id="demoVideoUrl"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={formData.demoVideoUrl}
          onChange={(e) => updateFormData({ demoVideoUrl: e.target.value })}
          className={errors.demoVideoUrl ? "border-destructive" : ""}
        />
        {errors.demoVideoUrl && (
          <p className="text-sm text-destructive">{errors.demoVideoUrl}</p>
        )}
      </div>

      {/* Funding Section */}
      <div className="rounded-lg border p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
          <Wallet className="h-4 w-4" />
          Funding Information
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Funding Status */}
          <div className="space-y-2">
            <Label>Funding Status</Label>
            <Select
              value={formData.fundingStatus}
              onValueChange={(value) => updateFormData({ fundingStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select funding status" />
              </SelectTrigger>
              <SelectContent>
                {FUNDING_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Funding Amount */}
          <div className="space-y-2">
            <Label htmlFor="fundingAmount">Funding Amount</Label>
            <Input
              id="fundingAmount"
              placeholder="e.g., INR 50 Lakhs"
              value={formData.fundingAmount}
              onChange={(e) => updateFormData({ fundingAmount: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Submission Note */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm text-foreground">
          <strong>Almost done!</strong> After submission, your startup will be
          reviewed by our team. You&apos;ll receive an email notification once
          your listing is live. The verification process typically takes 2-3
          business days.
        </p>
      </div>
    </div>
  )
}
