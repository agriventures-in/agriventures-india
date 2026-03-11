import { Metadata } from "next"
import { InvestorOnboarding } from "@/components/investor/investor-onboarding"

export const metadata: Metadata = {
  title: "Investor Onboarding | AgriVentures India",
  description:
    "Set up your investor profile to discover and connect with AgriTech startups across India.",
}

export default function InvestorOnboardingPage() {
  return <InvestorOnboarding />
}
