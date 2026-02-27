import { z } from "zod"

export const createJobSchema = z.object({
  title: z
    .string()
    .min(3, "Job title must be at least 3 characters")
    .max(150, "Job title must be at most 150 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be at most 5000 characters"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"], {
    message: "Please select a job type",
  }),
  salaryRange: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  applicationUrl: z
    .string()
    .url("Please enter a valid application URL")
    .optional()
    .or(z.literal("")),
  expiresAt: z.string().optional(),
})

export type CreateJobInput = z.infer<typeof createJobSchema>

// Extended schema used by the job post form (includes startupId selection)
export const jobPostFormSchema = createJobSchema.extend({
  startupId: z.string().min(1, "Please select a startup"),
  // Form uses textarea for requirements (one per line), converted to array on submit
  requirements: z.string().optional().or(z.literal("")),
})

export type JobPostFormInput = z.infer<typeof jobPostFormSchema>
