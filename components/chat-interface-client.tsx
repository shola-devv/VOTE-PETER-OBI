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

  // The HEADER_H constant drives the top padding of the scroll area so
  // content never hides behind the fixed header.
  const HEADER_H = 56;

  return (
    // Outermost shell — just a background, no overflow tricks
    <div style={{ minHeight: '100vh', backgroundColor: darkMode ? '#0a0f0a' : '#f8faf8' }}>
      <AnimatedGrid darkMode={darkMode} />

      {/* ── SIDEBAR OVERLAY ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR PANEL ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', left: 0, top: 0, height: '100%', width: 320,
              zIndex: 50, display: 'flex', flexDirection: 'column',
              backgroundColor: darkMode ? '#0f1a0f' : '#ffffff',
              borderRight: darkMode ? '1px solid rgba(20,83,45,0.4)' : '1px solid #e5e7eb',
              boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
            }}
          >
            {/* Sidebar header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: darkMode ? '1px solid rgba(20,83,45,0.4)' : '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="/smart gauge.png" alt="Smart Gauge Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                <span style={{ fontSize: 20, fontWeight: 700, color: darkMode ? '#ffffff' : '#111827' }}>Smart Gauge</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} style={{ padding: 8, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#86efac' : '#4b5563' }}>
                <X size={20} />
              </button>
            </div>

            {/* New chat */}
            <div style={{ padding: 16 }}>
              <button onClick={handleNewChat} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'linear-gradient(to right, #16a34a, #059669)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                <Plus size={18} /> New Chat
              </button>
            </div>

            {/* Gas prices */}
            <div style={{ flex: 1, padding: '0 16px 16px', borderTop: darkMode ? '1px solid rgba(20,83,45,0.4)' : '1px solid #e5e7eb', paddingTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Zap size={14} color="#eab308" />
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: darkMode ? 'rgba(187,247,208,0.5)' : '#6b7280' }}>Gas Prices</span>
              </div>
              {gasData.map((chain) => (
                <div key={chain.chainName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, marginBottom: 8, backgroundColor: darkMode ? '#0a140a' : '#f9fafb' }}>
                  <span style={{ fontSize: 12, color: darkMode ? 'rgba(187,247,208,0.5)' : '#374151' }}>{chain.chainName}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: darkMode ? '#4ade80' : '#16a34a' }}>{chain.gasPrice.toFixed(2)} GWEI</span>
                </div>
              ))}
            </div>

            {/* Account footer */}
            <div style={{ borderTop: darkMode ? '1px solid rgba(20,83,45,0.4)' : '1px solid #e5e7eb', padding: 16 }}>
              {loggedUser ? (
                <>
                  <p style={{ fontSize: 12, color: darkMode ? 'rgba(187,247,208,0.5)' : '#6b7280', marginBottom: 8 }}>
                    Signed in as <strong style={{ color: darkMode ? '#fff' : '#111827' }}>{loggedUser.username}</strong>
                  </p>
                  <Link href="/profile" onClick={() => setIsSidebarOpen(false)}>
                    <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: darkMode ? 'rgba(187,247,208,0.6)' : '#374151', fontSize: 14, marginBottom: 4 }}>
                      <User size={18} /> Profile
                    </button>
                  </Link>
                  <Link href="/settings" onClick={() => setIsSidebarOpen(false)}>
                    <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: darkMode ? 'rgba(187,247,208,0.6)' : '#374151', fontSize: 14, marginBottom: 4 }}>
                      <Settings size={18} /> Settings
                    </button>
                  </Link>
                  <button onClick={() => { handleLogout(); setIsSidebarOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#f87171', fontSize: 14 }}>
                    <LogOut size={18} /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: darkMode ? 'rgba(187,247,208,0.5)' : '#6b7280', marginBottom: 12 }}>Sign in to access account shortcuts</p>
                  <Link href="/landing/login" onClick={() => setIsSidebarOpen(false)}>
                    <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', background: 'linear-gradient(to right, #16a34a, #059669)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
                      <User size={18} /> Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FIXED HEADER — position:fixed so it is ALWAYS on screen regardless of any parent overflow ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_H,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 12,
          paddingRight: 12,
          backgroundColor: darkMode ? '#0a0f0a' : '#f8faf8',
          borderBottom: darkMode ? '1px solid rgba(20,83,45,0.4)' : '1px solid #e5e7eb',
        }}
      >
        {/* Left: menu + dark mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
            style={{ padding: 8, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#86efac' : '#374151', display: 'flex', alignItems: 'center' }}
          >
            <Menu size={22} />
          </button>
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            style={{ padding: 8, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#4ade80' : '#374151', display: 'flex', alignItems: 'center' }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Centre: logo + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/smart gauge.png" alt="Smart Gauge Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: darkMode ? '#ffffff' : '#111827' }}>Smart Gauge</span>
        </div>

        {/* Right spacer to keep centre truly centred */}
        <div style={{ width: 80 }} />
      </div>

      {/* ── BODY — padded top by header height so nothing hides behind it ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          paddingTop: HEADER_H,
        }}
      >
        {/* Messages scroll area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', paddingTop: 44 }}>
          <div style={{ maxWidth: 768, margin: '0 auto' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: 80 }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: darkMode ? '#ffffff' : '#111827' }}>
                  Welcome to Smart Gauge
                </h2>
                <p style={{ fontSize: 16, color: darkMode ? 'rgba(187,247,208,0.4)' : '#9ca3af' }}>
                  Paste in your Solidity smart contract and let AI do the magic
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 24 }}
                >
                  <div style={{ position: 'relative', maxWidth: '82%' }} className="group">
                    <div
                      style={{
                        borderRadius: 20,
                        padding: '12px 18px',
                        background: message.sender === 'user'
                          ? 'linear-gradient(135deg, #16a34a, #059669)'
                          : darkMode ? '#0f1a0f' : '#ffffff',
                        border: message.sender === 'user' ? 'none' : darkMode ? '1px solid rgba(20,83,45,0.5)' : '1px solid #e5e7eb',
                        color: message.sender === 'user' ? '#ffffff' : darkMode ? '#bbf7d0' : '#111827',
                      }}
                    >
                      {message.sender === 'user' ? (
                        /* Plain text — no markdown, no formatting mangling */
                        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {message.text}
                        </p>
                      ) : (
                        /* AI response — full markdown + scrollable code blocks */
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words
                          prose-headings:font-bold prose-headings:mb-2
                          prose-p:mb-2 prose-p:leading-relaxed prose-p:text-sm
                          prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
                          prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4
                          prose-li:mb-1 prose-li:text-sm
                          prose-strong:font-semibold">
                          <ReactMarkdown
                            components={{
                              pre: ({ children }) => (
                                <div style={{
                                  overflowX: 'auto',
                                  WebkitOverflowScrolling: 'touch',
                                  borderRadius: 10,
                                  margin: '10px 0',
                                  backgroundColor: darkMode ? '#050a05' : '#f1f5f9',
                                  border: darkMode ? '1px solid rgba(20,83,45,0.5)' : '1px solid #e2e8f0',
                                }}>
                                  <pre style={{ margin: 0, padding: 12, width: 'max-content', minWidth: '100%', whiteSpace: 'pre', fontSize: 12, lineHeight: 1.6, color: darkMode ? '#86efac' : '#1e293b' }}>
                                    {children}
                                  </pre>
                                </div>
                              ),
                              code: ({ node, children, ...props }) => {
                                const isInline = node?.position?.start.line === node?.position?.end.line;
                                return isInline ? (
                                  <code style={{ padding: '2px 5px', borderRadius: 4, fontSize: 12, backgroundColor: darkMode ? 'rgba(20,83,45,0.4)' : '#f1f5f9', color: darkMode ? '#86efac' : '#334155' }} {...props}>{children}</code>
                                ) : (
                                  <code style={{ fontSize: 12, color: darkMode ? '#86efac' : '#1e293b' }} {...props}>{children}</code>
                                );
                              },
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      )}
                      <p style={{ margin: '6px 0 0', fontSize: 11, color: message.sender === 'user' ? 'rgba(255,255,255,0.6)' : darkMode ? 'rgba(20,83,45,0.8)' : '#9ca3af' }}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Copy button */}
                    <button
                      onClick={() => { navigator.clipboard.writeText(message.text); setCopiedId(message.id); setTimeout(() => setCopiedId(null), 2000); }}
                      style={{
                        position: 'absolute',
                        bottom: -10,
                        [message.sender === 'user' ? 'right' : 'left']: 8,
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                        border: 'none', cursor: 'pointer',
                        backgroundColor: message.sender === 'user' ? '#15803d' : darkMode ? '#0f1a0f' : '#f3f4f6',
                        color: message.sender === 'user' ? '#dcfce7' : darkMode ? 'rgba(187,247,208,0.5)' : '#4b5563',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      }}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    >
                      {copiedId === message.id ? <><Check size={11} />Copied</> : <><Copy size={11} />Copy</>}
                    </button>
                  </div>
                </motion.div>
              ))
            )}

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 24 }}>
                <div style={{ borderRadius: 20, padding: '14px 20px', backgroundColor: darkMode ? '#0a140a' : '#ffffff', border: darkMode ? '1px solid rgba(20,83,45,0.5)' : '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: darkMode ? '#4ade80' : '#64748b', animation: `bounce 1s ${i * 0.15}s infinite` }} className="animate-bounce" />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── INPUT AREA ── */}
        <div style={{ flexShrink: 0, padding: '12px 16px 16px', backgroundColor: darkMode ? '#0a0f0a' : '#f8faf8' }}>
          <div style={{ maxWidth: 768, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ borderRadius: 20, padding: '12px 16px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', backgroundColor: darkMode ? '#0f1a0f' : '#ffffff', border: darkMode ? '1px solid rgba(20,83,45,0.4)' : '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 10, color: darkMode ? '#6b7280' : '#64748b' }}>
                  Paste in your smart contract and AI does the magic:
                </label>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none',
                        opacity: isTyping ? 1 : 0, transition: 'opacity 0.5s',
                        background: 'linear-gradient(to right, rgba(34,197,94,0.08), rgba(52,211,153,0.08), rgba(34,197,94,0.08))',
                      }}
                    />
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="pragma solidity..."
                      rows={1}
                      className={`relative w-full min-h-[100px] max-h-68 pl-4 pr-32 py-3 rounded-2xl
                        bg-gradient-to-br from-primaryDark/40 via-primary/30 to-primaryLight/40
                        backdrop-blur-md resize-none overflow-hidden text-sm sm:text-base
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
                          className={`p-2 rounded-full ${darkMode ? 'bg-green-950/40' : 'bg-slate-200'} opacity-50 cursor-not-allowed`}
                        >
                          <Mic className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-green-200/40' : 'text-slate-500'}`} />
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
                        className={`relative p-2 rounded-full transition-all duration-300 ${
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
  )
}