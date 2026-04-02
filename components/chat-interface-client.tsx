'use client';


import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Send, Check, Paperclip, Mic, MessageSquare, Settings, User, LogOut, Plus, Moon, Sun, Zap, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { estimateComplexity, fetchChainGasData } from "@/lib/coinstats";
import { AnalysisResponse } from '@/types/analysis';


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
    const lines = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      isHorizontal: Math.random() > 0.5,
      position: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setGridLines(lines);
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${darkMode ? 'bg-[#0a0f0a]' : 'bg-[#f8faf8]'}`}>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: 'clamp(40px, 8vw, 100px) clamp(40px, 8vw, 100px)',
        }}
      />
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(74,222,128,0.09) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)',
        }}
      />
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
  const [gasData, setGasData] = useState<Array<{ chainName: string; gasPrice: number; tokenSymbol: string; estimatedGasCost: number }>>([]);
  const [loggedUser, setLoggedUser] = useState<{ id: string; email: string; username: string } | null>(null);

  const getApiPayloadMeta = () => {
    const provider = localStorage.getItem('apiProvider') || 'openai';
    const apiMode = localStorage.getItem('apiMode') || 'auto';
    const apiKey = apiMode === 'custom' ? localStorage.getItem(`apiKey_${provider}`) : null;
    return { provider, apiKey: apiKey ? apiKey : undefined };
  };

  useEffect(() => {
    const saved = localStorage.getItem('smartgauge_user');
    if (saved) {
      try {
        setLoggedUser(JSON.parse(saved));
      } catch {
        setLoggedUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('smartgauge_user');
    localStorage.removeItem('smartgauge_logged_in');
    setLoggedUser(null);
  };

  const searchParams = useSearchParams();
  const hasSentInitial = useRef(false);

  useEffect(() => {
    const contract = searchParams.get('contract');
    if (contract && !hasSentInitial.current) {
      hasSentInitial.current = true;
      setInputValue(contract);
      setTimeout(() => {
        handleSendWithValue(contract);
      }, 300);
    }
  }, []);

  // FIX 3: Single source of truth for sending — handleSend just delegates to handleSendWithValue.
  // Previously handleSend called handleSendWithValue AND ran its own duplicate fetch, causing two
  // messages to be appended and two API calls to fire.
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
      const providerPayload = getApiPayloadMeta();
      const res = await fetch("/api/analyze-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractCode: value, provider: providerPayload.provider, apiKey: providerPayload.apiKey }),
      });

      const data: AnalysisResponse = await res.json();
      const complexity = estimateComplexity(value);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze contract");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: `${formatAnalysisResponse(data)}\n\n📊 Estimated local complexity: ${complexity}`,
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

  // FIX 3: handleSend now only delegates — no duplicate logic.
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    await handleSendWithValue(inputValue);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  useEffect(() => {
    const fetchGasData = async () => {
      try {
        const data = await fetchChainGasData();
        if (data && data.length > 0) {
          setGasData(data);
        } else {
          setGasData([
            { chainName: 'Ethereum', gasPrice: 0, tokenSymbol: 'ETH', estimatedGasCost: 0 },
            { chainName: 'Polygon', gasPrice: 0, tokenSymbol: 'MATIC', estimatedGasCost: 0 },
            { chainName: 'Arbitrum', gasPrice: 0, tokenSymbol: 'ETH', estimatedGasCost: 0 },
            { chainName: 'Optimism', gasPrice: 0, tokenSymbol: 'ETH', estimatedGasCost: 0 },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch gas data:', error);
        setGasData([
          { chainName: 'Ethereum', gasPrice: 35, tokenSymbol: 'ETH', estimatedGasCost: 5.4 },
          { chainName: 'Polygon', gasPrice: 33, tokenSymbol: 'MATIC', estimatedGasCost: 1.9 },
          { chainName: 'Arbitrum', gasPrice: 0.25, tokenSymbol: 'ETH', estimatedGasCost: 0.03 },
          { chainName: 'Optimism', gasPrice: 0.3, tokenSymbol: 'ETH', estimatedGasCost: 0.04 },
        ]);
      }
    };
    fetchGasData();
  }, []);

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

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${darkMode ? 'bg-[#0a0f0a]' : 'bg-[#f8faf8]'}`}>
      <AnimatedGrid darkMode={darkMode} />

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
            className={`fixed left-0 top-0 h-full w-80 backdrop-blur-xl border-r z-50 shadow-2xl ${darkMode ? 'bg-[#0f1a0f] border-green-900/40' : 'bg-white/95 border-gray-200'}`}
          >
            <div className="flex flex-col h-full">
              <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-green-900/40' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <img
                    src="/smart gauge.png"
                    alt="Smart Gauge Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Smart Gauge
                  </h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-green-950/40 text-green-200/40' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <button
                  onClick={handleNewChat}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Chat</span>
                </button>
              </div>

              <div className={`flex-1 px-4 py-4 border-t ${darkMode ? 'border-green-900/40' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <div className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-green-200/40' : 'text-gray-500'}`}>
                    Gas Prices for Chains
                  </div>
                </div>
                <div className="space-y-2">
                  {gasData.map((chain) => (
                    <div
                      key={chain.chainName}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg ${darkMode ? 'bg-[#0a140a]' : 'bg-gray-50'}`}
                    >
                      <span className={`text-xs font-medium ${darkMode ? 'text-green-200/40' : 'text-gray-700'}`}>
                        {chain.chainName}
                      </span>
                      <span className={`text-xs font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {chain.gasPrice.toFixed(2)} GWEI
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`border-t ${darkMode ? 'border-green-900/40' : 'border-gray-200'} p-4 space-y-2`}>
                {loggedUser ? (
                  <>
                    <div className={`text-xs ${darkMode ? 'text-green-200/40' : 'text-gray-500'}`}>
                      Signed in as <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{loggedUser.username}</span>
                    </div>
                    <Link href="/profile" onClick={() => setIsSidebarOpen(false)}>
                      <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${darkMode ? 'text-green-200/40 hover:bg-green-950/40 hover:text-green-300' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                      </button>
                    </Link>
                    <Link href="/settings" onClick={() => setIsSidebarOpen(false)}>
                      <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${darkMode ? 'text-green-200/40 hover:bg-green-950/40 hover:text-green-300' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </button>
                    </Link>
                    <button onClick={() => { handleLogout(); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-red-950/30' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`}>
                      <LogOut className="w-5 h-5" />
                      <span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className={`text-sm mb-2 ${darkMode ? 'text-green-200/40' : 'text-gray-500'}`}>
                      Sign in to access account shortcuts
                    </div>
                    <Link href="/landing/login" onClick={() => setIsSidebarOpen(false)}>
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all">
                        <User className="w-5 h-5" />
                        <span>Login</span>
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col" style={{ height: '100dvh' }}>

        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            flexShrink: 0,
            borderBottom: darkMode ? '1px solid rgba(20,83,45,0.4)' : '1px solid #e5e7eb',
            backgroundColor: darkMode ? '#0a0f0a' : '#f8faf8',
          }}
        >
          <div className="w-full px-3 sm:px-6 lg:px-8 flex items-center justify-between" style={{ minHeight: '56px', paddingTop: '12px', paddingBottom: '12px' }}>
            {/* Left controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'hover:bg-green-950/40 text-green-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'hover:bg-green-950/40 text-green-400'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>

            {/* Centre branding */}
            <div className="flex items-center gap-2">
              <img
                src="/smart gauge.png"
                alt="Smart Gauge Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              />
              <h1 className={`text-base sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Smart Gauge
              </h1>
            </div>

            {/* Right spacer — mirrors left side width so title stays centred */}
            <div className="w-[72px] sm:w-[88px]" />
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
                  <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Welcome to Smart Gauge
                  </h2>
                  <p className={`text-lg ${darkMode ? 'text-green-200/40' : 'text-gray-400'}`}>
                    Paste in your solidity smart contract and let AI do the magic
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="relative group max-w-[85%] sm:max-w-[80%]">
                      <div
                        className={`rounded-2xl px-4 sm:px-6 py-4 ${
                          message.sender === "user"
                            ? "bg-gradient-to-br from-green-600 to-emerald-600 text-white"
                            : `${darkMode ? 'bg-[#0f1a0f] border border-green-900/40 text-green-200' : 'bg-white border border-gray-200 text-gray-900'}`
                        }`}
                      >
                        {message.sender === "user" ? (
                          /* User bubble: plain text only, no markdown parsing */
                          <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                            {message.text}
                          </p>
                        ) : (
                          /* AI bubble: full markdown with scrollable code blocks */
                          <div className="text-sm sm:text-base prose prose-sm dark:prose-invert max-w-none
                            break-words
                            prose-headings:font-bold prose-headings:mb-2
                            prose-p:mb-2 prose-p:leading-relaxed
                            prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
                            prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4
                            prose-li:mb-1
                            prose-code:bg-slate-100 prose-code:dark:bg-slate-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                            prose-strong:font-semibold">
                            <ReactMarkdown
                              components={{
                                pre: ({ children }) => (
                                  <div
                                    style={{
                                      overflowX: 'auto',
                                      WebkitOverflowScrolling: 'touch',
                                      borderRadius: '12px',
                                      margin: '12px 0',
                                      border: darkMode ? '1px solid rgba(20,83,45,0.5)' : '1px solid #e2e8f0',
                                      backgroundColor: darkMode ? '#050a05' : '#f1f5f9',
                                    }}
                                  >
                                    <pre style={{ margin: 0, padding: '12px', width: 'max-content', minWidth: '100%', whiteSpace: 'pre', fontSize: '12px', lineHeight: '1.6' }}>
                                      {children}
                                    </pre>
                                  </div>
                                ),
                                code: ({ node, children, ...props }) => {
                                  const isInline = node?.position?.start.line === node?.position?.end.line;
                                  return isInline ? (
                                    <code
                                      style={{
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        backgroundColor: darkMode ? 'rgba(20,83,45,0.4)' : '#f1f5f9',
                                        color: darkMode ? '#86efac' : '#334155',
                                      }}
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  ) : (
                                    <code style={{ fontSize: '12px', color: darkMode ? '#86efac' : '#1e293b' }} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {message.text}
                            </ReactMarkdown>
                          </div>
                        )}
                        <div
                          className={`text-xs mt-2 ${
                            message.sender === "user"
                              ? "text-green-100"
                              : darkMode ? "text-green-900" : "text-gray-400"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>

                      {/* FIX 2 (copy button): Kept always-visible on mobile (opacity-100) and
                          hover-visible on desktop. Positioned outside the bubble flow so it never
                          overlaps bubble text. */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(message.text);
                          setCopiedId(message.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className={`absolute -bottom-3 ${
                          message.sender === "user" ? "right-2" : "left-2"
                        } opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200
                        flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium shadow-md z-10
                        ${
                          message.sender === "user"
                            ? "bg-green-700 text-green-100 hover:bg-green-800"
                            : darkMode
                              ? "bg-[#0f1a0f] border border-green-900/40 text-green-200/40 hover:bg-green-950/40"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {copiedId === message.id ? (
                          <><Check className="w-3 h-3" />Copied</>
                        ) : (
                          <><Copy className="w-3 h-3" />Copy</>
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
                  <div className={`rounded-2xl px-6 py-4 border ${darkMode ? 'bg-[#0a140a] border-green-900/40 text-green-300' : 'bg-white border-gray-200 text-gray-800'}`}>
                    <div className="flex gap-2">
                      <div className={`${darkMode ? 'bg-green-400' : 'bg-slate-500'} w-2 h-2 rounded-full animate-bounce`}></div>
                      <div className={`${darkMode ? 'bg-green-400' : 'bg-slate-500'} w-2 h-2 rounded-full animate-bounce animation-delay-200`}></div>
                      <div className={`${darkMode ? 'bg-green-400' : 'bg-slate-500'} w-2 h-2 rounded-full animate-bounce animation-delay-400`}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="flex-shrink-0 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="relative dark:bg-slate-800/50 rounded-2xl shadow-lg p-3 sm:p-4 transition-all duration-300">
                  <label className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Paste in your smart contract and AI does the magic:
                  </label>

                  <div className="relative">
                    <div
                      className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${
                        isTyping
                          ? "opacity-100 animate-pulse bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10"
                          : "opacity-0"
                      }`}
                    />

                    {/* FIX 2: Changed overflow-hidden → overflow-y-auto so text scrolls rather than
                        clips. Added word-break: break-all via style so extremely long unspaced
                        strings (contract code) wrap instead of widening the textarea. Adjusted
                        padding-right to leave room for the button column without being excessive. */}
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="pragma solidity..."
                      rows={4}
                      style={{ wordBreak: 'break-all' }}
                      className={`relative w-full min-h-[100px] max-h-64 pl-3 sm:pl-4 pr-28 sm:pr-32 py-3 rounded-2xl
                        bg-gradient-to-br from-primaryDark/40 via-primary/30 to-primaryLight/40
                        backdrop-blur-md resize-none overflow-y-auto text-sm sm:text-base
                        transition-all duration-300 focus:outline-none
                        shadow-[8px_8px_18px_rgba(0,0,0,0.35),_-8px_-8px_18px_rgba(255,255,255,0.15)]
                        focus:shadow-[inset_6px_6px_14px_rgba(0,0,0,0.4),_inset_-6px_-6px_14px_rgba(255,255,255,0.15)]
                        ${darkMode ? 'text-white placeholder-gray-400' : 'text-surfaceDark placeholder-surfaceShadow'}
                      `}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.metaKey) {
                          handleSend();
                        }
                      }}
                    />

                    {/* Button cluster — absolutely positioned so it never pushes textarea wider */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 sm:gap-2">
                      <div className="relative group">
                        <button
                          disabled
                          onMouseEnter={() => setShowTooltip("clip")}
                          onMouseLeave={() => setShowTooltip(null)}
                          className="p-1.5 sm:p-2 rounded-full bg-slate-200 dark:bg-slate-700/50 opacity-50 cursor-not-allowed"
                        >
                          <Paperclip className="w-4 h-4 text-slate-500 dark:text-gray-400" />
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
                          className={`p-1.5 sm:p-2 rounded-full ${darkMode ? 'bg-green-950/40' : 'bg-slate-200'} opacity-50 cursor-not-allowed`}
                        >
                          <Mic className={`w-4 h-4 ${darkMode ? 'text-green-200/40' : 'text-slate-500'}`} />
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
                        className={`relative p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
                          inputValue.trim()
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 ring-2 ring-green-400/60 shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                            : 'bg-slate-400 dark:bg-green-950/30 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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