import { ShieldCheck } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <ShieldCheck className="h-10 w-10 animate-pulse text-emerald" />
      <div className="flex flex-col items-center gap-2">
        <div className="h-2 w-32 animate-pulse rounded-full bg-emerald/20" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
