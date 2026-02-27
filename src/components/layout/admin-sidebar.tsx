"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShieldCheck,
  Rocket,
  Users,
  BookOpen,
  Briefcase,
  ArrowLeft,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/verification", label: "Verification", icon: ShieldCheck },
  { href: "/admin/startups", label: "Startups", icon: Rocket },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Admin Panel</h2>
          <p className="text-xs text-slate-400">AgriVentures India</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-600/20 text-emerald-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-400" : "text-slate-400")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 text-slate-400" />
          Back to Site
        </Link>
      </div>
    </div>
  )
}
