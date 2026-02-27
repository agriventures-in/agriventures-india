"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from "lucide-react"
import { FilterBar } from "@/components/discovery/filter-bar"
import { StartupCard } from "@/components/discovery/startup-card"
import { useDebounce } from "@/hooks/use-debounce"

type SortOption = "hot" | "top" | "new" | "verified"

interface Startup {
  id: string
  name: string
  slug: string
  tagline: string
  logoUrl: string | null
  techCategory: string
  stage: string
  state: string | null
  district: string | null
  verificationLevel: string
  upvoteCount: number
  isFeatured: boolean
  founder: {
    fullName: string
    avatarUrl: string | null
  }
  _count: {
    upvotes: number
    comments: number
    jobs: number
  }
}

interface FeedResponse {
  startups: Startup[]
  total: number
  page: number
  totalPages: number
}

export function DiscoveryFeed() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Filters
  const [sort, setSort] = useState<SortOption>("hot")
  const [category, setCategory] = useState("")
  const [stage, setStage] = useState("")
  const [state, setState] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 400)

  const fetchStartups = useCallback(
    async (pageNum: number, append = false) => {
      if (append) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }

      try {
        const params = new URLSearchParams()
        params.set("page", pageNum.toString())
        params.set("limit", "20")
        params.set("sort", sort === "verified" ? "top" : sort)

        if (sort === "verified") {
          params.set("verified", "true")
        }
        if (category) params.set("category", category)
        if (stage) params.set("stage", stage)
        if (state) params.set("state", state)
        if (debouncedSearch) params.set("search", debouncedSearch)

        const res = await fetch(`/api/startups?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch")

        const data: FeedResponse = await res.json()

        if (append) {
          setStartups((prev) => [...prev, ...data.startups])
        } else {
          setStartups(data.startups)
        }
        setTotal(data.total)
        setPage(data.page)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("Error fetching startups:", error)
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [sort, category, stage, state, debouncedSearch]
  )

  // Fetch on filter changes (reset to page 1)
  useEffect(() => {
    setPage(1)
    fetchStartups(1)
  }, [fetchStartups])

  function handleLoadMore() {
    if (page < totalPages) {
      fetchStartups(page + 1, true)
    }
  }

  function clearFilters() {
    setCategory("")
    setStage("")
    setState("")
    setSearchQuery("")
  }

  const sortTabs: { value: SortOption; label: string }[] = [
    { value: "hot", label: "Hot" },
    { value: "top", label: "Top" },
    { value: "new", label: "New" },
    { value: "verified", label: "Verified" },
  ]

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search startups by name, tagline..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sort Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
        {sortTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSort(tab.value)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              sort === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <FilterBar
        category={category}
        stage={stage}
        state={state}
        onCategoryChange={setCategory}
        onStageChange={setStage}
        onStateChange={setState}
        onClear={clearFilters}
      />

      {/* Results Count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          {total} startup{total !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Startup Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : startups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <p className="text-lg font-medium text-foreground">No startups found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {startups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}

          {/* Load More */}
          {page < totalPages && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="min-w-[200px]"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  `Load More (${total - startups.length} remaining)`
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
