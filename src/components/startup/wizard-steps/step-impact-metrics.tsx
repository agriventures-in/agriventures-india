"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { WizardFormData } from "@/components/startup/submit-wizard"

interface StepImpactMetricsProps {
  formData: WizardFormData
  updateFormData: (updates: Partial<WizardFormData>) => void
  errors: Record<string, string>
}

export function StepImpactMetrics({
  formData,
  updateFormData,
  errors,
}: StepImpactMetricsProps) {
  function addMetric() {
    if (formData.impactMetrics.length >= 5) return
    updateFormData({
      impactMetrics: [...formData.impactMetrics, { name: "", value: "", unit: "" }],
    })
  }

  function removeMetric(index: number) {
    if (formData.impactMetrics.length <= 1) return
    updateFormData({
      impactMetrics: formData.impactMetrics.filter((_, i) => i !== index),
    })
  }

  function updateMetric(index: number, field: "name" | "value" | "unit", val: string) {
    const updated = formData.impactMetrics.map((metric, i) =>
      i === index ? { ...metric, [field]: val } : metric
    )
    updateFormData({ impactMetrics: updated })
  }

  return (
    <div className="space-y-5">
      <div>
        <Label>
          Impact Metrics <span className="text-destructive">*</span>
        </Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Add measurable impact metrics for your startup. Examples: &ldquo;Farmers Served&rdquo;
          with value &ldquo;5000&rdquo; and unit &ldquo;farmers&rdquo;. Minimum 1, maximum 5
          metrics.
        </p>
      </div>

      {errors.impactMetrics && (
        <p className="text-sm text-destructive">{errors.impactMetrics}</p>
      )}

      <div className="space-y-4">
        {formData.impactMetrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-lg border bg-muted/30 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Metric {index + 1}
              </span>
              {formData.impactMetrics.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMetric(index)}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor={`metric-name-${index}`} className="text-xs">
                  Metric Name
                </Label>
                <Input
                  id={`metric-name-${index}`}
                  placeholder="e.g., Farmers Served"
                  value={metric.name}
                  onChange={(e) => updateMetric(index, "name", e.target.value)}
                  className={
                    errors[`impactMetrics.${index}.name`] ? "border-destructive" : ""
                  }
                />
                {errors[`impactMetrics.${index}.name`] && (
                  <p className="text-xs text-destructive">
                    {errors[`impactMetrics.${index}.name`]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`metric-value-${index}`} className="text-xs">
                  Value
                </Label>
                <Input
                  id={`metric-value-${index}`}
                  placeholder="e.g., 5000"
                  value={metric.value}
                  onChange={(e) => updateMetric(index, "value", e.target.value)}
                  className={
                    errors[`impactMetrics.${index}.value`] ? "border-destructive" : ""
                  }
                />
                {errors[`impactMetrics.${index}.value`] && (
                  <p className="text-xs text-destructive">
                    {errors[`impactMetrics.${index}.value`]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`metric-unit-${index}`} className="text-xs">
                  Unit
                </Label>
                <Input
                  id={`metric-unit-${index}`}
                  placeholder="e.g., farmers"
                  value={metric.unit}
                  onChange={(e) => updateMetric(index, "unit", e.target.value)}
                  className={
                    errors[`impactMetrics.${index}.unit`] ? "border-destructive" : ""
                  }
                />
                {errors[`impactMetrics.${index}.unit`] && (
                  <p className="text-xs text-destructive">
                    {errors[`impactMetrics.${index}.unit`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {formData.impactMetrics.length < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={addMetric}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Metric ({formData.impactMetrics.length}/5)
        </Button>
      )}
    </div>
  )
}
