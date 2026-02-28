"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

type ExportType = "startups" | "users" | "jobs"

const EXPORTS: { type: ExportType; label: string }[] = [
  { type: "startups", label: "Export Startups" },
  { type: "users", label: "Export Users" },
  { type: "jobs", label: "Export Jobs" },
]

export function ExportButtons() {
  const [loading, setLoading] = useState<Record<ExportType, boolean>>({
    startups: false,
    users: false,
    jobs: false,
  })

  async function handleExport(type: ExportType) {
    setLoading((prev) => ({ ...prev, [type]: true }))
    try {
      const res = await fetch(`/api/admin/export?type=${type}`)
      if (!res.ok) {
        throw new Error("Export failed")
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}-export-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export error:", err)
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }))
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {EXPORTS.map(({ type, label }) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          disabled={loading[type]}
          onClick={() => handleExport(type)}
        >
          {loading[type] ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="mr-1.5 h-3.5 w-3.5" />
          )}
          {label}
        </Button>
      ))}
    </div>
  )
}
