import { z } from "zod"

// Step 1: Basic Info
export const startupBasicsSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(150, "Tagline must be at most 150 characters"),
  state: z.string().min(1, "Please select a state"),
  district: z.string().optional(),
  foundedYear: z
    .number()
    .min(2000, "Year must be 2000 or later")
    .max(2026, "Year cannot be in the future")
    .optional(),
  websiteUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
})

// Step 2: Problem & Solution
export const problemSolutionSchema = z.object({
  problemStatement: z
    .string()
    .min(50, "Problem statement must be at least 50 characters")
    .max(2000, "Problem statement must be at most 2000 characters"),
  solution: z
    .string()
    .min(50, "Solution must be at least 50 characters")
    .max(2000, "Solution must be at most 2000 characters"),
  businessModel: z.string().optional(),
})

// Step 3: Category & Stage
export const categorySchema = z.object({
  techCategory: z.string().min(1, "Please select a category"),
  subCategories: z
    .array(z.string())
    .max(5, "You can select up to 5 sub-categories"),
  stage: z.enum(["IDEATION", "VALIDATION", "EARLY_TRACTION", "GROWTH", "SCALING"], {
    message: "Please select a stage",
  }),
})

// Step 4: Impact Metrics
export const impactMetricItemSchema = z.object({
  name: z.string().min(1, "Metric name is required"),
  value: z.string().min(1, "Metric value is required"),
  unit: z.string().min(1, "Metric unit is required"),
})

export const impactMetricsSchema = z.object({
  impactMetrics: z
    .array(impactMetricItemSchema)
    .min(1, "At least one impact metric is required")
    .max(5, "You can add up to 5 impact metrics"),
})

// Step 5: Field Trials
export const fieldTrialSchema = z.object({
  fieldTrialData: z.object({
    hasTrials: z.boolean(),
    trialDescription: z.string().optional(),
    trialLocation: z.string().optional(),
    sampleSize: z.string().optional(),
    results: z.string().optional(),
  }),
})

// Step 6: Team
export const teamMemberItemSchema = z.object({
  name: z.string().min(1, "Team member name is required"),
  role: z.string().min(1, "Team member role is required"),
  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
})

export const teamSchema = z.object({
  teamSize: z.number().min(1, "Team size must be at least 1"),
  teamMembers: z
    .array(teamMemberItemSchema)
    .min(1, "At least one team member is required"),
})

// Step 7: Media & Pitch
export const mediaSchema = z.object({
  pitchDeckUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  demoVideoUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  fundingStatus: z.string().optional(),
  fundingAmount: z.string().optional(),
})

// Combined full schema for the API
export const createStartupSchema = startupBasicsSchema
  .merge(problemSolutionSchema)
  .merge(categorySchema)
  .merge(impactMetricsSchema)
  .merge(fieldTrialSchema)
  .merge(teamSchema)
  .merge(mediaSchema)

export type StartupBasicsInput = z.infer<typeof startupBasicsSchema>
export type ProblemSolutionInput = z.infer<typeof problemSolutionSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type ImpactMetricsInput = z.infer<typeof impactMetricsSchema>
export type FieldTrialInput = z.infer<typeof fieldTrialSchema>
export type TeamInput = z.infer<typeof teamSchema>
export type MediaInput = z.infer<typeof mediaSchema>
export type CreateStartupInput = z.infer<typeof createStartupSchema>
