"use client"

import * as React from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatInterface } from "@/components/chat-interface"
import { cn } from "@/lib/utils"

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      {/* Sidebar - Desktop */}
      <Sidebar 
        className={cn(
          "hidden md:flex w-72 shrink-0 transition-all duration-300",
          !isSidebarOpen && "w-0 opacity-0 overflow-hidden"
        )} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>

        {/* Mobile Sidebar Overlay */}
        {!isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(true)}
          />
        )}
      </main>
    </div>
  )
}
