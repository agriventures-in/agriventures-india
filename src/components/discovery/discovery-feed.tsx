"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Search,
  LayoutGrid,
  List,
  Flame,
  TrendingUp,
  Clock,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { FilterBar } from "@/components/discovery/filter-bar"
import { StartupCard } from "@/components/discovery/startup-card"
import { useDebounce } from "@/hooks/use-debounce"

type SortOption = "hot" | "top" | "new" | "verified"
type ViewMode = "list" | "grid"

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

const sortTabs: { value: SortOption; label: string; icon: typeof Flame }[] = [
  { value: "hot", label: "Hot", icon: Flame },
  { value: "top", label: "Top", icon: TrendingUp },
  { value: "new", label: "New", icon: Clock },
  { value: "verified", label: "Verified", icon: ShieldCheck },
]

export function DiscoveryFeed() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Filters
  const [sort, setSort] = useState<SortOption>("hot")
  const [category, setCategory] = useState("")
  const [stage, setStage] = useState("")
  const [state, setState] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 400)

  const hasFilters = category || stage || state

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

  return (
    <div className="space-y-5">
      {/* Search + View Toggle Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search startups by name, tagline, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 pr-10 rounded-xl border-border/60 bg-muted/30 focus:bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {/* Filter toggle */}
        <Button
          variant={showFilters || hasFilters ? "default" : "outline"}
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        {/* View mode toggle */}
        <div className="hidden sm:flex items-center rounded-xl border bg-muted/30 p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-lg p-2 transition-colors ${
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-lg p-2 transition-colors ${
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sort Tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-muted/50 p-1">
        {sortTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.value}
              onClick={() => setSort(tab.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                sort === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Expandable Filter Bar */}
      {showFilters && (
        <div className="rounded-xl border bg-muted/20 p-4">
          <FilterBar
            category={category}
            stage={stage}
            state={state}
            onCategoryChange={setCategory}
            onStageChange={setStage}
            onStateChange={setState}
            onClear={clearFilters}
          />
        </div>
      )}

      {/* Active filter badges */}
      {hasFilters && !showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filters:</span>
          {category && (
            <Badge variant="secondary" className="gap-1 pl-2">
              {category.replace(/_/g, " ")}
              <button onClick={() => setCategory("")} className="ml-0.5 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {stage && (
            <Badge variant="secondary" className="gap-1 pl-2">
              {stage.replace(/_/g, " ")}
              <button onClick={() => setStage("")} className="ml-0.5 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {state && (
            <Badge variant="secondary" className="gap-1 pl-2">
              {state}
              <button onClick={() => setState("")} className="ml-0.5 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results Count */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{total}</span> startup{total !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      {/* Startup Cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Discovering startups...</p>
        </div>
      ) : startups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No startups found</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try adjusting your filters or search query to discover more startups
          </p>
          <Button variant="outline" onClick={clearFilters} className="mt-4 rounded-xl">
            Clear all filters
          </Button>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {startups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} viewMode="grid" />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {startups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} viewMode="list" />
              ))}
            </div>
          )}

          {/* Load More */}
          {page < totalPages && (
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="min-w-[220px] rounded-xl h-11"
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
        </>
      )}
    </div>
  )
}
