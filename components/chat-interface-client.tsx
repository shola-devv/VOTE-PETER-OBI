'use client';


import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Send, Check, Paperclip, Mic, MessageSquare, Settings, User, LogOut, Plus, Moon, Sun, Zap, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

// Animated Grid Background Component
const AnimatedGrid = ({ darkMode }: { darkMode: boolean }) => {
  const [gridLines, setGridLines] = useState<Array<{
    id: number;
    isHorizontal: boolean;
    position: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    // Generate random grid lines that will animate
    const lines = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      isHorizontal: Math.random() > 0.5,
      position: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setGridLines(lines);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid container */}
      <div className="absolute inset-0 opacity-50 dark:opacity-60">
        {/* Static grid squares for responsive sizing */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: 'clamp(40px, 8vw, 100px) clamp(40px, 8vw, 100px)'
        }} />

     
    
      </div>
    </div>
  );
};

export default function ChatInterfaceClient() {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);


const searchParams = useSearchParams();
  const hasSentInitial = useRef(false); // ← prevent double send

  // ← auto-send the contract from landing page on mount
  useEffect(() => {
    const contract = searchParams.get('contract');
    if (contract && !hasSentInitial.current) {
      hasSentInitial.current = true;
      setInputValue(contract);

      // slight delay so component is fully mounted
      setTimeout(() => {
        handleSendWithValue(contract);
      }, 300);
    }
  }, []);

  // ← extract send logic to accept a value directly
  const handleSendWithValue = async (value: string) => {
    if (!value.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: value,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/analyze-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractCode: value }),
      });

      const data: AnalysisResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze contract");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: formatAnalysisResponse(data),
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: `❌ ${error instanceof Error ? error.message : "Something went wrong"}`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Dark mode: read from localStorage on mount and apply
  useEffect(() => {
    const isDark =
      localStorage.getItem("darkMode") === "true" ||
      (!localStorage.getItem("darkMode") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // ✅ Dark mode toggle: saves to localStorage and updates class
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  // ✅ New chat: clears messages and closes sidebar
  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    setIsTyping(false);
    setIsSidebarOpen(false);
  };

  const formatAnalysisResponse = (data: AnalysisResponse): string => {
  if (data.optimizationSuggestions.includes("No valid Solidity contract detected")) {
    return data.optimizationSuggestions;
  }

  return `🔍 Complexity: ${data.complexity}\n\n${data.optimizationSuggestions}`;
};

  const handleSend = async () => {
    if (!inputValue.trim()) return;
       await handleSendWithValue(inputValue);
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    const contractCode = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/analyze-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractCode }),
      });

      const data: AnalysisResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze contract");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: formatAnalysisResponse(data),
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: `❌ ${error instanceof Error ? error.message : "Something went wrong"}`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
<div className={`min-h-screen relative overflow-hidden ${darkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50'}`}>
      <AnimatedGrid darkMode={darkMode} />

      <div className="absolute inset-cdx0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 dark:bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-400 dark:bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700/50 z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <img
                    src="/smart gauge.png"
                    alt="Smart Gauge Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Smart Gauge
                  </h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* ✅ New Chat Button */}
              <div className="p-4">
                <button
                  onClick={handleNewChat}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Chat</span>
                </button>
              </div>

              {/* Gas Prices */}
              <div className="flex-1 px-4 py-4 border-t border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gas Prices for Chains
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Ethereum", price: "25.4", color: "text-green-600 dark:text-green-400" },
                    { name: "Polygon", price: "32.1", color: "text-emerald-600 dark:text-emerald-400" },
                    { name: "Arbitrum", price: "0.15", color: "text-teal-600 dark:text-teal-400" },
                    { name: "Optimism", price: "0.21", color: "text-lime-600 dark:text-lime-400" },
                  ].map((chain) => (
                    <div
                      key={chain.name}
                      className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg"
                    >
                      <span className="text-xs font-medium text-slate-700 dark:text-gray-300">
                        {chain.name}
                      </span>
                      <span className={`text-xs font-bold ${chain.color}`}>
                        {chain.price} GWEI
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ Sidebar Footer with fixed Links */}
              <div className="border-t border-slate-200 dark:border-slate-700/50 p-4 space-y-1">
                <Link href="/profile" onClick={() => setIsSidebarOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                </Link>

                <Link href="/settings" onClick={() => setIsSidebarOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                </Link>

                <Link href="/" onClick={() => setIsSidebarOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        <header className="border-b border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="/smart gauge.png"
                alt="Smart Gauge Logo"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">
                Smart Gauge
              </h1>
            </div>

            <div className="w-10"></div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col relative">
          {messages.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="opacity-[0.03] dark:opacity-5">
                <MessageSquare className="w-64 h-64 text-slate-900 dark:text-white" />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Welcome to Smart Gauge
                  </h2>
                  <p className="text-slate-600 dark:text-gray-400 text-lg">
                    Paste in your solidity smart contract and let AI do the magic
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="relative group max-w-[80%] min-w-0 overflow-hidden">
                      <div
                        className={`rounded-2xl px-6 py-4 ${
                          message.sender === "user"
                            ? "bg-gradient-to-br from-green-600 to-emerald-600 text-white"
                            : "bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-200"
                        }`}
                      >
                        <div className="text-sm sm:text-base prose prose-sm dark:prose-invert max-w-none
  prose-headings:font-bold prose-headings:mb-2
  prose-p:mb-2 prose-p:leading-relaxed
  prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
  prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4
  prose-li:mb-1
  prose-code:bg-slate-100 prose-code:dark:bg-slate-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
  prose-pre:bg-slate-100 prose-pre:dark:bg-slate-900 prose-pre:p-3 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:text-xs
  prose-strong:font-semibold">
  <ReactMarkdown>
    {message.text}
  </ReactMarkdown>
</div>
                        <div
                          className={`text-xs mt-2 ${
                            message.sender === "user"
                              ? "text-green-100"
                              : "text-slate-500 dark:text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(message.text);
                          setCopiedId(message.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className={`absolute -bottom-3 ${
                          message.sender === "user" ? "right-2" : "left-2"
                        } opacity-0 group-hover:opacity-100 transition-all duration-200
                        flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium shadow-md
                        ${
                          message.sender === "user"
                            ? "bg-green-700 text-green-100 hover:bg-green-800"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))
              )}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-slate-500 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-500 dark:bg-gray-500 rounded-full animate-bounce animation-delay-200"></div>
                      <div className="w-2 h-2 bg-slate-500 dark:bg-gray-500 rounded-full animate-bounce animation-delay-400"></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="relative bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 transition-all duration-300 border border-slate-200 dark:border-slate-700">
                  <label className="block text-sm sm:text-base md:text-lg font-medium text-slate-700 dark:text-gray-300 mb-4">
                    paste in your smart contract and AI does the magic:
                  </label>

                  <div className="relative">
                    <div
                      className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${
                        isTyping
                          ? "opacity-100 animate-pulse bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10"
                          : "opacity-0"
                      }`}
                    />

                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="pragma solidity..."
                      rows={1}
                      className="relative w-full min-h-[100px] max-h-68 pl-4 pr-32 py-3 rounded-2xl
                        bg-gradient-to-br from-slate-100 via-slate-50 to-green-50 dark:from-green-900/40 dark:via-green-800/30 dark:to-emerald-900/40
                        backdrop-blur-md resize-none overflow-hidden
                        text-slate-900 dark:text-white
                        placeholder-slate-400 dark:placeholder-gray-400
                        text-sm sm:text-base transition-all duration-300 focus:outline-none
                        shadow-[8px_8px_18px_rgba(0,0,0,0.1),_-8px_-8px_18px_rgba(255,255,255,0.9)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.35),_-8px_-8px_18px_rgba(255,255,255,0.15)]
                        focus:shadow-[inset_6px_6px_14px_rgba(0,0,0,0.15),_inset_-6px_-6px_14px_rgba(255,255,255,0.7)] dark:focus:shadow-[inset_6px_6px_14px_rgba(0,0,0,0.4),_inset_-6px_-6px_14px_rgba(255,255,255,0.15)]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.metaKey) {
                          handleSend();
                        }
                      }}
                    />

                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <div className="relative group">
                        <button
                          disabled
                          onMouseEnter={() => setShowTooltip("clip")}
                          onMouseLeave={() => setShowTooltip(null)}
                          className="p-2 rounded-full bg-slate-200 dark:bg-slate-700/50 opacity-50 cursor-not-allowed"
                        >
                          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-gray-400" />
                        </button>
                        {showTooltip === "clip" && (
                          <div className="absolute bottom-12 right-0 bg-slate-900 dark:bg-black text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                            Coming soon
                          </div>
                        )}
                      </div>

                      <div className="relative group">
                        <button
                          disabled
                          onMouseEnter={() => setShowTooltip("mic")}
                          onMouseLeave={() => setShowTooltip(null)}
                          className="p-2 rounded-full bg-slate-200 dark:bg-slate-700/50 opacity-50 cursor-not-allowed"
                        >
                          <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-gray-400" />
                        </button>
                        {showTooltip === "mic" && (
                          <div className="absolute bottom-12 right-0 bg-slate-900 dark:bg-black text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                            Coming soon
                          </div>
                        )}
                      </div>

                      <motion.button
                        onClick={handleSend}
                        whileHover={{ scale: inputValue.trim() ? 1.07 : 1 }}
                        whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
                        disabled={!inputValue.trim()}
                        className={`relative p-2 rounded-full bg-slate-900 dark:bg-slate-900 transition-all duration-300
                          ${inputValue.trim()
                            ? "ring-2 ring-green-400/60 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                            : "opacity-50 cursor-not-allowed"
                          }`}
                      >
                        <Send className="w-4 cursor-pointer h-4 sm:w-5 sm:h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}