import { ShieldCheck } from "lucide-react"

export default function MainLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <ShieldCheck className="h-8 w-8 animate-pulse text-emerald" />
      <div className="h-1.5 w-24 animate-pulse rounded-full bg-emerald/20" />
    </div>
  )
}
