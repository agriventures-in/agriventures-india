"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  ShieldCheck,
  Compass,
  BookOpen,
  Briefcase,
  User,
  Rocket,
  LayoutDashboard,
  LogOut,
  Globe,
  Handshake,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/store/app-store"
import { MobileNav } from "@/components/layout/mobile-nav"
import { NotificationBell } from "@/components/layout/notification-bell"
import { useTranslations } from "@/hooks/use-translations"
import { languages, type Language } from "@/i18n/config"

const NAV_LINKS = [
  { href: "/discover", labelKey: "nav.discover", icon: Compass },
  { href: "/knowledge", labelKey: "nav.knowledge", icon: BookOpen },
  { href: "/jobs", labelKey: "nav.jobs", icon: Briefcase },
]

export function Header() {
  const { data: session } = useSession()
  const { isSarpanchMode, toggleSarpanchMode, language, setLanguage } =
    useAppStore()
  const { t } = useTranslations()

  const userRole = (session?.user as { role?: string } | undefined)?.role

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 ${
        isSarpanchMode
          ? "sarpanch-header border-b-2 border-saffron"
          : ""
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          {/* Mobile hamburger */}
          <MobileNav />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-forest" />
            <span className="text-lg font-bold tracking-tight text-forest">
              AgriVentures
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground ${
                  isSarpanchMode ? "text-[1.05rem]" : "text-sm"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Language Selector + Sarpanch Mode + Auth */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-emerald/50 hover:text-emerald sm:flex">
                <Globe className="h-3.5 w-3.5" />
                {languages[language].nativeName}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {(Object.keys(languages) as Language[]).map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex items-center justify-between ${
                    language === lang ? "bg-emerald/10 text-emerald" : ""
                  }`}
                >
                  <span>{languages[lang].nativeName}</span>
                  <span className="text-xs text-muted-foreground">
                    {languages[lang].name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sarpanch Mode toggle */}
          <button
            onClick={toggleSarpanchMode}
            className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all sm:flex ${
              isSarpanchMode
                ? "bg-saffron text-white shadow-md shadow-saffron/25"
                : "border border-border bg-background text-muted-foreground hover:border-saffron/50 hover:text-saffron"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {isSarpanchMode ? t("sarpanch.mode") : "Sarpanch Mode"}
          </button>

          {/* Auth */}
          {session?.user ? (
            <>
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback className="bg-emerald/10 text-emerald text-xs font-semibold">
                      {session.user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {userRole === "FOUNDER" && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/startups"
                      className="flex items-center gap-2"
                    >
                      <Rocket className="h-4 w-4" />
                      My Startups
                    </Link>
                  </DropdownMenuItem>
                )}
                {(userRole === "ADMIN" || userRole === "INVESTOR") && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                {(userRole === "INVESTOR" || userRole === "FOUNDER") && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/intros"
                      className="flex items-center gap-2"
                    >
                      <Handshake className="h-4 w-4" />
                      Introductions
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-forest hover:bg-forest/90 text-white"
                >
                  {t("nav.register")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
