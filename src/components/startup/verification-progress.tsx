"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Users, Award, Star } from "lucide-react"
import { COMMUNITY_UPVOTE_THRESHOLD } from "@/lib/verification"

interface VerificationProgressProps {
  currentLevel: string
  upvoteCount: number
}

export function VerificationProgress({
  currentLevel,
  upvoteCount,
}: VerificationProgressProps) {
  if (currentLevel === "NONE") {
    const progress = Math.min(
      (upvoteCount / COMMUNITY_UPVOTE_THRESHOLD) * 100,
      100
    )

    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-600" />
          <h4 className="text-sm font-semibold text-emerald-900">
            Path to Community Verified
          </h4>
        </div>
        <p className="mb-3 text-xs text-emerald-700">
          Get {COMMUNITY_UPVOTE_THRESHOLD}+ upvotes to earn the Community
          Verified badge
        </p>
        <Progress
          value={progress}
          className="h-2.5 bg-emerald-100 [&>div]:bg-emerald-500"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-emerald-600">
          <span className="font-medium">
            {upvoteCount} / {COMMUNITY_UPVOTE_THRESHOLD} upvotes
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    )
  }

  if (currentLevel === "COMMUNITY") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Award className="h-5 w-5 text-emerald-600" />
          <h4 className="text-sm font-semibold text-emerald-900">
            Next: Expert Verification
          </h4>
        </div>
        <p className="mb-3 text-xs text-emerald-700">
          Take your verification to the next level with an expert review
        </p>
        <Badge className="border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          <Award className="mr-1 h-3 w-3" />
          Apply for Expert Verification
        </Badge>
      </div>
    )
  }

  if (currentLevel === "EXPERT") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h4 className="text-sm font-semibold text-emerald-900">
            Full Verification In Progress
          </h4>
        </div>
        <p className="text-xs text-emerald-700">
          Full verification is pending third-party review. You will be notified
          once the review is complete.
        </p>
      </div>
    )
  }

  if (currentLevel === "FULL") {
    return (
      <div className="rounded-lg border border-emerald-300 bg-gradient-to-br from-emerald-50 to-lime-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Star className="h-5 w-5 text-emerald-600" />
          <h4 className="text-sm font-semibold text-emerald-900">
            Fully Verified Impact Startup
          </h4>
        </div>
        <p className="text-xs text-emerald-700">
          This startup has been fully verified through community validation,
          expert review, and third-party assessment.
        </p>
        <Badge className="mt-3 border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700">
          <ShieldCheck className="mr-1 h-3 w-3" />
          Fully Verified
        </Badge>
      </div>
    )
  }

  return null
}
