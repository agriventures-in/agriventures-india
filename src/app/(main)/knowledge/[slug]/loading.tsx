import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-forest/5 via-emerald/5 to-lime/5">
        <div className="container mx-auto px-4 py-10">
          <Skeleton className="mb-6 h-8 w-40 rounded-md" />

          <div className="max-w-3xl">
            <Skeleton className="mb-4 h-5 w-28 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="mt-1 h-10 w-3/4" />
            <Skeleton className="mt-4 h-5 w-full max-w-xl" />

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Main Article Content */}
          <article className="flex-1 min-w-0 max-w-3xl space-y-6">
            {/* Paragraphs */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <Skeleton className="h-7 w-56" />

            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <Skeleton className="h-7 w-48" />

            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>

            <Skeleton className="h-7 w-44" />

            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </div>

            {/* Tags */}
            <Skeleton className="h-px w-full" />
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-4 w-4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-16 rounded-full" />
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="mb-1.5 h-4 w-24 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-0.5 h-4 w-3/4" />
                    <Skeleton className="mt-1 h-3 w-20" />
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
