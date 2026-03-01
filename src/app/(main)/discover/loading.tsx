import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DiscoverLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-5 w-96" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Feed */}
          <div>
            {/* Search Bar */}
            <Skeleton className="mb-6 h-10 w-full rounded-lg" />

            {/* Filter Bar: Sort pills + filter dropdowns */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
            </div>

            {/* Startup Cards */}
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <Skeleton className="h-12 w-12 flex-shrink-0 rounded-xl" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-5 w-40" />
                              <Skeleton className="h-4 w-16 rounded-full" />
                            </div>
                            <Skeleton className="mt-1.5 h-4 w-3/4" />
                          </div>
                          <Skeleton className="h-8 w-16 rounded-md" />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Skeleton className="h-5 w-20 rounded-full" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                        <div className="mt-3 flex items-center gap-4">
                          <Skeleton className="h-4 w-14" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              {/* Submit CTA Card */}
              <Card>
                <CardContent className="p-5 text-center">
                  <Skeleton className="mx-auto h-12 w-12 rounded-full" />
                  <Skeleton className="mx-auto mt-3 h-5 w-40" />
                  <Skeleton className="mx-auto mt-2 h-4 w-full" />
                  <Skeleton className="mx-auto mt-4 h-9 w-full rounded-md" />
                </CardContent>
              </Card>

              {/* Trending Categories Card */}
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-36" />
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded-md" />
                  ))}
                </CardContent>
              </Card>

              {/* Platform Stats Card */}
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
