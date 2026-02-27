import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join AgriVentures India - the verified impact platform for Indian agritech",
}

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join India&apos;s largest agritech discovery platform
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
