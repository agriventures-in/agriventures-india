import { prisma } from "@/lib/prisma"

export const COMMUNITY_UPVOTE_THRESHOLD = 50

/**
 * Checks if a startup qualifies for automatic verification upgrade.
 * Currently supports auto-upgrading from NONE to COMMUNITY when
 * the startup reaches 50+ upvotes.
 *
 * @returns The updated startup if upgraded, or null if no change.
 */
export async function checkAndUpgradeVerification(startupId: string) {
  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    select: {
      id: true,
      upvoteCount: true,
      verificationLevel: true,
    },
  })

  if (!startup) {
    return null
  }

  // Auto-upgrade from NONE to COMMUNITY at 50+ upvotes
  if (
    startup.upvoteCount >= COMMUNITY_UPVOTE_THRESHOLD &&
    startup.verificationLevel === "NONE"
  ) {
    const updated = await prisma.startup.update({
      where: { id: startupId },
      data: { verificationLevel: "COMMUNITY" },
    })

    return updated
  }

  return null
}
