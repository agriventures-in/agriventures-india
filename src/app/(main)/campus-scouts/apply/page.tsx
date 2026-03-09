"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2 } from "lucide-react"
import { INDIAN_STATES } from "@/lib/constants"
import { toast } from "sonner"
import Link from "next/link"

export default function ApplyScoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    collegeName: "",
    state: "",
    district: "",
    course: "",
    graduationYear: "",
    why: "",
    linkedinUrl: "",
  })

  if (!session?.user) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <GraduationCap className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Sign In Required</h1>
        <p className="mt-2 text-muted-foreground">Please sign in to apply for the Campus Scout Program.</p>
        <Link href="/login">
          <Button className="mt-4 bg-forest text-white hover:bg-forest/90">Sign In</Button>
        </Link>
      </div>
    )
  }

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.collegeName || !form.state || !form.course || !form.graduationYear || !form.why) {
      toast.error("Please fill in all required fields")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/campus-scouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Application failed")
        return
      }
      toast.success("Application submitted! We will review it shortly.")
      router.push("/campus-scouts")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="container mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
            <GraduationCap className="h-6 w-6 text-gold" />
          </div>
          <CardTitle className="text-center text-xl">Apply to Be a Campus Scout</CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Help us find the best agritech talent in your college.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>College / University Name *</Label>
              <Input placeholder="e.g. IIT Kharagpur" value={form.collegeName} onChange={(e) => update("collegeName", e.target.value)} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>State *</Label>
                <Select value={form.state} onValueChange={(v) => update("state", v)}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input placeholder="e.g. Kharagpur" value={form.district} onChange={(e) => update("district", e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Course / Degree *</Label>
                <Input placeholder="e.g. B.Tech Agriculture" value={form.course} onChange={(e) => update("course", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Graduation Year *</Label>
                <Select value={form.graduationYear} onValueChange={(v) => update("graduationYear", v)}>
                  <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 6 }, (_, i) => currentYear + i).map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Why Do You Want to Be a Scout? *</Label>
              <Textarea placeholder="Tell us about your motivation and how you plan to scout agritech talent..." value={form.why} onChange={(e) => update("why", e.target.value)} rows={4} />
            </div>

            <div className="space-y-2">
              <Label>LinkedIn URL (optional)</Label>
              <Input type="url" placeholder="https://linkedin.com/in/..." value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} />
            </div>

            <Button type="submit" disabled={loading} className="w-full gap-2 bg-forest text-white hover:bg-forest/90">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
