import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function StartupProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Hero Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  {/* Logo */}
                  <Skeleton className="h-20 w-20 flex-shrink-0 rounded-xl" />

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>

                    <Skeleton className="h-5 w-3/4" />

                    <div className="flex flex-wrap items-center gap-4">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Skeleton className="h-9 w-24 rounded-md" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Bar */}
            <div className="flex gap-1 border-b pb-0.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-md" />
              ))}
            </div>

            {/* Tab Content - About cards */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-36" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category & Stage Card */}
            <Card>
              <CardContent className="space-y-4 p-5">
                <div>
                  <Skeleton className="mb-2 h-3 w-16" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
                <div>
                  <Skeleton className="mb-2 h-3 w-20" />
                  <div className="flex flex-wrap gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
                <div>
                  <Skeleton className="mb-2 h-3 w-12" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardContent>
            </Card>

            {/* Verification Progress Card */}
            <Card>
              <CardContent className="p-5">
                <Skeleton className="mb-3 h-4 w-36" />
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="mt-3 flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardContent>
            </Card>

            {/* Founder Card */}
            <Card>
              <CardContent className="p-5">
                <Skeleton className="mb-3 h-3 w-16" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="mt-1 h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="mt-3 h-3 w-24" />
              </CardContent>
            </Card>

            {/* Intro Request Card */}
            <Card>
              <CardContent className="p-5">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="mx-auto mt-2 h-3 w-48" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
