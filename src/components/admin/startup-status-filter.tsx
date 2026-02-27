"use client"

import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StartupStatusFilterProps {
  currentStatus?: string
}

export function StartupStatusFilter({ currentStatus }: StartupStatusFilterProps) {
  const router = useRouter()

  function handleChange(value: string) {
    if (value === "ALL") {
      router.push("/admin/startups")
    } else {
      router.push(`/admin/startups?status=${value}`)
    }
  }

  return (
    <Select value={currentStatus || "ALL"} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Statuses</SelectItem>
        <SelectItem value="DRAFT">Draft</SelectItem>
        <SelectItem value="SUBMITTED">Submitted</SelectItem>
        <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
        <SelectItem value="VERIFIED">Verified</SelectItem>
        <SelectItem value="REJECTED">Rejected</SelectItem>
      </SelectContent>
    </Select>
  )
}
