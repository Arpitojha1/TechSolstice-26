'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          conversationHistory: messages.slice(-4).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Show rate limit info if provided
      if (data.rateLimit && data.rateLimit.remaining <= 3) {
        console.warn(`Rate limit: ${data.rateLimit.remaining} messages remaining`);
      }

    } catch (error: any) {
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: error.message || 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/70 transition-all duration-300 flex items-center justify-center group hover:scale-110 border border-red-400/30"
        aria-label="Open chatbot"
      >
        <Bot className="h-7 w-7 text-white drop-shadow-lg" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-purple-500/20 animate-pulse" />
        <span className="absolute -top-12 right-0 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-red-500/30 shadow-lg shadow-red-500/20">
          <Sparkles className="inline h-3 w-3 mr-1" />
          Ask about events!
        </span>
      </button>
    );
  }

  // Fullscreen chat on mobile, large panel on desktop
  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[420px] md:h-[650px] z-50 flex flex-col bg-black/95 backdrop-blur-xl md:rounded-2xl shadow-2xl border border-red-500/30 shadow-red-500/20">
      {/* Cyberpunk glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5 pointer-events-none md:rounded-2xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-red-500/30 bg-gradient-to-r from-red-600/90 via-pink-600/90 to-purple-600/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
            <Bot className="h-6 w-6 text-white drop-shadow-lg" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg drop-shadow-lg">TechSolstice Assistant</h3>
            <p className="text-xs text-white/90 flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Ask me anything about the fest!
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-full p-2"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8 space-y-6">
            <div className="relative inline-block">
              <Bot className="h-16 w-16 mx-auto text-red-500 drop-shadow-lg" />
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
            </div>
            <div>
              <p className="font-bold text-white text-xl mb-2">Welcome to TechSolstice!</p>
              <p className="text-sm text-gray-400">Ask me about events, schedules, venues, or rules.</p>
            </div>
            <div className="mt-6 space-y-3 text-xs text-left max-w-xs mx-auto bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-red-500/20">
              <p className="text-red-400 font-semibold flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                Try asking:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>"When is Robowars?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>"What's the next event?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>"Show me all hackathons"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>"Tell me the rules for..."</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user'
                ? 'rounded-tr-sm bg-gradient-to-br from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/30 border border-red-400/30'
                : 'rounded-tl-sm bg-white/5 backdrop-blur-sm text-gray-100 border border-white/10 shadow-lg'
                }`}
            >
              <div className="text-sm leading-relaxed">
                {message.content.split('\n').map((line, i) => {
                  // Simple markdown-like formatting
                  const formatted = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                    .replace(/__(.*?)__/g, '<em class="text-red-400">$1</em>');

                  return (
                    <p
                      key={i}
                      className={i > 0 ? 'mt-2' : ''}
                      dangerouslySetInnerHTML={{ __html: formatted }}
                    />
                  );
                })}
              </div>
              <p className="text-xs opacity-50 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl rounded-tl-sm px-5 py-3 border border-white/10">
              <Loader2 className="h-5 w-5 animate-spin text-red-500" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="relative p-4 border-t border-red-500/30 bg-black/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question... (max 25 words)"
            className="flex-1 px-4 py-3 rounded-full border border-red-500/30 bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            disabled={isLoading}
            maxLength={200}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="rounded-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 border border-red-400/30"
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <Send className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          20 messages per hour • Keep questions under 25 words
        </p>
      </div>
    </div>
  );
}