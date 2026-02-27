"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import {
  Mail,
  Phone,
  Building2,
  Linkedin,
  Globe,
  Pencil,
  Loader2,
  Rocket,
  TrendingUp,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import type { UserRole, StartupStatus } from "@prisma/client"

const editProfileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional().or(z.literal("")),
  organization: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
})

type EditProfileInput = z.infer<typeof editProfileSchema>

interface Startup {
  id: string
  name: string
  slug: string
  tagline: string
  status: StartupStatus
  techCategory: string
  stage: string
}

interface InvestorProfile {
  firmName: string | null
  thesis: string | null
  checkSizeMin: number | null
  checkSizeMax: number | null
  portfolioCount: number | null
  websiteUrl: string | null
}

interface ProfileData {
  id: string
  fullName: string
  email: string
  avatarUrl: string | null
  role: UserRole
  phone: string | null
  linkedinUrl: string | null
  organization: string | null
  bio: string | null
  preferredLanguage: string
  createdAt: string
  startups: Startup[]
  investorProfile: InvestorProfile | null
}

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; className: string }
> = {
  FOUNDER: {
    label: "Founder",
    className: "bg-emerald/10 text-emerald border-emerald/20",
  },
  INVESTOR: {
    label: "Investor",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  COMMUNITY: {
    label: "Community Member",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  ADMIN: {
    label: "Admin",
    className: "bg-red-100 text-red-800 border-red-200",
  },
}

const STATUS_CONFIG: Record<
  StartupStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  SUBMITTED: {
    label: "Submitted",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  VERIFIED: {
    label: "Verified",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
  },
}

export function ProfileView({ profile }: { profile: ProfileData }) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const roleConfig = ROLE_CONFIG[profile.role]
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const form = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: profile.fullName,
      bio: profile.bio ?? "",
      organization: profile.organization ?? "",
      phone: profile.phone ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
    },
  })

  async function onSave(values: EditProfileInput) {
    setIsSaving(true)
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Failed to update profile")
      }

      toast.success("Profile updated successfully!")
      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={profile.avatarUrl ?? ""}
                alt={profile.fullName}
              />
              <AvatarFallback className="bg-forest/10 text-forest text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <h2 className="text-2xl font-bold text-foreground">
                  {profile.fullName}
                </h2>
                <Badge
                  variant="outline"
                  className={roleConfig.className}
                >
                  {roleConfig.label}
                </Badge>
              </div>

              {profile.organization && (
                <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                  <Building2 className="h-4 w-4" />
                  {profile.organization}
                </p>
              )}

              {profile.bio && (
                <p className="mt-3 text-sm text-foreground/80 max-w-xl leading-relaxed">
                  {profile.bio}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>

              <div className="mt-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="mr-1.5 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSave)}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about yourself..."
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="organization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organization</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your company or organization"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+91 XXXXX XXXXX"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="linkedinUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://linkedin.com/in/yourprofile"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-forest hover:bg-forest/90 text-white"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Founder: My Startups */}
      {profile.role === "FOUNDER" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Rocket className="h-5 w-5 text-emerald" />
              My Startups
            </h3>
            <Link href="/dashboard/startups/new">
              <Button size="sm" variant="outline">
                Add Startup
              </Button>
            </Link>
          </div>

          {profile.startups.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Rocket className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <h4 className="mt-3 font-semibold text-foreground">
                  No startups yet
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Register your agritech startup to get visibility
                </p>
                <Link href="/dashboard/startups/new">
                  <Button className="mt-4 bg-forest hover:bg-forest/90 text-white" size="sm">
                    Register Startup
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.startups.map((startup) => {
                const statusConfig = STATUS_CONFIG[startup.status]
                return (
                  <Link key={startup.id} href={`/startups/${startup.slug}`}>
                    <Card className="h-full transition-all hover:shadow-md hover:border-emerald/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base line-clamp-1">
                            {startup.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={`shrink-0 text-[10px] ${statusConfig.className}`}
                          >
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {startup.tagline}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {startup.techCategory.replace(/_/g, " ")}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            {startup.stage.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Investor: Profile Details */}
      {profile.role === "INVESTOR" && profile.investorProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald" />
              Investor Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.investorProfile.firmName && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Firm
                </p>
                <p className="text-foreground">
                  {profile.investorProfile.firmName}
                </p>
              </div>
            )}
            {profile.investorProfile.thesis && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Investment Thesis
                </p>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {profile.investorProfile.thesis}
                </p>
              </div>
            )}
            {(profile.investorProfile.checkSizeMin ||
              profile.investorProfile.checkSizeMax) && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Check Size
                </p>
                <p className="text-foreground">
                  {profile.investorProfile.checkSizeMin
                    ? `${(profile.investorProfile.checkSizeMin / 100000).toFixed(0)}L`
                    : ""}
                  {profile.investorProfile.checkSizeMin &&
                  profile.investorProfile.checkSizeMax
                    ? " - "
                    : ""}
                  {profile.investorProfile.checkSizeMax
                    ? `${(profile.investorProfile.checkSizeMax / 100000).toFixed(0)}L`
                    : ""}
                </p>
              </div>
            )}
            {profile.investorProfile.portfolioCount != null &&
              profile.investorProfile.portfolioCount > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Portfolio Companies
                  </p>
                  <p className="text-foreground">
                    {profile.investorProfile.portfolioCount}
                  </p>
                </div>
              )}
            {profile.investorProfile.websiteUrl && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={profile.investorProfile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald hover:underline"
                >
                  {profile.investorProfile.websiteUrl.replace(
                    /^https?:\/\//,
                    ""
                  )}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
