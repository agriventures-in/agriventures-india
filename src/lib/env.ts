// Runtime environment variable validation
// This file is imported by lib/prisma.ts and lib/auth.ts to ensure
// required env vars are set before any database or auth operations

function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  get DATABASE_URL() {
    return getRequiredEnv("DATABASE_URL")
  },
  get NEXTAUTH_SECRET() {
    return getRequiredEnv("NEXTAUTH_SECRET")
  },
  get NEXTAUTH_URL() {
    return process.env.NEXTAUTH_URL || "http://localhost:3000"
  },
  get GOOGLE_CLIENT_ID() {
    return process.env.GOOGLE_CLIENT_ID || ""
  },
  get GOOGLE_CLIENT_SECRET() {
    return process.env.GOOGLE_CLIENT_SECRET || ""
  },
  get LINKEDIN_CLIENT_ID() {
    return process.env.LINKEDIN_CLIENT_ID || ""
  },
  get LINKEDIN_CLIENT_SECRET() {
    return process.env.LINKEDIN_CLIENT_SECRET || ""
  },
}
