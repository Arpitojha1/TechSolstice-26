'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Loader2, Sparkles } from 'lucide-react';

// Define the structure of the chatbot's reply based on your backend
interface ChatbotReply {
  shortAnswer: string;
  detailedAnswer: string;
  success: boolean;
}

interface ApiResponse {
  reply: ChatbotReply;
}

interface ChatMessage {
  id: string;
  user: string;
  bot: ChatbotReply;
  timestamp: Date;
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    const message = userInput;
    setUserInput('');

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: ApiResponse = await response.json();

      setChatHistory(prev => [...prev, {
        id: `msg-${Date.now()}`,
        user: message,
        bot: data.reply,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Failed to fetch chatbot reply:', error);
      const errorReply: ChatbotReply = {
        shortAnswer: "Connection Error",
        detailedAnswer: "Sorry, I couldn't connect to the server. Please try again later.",
        success: false,
      };
      setChatHistory(prev => [...prev, {
        id: `msg-${Date.now()}`,
        user: message,
        bot: errorReply,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
          Ask about TechSolstice!
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
            <h3 className="font-bold text-white text-lg drop-shadow-lg">SolsticeBot</h3>
            <p className="text-xs text-white/90 flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Online • Ask me anything!
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
        {chatHistory.length === 0 && (
          <div className="text-center text-gray-400 mt-8 space-y-6">
            <div className="relative inline-block">
              <Bot className="h-16 w-16 mx-auto text-red-500 drop-shadow-lg" />
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
            </div>
            <div>
              <p className="font-bold text-white text-xl mb-2">Welcome to TechSolstice'26!</p>
              <p className="text-sm text-gray-400">I'm here to help you with events, schedules, and more.</p>
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

        {chatHistory.map((chat) => (
          <div key={chat.id} className="space-y-3">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3 bg-gradient-to-br from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/30 border border-red-400/30">
                <p className="text-sm leading-relaxed">{chat.user}</p>
                <p className="text-xs opacity-70 mt-1.5">
                  {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Bot Message */}
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 bg-white/5 backdrop-blur-sm text-gray-100 border border-white/10 shadow-lg">
                {/* Short Answer */}
                <p className="text-sm font-semibold text-red-400 mb-2">
                  {chat.bot.shortAnswer}
                </p>

                {/* Detailed Answer */}
                <div className="text-sm leading-relaxed text-gray-300 space-y-2">
                  {chat.bot.detailedAnswer.split('\n').map((line, i) => {
                    const formatted = line
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                      .replace(/__(.*?)__/g, '<em class="text-red-400">$1</em>');

                    return line.trim() ? (
                      <p
                        key={i}
                        dangerouslySetInnerHTML={{ __html: formatted }}
                      />
                    ) : null;
                  })}
                </div>

                {!chat.bot.success && (
                  <div className="mt-2 pt-2 border-t border-red-500/30">
                    <p className="text-xs text-red-400">⚠ Error occurred</p>
                  </div>
                )}

                <p className="text-xs opacity-50 mt-2">
                  {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
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
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about events, schedules, rules..."
            className="flex-1 px-4 py-3 rounded-full border border-red-500/30 bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            disabled={isLoading}
            maxLength={200}
          />
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim() || isLoading}
            className="rounded-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 p-3 border border-red-400/30"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <Send className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Powered by TechSolstice AI
        </p>
      </div>
    </div>
  );
}