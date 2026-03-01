import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function JobDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-10">
          <Skeleton className="mb-6 h-8 w-28 rounded-md" />

          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>

            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="mt-2 h-6 w-40" />

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>

            <Skeleton className="mt-6 h-10 w-32 rounded-md" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-8">
            {/* Description */}
            <div>
              <Skeleton className="mb-4 h-6 w-36" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Requirements */}
            <Skeleton className="h-px w-full" />
            <div>
              <Skeleton className="mb-4 h-6 w-32" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="mt-1.5 h-1.5 w-1.5 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Apply section */}
            <Skeleton className="h-px w-full" />
            <div className="rounded-xl border p-6 text-center">
              <Skeleton className="mx-auto h-6 w-52" />
              <Skeleton className="mx-auto mt-2 h-4 w-64" />
              <Skeleton className="mx-auto mt-4 h-10 w-32 rounded-md" />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            {/* Company Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-36" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="mt-1 h-4 w-full" />
                </div>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-9 w-full rounded-md" />
              </CardContent>
            </Card>

            {/* Job Summary Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-28" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    {i < 3 && <Skeleton className="mt-3 h-px w-full" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  )
}
