/**
 * Centralized application configuration.
 * All base URLs, email settings, and app-wide constants live here.
 */

export const APP_NAME = "AgriVentures India"

export const BASE_URL =
  process.env.NEXTAUTH_URL || "https://www.agriventures.in"

export const FROM_EMAIL =
  process.env.FROM_EMAIL || "AgriVentures India <noreply@agriventures.in>"
