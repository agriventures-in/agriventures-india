"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TECH_CATEGORIES, STARTUP_STAGES, INDIAN_STATES } from "@/lib/constants"
import { X } from "lucide-react"

interface FilterBarProps {
  category: string
  stage: string
  state: string
  onCategoryChange: (value: string) => void
  onStageChange: (value: string) => void
  onStateChange: (value: string) => void
  onClear: () => void
}

export function FilterBar({
  category,
  stage,
  state,
  onCategoryChange,
  onStageChange,
  onStateChange,
  onClear,
}: FilterBarProps) {
  const hasFilters = category || stage || state

  return (
    <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
      {/* Category */}
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          {TECH_CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Stage */}
      <Select value={stage} onValueChange={onStageChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Stages" />
        </SelectTrigger>
        <SelectContent>
          {STARTUP_STAGES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* State */}
      <Select value={state} onValueChange={onStateChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All States" />
        </SelectTrigger>
        <SelectContent>
          {INDIAN_STATES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Button */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
