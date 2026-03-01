"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  Compass,
  BookOpen,
  Briefcase,
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Rocket,
  LayoutDashboard,
  Globe,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/store/app-store"

const NAV_LINKS = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/knowledge", label: "Knowledge Hub", icon: BookOpen },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
]

const LANGUAGES = [
  { code: "en" as const, label: "English" },
  { code: "hi" as const, label: "Hindi" },
  { code: "mr" as const, label: "Marathi" },
  { code: "te" as const, label: "Telugu" },
]

export function MobileNav() {
  const { data: session } = useSession()
  const { isSarpanchMode, toggleSarpanchMode, language, setLanguage } =
    useAppStore()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[360px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-forest" />
            <span className="text-forest font-bold">AgriVentures</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <Separator className="my-4" />

        {/* Sarpanch Mode */}
        <div className="px-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Mode
          </p>
          <button
            onClick={toggleSarpanchMode}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isSarpanchMode
                ? "bg-saffron/15 text-saffron"
                : "text-foreground/80 hover:bg-accent"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            {isSarpanchMode ? "सरपंच मोड ON" : "Sarpanch Mode"}
          </button>
        </div>

        <Separator className="my-4" />

        {/* Language */}
        <div className="px-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Language
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  language === lang.code
                    ? "bg-emerald/10 text-emerald"
                    : "text-foreground/80 hover:bg-accent"
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Auth */}
        <div className="px-3 flex flex-col gap-2">
          {session?.user ? (
            <>
              <SheetClose asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </SheetClose>
              {["FOUNDER", "ADMIN"].includes(
                (session.user as { role?: string }).role || ""
              ) && (
                <SheetClose asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </SheetClose>
              )}
              {(session.user as { role?: string }).role === "FOUNDER" && (
                <>
                  <SheetClose asChild>
                    <Link
                      href="/dashboard/startups"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Rocket className="h-4 w-4" />
                      My Startups
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/dashboard/jobs"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Briefcase className="h-4 w-4" />
                      My Jobs
                    </Link>
                  </SheetClose>
                </>
              )}
              {(session.user as { role?: string }).role === "INVESTOR" && (
                <SheetClose asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </SheetClose>
              )}
              <Separator className="my-1" />
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Link href="/login">
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Log In
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/register">
                  <Button className="w-full gap-2 bg-forest hover:bg-forest/90">
                    <UserPlus className="h-4 w-4" />
                    Join Community
                  </Button>
                </Link>
              </SheetClose>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
