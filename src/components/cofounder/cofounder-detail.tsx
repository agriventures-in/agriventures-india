"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Briefcase, Sprout, ArrowLeft, ExternalLink, Linkedin, Target } from "lucide-react"
import { TECH_CATEGORIES } from "@/lib/constants"

interface Profile {
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
  linkedinUrl: string | null
  createdAt: string
  user: { id: string; fullName: string; avatarUrl: string | null; role: string; bio: string | null; linkedinUrl: string | null; organization: string | null }
  startup: { id: string; name: string; slug: string; logoUrl: string | null; tagline: string | null; stage: string; techCategory: string } | null
}

interface MatchProfile {
  id: string
  title: string
  category: string
  skills: string[]
  user: { id: string; fullName: string; avatarUrl: string | null }
}

const STAGE_LABELS: Record<string, string> = {
  IDEATION: "Ideation", VALIDATION: "Validation", EARLY_TRACTION: "Early Traction", GROWTH: "Growth", SCALING: "Scaling",
}

const COMMITMENT_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time", PART_TIME: "Part-time", ADVISORY: "Advisory",
}

export function CoFounderDetail({ profile, matches }: { profile: Profile; matches: MatchProfile[] }) {
  const categoryLabel = TECH_CATEGORIES.find((c) => c.value === profile.category)?.label || profile.category
  const linkedin = profile.linkedinUrl || profile.user.linkedinUrl

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Back */}
      <Link href="/co-founders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to all profiles
      </Link>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarImage src={profile.user.avatarUrl || undefined} />
              <AvatarFallback className="bg-forest/10 text-2xl text-forest">{profile.user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{profile.title}</h1>
              <p className="mt-1 text-lg text-muted-foreground">{profile.user.fullName}</p>
              {profile.user.organization && (
                <p className="text-sm text-muted-foreground">{profile.user.organization}</p>
              )}

              {/* Meta badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1"><Sprout className="h-3 w-3" /> {categoryLabel}</Badge>
                <Badge variant="outline" className="gap-1"><Briefcase className="h-3 w-3" /> {COMMITMENT_LABELS[profile.commitment]}</Badge>
                <Badge variant="outline" className="gap-1"><Target className="h-3 w-3" /> {STAGE_LABELS[profile.preferredStage]}</Badge>
                {profile.state && <Badge variant="outline" className="gap-1"><MapPin className="h-3 w-3" /> {profile.state}</Badge>}
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-3">
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio & What I'm Looking For */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">What I Bring</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-foreground">My Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {(profile.skills as string[]).map((s) => (
                  <Badge key={s} className="bg-emerald/10 text-emerald hover:bg-emerald/20">{s}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">What I Am Looking For</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{profile.lookingFor}</p>
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-foreground">Desired Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {(profile.desiredSkills as string[]).map((s) => (
                  <Badge key={s} variant="outline" className="border-gold/30 text-gold">{s}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Linked Startup */}
      {profile.startup && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">My Startup</h2>
            <Link href={`/startups/${profile.startup.slug}`} className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:border-emerald/30 hover:bg-muted/50">
              {profile.startup.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.startup.logoUrl} alt={profile.startup.name} className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald/10"><Sprout className="h-6 w-6 text-emerald" /></div>
              )}
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-emerald">{profile.startup.name}</h3>
                {profile.startup.tagline && <p className="text-sm text-muted-foreground">{profile.startup.tagline}</p>}
              </div>
              <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Suggested Matches */}
      {matches.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Potential Matches</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((m) => (
              <Link key={m.id} href={`/co-founders/${m.id}`}>
                <Card className="transition-all hover:border-emerald/30 hover:shadow-sm">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={m.user.avatarUrl || undefined} />
                        <AvatarFallback className="bg-forest/10 text-sm text-forest">{m.user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{m.user.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{m.title}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(m.skills as string[]).slice(0, 3).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
