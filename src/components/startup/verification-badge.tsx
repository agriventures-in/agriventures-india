"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Users } from "lucide-react"
import { cn } from "@/lib/utils"

type VerificationLevel = "NONE" | "COMMUNITY" | "EXPERT" | "FULL"

interface VerificationBadgeProps {
  level: VerificationLevel
  className?: string
}

export function VerificationBadge({ level, className }: VerificationBadgeProps) {
  switch (level) {
    case "NONE":
      return (
        <Badge
          variant="outline"
          className={cn("border-gray-300 text-gray-500", className)}
        >
          Unverified
        </Badge>
      )
    case "COMMUNITY":
      return (
        <Badge
          className={cn(
            "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
            className
          )}
        >
          <Users className="mr-1 h-3 w-3" />
          Community Verified
        </Badge>
      )
    case "EXPERT":
      return (
        <Badge
          className={cn(
            "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
            className
          )}
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          Expert Verified
        </Badge>
      )
    case "FULL":
      return (
        <Badge
          className={cn(
            "relative overflow-hidden border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
            className
          )}
        >
          <Shield className="mr-1 h-3 w-3" />
          Fully Verified
          {/* Shimmer animation */}
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </Badge>
      )
    default:
      return null
  }
}
