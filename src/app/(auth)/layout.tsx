import { Sprout } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel - green gradient branding */}
      <div className="relative hidden lg:flex lg:flex-col lg:items-center lg:justify-center bg-gradient-to-br from-primary via-secondary to-emerald-500 p-12 text-white">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="relative z-10 max-w-md text-center">
          <Link href="/" className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Sprout className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">
              AgriVentures
            </span>
          </Link>
          <h2 className="mt-8 text-2xl font-semibold leading-snug">
            The Verified Impact Platform for Indian Agritech
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Connecting 4,255+ unfunded agritech startups with investors,
            corporates, and farmers across India.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">4,255+</div>
              <div className="mt-1 text-sm text-white/70">
                Agritech Startups
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="mt-1 text-sm text-white/70">Active Investors</div>
            </div>
            <div>
              <div className="text-3xl font-bold">28</div>
              <div className="mt-1 text-sm text-white/70">States Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form area */}
      <div className="flex items-center justify-center px-4 py-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">
                AgriVentures
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
