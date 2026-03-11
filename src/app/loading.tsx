/* eslint-disable @next/next/no-img-element */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <img src="/images/icon-logo.png" alt="Loading" width={40} height={40} className="h-10 w-10 animate-pulse" />
      <div className="flex flex-col items-center gap-2">
        <div className="h-2 w-32 animate-pulse rounded-full bg-emerald/20" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
