/**
 * Investor Readiness Score Calculator
 * Evaluates how ready a startup is for investor engagement.
 * Returns a score 0-100 with detailed breakdown.
 */

interface StartupData {
  name: string
  tagline: string
  description: string | null
  logoUrl: string | null
  websiteUrl: string | null
  foundedYear: number | null
  stage: string
  techCategory: string
  subCategories: unknown
  state: string | null
  teamSize: number | null
  fundingStatus: string | null
  fundingAmount: string | null
  problemStatement: string | null
  solution: string | null
  businessModel: string | null
  impactMetrics: unknown
  fieldTrialData: unknown
  pitchDeckUrl: string | null
  demoVideoUrl: string | null
  galleryUrls: unknown
  socialLinks: unknown
  verificationLevel: string
  upvoteCount: number
  viewCount: number
  _count?: { teamMembers: number; comments: number }
}

interface ScoreBreakdown {
  category: string
  label: string
  score: number
  maxScore: number
  tips: string[]
}

export function calculateReadinessScore(startup: StartupData): {
  totalScore: number
  grade: string
  breakdown: ScoreBreakdown[]
} {
  const breakdown: ScoreBreakdown[] = []

  // 1. Profile Completeness (25 points)
  const profileTips: string[] = []
  let profileScore = 0
  if (startup.name) profileScore += 2
  if (startup.tagline) profileScore += 2
  if (startup.description && startup.description.length > 100) profileScore += 3
  else profileTips.push("Add a detailed description (100+ characters)")
  if (startup.logoUrl) profileScore += 3
  else profileTips.push("Upload a startup logo")
  if (startup.websiteUrl) profileScore += 3
  else profileTips.push("Add your website URL")
  if (startup.foundedYear) profileScore += 2
  if (startup.state) profileScore += 2
  if (startup.subCategories && Array.isArray(startup.subCategories) && (startup.subCategories as string[]).length > 0) profileScore += 3
  else profileTips.push("Add sub-categories for better discoverability")
  if ((startup.galleryUrls as string[])?.length > 0) profileScore += 3
  else profileTips.push("Upload gallery images showcasing your product")
  if (startup.socialLinks) profileScore += 2
  else profileTips.push("Add social media links")
  breakdown.push({ category: "profile", label: "Profile Completeness", score: Math.min(profileScore, 25), maxScore: 25, tips: profileTips })

  // 2. Problem-Solution Clarity (20 points)
  const psTips: string[] = []
  let psScore = 0
  if (startup.problemStatement && startup.problemStatement.length > 100) psScore += 7
  else if (startup.problemStatement) { psScore += 3; psTips.push("Expand your problem statement (aim for 100+ characters)") }
  else psTips.push("Add a clear problem statement")
  if (startup.solution && startup.solution.length > 100) psScore += 7
  else if (startup.solution) { psScore += 3; psTips.push("Elaborate on your solution") }
  else psTips.push("Describe your solution")
  if (startup.businessModel && startup.businessModel.length > 50) psScore += 6
  else if (startup.businessModel) { psScore += 3; psTips.push("Detail your business model") }
  else psTips.push("Add your business model")
  breakdown.push({ category: "problem_solution", label: "Problem-Solution Clarity", score: Math.min(psScore, 20), maxScore: 20, tips: psTips })

  // 3. Traction & Validation (20 points)
  const tractionTips: string[] = []
  let tractionScore = 0
  const metrics = startup.impactMetrics as Array<{ name: string; value: string; unit: string }> | null
  if (metrics && metrics.length >= 3) tractionScore += 6
  else if (metrics && metrics.length > 0) { tractionScore += 3; tractionTips.push("Add at least 3 impact metrics") }
  else tractionTips.push("Add impact metrics to demonstrate traction")
  const fieldTrials = startup.fieldTrialData as { hasTrials?: boolean; trialDescription?: string } | null
  if (fieldTrials?.hasTrials && fieldTrials.trialDescription) tractionScore += 5
  else tractionTips.push("Add field trial data if available")
  if (startup.verificationLevel !== "NONE") tractionScore += 5
  else tractionTips.push("Get verified by the community for credibility")
  if (startup.upvoteCount >= 5) tractionScore += 2
  else tractionTips.push("Get community upvotes for social proof")
  if (startup.viewCount >= 50) tractionScore += 2
  breakdown.push({ category: "traction", label: "Traction & Validation", score: Math.min(tractionScore, 20), maxScore: 20, tips: tractionTips })

  // 4. Team Strength (15 points)
  const teamTips: string[] = []
  let teamScore = 0
  const teamCount = startup._count?.teamMembers || 0
  if (teamCount >= 3) teamScore += 8
  else if (teamCount >= 2) { teamScore += 5; teamTips.push("Add more team members to your profile") }
  else if (teamCount >= 1) { teamScore += 3; teamTips.push("Add your full team to build investor confidence") }
  else teamTips.push("Add team members to your startup profile")
  if (startup.teamSize && startup.teamSize >= 3) teamScore += 4
  else teamTips.push("A team of 3+ members signals execution capability")
  if (startup.stage !== "IDEATION") teamScore += 3
  breakdown.push({ category: "team", label: "Team Strength", score: Math.min(teamScore, 15), maxScore: 15, tips: teamTips })

  // 5. Pitch Materials (20 points)
  const pitchTips: string[] = []
  let pitchScore = 0
  if (startup.pitchDeckUrl) pitchScore += 8
  else pitchTips.push("Upload a pitch deck — this is critical for investors")
  if (startup.demoVideoUrl) pitchScore += 6
  else pitchTips.push("Add a demo or explainer video")
  if (startup.fundingStatus) pitchScore += 3
  if (startup.fundingAmount) pitchScore += 3
  else pitchTips.push("Specify your funding ask/status")
  breakdown.push({ category: "pitch", label: "Pitch Materials", score: Math.min(pitchScore, 20), maxScore: 20, tips: pitchTips })

  const totalScore = breakdown.reduce((sum, b) => sum + b.score, 0)

  let grade: string
  if (totalScore >= 85) grade = "A+"
  else if (totalScore >= 75) grade = "A"
  else if (totalScore >= 65) grade = "B+"
  else if (totalScore >= 55) grade = "B"
  else if (totalScore >= 45) grade = "C+"
  else if (totalScore >= 35) grade = "C"
  else grade = "D"

  return { totalScore, grade, breakdown }
}
