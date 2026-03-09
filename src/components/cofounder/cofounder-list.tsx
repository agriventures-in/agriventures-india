"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Briefcase, Sprout, ArrowRight, Plus, Loader2 } from "lucide-react"
import { TECH_CATEGORIES, INDIAN_STATES } from "@/lib/constants"
import { useSession } from "next-auth/react"

interface CoFounderProfile {
  id: string
  title: string
  bio: string
  lookingFor: string
  skills: string[]
  desiredSkills: string[]
  category: string
  preferredStage: string
  state: string | null
  commitment: string
  hasStartup: boolean
  createdAt: string
  user: { id: string; fullName: string; avatarUrl: string | null; role: string }
  startup: { id: string; name: string; slug: string; logoUrl: string | null } | null
}

interface Props {
  initialProfiles: CoFounderProfile[]
  initialTotal: number
}

const STAGE_LABELS: Record<string, string> = {
  IDEATION: "Ideation",
  VALIDATION: "Validation",
  EARLY_TRACTION: "Early Traction",
  GROWTH: "Growth",
  SCALING: "Scaling",
}

const COMMITMENT_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  ADVISORY: "Advisory",
}

export function CoFounderList({ initialProfiles, initialTotal }: Props) {
  const { data: session } = useSession()
  const [profiles, setProfiles] = useState<CoFounderProfile[]>(initialProfiles)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ category: "", stage: "", commitment: "" })

  const fetchProfiles = async (newFilters?: typeof filters, newPage = 1) => {
    setLoading(true)
    const f = newFilters ?? filters
    const params = new URLSearchParams()
    if (f.category) params.set("category", f.category)
    if (f.stage) params.set("stage", f.stage)
    if (f.commitment) params.set("commitment", f.commitment)
    params.set("page", String(newPage))

    try {
      const res = await fetch(`/api/co-founders?${params}`)
      const data = await res.json()
      setProfiles(data.profiles)
      setTotal(data.total)
      setPage(newPage)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value === "all" ? "" : value }
    setFilters(newFilters)
    fetchProfiles(newFilters, 1)
  }

  const totalPages = Math.ceil(total / 12)

  return (
    <div className="space-y-6">
      {/* Filters + CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Select value={filters.category || "all"} onValueChange={(v) => updateFilter("category", v)}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {TECH_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.stage || "all"} onValueChange={(v) => updateFilter("stage", v)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Stage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.commitment || "all"} onValueChange={(v) => updateFilter("commitment", v)}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Commitment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(COMMITMENT_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {session?.user && (
          <Link href="/co-founders/create">
            <Button className="gap-2 bg-forest text-white hover:bg-forest/90">
              <Plus className="h-4 w-4" /> Create Your Profile
            </Button>
          </Link>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : profiles.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No co-founder profiles found. Be the first!</p>
          <Link href="/co-founders/create">
            <Button className="mt-4 gap-2 bg-forest text-white hover:bg-forest/90">
              <Plus className="h-4 w-4" /> Create Profile
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => {
            const categoryLabel = TECH_CATEGORIES.find((c) => c.value === p.category)?.label || p.category
            return (
              <Link key={p.id} href={`/co-founders/${p.id}`}>
                <Card className="group h-full transition-all hover:border-emerald/30 hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-start gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={p.user.avatarUrl || undefined} />
                        <AvatarFallback className="bg-forest/10 text-forest">{p.user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-foreground">{p.user.fullName}</h3>
                        <p className="truncate text-xs text-muted-foreground">{p.title}</p>
                      </div>
                    </div>

                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{p.lookingFor}</p>

                    {/* Skills preview */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {(p.skills as string[]).slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                      {(p.skills as string[]).length > 3 && (
                        <Badge variant="outline" className="text-xs">+{(p.skills as string[]).length - 3}</Badge>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Sprout className="h-3 w-3" /> {categoryLabel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {COMMITMENT_LABELS[p.commitment] || p.commitment}
                      </span>
                      {p.state && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {p.state}
                        </span>
                      )}
                    </div>

                    {p.startup && (
                      <div className="mt-3 flex items-center gap-2 rounded-md bg-emerald/5 px-2.5 py-1.5">
                        <Sprout className="h-3 w-3 text-emerald" />
                        <span className="text-xs font-medium text-emerald">Has startup: {p.startup.name}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => fetchProfiles(filters, page - 1)}>Previous</Button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => fetchProfiles(filters, page + 1)}>Next</Button>
        </div>
      )}
    </div>
  )
}
