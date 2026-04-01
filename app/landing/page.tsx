'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Paperclip, Mic, Send, Braces, Zap, BarChart3, Bot, Check, Menu, X } from 'lucide-react';
import Link from "next/link";

// Animated Grid Background Component
const AnimatedGrid = ({ darkMode }: { darkMode: boolean }) => {
  const [gridLines, setGridLines] = useState<Array<{
    id: number;
    isHorizontal: boolean;
    position: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const lines = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      isHorizontal: Math.random() > 0.5,
      position: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setGridLines(lines);
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${darkMode ? 'bg-surface' : 'bg-slate-900'}`}>
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: 'clamp(40px, 8vw, 100px) clamp(40px, 8vw, 100px)'
        }} />

        {gridLines.filter(line => !line.isHorizontal).map((line) => (
          <motion.div
            key={`v-${line.id}`}
            className="absolute top-0 bottom-0"
            style={{ left: `${line.position}%` }}
            initial={{ height: 0, top: '50%' }}
            animate={{ height: '100%', top: 0 }}
            transition={{ duration: 2, delay: line.delay, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 w-3 -translate-x-1/2 bg-linear-to-b from-transparent via-green-200/90 to-transparent blur-lg" />
            <div className="absolute inset-0 w-1.5 -translate-x-1/2 bg-linear-to-b from-transparent via-green-200 to-transparent blur-md" />
            <div className="absolute inset-0 w-0.75 -translate-x-1/2 bg-linear-to-b from-transparent via-green-300 to-transparent blur-sm" />
            <div className="absolute inset-0 w-0.5 -translate-x-1/2 bg-linear-to-b from-transparent via-green-500 to-transparent" />
          </motion.div>
        ))}

        {gridLines.filter(line => line.isHorizontal).map((line) => (
          <motion.div
            key={`h-${line.id}`}
            className="absolute left-0 right-0"
            style={{ top: `${line.position}%` }}
            initial={{ width: 0, left: '50%' }}
            animate={{ width: '100%', left: 0 }}
            transition={{ duration: 2, delay: line.delay, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 h-3 -translate-y-1/2 bg-linear-to-r from-transparent via-green-200/90 to-transparent blur-lg" />
            <div className="absolute inset-0 h-1.5 -translate-y-1/2 bg-linear-to-r from-transparent via-green-200 to-transparent blur-md" />
            <div className="absolute inset-0 h-0.75 -translate-y-1/2 bg-linear-to-r from-transparent via-green-300 to-transparent blur-sm" />
            <div className="absolute inset-0 h-0.5 -translate-y-1/2 bg-linear-to-r from-transparent via-green-500 to-transparent" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const controls = useAnimation();
  const router = useRouter();

  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const pricingRef = useRef<HTMLDivElement | null>(null);

  const isDark = !darkMode;

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const focusInput = () => {
    textareaRef.current?.focus();
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
    if (inputValue.trim()) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [inputValue]);

  useEffect(() => {
    if (showTooltip) {
      const timeout = setTimeout(() => setShowTooltip(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [showTooltip]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      setIsLoading(true);
      await controls.start({
        y: 1000,
        opacity: 0,
        transition: { duration: 0.8, ease: 'easeInOut' }
      });
      router.push(`/home?contract=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    // ✅ FIX 1: removed `overflow-y-auto` from root div — the page scrolls naturally.
    // The fixed AnimatedGrid sits behind everything via z-0; the content stacks above it.
    <div className={`transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-surface text-surfaceDark'
    }`} style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <style>{`html, body { overflow-y: auto !important; height: auto !important; }`}</style>
      <AnimatedGrid darkMode={darkMode} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b transition-colors duration-300 ${
        isDark ? 'bg-slate-900/95 border-slate-700/50' : 'bg-surface/95 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-auto">
          <div className="flex items-center space-x-2">
            <img src="/smart gauge.png" alt="Smart Gauge Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-contain flex-shrink-0" />
            <span className={`text-base sm:text-lg font-bold whitespace-nowrap ${isDark ? 'text-white' : 'text-surfaceDark'}`}>
              Smart Gauge
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToFeatures}
              className={`cursor-pointer hidden sm:inline-block font-medium text-sm sm:text-base transition-colors hover:text-primary ${
                isDark ? 'text-gray-300' : 'text-surfaceDark'
              }`}>
              Features
            </button>
            <button
              onClick={scrollToPricing}
              className={`cursor-pointer hidden sm:inline-block font-medium text-sm sm:text-base transition-colors hover:text-primary ${
                isDark ? 'text-gray-300' : 'text-surfaceDark'
              }`}>
              Pricing
            </button>
            <Link href='/landing/login'>
              <button className={`cursor-pointer hidden md:inline-block font-medium text-sm sm:text-base transition-colors hover:text-primary ${
                isDark ? 'text-gray-300' : 'text-surfaceDark'
              }`}>
                Log in
              </button>
            </Link>
            <button
              onClick={toggleDarkMode}
              className="cursor-pointer p-2.5 sm:p-2 rounded-neu shadow-neu hover:shadow-neuInset transition-all duration-300 active:shadow-neuInset"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5 sm:w-5 sm:h-5 text-primaryLight" /> : <Moon className="w-5 h-5 sm:w-5 sm:h-5 text-surfaceDark" />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="cursor-pointer p-2.5 sm:p-2 md:hidden rounded-neu shadow-neu hover:shadow-neuInset transition-all duration-300 active:shadow-neuInset"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={focusInput}
              className="cursor-pointer px-6 py-2 rounded-2xl hidden sm:inline-block
                bg-linear-to-br from-primaryDark via-primary via-green-400 to-primaryLight
                text-surfaceLight font-semibold text-sm sm:text-base md:text-lg transition-all duration-300
                shadow-[8px_8px_18px_rgba(0,0,0,0.35),_-8px_-8px_18px_rgba(255,255,255,0.25)]
                hover:shadow-[6px_6px_14px_rgba(0,0,0,0.3),_-6px_-6px_14px_rgba(255,255,255,0.2)]
                active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.35),_inset_-6px_-6px_12px_rgba(255,255,255,0.2)]">
              Start Building for free
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden mt-4 pb-4 border-t ${isDark ? 'border-slate-700/50' : 'border-gray-200/50'}`}
          >
            <div className="flex flex-col space-y-2 pt-4">
              <button
                onClick={() => { scrollToFeatures(); setIsMenuOpen(false); }}
                className={`cursor-pointer text-left font-medium text-sm transition-colors hover:text-primary ${
                  isDark ? 'text-gray-300' : 'text-surfaceDark'
                }`}>
                Features
              </button>
              <button
                onClick={() => { scrollToPricing(); setIsMenuOpen(false); }}
                className={`cursor-pointer text-left font-medium text-sm transition-colors hover:text-primary ${
                  isDark ? 'text-gray-300' : 'text-surfaceDark'
                }`}>
                Pricing
              </button>
              <Link href='/landing/login'>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`cursor-pointer text-left font-medium text-sm transition-colors hover:text-primary ${
                    isDark ? 'text-gray-300' : 'text-surfaceDark'
                  }`}>
                  Log in
                </button>
              </Link>
              <button
                onClick={() => { focusInput(); setIsMenuOpen(false); }}
                className="cursor-pointer mt-4 px-6 py-2 rounded-2xl
                  bg-linear-to-br from-primaryDark via-primary via-green-400 to-primaryLight
                  text-surfaceLight font-semibold text-sm transition-all duration-300
                  shadow-[8px_8px_18px_rgba(0,0,0,0.35),_-8px_-8px_18px_rgba(255,255,255,0.25)]
                  hover:shadow-[6px_6px_14px_rgba(0,0,0,0.3),_-6px_-6px_14px_rgba(255,255,255,0.2)]
                  active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.35),_inset_-6px_-6px_12px_rgba(255,255,255,0.2)]">
                Start Building for free
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ✅ FIX 2: <main> now wraps ALL page content — hero, features, and pricing.
           Previously </main> closed prematurely after the hero, orphaning the sections. */}
      <main style={{ position: 'relative', zIndex: 10, paddingTop: '6rem' }}>
        <div className="max-w-6xl mx-auto mt-8 sm:mt-12 pb-8 px-4 sm:px-6 lg:px-8">

          {/* Hero Text */}
          <div className="text-center mb-16 md:mb-8 lg:mb-16">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight px-4">
              <span className={isDark ? 'text-white' : 'text-surfaceDark'}>
                Understand what your smart contracts{' '}
              </span>
              <span className="relative inline-block">
                <motion.span
                  className="absolute -right-2 top-0 text-primary"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Braces className="text-green-400 w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-36 xl:h-36" />
                </motion.span>
              </span>
              <br />
              <span className={isDark ? 'text-white' : 'text-surfaceDark'}>
                Costs You Before you Deploy.
              </span>
            </h1>

            <div className="max-w-2xl mx-auto flex flex-col gap-2 mb-8">
              <div className="flex items-center justify-center p-2 sm:p-0">
                <p className={`text-sm sm:text-base md:text-lg font-semibold text-center ${isDark ? 'text-gray-300' : 'text-surfaceDark'}`}>
                  Instant gas estimates, complexity insights, and AI-driven gas optimisation suggestions
                </p>
              </div>
            </div>
          </div>

          {/* Input Box */}
          <motion.div animate={controls} className="max-w-3xl mx-auto relative">

            {/* Loading spinner — sits behind the card via z ordering */}
            
{isLoading && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
     {/* Outer slow ring */}
                <div className="absolute w-[110%] h-[110%] rounded-3xl border-2 border-green-400/20" style={{ animation: 'spin 3s linear infinite' }} />
                {/* Mid ring */}
                <div className="absolute w-[105%] h-[105%] rounded-3xl border border-green-400/30" style={{ animation: 'spin 2s linear infinite reverse' }} />
                {/* Glow ring — conic gradient spinner */}
                <div
                  className="absolute w-[108%] h-[108%] rounded-3xl"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, rgba(34,197,94,0.6) 40%, transparent 60%)',
                    animation: 'spin 1.2s linear infinite',
                    filter: 'blur(6px)',
                  }}
                />
                {/* Tight bright arc */}
                <div
                  className="absolute w-[104%] h-[104%] rounded-3xl"
                  style={{
                    background: 'conic-gradient(from 180deg, transparent 0%, rgba(74,222,128,0.9) 20%, transparent 35%)',
                    animation: 'spin 1.2s linear infinite',
                    filter: 'blur(2px)',
                  }}
                />
                {/* Corner sparkle dots */}
                {[0, 90, 180, 270].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-2 h-2 rounded-full bg-green-400"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${deg}deg) translateX(min(52%, 180px)) translateY(-50%)`,
                      animation: `pulse 1.2s ease-in-out infinite`,
                      animationDelay: `${deg / 360 * 1.2}s`,
                      boxShadow: '0 0 8px 2px rgba(74,222,128,0.8)',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Keyframes injected once */}
            <style>{`
              @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
            `}</style>
            <div className="absolute -left-8 sm:-left-16 md:-left-24 top-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 pointer-events-none hidden lg:block">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path d="M 150 10 Q 100 50, 100 100" stroke="currentColor" strokeWidth="20" fill="none" className="text-primaryLight opacity-60" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute -right-8 sm:-right-16 md:-right-24 bottom-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 pointer-events-none hidden lg:block">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path d="M 50 100 Q 100 150, 150 190" stroke="currentColor" strokeWidth="20" fill="none" className="text-primaryLight opacity-60" strokeLinecap="round" />
              </svg>
            </div>

           <div className={`relative rounded-2xl shadow-neu p-3 sm:p-4 md:p-6 mt-12 sm:mt-32 md:mt-8 lg:mt-24 transition-all duration-300 ${
  isDark ? 'bg-slate-800' : 'bg-surface'
}`} style={{ position: 'relative', zIndex: 1 }}>
              <label className={`block text-sm sm:text-base md:text-lg font-medium mb-4 ${isDark ? 'text-gray-300' : 'text-surfaceDark'}`}>
                paste in your smart contract and AI does the magic:
              </label>

              <div className="relative">
                <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${
                  isTyping ? "opacity-100 animate-pulse bg-linear-to-r from-primary/10 via-primaryLight/10 to-primary/10" : "opacity-0"
                }`} />

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
                    ${isDark ? 'text-white placeholder-gray-400' : 'text-surfaceDark placeholder-surfaceShadow'}
                  `}
                  onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSend(); }}
                />

                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <div className="relative">
                    <button disabled onClick={() => setShowTooltip("clip")} className="p-2 rounded-full shadow-neu opacity-50 cursor-not-allowed">
                      <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {showTooltip === "clip" && (
                      <div className="absolute bottom-12 right-0 bg-black text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">Coming soon</div>
                    )}
                  </div>
                  <div className="relative">
                    <button disabled onClick={() => setShowTooltip("mic")} className="p-2 rounded-full shadow-neu opacity-50 cursor-not-allowed">
                      <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {showTooltip === "mic" && (
                      <div className="absolute bottom-12 right-0 bg-black text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">Coming soon</div>
                    )}
                  </div>
                  <motion.button
                    onClick={handleSend}
                    whileHover={{ scale: inputValue.trim() ? 1.07 : 1 }}
                    whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
                    disabled={!inputValue.trim()}
                    className={`relative p-2 rounded-full transition-all duration-300
                      ${isDark ? 'bg-black' : 'bg-slate-900'}
                      ${inputValue.trim() ? "ring-2 ring-primaryLight/60 shadow-[0_0_20px_rgba(99,102,241,0.6)]" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <Send className="w-4 cursor-pointer h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`mt-8 sm:mt-12 text-center text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-surfaceDark'}`}
          >
            <p>Press <kbd className="px-2 py-1 shadow-neu rounded text-xs sm:text-sm">⌘</kbd> + <kbd className="px-2 py-1 shadow-neu rounded text-xs sm:text-sm">Enter</kbd> to send</p>
          </motion.div>
        </div>

        {/* ─── FEATURES SECTION ─── */}
        <section
          ref={featuresRef}
          className={`relative z-10 py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
            isDark ? 'bg-slate-800/60' : 'bg-white/60'
          } backdrop-blur-sm`}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-surfaceDark'}`}>
                Everything you need before you deploy
              </h2>
              <p className={`text-base sm:text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-surfaceDark/70'}`}>
                Stop guessing. Start knowing exactly what your contract will cost.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8 text-green-400" />,
                  title: "Instant Gas Estimates",
                  description: "Paste your Solidity contract and get accurate gas cost estimates in seconds — before you deploy a single line to mainnet.",
                },
                {
                  icon: <BarChart3 className="w-8 h-8 text-green-400" />,
                  title: "Complexity Insights",
                  description: "Understand which parts of your contract are gas-heavy and why. Get a breakdown of function-level complexity so you know exactly where the costs come from.",
                },
                {
                  icon: <Bot className="w-8 h-8 text-green-400" />,
                  title: "AI-Driven Optimisation",
                  description: "Let AI suggest concrete improvements to reduce your contract's gas footprint — powered by OpenAI or Gemini, your choice.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className={`rounded-2xl p-6 shadow-neu transition-colors duration-300 ${
                    isDark ? 'bg-slate-700/50' : 'bg-surface'
                  }`}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-surfaceDark'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-surfaceDark/70'}`}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING SECTION ─── */}
        <section
          ref={pricingRef}
          className={`relative z-10 py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-surfaceDark'}`}>
                Simple pricing
              </h2>
              <p className={`text-base sm:text-lg max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-surfaceDark/70'}`}>
                Start for free. Scale on your own terms.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free Tier */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-8 shadow-neu transition-colors duration-300 ${
                  isDark ? 'bg-slate-700/50' : 'bg-surface'
                }`}
              >
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-surfaceDark'}`}>Free</h3>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-surfaceDark'}`}>$0</span>
                    <span className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-surfaceDark/60'}`}>/month</span>
                  </div>
                  <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-surfaceDark/70'}`}>
                    Daily quota included — no credit card needed.
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Gas estimates",
                    "Complexity insights",
                    "AI optimisation suggestions",
                    "Daily usage quota",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-surfaceDark/80'}`}>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={focusInput}
                  className={`w-full cursor-pointer py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-neu hover:shadow-neuInset active:shadow-neuInset ${
                    isDark ? 'text-white' : 'text-surfaceDark'
                  }`}>
                  Get started free
                </button>
              </motion.div>

              {/* Unlimited Tier */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-8 transition-colors duration-300
                  bg-linear-to-br from-primaryDark via-primary to-primaryLight
                  shadow-[8px_8px_18px_rgba(0,0,0,0.35),_-8px_-8px_18px_rgba(255,255,255,0.15)]
                  relative overflow-hidden"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Unlimited
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1 text-white">Bring Your Own Key</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">Free</span>
                  </div>
                  <p className="text-sm mt-2 text-white/70">
                    Set your own OpenAI or Gemini API key and get unlimited access — no quotas, no limits.
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Free",
                    "Unlimited gas estimates",
                    "Unlimited AI suggestions",
                    "OpenAI or Gemini — your choice",
                    "Your key, your data",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>

 <Link href='/landing/login'>
                <button
                 
                  className="w-full py-3 cursor-pointer rounded-xl font-semibold text-sm  dark:text-slate-900 text-primary bg-white transition-all duration-300
                    shadow-[4px_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_6px_rgba(0,0,0,0.15)]
                    active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]">
                  Start with your key
                </button>
                 </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}