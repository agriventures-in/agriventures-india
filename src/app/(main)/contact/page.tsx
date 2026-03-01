import { type Metadata } from "next"
import Link from "next/link"
import { Mail, MessageSquare, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Contact Us | AgriVentures India",
  description: "Get in touch with the AgriVentures India team.",
}

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    title: "Email",
    description: "For general inquiries, partnerships, or support",
    detail: "hello@agriventures.in",
    href: "mailto:hello@agriventures.in",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Community",
    description: "Join our community of founders, investors, and enthusiasts",
    detail: "Join Group",
    href: "https://chat.whatsapp.com/Jpu0sU3qsLP3oVCX2ZrqXy",
  },
  {
    icon: MapPin,
    title: "Location",
    description: "Based in India, building for India",
    detail: "Bengaluru, Karnataka, India",
    href: null,
  },
]

const SOCIAL_LINKS = [
  {
    name: "Twitter / X",
    href: "https://x.com/agriventures_Inx",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/agriventures-india/",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/agriventures.in/",
  },
]

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Get in Touch</h1>
        <p className="mt-3 text-slate-600">
          Have a question, partnership idea, or feedback? We&apos;d love to hear
          from you.
        </p>
      </div>

      {/* Contact channels */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {CONTACT_CHANNELS.map((channel) => (
          <Card
            key={channel.title}
            className="text-center transition-shadow hover:shadow-md"
          >
            <CardContent className="flex flex-col items-center p-6">
              <channel.icon className="h-8 w-8 text-emerald" />
              <h3 className="mt-3 font-semibold text-slate-900">
                {channel.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {channel.description}
              </p>
              {channel.href ? (
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    channel.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="mt-3 text-sm font-medium text-emerald hover:underline"
                >
                  {channel.detail}
                </a>
              ) : (
                <p className="mt-3 text-sm font-medium text-slate-700">
                  {channel.detail}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Social */}
      <div className="mt-12 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          Follow Us
        </h2>
        <div className="mt-4 flex items-center justify-center gap-6">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Founder CTA */}
      <div className="mt-12 rounded-2xl bg-forest/5 p-8 text-center">
        <h2 className="font-bold text-slate-900">
          Are you an agritech founder?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Submit your startup to get discovered by investors and the ecosystem.
        </p>
        <Link
          href="/startups/submit"
          className="mt-4 inline-block rounded-lg bg-forest px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest/90"
        >
          Submit Startup
        </Link>
      </div>
    </div>
  )
}
