"use client"

import * as React from "react"
import { Send, User, Bot, Sparkles, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! I am your GemmaCare assistant. How can I help you today? I can provide information on common health topics like malaria, pregnancy, or basic first aid.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Fetch AI response
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      })
      
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.answer || "Sorry, I couldn't find an answer.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Sorry, there was an error connecting to the server.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50 dark:bg-slate-900/50">
      <ScrollArea className="flex-1 p-4 md:p-8" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                  "flex gap-4",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className={cn(
                  "w-10 h-10 shrink-0",
                  message.role === "user" ? "bg-slate-100 dark:bg-slate-800" : "bg-primary shadow-lg shadow-primary/30"
                )}>
                  {message.role === "user" ? <User className="w-5 h-5 text-slate-500 dark:text-slate-400" /> : <Bot className="w-6 h-6 text-white" />}
                </Avatar>

                <div className={cn(
                  "flex flex-col space-y-1.5 max-w-[85%] sm:max-w-[75%]",
                  message.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed",
                    message.role === "user" 
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-tr-[4px]" 
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 rounded-tl-[4px]"
                  )}>
                    {message.content}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <Avatar className="w-10 h-10 bg-primary shrink-0 shadow-lg shadow-primary/30">
                <Bot className="w-6 h-6 text-white" />
              </Avatar>
              <div className="bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl rounded-tl-[4px] border border-slate-200/60 dark:border-slate-700 shadow-sm flex items-center gap-1.5 h-[52px]">
                <span className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce"></span>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 md:p-8 bg-gradient-to-t from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide shadow-sm backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Private • Offline Ready
             </div>
          </div>

          {messages.length === 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {["What are malaria symptoms?", "How to prevent dengue?", "What is dehydration?"].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-all duration-500" />
            <div className="relative flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all focus-within:ring-2 focus-within:ring-primary/20">
              <div className="pl-4 pr-2 text-slate-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <Input
                placeholder="Ask a health question (e.g., Symptoms of malaria?)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-6 text-base"
              />
              <Button 
                onClick={handleSend}
                size="icon"
                className="w-12 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95 shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4 font-medium px-4">
            Consult a medical professional for emergencies. Gemma Health is an information reference tool.
          </p>
        </div>
      </div>
    </div>
  )
}
