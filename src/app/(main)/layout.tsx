"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EmailVerifyBanner } from "@/components/common/email-verify-banner"
import { useAppStore } from "@/store/app-store"

function SarpanchModeWrapper({ children }: { children: React.ReactNode }) {
  const isSarpanchMode = useAppStore((state) => state.isSarpanchMode)

  return (
    <div className={isSarpanchMode ? "sarpanch-active" : ""}>
      {children}
    </div>
  )
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SarpanchModeWrapper>
      <div className="flex min-h-screen flex-col">
        <Header />
        <EmailVerifyBanner />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SarpanchModeWrapper>
  )
}
