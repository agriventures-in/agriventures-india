"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { JOB_TYPES } from "@/lib/constants"
import { jobPostFormSchema, type JobPostFormInput } from "@/lib/validations/job"

interface Startup {
  id: string
  name: string
}

export function JobPostForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startups, setStartups] = useState<Startup[]>([])
  const [isLoadingStartups, setIsLoadingStartups] = useState(true)

  const form = useForm<JobPostFormInput>({
    resolver: zodResolver(jobPostFormSchema),
    defaultValues: {
      startupId: "",
      title: "",
      description: "",
      location: "",
      type: undefined,
      salaryRange: "",
      requirements: "",
      applicationUrl: "",
      expiresAt: "",
    },
  })

  useEffect(() => {
    async function fetchStartups() {
      try {
        const res = await fetch("/api/users/me/startups")
        if (res.ok) {
          const data = await res.json()
          setStartups(data.startups ?? [])
        }
      } catch {
        toast.error("Failed to load your startups")
      } finally {
        setIsLoadingStartups(false)
      }
    }
    fetchStartups()
  }, [])

  async function onSubmit(values: JobPostFormInput) {
    setIsSubmitting(true)
    try {
      // Convert requirements textarea to array
      const requirementsArray = values.requirements
        ? values.requirements
            .split("\n")
            .map((r) => r.trim())
            .filter((r) => r.length > 0)
        : []

      const payload = {
        ...values,
        requirements: requirementsArray,
        expiresAt: values.expiresAt || undefined,
        salaryRange: values.salaryRange || undefined,
        applicationUrl: values.applicationUrl || undefined,
      }

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Failed to post job")
      }

      toast.success("Job posted successfully!")
      router.push("/jobs")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest/10">
            <Briefcase className="h-5 w-5 text-forest" />
          </div>
          <div>
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>
              Fill in the details below to list a job on the AgriVentures board
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Startup Selection */}
            <FormField
              control={form.control}
              name="startupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingStartups}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingStartups
                              ? "Loading startups..."
                              : "Select a startup"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {startups.map((startup) => (
                        <SelectItem key={startup.id} value={startup.id}>
                          {startup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which startup this job is for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Full-Stack Developer, Field Operations Manager"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the role, responsibilities, and what makes it exciting..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum 50 characters. Include responsibilities, team info,
                    and growth opportunities.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location and Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Bangalore, Remote, Hyderabad"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Salary Range */}
            <FormField
              control={form.control}
              name="salaryRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Salary Range{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 6-10 LPA, 30-50K/month"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Requirements */}
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Requirements{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={"One requirement per line, e.g.:\n3+ years of experience in agritech\nProficiency in Python and data analysis\nWillingness to travel to rural areas"}
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter one requirement per line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Application URL */}
            <FormField
              control={form.control}
              name="applicationUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Application URL{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://yourcompany.com/careers/apply"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link where candidates can apply
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expiry Date */}
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Expiry Date{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    When should this listing expire?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-forest hover:bg-forest/90 text-white"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting Job...
                </>
              ) : (
                "Post Job"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
