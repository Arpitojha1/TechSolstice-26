"use client"

import React from "react"
import { cx } from "class-variance-authority"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Send, Loader2, X, Bot } from "lucide-react"

// --- TYPES ---
export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatUIProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

// --- COLOR ORB COMPONENT ---
interface OrbProps {
  dimension?: string
  className?: string
  tones?: { base?: string; accent1?: string; accent2?: string; accent3?: string }
}

const ColorOrb: React.FC<OrbProps> = ({ dimension = "192px", className, tones }) => {
  const fallbackTones = {
    base: "oklch(95% 0.02 264.695)",
    accent1: "oklch(75% 0.15 350)",
    accent2: "oklch(80% 0.12 200)",
    accent3: "oklch(78% 0.14 280)",
  }

  const palette = { ...fallbackTones, ...tones }
  const dimValue = parseInt(dimension.replace("px", ""), 10)
  const blurStrength = dimValue < 50 ? Math.max(dimValue * 0.008, 1) : Math.max(dimValue * 0.015, 4)
  const pixelDot = dimValue < 50 ? Math.max(dimValue * 0.004, 0.05) : Math.max(dimValue * 0.008, 0.1)
  const shadowRange = dimValue < 50 ? Math.max(dimValue * 0.004, 0.5) : Math.max(dimValue * 0.008, 2)

  return (
    <div
      className={cn(className)}
      style={{
        width: dimension,
        height: dimension,
        position: "relative",
        borderRadius: "50%",
        overflow: "hidden",
      } as React.CSSProperties}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `conic-gradient(at 25% 70%, ${palette.accent3}, transparent 20% 80%, ${palette.accent3}),
conic-gradient(at 45% 75%, ${palette.accent2}, transparent 30% 60%, ${palette.accent2}),
conic-gradient(at 80% 20%, ${palette.accent1}, transparent 40% 60%, ${palette.accent1}),
conic-gradient(at 15% 5%, ${palette.accent2}, transparent 10% 90%, ${palette.accent2}),
conic-gradient(at 20% 80%, ${palette.accent1}, transparent 10% 90%, ${palette.accent1}),
conic-gradient(at 85% 10%, ${palette.accent3}, transparent 20% 80%, ${palette.accent3})`,
          boxShadow: `inset ${palette.base} 0 0 ${shadowRange}px calc(${shadowRange}px * 0.2)`,
          filter: `blur(${blurStrength}px) contrast(1.2)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at center, ${palette.base} ${pixelDot}px, transparent ${pixelDot}px)`,
          backgroundSize: `${pixelDot * 2}px ${pixelDot * 2}px`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  )
}

// --- MAIN CHAT PANEL ---

const DESKTOP_OPEN_WIDTH = 380
const CLOSED_SIZE = 48

export function MorphChatPanel({ messages, isLoading, onSendMessage, isOpen, setIsOpen }: ChatUIProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = React.useState("")
  const [width, setWidth] = React.useState(DESKTOP_OPEN_WIDTH)

  // 1. DYNAMIC WIDTH CALCULATION
  React.useEffect(() => {
    const updateWidth = () => {
      const newWidth = Math.min(window.innerWidth - 32, DESKTOP_OPEN_WIDTH)
      setWidth(newWidth)
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Auto-scroll
  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  // Focus
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim() || isLoading) return
    onSendMessage(inputValue)
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") setIsOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-end justify-end" style={{ height: "100dvh", width: "100dvw", pointerEvents: 'none' }}>

      {/* Wrapper needs pointer-events-auto to capture clicks since parent is none */}
      <motion.div
        ref={wrapperRef}
        layout
        className={cx(
          "bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 pointer-events-auto",
          "relative flex flex-col items-center"
        )}
        initial={false}
        animate={{
          width: isOpen ? width : CLOSED_SIZE,
          height: isOpen ? "min(600px, calc(100dvh - 80px))" : CLOSED_SIZE,
          borderRadius: isOpen ? 24 : 999,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 25,
        }}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="closed-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/robot/graident-ai-robot-vectorart.png"
                alt="Chatbot"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.currentTarget
                  const parent = target.parentElement
                  if (!parent) return
                  const fallback = document.createElement('div')
                  fallback.className = 'w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-md'
                  parent.replaceChild(fallback, target)
                }}
              />
            </motion.button>
          ) : (
            <motion.div
              key="open-chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="flex h-full w-full flex-col relative"
            >
              {/* Minimal Header */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-4 bg-linear-to-b from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80">
                <div className="flex items-center gap-2">
                  <img
                    src="/robot/graident-ai-robot-vectorart.png"
                    alt="Assistant"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Assistant</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 -mr-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* --- UPDATED MESSAGES AREA --- */}
              <div
                className={cn(
                  "flex-1 pt-14 px-4 pb-2",
                  // 1. Force vertical scroll
                  "overflow-y-auto",
                  // 2. Prevent scroll chaining (scrolling body when chat ends)
                  "overscroll-y-contain",
                  // 3. Ensure flex child height is constrained
                  "h-full min-h-0",
                  // 4. Custom scrollbar styling
                  "[&::-webkit-scrollbar]:w-1.5",
                  "[&::-webkit-scrollbar-track]:bg-transparent",
                  "[&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800",
                  "[&::-webkit-scrollbar-thumb]:rounded-full",
                  "[&::-webkit-scrollbar-thumb]:hover:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:hover:bg-zinc-700"
                )}
                // 5. Explicitly stop wheel propagation to be safe
                onWheel={(e) => e.stopPropagation()}
              >
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                    <Bot className="w-8 h-8 text-zinc-400" />
                    <p className="text-sm text-zinc-500">How can I help you with TechSolstice?</p>
                  </div>
                )}

                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex w-full",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] px-3 py-2 text-sm",
                          msg.role === "user"
                            ? "bg-zinc-900 text-white rounded-2xl rounded-tr-sm dark:bg-white dark:text-zinc-900"
                            : "bg-zinc-100 text-zinc-800 rounded-2xl rounded-tl-sm dark:bg-zinc-900 dark:text-zinc-300"
                        )}
                      >
                        <p dangerouslySetInnerHTML={{
                          __html: msg.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br />')
                        }} />
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Minimal Input Area */}
              <div className="p-3 bg-white dark:bg-zinc-950 z-20">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 rounded-full px-1 py-1 pr-1 border border-transparent focus-within:border-zinc-200 dark:focus-within:border-zinc-800 transition-colors"
                >
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className={cn(
                      "flex-1 bg-transparent border-0 focus:ring-0 resize-none h-9 py-2 px-3 text-base outline-none placeholder:text-zinc-400",
                      "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    )}
                    rows={1}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-900 transition-transform active:scale-95"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}