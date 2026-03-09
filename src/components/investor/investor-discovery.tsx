"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Linkedin, Briefcase, Loader2, IndianRupee } from "lucide-react"
import { TECH_CATEGORIES } from "@/lib/constants"

interface InvestorProfile {
  id: string
  userId: string
  firmName: string | null
  thesis: string | null
  checkSizeMin: number | null
  checkSizeMax: number | null
  preferredStages: string[] | null
  preferredCategories: string[] | null
  portfolioCount: number | null
  websiteUrl: string | null
  user: { id: string; fullName: string; avatarUrl: string | null; linkedinUrl: string | null; organization: string | null }
}

interface Props {
  initialInvestors: InvestorProfile[]
  initialTotal: number
}

const STAGE_LABELS: Record<string, string> = {
  IDEATION: "Ideation", VALIDATION: "Validation", EARLY_TRACTION: "Early Traction", GROWTH: "Growth", SCALING: "Scaling",
}

function formatCheckSize(amount: number | null): string {
  if (!amount) return ""
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `${(amount / 100000).toFixed(0)}L`
  return `${amount.toLocaleString("en-IN")}`
}

export function InvestorDiscovery({ initialInvestors, initialTotal }: Props) {
  const [investors, setInvestors] = useState<InvestorProfile[]>(initialInvestors)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ category: "", stage: "" })

  const fetchInvestors = async (newFilters?: typeof filters) => {
    setLoading(true)
    const f = newFilters ?? filters
    const params = new URLSearchParams()
    if (f.category) params.set("category", f.category)
    if (f.stage) params.set("stage", f.stage)

    try {
      const res = await fetch(`/api/investors?${params}`)
      const data = await res.json()
      setInvestors(data.investors)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value === "all" ? "" : value }
    setFilters(newFilters)
    fetchInvestors(newFilters)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
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
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : investors.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No investors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {investors.map((inv) => (
            <Card key={inv.id} className="group h-full transition-all hover:border-gold/30 hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={inv.user.avatarUrl || undefined} />
                    <AvatarFallback className="bg-gold/10 text-gold">{inv.user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground">{inv.user.fullName}</h3>
                    {inv.firmName && (
                      <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" /> {inv.firmName}
                      </p>
                    )}
                  </div>
                  {inv.user.linkedinUrl && (
                    <a href={inv.user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-foreground">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Thesis */}
                {inv.thesis && (
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{inv.thesis}</p>
                )}

                {/* Check size */}
                {(inv.checkSizeMin || inv.checkSizeMax) && (
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <IndianRupee className="h-3 w-3" />
                    Check size: {formatCheckSize(inv.checkSizeMin)} — {formatCheckSize(inv.checkSizeMax)}
                  </div>
                )}

                {/* Preferred stages */}
                {inv.preferredStages && (inv.preferredStages as string[]).length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {(inv.preferredStages as string[]).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{STAGE_LABELS[s] || s}</Badge>
                    ))}
                  </div>
                )}

                {/* Preferred categories */}
                {inv.preferredCategories && (inv.preferredCategories as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {(inv.preferredCategories as string[]).slice(0, 3).map((c) => (
                      <Badge key={c} variant="outline" className="border-gold/20 text-[10px] text-gold">
                        {TECH_CATEGORIES.find((tc) => tc.value === c)?.label || c}
                      </Badge>
                    ))}
                    {(inv.preferredCategories as string[]).length > 3 && (
                      <Badge variant="outline" className="text-[10px]">+{(inv.preferredCategories as string[]).length - 3}</Badge>
                    )}
                  </div>
                )}

                {/* Portfolio count */}
                {inv.portfolioCount && inv.portfolioCount > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald">
                    <Briefcase className="h-3 w-3" /> {inv.portfolioCount} portfolio companies
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
