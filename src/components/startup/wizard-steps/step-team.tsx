"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Users } from "lucide-react"
import type { WizardFormData } from "@/components/startup/submit-wizard"

interface StepTeamProps {
  formData: WizardFormData
  updateFormData: (updates: Partial<WizardFormData>) => void
  errors: Record<string, string>
}

export function StepTeam({ formData, updateFormData, errors }: StepTeamProps) {
  function addMember() {
    updateFormData({
      teamMembers: [...formData.teamMembers, { name: "", role: "", linkedinUrl: "" }],
    })
  }

  function removeMember(index: number) {
    if (formData.teamMembers.length <= 1) return
    updateFormData({
      teamMembers: formData.teamMembers.filter((_, i) => i !== index),
    })
  }

  function updateMember(
    index: number,
    field: "name" | "role" | "linkedinUrl",
    value: string
  ) {
    const updated = formData.teamMembers.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    )
    updateFormData({ teamMembers: updated })
  }

  return (
    <div className="space-y-5">
      {/* Team Size */}
      <div className="space-y-2">
        <Label htmlFor="teamSize">
          Total Team Size <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          Include all team members: founders, full-time employees, and key contributors.
        </p>
        <Input
          id="teamSize"
          type="number"
          min={1}
          placeholder="e.g., 5"
          value={formData.teamSize || ""}
          onChange={(e) =>
            updateFormData({ teamSize: parseInt(e.target.value) || 1 })
          }
          className={errors.teamSize ? "border-destructive" : ""}
        />
        {errors.teamSize && (
          <p className="text-sm text-destructive">{errors.teamSize}</p>
        )}
      </div>

      {/* Team Members */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Label>
            Key Team Members <span className="text-destructive">*</span>
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Add your founding team and key members. At least one member is required.
        </p>
      </div>

      {errors.teamMembers && (
        <p className="text-sm text-destructive">{errors.teamMembers}</p>
      )}

      <div className="space-y-4">
        {formData.teamMembers.map((member, index) => (
          <div
            key={index}
            className="rounded-lg border bg-muted/30 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Member {index + 1}
              </span>
              {formData.teamMembers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMember(index)}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor={`member-name-${index}`} className="text-xs">
                  Full Name
                </Label>
                <Input
                  id={`member-name-${index}`}
                  placeholder="e.g., Priya Sharma"
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)}
                  className={
                    errors[`teamMembers.${index}.name`] ? "border-destructive" : ""
                  }
                />
                {errors[`teamMembers.${index}.name`] && (
                  <p className="text-xs text-destructive">
                    {errors[`teamMembers.${index}.name`]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`member-role-${index}`} className="text-xs">
                  Role
                </Label>
                <Input
                  id={`member-role-${index}`}
                  placeholder="e.g., CEO & Co-Founder"
                  value={member.role}
                  onChange={(e) => updateMember(index, "role", e.target.value)}
                  className={
                    errors[`teamMembers.${index}.role`] ? "border-destructive" : ""
                  }
                />
                {errors[`teamMembers.${index}.role`] && (
                  <p className="text-xs text-destructive">
                    {errors[`teamMembers.${index}.role`]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`member-linkedin-${index}`} className="text-xs">
                  LinkedIn URL
                </Label>
                <Input
                  id={`member-linkedin-${index}`}
                  placeholder="https://linkedin.com/in/..."
                  value={member.linkedinUrl}
                  onChange={(e) =>
                    updateMember(index, "linkedinUrl", e.target.value)
                  }
                  className={
                    errors[`teamMembers.${index}.linkedinUrl`]
                      ? "border-destructive"
                      : ""
                  }
                />
                {errors[`teamMembers.${index}.linkedinUrl`] && (
                  <p className="text-xs text-destructive">
                    {errors[`teamMembers.${index}.linkedinUrl`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addMember}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Team Member
      </Button>
    </div>
  )
}
