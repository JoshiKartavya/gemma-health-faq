"use client"

import * as React from "react"
import { Sun, Moon, ShieldCheck, Share2, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Verified Secure</span>
          </Badge>
          <span className="text-xs text-slate-400 font-medium">|</span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Active Consultation</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900">
          <Share2 className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Dr. Amara</p>
            <p className="text-[10px] text-slate-400 font-medium">Village Health Worker</p>
          </div>
          <Avatar className="w-9 h-9 border-2 border-white dark:border-slate-800 shadow-sm">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
