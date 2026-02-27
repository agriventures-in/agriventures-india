"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserRoleSelectProps {
  userId: string
  currentRole: string
}

const roles = [
  { value: "FOUNDER", label: "Founder" },
  { value: "INVESTOR", label: "Investor" },
  { value: "COMMUNITY", label: "Community" },
  { value: "ADMIN", label: "Admin" },
]

export function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleRoleChange(newRole: string) {
    if (newRole === currentRole) return

    setLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update role")
      }

      toast.success(`Role updated to ${newRole}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update role")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={currentRole} onValueChange={handleRoleChange} disabled={loading}>
        <SelectTrigger className="h-8 w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
    </div>
  )
}
