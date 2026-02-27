"use client"

import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { FileUpload } from "@/components/ui/file-upload"
import { FUNDING_STATUSES } from "@/lib/constants"
import { FileText, Video, Wallet, Images, X } from "lucide-react"
import type { WizardFormData } from "@/components/startup/submit-wizard"

interface StepMediaProps {
  formData: WizardFormData
  updateFormData: (updates: Partial<WizardFormData>) => void
  errors: Record<string, string>
}

export function StepMedia({ formData, updateFormData, errors }: StepMediaProps) {
  const handleGalleryUpload = useCallback(
    (url: string) => {
      if (formData.galleryUrls.length < 5) {
        updateFormData({ galleryUrls: [...formData.galleryUrls, url] })
      }
    },
    [formData.galleryUrls, updateFormData]
  )

  const handleGalleryRemove = useCallback(
    (index: number) => {
      updateFormData({
        galleryUrls: formData.galleryUrls.filter((_, i) => i !== index),
      })
    },
    [formData.galleryUrls, updateFormData]
  )

  return (
    <div className="space-y-6">
      {/* Startup Logo */}
      <div className="space-y-3">
        <Label>Startup Logo</Label>
        <p className="text-xs text-muted-foreground">
          Upload your startup&apos;s logo. Square images work best (recommended: 120x120px).
        </p>
        <ImageUpload
          value={formData.logoUrl || undefined}
          onChange={(url) => updateFormData({ logoUrl: url })}
          variant="logo"
        />
        {errors.logoUrl && (
          <p className="text-sm text-destructive">{errors.logoUrl}</p>
        )}
      </div>

      {/* Gallery */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Images className="h-4 w-4 text-muted-foreground" />
          <Label>Gallery Images</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload up to 5 images showcasing your product, team, or field work.
        </p>

        {/* Gallery preview grid */}
        {formData.galleryUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {formData.galleryUrls.map((url, index) => (
              <div
                key={url}
                className="group relative aspect-video overflow-hidden rounded-lg border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Gallery image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleGalleryRemove(index)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload new gallery image */}
        {formData.galleryUrls.length < 5 && (
          <FileUpload
            onUpload={handleGalleryUpload}
            accept="image/jpeg,image/png,image/webp,image/gif"
            maxSizeMB={4}
            label={`Add image (${formData.galleryUrls.length}/5)`}
          />
        )}

        {errors.galleryUrls && (
          <p className="text-sm text-destructive">{errors.galleryUrls}</p>
        )}
      </div>

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
