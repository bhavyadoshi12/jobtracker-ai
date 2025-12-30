"use client"

import { LayoutDashboard, FileText, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "My Resumes", icon: FileText, href: "#" },
  { name: "Analytics", icon: BarChart3, href: "#" },
  { name: "Settings", icon: Settings, href: "#" },
]

export function Sidebar() {
  const [active, setActive] = useState("Dashboard")

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">JobTracker</h1>
        <p className="text-sm text-muted-foreground mt-1">Application Manager</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.name

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActive(item.name)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Bhavya Doshi</p>
            <p className="text-xs text-muted-foreground truncate">work.bhavya12@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}