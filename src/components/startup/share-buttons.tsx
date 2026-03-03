"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Link2, Linkedin, MessageCircle, Check } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonsProps {
  startupName: string
  startupSlug: string
}

export function ShareButtons({ startupName, startupSlug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.agriventures.in"
  const url = `${origin}/startups/${startupSlug}`
  const text = `Check out ${startupName} on AgriVentures India — India's verified agritech startup directory`

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy link")
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1.5">
        {/* Twitter / X */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
              asChild
            >
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on X</TooltipContent>
        </Tooltip>

        {/* LinkedIn */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              asChild
            >
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>

        {/* WhatsApp */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:border-green-300 hover:bg-green-50 hover:text-green-600"
              asChild
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on WhatsApp</TooltipContent>
        </Tooltip>

        {/* Copy Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`h-8 w-8 ${
                copied
                  ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                  : "hover:border-gray-400 hover:bg-gray-50"
              }`}
              onClick={handleCopyLink}
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied!" : "Copy link"}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
