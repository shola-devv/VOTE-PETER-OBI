'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Paperclip, Mic, Send, Braces } from 'lucide-react';

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
    const lines = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      isHorizontal: Math.random() > 0.5,
      position: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setGridLines(lines);
    // auto darkmode here

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

        {/* Animated Vertical lines */}
        {gridLines.filter(line => !line.isHorizontal).map((line) => (
          <motion.div
            key={`v-${line.id}`}
            className="absolute top-0 bottom-0"
            style={{ left: `${line.position}%` }}
            initial={{ height: 0, top: '50%' }}
            animate={{ 
              height: '100%',
              top: 0,
            }}
            transition={{
              duration: 2,
              delay: line.delay,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut"
            }}
          >
            {/* Outer glow effect - brighter with green-200 */}
            <div className="absolute inset-0 w-[12px] -translate-x-1/2 bg-gradient-to-b from-transparent via-green-200/90 to-transparent blur-lg" />
            {/* Middle glow - brighter */}
            <div className="absolute inset-0 w-[6px] -translate-x-1/2 bg-gradient-to-b from-transparent via-green-200 to-transparent blur-md" />
            {/* Inner glow - bright */}
            <div className="absolute inset-0 w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-green-300 to-transparent blur-sm" />
            {/* Main line - green-500 core */}
            <div className="absolute inset-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-green-500 to-transparent" />
          </motion.div>
        ))}

        {/* Animated Horizontal lines */}
        {gridLines.filter(line => line.isHorizontal).map((line) => (
          <motion.div
            key={`h-${line.id}`}
            className="absolute left-0 right-0"
            style={{ top: `${line.position}%` }}
            initial={{ width: 0, left: '50%' }}
            animate={{ 
              width: '100%',
              left: 0,
            }}
            transition={{
              duration: 2,
              delay: line.delay,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut"
            }}
          >
            {/* Outer glow effect - brighter with green-200 */}
            <div className="absolute inset-0 h-[12px] -translate-y-1/2 bg-gradient-to-r from-transparent via-green-200/90 to-transparent blur-lg" />
            {/* Middle glow - brighter */}
            <div className="absolute inset-0 h-[6px] -translate-y-1/2 bg-gradient-to-r from-transparent via-green-200 to-transparent blur-md" />
            {/* Inner glow - bright */}
            <div className="absolute inset-0 h-[3px] -translate-y-1/2 bg-gradient-to-r from-transparent via-green-300 to-transparent blur-sm" />
            {/* Main line - green-500 core */}
            <div className="absolute inset-0 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
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
const textareaRef = useRef<HTMLTextAreaElement | null>(null);

//auto darkmode
useEffect(()=>{setDarkMode(!darkMode)}, [])
useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
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
      // Animate the input box floating down
      await controls.start({
        y: 1000,
        opacity: 0,
        transition: { duration: 0.8, ease: 'easeInOut' }
      });
      
      // Navigate to home page
      router.push('/home');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };



  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${
      darkMode ? 'dark bg-slate-900 text-white' : 'bg-surface'
    }`}>
      {/* Animated Grid Background */}
      <AnimatedGrid darkMode={darkMode} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-2 sm:py-4 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* Logo Image */}
            <img 
              src="/smart gauge.png" 
              alt="Smart Gauge Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-contain"
            />
            {/* Brand Text */}
            <span className="text-sm sm:text-lg font-bold bg-gradient-to-r from-primary to-primaryDark bg-clip-text dark:text-white">
              Smart Gauge
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            <button className="cursor-pointer hidden sm:inline-block text-surfaceDark dark:text-gray-300 hover:text-primary dark:hover:text-primaryLight transition-colors font-medium text-sm sm:text-base">
              Features
            </button>
            <button className="cursor-pointer hidden sm:inline-block text-surfaceDark dark:text-gray-300 hover:text-primary dark:hover:text-primaryLight transition-colors font-medium text-sm sm:text-base">
              Pricing
            </button>
            <button className="cursor-pointer hidden md:inline-block text-surfaceDark dark:text-gray-300 hover:text-primary dark:hover:text-primaryLight transition-colors font-medium text-sm sm:text-base">
              Log in
            </button>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="cursor-pointer p-2 rounded-neu shadow-neu dark:shadow-neuDark hover:shadow-neuInset dark:hover:shadow-neuInsetDark transition-all duration-300 active:shadow-neuInset dark:active:shadow-neuInsetDark"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-primaryLight" />
              ) : (
                <Moon className="w-5 h-5 text-surfaceDark" />
              )}
            </button>

            <button className="
    cursor-pointer
    px-6 py-2
    rounded-2xl
    bg-gradient-to-br from-primaryDark via-primary via-green-400 to-primaryLight
    text-surfaceLight
    font-semibold
    text-sm sm:text-base md:text-lg
    transition-all duration-300

    shadow-[8px_8px_18px_rgba(0,0,0,0.35),_-8px_-8px_18px_rgba(255,255,255,0.25)]
    
    hover:shadow-[6px_6px_14px_rgba(0,0,0,0.3),_-6px_-6px_14px_rgba(255,255,255,0.2)]
    
    active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.35),_inset_-6px_-6px_12px_rgba(255,255,255,0.2)]">
              Start Building for free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 mt-12 sm:mb-8 md:mb-8 lg:mb-8 pb-8 sm:pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-32">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight px-4">
              <span className="text-surfaceDark dark:text-white">Understand what your smart contracts </span>
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
              <span className="text-surfaceDark  dark:text-white">Costs You Before you Deploy.</span>
            </h1>
            
            <div className="max-w-2xl mx-auto flex flex-col gap-2 mb-8">
              <div className="flex items-center justify-center p-2 sm:p-0">
                <p className="text-sm sm:text-base md:text-lg lg:text-lg text-surfaceDark  dark:text-gray-300 font-semibold text-center">
                  Instant gas estimates, complexity insights, and AI-driven gas optimisation suggestions
                </p>
              </div>
              
            </div>
          </div>

          {/* Input Box with Animation */}
<motion.div
  animate={controls}
  className="max-w-3xl mx-auto relative"
>
  {/* Decorative curved line - left */}
  <div className="absolute -left-8 sm:-left-16 md:-left-24 top-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 pointer-events-none hidden lg:block">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <path
        d="M 150 10 Q 100 50, 100 100"
        stroke="currentColor"
        strokeWidth="20"
        fill="none"
        className="text-primaryLight opacity-60"
        strokeLinecap="round"
      />
    </svg>
  </div>

  {/* Decorative curved line - right */}
  <div className="absolute -right-8 sm:-right-16 md:-right-24 bottom-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 pointer-events-none hidden lg:block">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <path
        d="M 50 100 Q 100 150, 150 190"
        stroke="currentColor"
        strokeWidth="20"
        fill="none"
        className="text-primaryLight opacity-60"
        strokeLinecap="round"
      />
    </svg>
  </div>

  {/* Input Container */}
  <div className="relative bg-surface dark:bg-slate-800  bg-transparent rounded-neu shadow-neu dark:shadow-neuDark p-3 sm:p-4 md:p-6  mt-12 sm:mt-32 md:mt-32 lg:mt-36 transition-all duration-300 rounded-2xl">

    <label className="block text-sm sm:text-base md:text-lg font-medium  text-surfaceDark dark:text-gray-300 mb-4 ">
      paste in your smart contract and AI does the magic:
    </label>

    {/* Input Wrapper */}
    <div className="relative">

      {/* AI Pulse */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500  ${
          isTyping
            ? "opacity-100 animate-pulse bg-gradient-to-r from-primary/10 via-primaryLight/10 to-primary/10"
            : "opacity-0"
        }`}
      />

      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="pragma solidity..."
        rows={1}
        className="  relative
    w-full
    min-h-[100px]
    max-h-68
    pl-4 pr-32 py-3
    rounded-2xl
    bg-gradient-to-br 
      from-primaryDark/40 via-primary/30 to-primaryLight/40
    backdrop-blur-md
    light:bg-white/20
    light:backdrop-blur-sm
    resize-none
    overflow-hidden
    text-surfaceDark dark:text-white
    placeholder-surfaceShadow dark:placeholder-gray-400
    text-sm sm:text-base
    transition-all duration-300
    focus:outline-none
    shadow-[8px_8px_18px_rgba(0,0,0,0.35),_-8px_-8px_18px_rgba(255,255,255,0.15)]
    focus:shadow-[inset_6px_6px_14px_rgba(0,0,0,0.4),_inset_-6px_-6px_14px_rgba(255,255,255,0.15)] "
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey) {
            handleSend();
          }
        }}
      />

      {/* ICON ROW */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">

        {/* Paperclip */}
        <div className="relative group">
          <button
            disabled
            onClick={() => setShowTooltip("clip")}
            className="p-2 rounded-full shadow-neu dark:shadow-neuDark opacity-50 cursor-not-allowed"
          >
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {(showTooltip === "clip") && (
            <div className="absolute bottom-12 right-0 bg-black text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
              Coming soon
            </div>
          )}
        </div>

        {/* Mic */}
        <div className="relative group">
          <button
            disabled
            onClick={() => setShowTooltip("mic")}
            className="p-2 rounded-full shadow-neu dark:shadow-neuDark opacity-50 cursor-not-allowed"
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {(showTooltip === "mic") && (
            <div className="absolute bottom-12 right-0 bg-black text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
              Coming soon
            </div>
          )}
        </div>

        {/* Send Button */}
        <motion.button
          onClick={handleSend}
          whileHover={{ scale: inputValue.trim() ? 1.07 : 1 }}
          whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
          disabled={!inputValue.trim()}
          className={`
            relative p-2 rounded-full
            bg-slate-900 dark:bg-black
            transition-all duration-300
            ${
              inputValue.trim()
                ? "ring-2 ring-primaryLight/60 shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                : "opacity-50 cursor-not-allowed"
            }
          `}
        >
          <Send className="w-4 cursor-pointer h-4 sm:w-5 sm:h-5 text-white" />
        </motion.button>

      </div>
    </div>
  </div>
</motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-surfaceDark dark:text-gray-400"
          >
            <p>Press <kbd className="px-2 py-1 shadow-neu dark:shadow-neuDark rounded text-xs sm:text-sm">⌘</kbd> + <kbd className="px-2 py-1 shadow-neu dark:shadow-neuDark rounded text-xs sm:text-sm">Enter</kbd> to send</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}