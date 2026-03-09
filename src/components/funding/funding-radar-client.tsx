"use client"

import { useState } from "react"
import {
  IndianRupee,
  ExternalLink,
  Calendar,
  Building2,
  Filter,
  Target,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FundingScheme } from "@/lib/constants/funding-schemes"
import type { TECH_CATEGORIES, STARTUP_STAGES } from "@/lib/constants"

type TechCategory = (typeof TECH_CATEGORIES)[number]
type StartupStage = (typeof STARTUP_STAGES)[number]

const TYPE_STYLES: Record<
  FundingScheme["type"],
  { bg: string; text: string; label: string }
> = {
  grant: { bg: "bg-emerald/10", text: "text-emerald", label: "Grant" },
  loan: { bg: "bg-blue-100", text: "text-blue-700", label: "Loan" },
  equity: { bg: "bg-amber-100", text: "text-amber-700", label: "Equity" },
  subsidy: { bg: "bg-purple-100", text: "text-purple-700", label: "Subsidy" },
  competition: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    label: "Competition",
  },
}

interface FundingRadarClientProps {
  schemes: FundingScheme[]
  techCategories: readonly TechCategory[]
  startupStages: readonly StartupStage[]
}

export function FundingRadarClient({
  schemes,
  techCategories,
  startupStages,
}: FundingRadarClientProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filtered = schemes.filter((scheme) => {
    if (!scheme.isActive) return false

    if (typeFilter !== "all" && scheme.type !== typeFilter) return false

    if (
      stageFilter !== "all" &&
      !scheme.stages.includes(stageFilter)
    )
      return false

    if (
      categoryFilter !== "all" &&
      !scheme.categories.includes("all") &&
      !scheme.categories.includes(categoryFilter)
    )
      return false

    return true
  })

  const getCategoryLabel = (value: string) => {
    const cat = techCategories.find((c) => c.value === value)
    return cat?.label ?? value
  }

  const getStageLabel = (value: string) => {
    const stage = startupStages.find((s) => s.value === value)
    return stage?.label ?? value
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:flex-1">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Funding Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="grant">Grant</SelectItem>
              <SelectItem value="loan">Loan</SelectItem>
              <SelectItem value="equity">Equity</SelectItem>
              <SelectItem value="subsidy">Subsidy</SelectItem>
              <SelectItem value="competition">Competition</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Startup Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {startupStages.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tech Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {techCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-muted-foreground">
        Showing {filtered.length} of{" "}
        {schemes.filter((s) => s.isActive).length} schemes
      </p>

      {/* Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((scheme) => {
            const typeStyle = TYPE_STYLES[scheme.type]
            return (
              <Card
                key={scheme.id}
                className="flex flex-col transition-shadow hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">
                      {scheme.name}
                    </CardTitle>
                    <Badge
                      className={`shrink-0 ${typeStyle.bg} ${typeStyle.text} border-0`}
                    >
                      {typeStyle.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {scheme.organization}
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-4">
                  {/* Amount */}
                  <div className="flex items-center gap-2 rounded-lg bg-forest/5 px-3 py-2">
                    <IndianRupee className="h-4 w-4 text-forest" />
                    <span className="text-sm font-semibold text-forest">
                      {scheme.amount}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {scheme.description}
                  </p>

                  {/* Eligibility */}
                  <div>
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Eligibility
                    </p>
                    <ul className="space-y-1">
                      {scheme.eligibility.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-foreground/80"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stages */}
                  <div>
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Stages
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.stages.map((stage) => (
                        <Badge
                          key={stage}
                          variant="outline"
                          className="text-xs"
                        >
                          <Target className="mr-1 h-3 w-3" />
                          {getStageLabel(stage)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  {!scheme.categories.includes("all") && (
                    <div>
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Sectors
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {scheme.categories.map((cat) => (
                          <Badge
                            key={cat}
                            variant="secondary"
                            className="text-xs"
                          >
                            {getCategoryLabel(cat)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deadline */}
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Deadline: {scheme.deadline}</span>
                  </div>

                  {/* Spacer to push button to bottom */}
                  <div className="flex-1" />

                  {/* CTA */}
                  <a
                    href={scheme.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-forest/20 text-forest hover:bg-forest/5 hover:text-forest"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Learn More
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
            <IndianRupee className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No schemes found
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Try adjusting your filters to discover more funding opportunities
            for your agritech startup.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setTypeFilter("all")
              setStageFilter("all")
              setCategoryFilter("all")
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}
