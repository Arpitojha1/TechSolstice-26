"use client"

import { useState, useRef } from "react"
import { MorphChatPanel } from "./ui/ai-chat-ui"

// Local Message type to avoid importing client-only module during SSR
export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Create a session ID that persists for this browser session
  const [sessionId] = useState(() =>
    `session-${typeof window !== 'undefined' ? Date.now() : '0'}-${Math.random().toString(36).substr(2, 9)}`
  )

  const sendMessage = async (input: string) => {
    if (!input.trim() || isLoading) return

    // 1. Add User Message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // 2. Fetch from API
      // Adjust path if your API is on localhost:3001 explicitly
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      // 3. Add Assistant Message
      // Handle the data structure from your backend (checking for data.reply or data.response)
      const replyContent = data.response || data.reply?.detailedAnswer || "I received your message but couldn't process the response format."

      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: replyContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Rate limit warning log
      if (data.rateLimit && data.rateLimit.remaining <= 3) {
        console.warn(`Rate limit: ${data.rateLimit.remaining} messages remaining`)
      }

    } catch (error: any) {
      console.error("Chat Error:", error)
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MorphChatPanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
    />
  )
}