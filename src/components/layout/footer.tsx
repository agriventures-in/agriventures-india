import Link from "next/link"
import { ShieldCheck } from "lucide-react"

const PLATFORM_LINKS = [
  { href: "/discover", label: "Discover Startups" },
  { href: "/startups/submit", label: "Submit Startup" },
  { href: "/knowledge", label: "Knowledge Hub" },
  { href: "/jobs", label: "Jobs Board" },
]

const RESOURCE_LINKS = [
  { href: "/knowledge/founder-guides", label: "Founder Guides" },
  { href: "/knowledge/government-schemes", label: "Government Schemes" },
  { href: "/knowledge/research", label: "Research Reports" },
  { href: "/docs/api", label: "API Documentation" },
]

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/mission", label: "Our Mission" },
  { href: "/team", label: "Team" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
]

const CONNECT_LINKS = [
  { href: "https://x.com/agriventures_Inx", label: "Twitter / X" },
  { href: "https://www.linkedin.com/company/agriventures-india/", label: "LinkedIn" },
  { href: "https://www.instagram.com/agriventures.in/", label: "Instagram" },
  { href: "https://chat.whatsapp.com/Jpu0sU3qsLP3oVCX2ZrqXy", label: "WhatsApp Community" },
]

export function Footer() {
  return (
    <footer className="bg-[#0A4A23] text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Top section with logo and tagline */}
        <div className="mb-10 flex flex-col items-start gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <ShieldCheck className="h-7 w-7 text-lime" />
            <span className="text-xl font-bold tracking-tight text-white">
              AgriVentures
            </span>
          </Link>
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            Built for India&apos;s Agritech Ecosystem. Making invisible
            founders visible to the world.
          </p>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-lime">
              Platform
            </h3>
            <ul className="space-y-2.5">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-lime">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-lime">
              Company
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-lime">
              Connect
            </h3>
            <ul className="space-y-2.5">
              {CONNECT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-white/50">
              &copy; {new Date().getFullYear()} AgriVentures India. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-xs text-white/50 transition-colors hover:text-white/80"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-white/50 transition-colors hover:text-white/80"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-white/50 transition-colors hover:text-white/80"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
