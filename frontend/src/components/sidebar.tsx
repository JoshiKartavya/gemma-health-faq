"use client"

import * as React from "react"
import { Plus, LogOut, Settings, HeartPulse } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300", className)}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <HeartPulse className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white leading-tight">GemmaCare</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Offline Assistant</p>
        </div>
      </div>

      <div className="px-4 mb-4">
        <Button className="w-full justify-start gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl py-6 shadow-md transition-all active:scale-[0.98]">
          <Plus className="w-5 h-5" />
          <span className="font-semibold">New Consultation</span>
        </Button>
      </div>

      <div className="flex-1" />

      <div className="p-4 space-y-4">
        <Separator className="bg-slate-100 dark:bg-slate-800" />

        <div className="flex items-center justify-between px-2">
           <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white">
             <Settings className="w-5 h-5" />
           </Button>
           <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-red-500">
             <LogOut className="w-5 h-5" />
           </Button>
        </div>
      </div>
    </div>
  )
}
