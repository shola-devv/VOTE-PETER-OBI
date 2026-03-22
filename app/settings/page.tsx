'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Key, User, LogOut, ChevronDown, Check, Eye, EyeOff, Save, AlertCircle, Braces } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Reused from landing page
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
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 opacity-50 dark:opacity-60">
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
            <div className="absolute inset-0 w-3 -translate-x-1/2 bg-gradient-to-b from-transparent via-green-200/90 to-transparent blur-lg" />
            <div className="absolute inset-0 w-1.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-green-200 to-transparent blur-md" />
            <div className="absolute inset-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-green-500 to-transparent" />
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
            <div className="absolute inset-0 h-3 -translate-y-1/2 bg-gradient-to-r from-transparent via-green-200/90 to-transparent blur-lg" />
            <div className="absolute inset-0 h-1.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-green-200 to-transparent blur-md" />
            <div className="absolute inset-0 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AI_PROVIDERS = [
  { id: 'openai', label: 'OpenAI', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'gemini', label: 'Google Gemini', models: ['gemini-2.0-flash', 'gemini-1.5-pro'] },
  { id: 'groq', label: 'Groq', models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'] },
  { id: 'anthropic', label: 'Anthropic', models: ['claude-3-5-sonnet', 'claude-3-haiku'] },
];

type ToastType = 'success' | 'error';

interface Toast {
  message: string;
  type: ToastType;
}

export default function SettingsPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  // AI API state
  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS[0]);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Profile state
  const [username, setUsername] = useState('john_dev');
  const [usernameSaved, setUsernameSaved] = useState(false);

  // Toast
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
      return next;
    });
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      showToast('Please enter an API key', 'error');
      return;
    }
    // Save to localStorage or your backend here
    localStorage.setItem(`apiKey_${selectedProvider.id}`, apiKey);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
    showToast(`${selectedProvider.label} API key saved`, 'success');
  };

  const handleSaveUsername = () => {
    if (!username.trim()) {
      showToast('Username cannot be empty', 'error');
      return;
    }
    setUsernameSaved(true);
    setTimeout(() => setUsernameSaved(false), 2000);
    showToast('Username updated successfully', 'success');
  };

  const handleLogout = () => {
    // Add your logout logic here
    router.push('/');
  };

  const cardClass = `
    relative bg-white/80 dark:bg-slate-800/60
    backdrop-blur-md
    border border-white/60 dark:border-slate-700/50
    rounded-2xl p-5 sm:p-6 md:p-8
    shadow-[8px_8px_24px_rgba(0,0,0,0.08),_-4px_-4px_16px_rgba(255,255,255,0.8)]
    dark:shadow-[8px_8px_24px_rgba(0,0,0,0.4),_-4px_-4px_16px_rgba(255,255,255,0.04)]
  `;

  const inputClass = `
    w-full px-4 py-3 rounded-xl
    bg-gradient-to-br from-green-900/30 via-green-800/20 to-emerald-900/30
    dark:from-green-900/40 dark:via-green-800/30 dark:to-emerald-900/40
    border border-green-500/20 dark:border-green-500/20
    text-slate-800 dark:text-white
    placeholder-slate-400 dark:placeholder-slate-500
    text-sm sm:text-base
    focus:outline-none focus:ring-2 focus:ring-green-400/40
    shadow-[inset_3px_3px_8px_rgba(0,0,0,0.08),_inset_-3px_-3px_8px_rgba(255,255,255,0.6)]
    dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),_inset_-3px_-3px_8px_rgba(255,255,255,0.05)]
    transition-all duration-200
  `;

  const btnPrimary = `
    flex items-center gap-2 px-5 py-2.5 rounded-xl
    bg-gradient-to-br from-green-700 via-green-500 to-emerald-400
    text-white font-semibold text-sm sm:text-base
    shadow-[4px_4px_12px_rgba(34,197,94,0.3),_-2px_-2px_8px_rgba(255,255,255,0.1)]
    hover:shadow-[6px_6px_16px_rgba(34,197,94,0.4)]
    active:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.2)]
    transition-all duration-200
  `;

  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${darkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      <AnimatedGrid darkMode={darkMode} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-6 left-1/2 z-[100] flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl text-sm font-medium
              ${toast.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
              }`}
          >
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-green-500 dark:hover:text-green-400 transition-colors">
            <img src="/smart gauge.png" alt="Smart Gauge" className="w-8 h-8 object-contain" />
            <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">Smart Gauge</span>
          </button>

          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white absolute left-1/2 -translate-x-1/2">
            Settings
          </h1>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-green-400 transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
          >
            {darkMode ? <Sun className="w-4 h-4 text-green-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Section label */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-500 mb-1">Configuration</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Your Preferences</h2>
          </motion.div>

          {/* ── AI API Section ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cardClass}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                <Key className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">AI Provider</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Connect your own API key</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Provider dropdown */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  AI Provider
                </label>
                <div className="relative">
                  <button
                    onClick={() => setProviderDropdownOpen(p => !p)}
                    className={`${inputClass} flex items-center justify-between cursor-pointer text-left`}
                  >
                    <span className="text-slate-800 dark:text-white font-medium">{selectedProvider.label}</span>
                    <motion.div animate={{ rotate: providerDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {providerDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden"
                      >
                        {AI_PROVIDERS.map((provider) => (
                          <button
                            key={provider.id}
                            onClick={() => { setSelectedProvider(provider); setProviderDropdownOpen(false); setApiKey(''); }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors
                              ${selectedProvider.id === provider.id ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}
                          >
                            {provider.label}
                            {selectedProvider.id === provider.id && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* API Key input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Enter your ${selectedProvider.label} API key`}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    onClick={() => setShowKey(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                  {selectedProvider.id === 'openai' && 'Get your key at platform.openai.com/api-keys'}
                  {selectedProvider.id === 'gemini' && 'Get your key at aistudio.google.com'}
                  {selectedProvider.id === 'groq' && 'Get your key at console.groq.com'}
                  {selectedProvider.id === 'anthropic' && 'Get your key at console.anthropic.com'}
                </p>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-1">
                <motion.button
                  onClick={handleSaveApiKey}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={btnPrimary}
                >
                  {apiKeySaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {apiKeySaved ? 'Saved!' : 'Save API Key'}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── Profile Section ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className={cardClass}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                <User className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">Profile</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end pt-1">
                <motion.button
                  onClick={handleSaveUsername}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={btnPrimary}
                >
                  {usernameSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {usernameSaved ? 'Saved!' : 'Update Profile'}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── Logout ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} className={cardClass}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">Account</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage your session</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Signed in as <span className="font-semibold text-slate-700 dark:text-slate-200">@{username}</span>
              </p>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                  border border-red-300 dark:border-red-700
                  text-red-500 dark:text-red-400
                  font-semibold text-sm sm:text-base
                  hover:bg-red-50 dark:hover:bg-red-900/20
                  active:bg-red-100 dark:active:bg-red-900/30
                  transition-all duration-200 w-full sm:w-auto justify-center"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </motion.button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-center text-xs text-slate-400 dark:text-slate-600 pb-4"
          >
            Smart Gauge · Your keys are stored locally and never shared
          </motion.p>

        </div>
      </main>
    </div>
  );
}