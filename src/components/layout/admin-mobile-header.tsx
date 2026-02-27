"use client"

import { Menu, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { AdminSidebar } from "@/components/layout/admin-sidebar"

export function AdminMobileHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <AdminSidebar />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-emerald-600" />
        <span className="font-semibold text-slate-900">Admin Panel</span>
      </div>
    </header>
  )
}
