import { Loader2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-emerald" />
      <p className="text-sm text-muted-foreground">Loading admin panel...</p>
    </div>
  )
}
