"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { WizardFormData } from "@/components/startup/submit-wizard"

interface StepProblemSolutionProps {
  formData: WizardFormData
  updateFormData: (updates: Partial<WizardFormData>) => void
  errors: Record<string, string>
}

export function StepProblemSolution({
  formData,
  updateFormData,
  errors,
}: StepProblemSolutionProps) {
  return (
    <div className="space-y-5">
      {/* Problem Statement */}
      <div className="space-y-2">
        <Label htmlFor="problemStatement">
          Problem Statement <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          What agricultural problem are you solving? Be specific about who is affected and how.
        </p>
        <Textarea
          id="problemStatement"
          placeholder="Describe the agricultural problem you are addressing. Who faces this problem? What is the current impact? What are the existing alternatives and their limitations?"
          rows={6}
          value={formData.problemStatement}
          onChange={(e) => updateFormData({ problemStatement: e.target.value })}
          className={errors.problemStatement ? "border-destructive" : ""}
        />
        <div className="flex items-center justify-between text-xs">
          <span className={formData.problemStatement.length < 50 ? "text-destructive" : "text-muted-foreground"}>
            {formData.problemStatement.length}/2000 characters (min 50)
          </span>
        </div>
        {errors.problemStatement && (
          <p className="text-sm text-destructive">{errors.problemStatement}</p>
        )}
      </div>

      {/* Solution */}
      <div className="space-y-2">
        <Label htmlFor="solution">
          Your Solution <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          How does your technology solve this problem? What makes your approach unique?
        </p>
        <Textarea
          id="solution"
          placeholder="Describe your solution in detail. What technology do you use? How does it work? What makes it different from existing alternatives? What is your unique value proposition?"
          rows={6}
          value={formData.solution}
          onChange={(e) => updateFormData({ solution: e.target.value })}
          className={errors.solution ? "border-destructive" : ""}
        />
        <div className="flex items-center justify-between text-xs">
          <span className={formData.solution.length < 50 ? "text-destructive" : "text-muted-foreground"}>
            {formData.solution.length}/2000 characters (min 50)
          </span>
        </div>
        {errors.solution && (
          <p className="text-sm text-destructive">{errors.solution}</p>
        )}
      </div>

      {/* Business Model */}
      <div className="space-y-2">
        <Label htmlFor="businessModel">Business Model</Label>
        <p className="text-xs text-muted-foreground">
          How do you plan to generate revenue? (Optional but recommended)
        </p>
        <Textarea
          id="businessModel"
          placeholder="e.g., SaaS subscription for FPOs, per-acre pricing for farmers, marketplace commission..."
          rows={4}
          value={formData.businessModel}
          onChange={(e) => updateFormData({ businessModel: e.target.value })}
        />
      </div>
    </div>
  )
}
