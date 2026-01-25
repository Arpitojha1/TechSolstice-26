"use client"

import { useEffect, useRef } from "react"
import { MorphChatPanel } from "@/components/chat/ai-chat-ui"
import { useChatEngine } from "@/hooks/use-chat-engine"

export function ChatbotWidget() {
  const {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    sendMessage,
    // If you implemented setMessages in the hook to allow manual adds, extract it here
    // Otherwise we handle the welcome message inside the hook or here via useEffect
  } = useChatEngine()

  const hasWelcomeRef = useRef(false)

  // Optional: Add a welcome message locally if the hook doesn't handle it
  // Note: To do this perfectly, your hook needs to expose 'setMessages'
  // Or simpler: put this logic INSIDE the hook's useEffect.

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