"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, X } from "lucide-react"
import { TECH_CATEGORIES, INDIAN_STATES } from "@/lib/constants"
import { COFOUNDER_SKILLS } from "@/lib/constants/cofounder"
import { toast } from "sonner"

const STAGES = [
  { value: "IDEATION", label: "Ideation" },
  { value: "VALIDATION", label: "Validation" },
  { value: "EARLY_TRACTION", label: "Early Traction" },
  { value: "GROWTH", label: "Growth" },
  { value: "SCALING", label: "Scaling" },
]

const COMMITMENTS = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "ADVISORY", label: "Advisory" },
]

interface Props {
  startups: { id: string; name: string; slug: string }[]
  initialData?: {
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
    startupId: string | null
    linkedinUrl: string | null
  }
}

export function CoFounderForm({ startups, initialData }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState(initialData?.title || "")
  const [bio, setBio] = useState(initialData?.bio || "")
  const [lookingFor, setLookingFor] = useState(initialData?.lookingFor || "")
  const [skills, setSkills] = useState<string[]>((initialData?.skills as string[]) || [])
  const [desiredSkills, setDesiredSkills] = useState<string[]>((initialData?.desiredSkills as string[]) || [])
  const [category, setCategory] = useState(initialData?.category || "")
  const [preferredStage, setPreferredStage] = useState(initialData?.preferredStage || "IDEATION")
  const [state, setState] = useState(initialData?.state || "")
  const [commitment, setCommitment] = useState(initialData?.commitment || "FULL_TIME")
  const [hasStartup, setHasStartup] = useState(initialData?.hasStartup || false)
  const [startupId, setStartupId] = useState(initialData?.startupId || "")
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedinUrl || "")

  const toggleSkill = (skill: string, list: string[], setter: (v: string[]) => void) => {
    if (list.includes(skill)) {
      setter(list.filter((s) => s !== skill))
    } else if (list.length < 8) {
      setter([...list, skill])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !bio || !lookingFor || !skills.length || !desiredSkills.length || !category) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const isEdit = !!initialData
      const url = isEdit ? `/api/co-founders/${initialData.id}` : "/api/co-founders"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, bio, lookingFor, skills, desiredSkills, category,
          preferredStage, state: state || null, commitment,
          hasStartup, startupId: startupId || null, linkedinUrl: linkedinUrl || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to save profile")
        return
      }

      toast.success(isEdit ? "Profile updated!" : "Profile created!")
      router.push(`/co-founders/${data.profile.id}`)
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Profile Title *</Label>
        <Input id="title" placeholder='e.g. "Looking for a Technical Co-Founder for AgriFintech Startup"' value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">What You Bring to the Table *</Label>
        <Textarea id="bio" placeholder="Describe your background, experience, and what you contribute..." value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
      </div>

      {/* Looking For */}
      <div className="space-y-2">
        <Label htmlFor="lookingFor">What You Are Looking For *</Label>
        <Textarea id="lookingFor" placeholder="Describe the ideal co-founder you want to work with..." value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} rows={4} />
      </div>

      {/* Your Skills */}
      <div className="space-y-2">
        <Label>Your Skills * <span className="text-xs text-muted-foreground">(select up to 8)</span></Label>
        <div className="flex flex-wrap gap-2">
          {COFOUNDER_SKILLS.map((skill) => (
            <Badge
              key={skill}
              variant={skills.includes(skill) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${skills.includes(skill) ? "bg-emerald text-white hover:bg-emerald/80" : "hover:border-emerald/50"}`}
              onClick={() => toggleSkill(skill, skills, setSkills)}
            >
              {skill}
              {skills.includes(skill) && <X className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      </div>

      {/* Desired Skills */}
      <div className="space-y-2">
        <Label>Skills You Want in a Co-Founder * <span className="text-xs text-muted-foreground">(select up to 8)</span></Label>
        <div className="flex flex-wrap gap-2">
          {COFOUNDER_SKILLS.map((skill) => (
            <Badge
              key={skill}
              variant={desiredSkills.includes(skill) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${desiredSkills.includes(skill) ? "bg-gold text-white hover:bg-gold/80" : "hover:border-gold/50"}`}
              onClick={() => toggleSkill(skill, desiredSkills, setDesiredSkills)}
            >
              {skill}
              {desiredSkills.includes(skill) && <X className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      </div>

      {/* Category + Stage + Commitment */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>AgriTech Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {TECH_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Preferred Stage</Label>
          <Select value={preferredStage} onValueChange={setPreferredStage}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Commitment</Label>
          <Select value={commitment} onValueChange={setCommitment}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {COMMITMENTS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label>State (optional)</Label>
        <Select value={state || "none"} onValueChange={(v) => setState(v === "none" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Any state</SelectItem>
            {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Existing Startup */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="hasStartup" checked={hasStartup} onChange={(e) => { setHasStartup(e.target.checked); if (!e.target.checked) setStartupId("") }} className="h-4 w-4" />
            <Label htmlFor="hasStartup" className="cursor-pointer">I already have a startup</Label>
          </div>
          {hasStartup && startups.length > 0 && (
            <div className="mt-3">
              <Select value={startupId || "none"} onValueChange={(v) => setStartupId(v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Link your startup" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select startup</SelectItem>
                  {startups.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* LinkedIn */}
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
        <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/..." value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full gap-2 bg-forest text-white hover:bg-forest/90">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {initialData ? "Update Profile" : "Create Profile"}
      </Button>
    </form>
  )
}
