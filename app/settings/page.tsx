'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Key, User, LogOut, ChevronDown, Check, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const StaticGrid = ({ isDark }: { isDark: boolean }) => (
  <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? 'bg-[#0a0f0a]' : 'bg-[#f8faf8]'}`}>
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
        background: isDark
          ? 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
      }}
    />
    <div
      className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full"
      style={{
        background: isDark
          ? 'radial-gradient(circle, rgba(74,222,128,0.09) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)',
      }}
    />
  </div>
);

const AI_PROVIDERS = [
  { id: 'openai',    label: 'OpenAI',       hint: 'platform.openai.com/api-keys' },
  { id: 'gemini',    label: 'Google Gemini', hint: 'aistudio.google.com' },
  { id: 'groq',      label: 'Groq',         hint: 'console.groq.com' },
  { id: 'anthropic', label: 'Anthropic',    hint: 'console.anthropic.com' },
];

type ToastType = 'success' | 'error';
interface Toast { message: string; type: ToastType; }

function SettingsContent() {
  const router = useRouter();
  const [darkMode, setDarkMode]   = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS[0]);
  const [apiMode, setApiMode] = useState<'auto'|'custom'>('auto');
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [apiKey, setApiKey]       = useState('');
  const [showKey, setShowKey]     = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [username, setUsername]   = useState('john_dev');
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [toast, setToast]         = useState<Toast | null>(null);

  const isDark = darkMode;

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(stored ? stored === 'true' : prefersDark);

    const savedMode = localStorage.getItem('apiMode');
    setApiMode(savedMode === 'custom' ? 'custom' : 'auto');

    const savedProvider = localStorage.getItem('apiProvider');
    const provider = AI_PROVIDERS.find((p) => p.id === savedProvider) || AI_PROVIDERS[0];
    setSelectedProvider(provider);

    const savedKey = localStorage.getItem(`apiKey_${provider.id}`) || '';
    setApiKey(savedKey);
    setHasCustomKey(!!savedKey);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('darkMode', String(next));
      return next;
    });
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) { showToast('Please enter an API key', 'error'); return; }
    localStorage.setItem('apiProvider', selectedProvider.id);
    localStorage.setItem('apiMode', 'custom');
    localStorage.setItem(`apiKey_${selectedProvider.id}`, apiKey);
    setApiMode('custom');
    setHasCustomKey(true);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
    showToast(`${selectedProvider.label} API key saved`, 'success');
  };

  const handleSaveUsername = () => {
    if (!username.trim()) { showToast('Username cannot be empty', 'error'); return; }
    setUsernameSaved(true);
    setTimeout(() => setUsernameSaved(false), 2000);
    showToast('Username updated successfully', 'success');
  };

  // ── palette ──
  const textPrimary  = isDark ? 'text-white'         : 'text-gray-900';
  const textMuted    = isDark ? 'text-green-200/40'  : 'text-gray-400';
  const cardBg       = isDark ? 'bg-[#0f1a0f]'       : 'bg-white';
  const cardBorder   = isDark ? 'border-green-900/40': 'border-gray-200';
  const labelColor   = isDark ? 'text-green-300/60'  : 'text-gray-500';
  const inputBg      = isDark ? 'bg-[#0a140a]'       : 'bg-gray-50';
  const inputBorder  = isDark ? 'border-green-900/50': 'border-gray-200';
  const rowHover     = isDark ? 'hover:bg-green-950/40' : 'hover:bg-gray-50';
  const navBg        = isDark ? 'bg-[#0a0f0a]/90 border-green-900/30' : 'bg-[#f8faf8]/90 border-gray-200/60';
  const card         = `${cardBg} border ${cardBorder} rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]`;
  const inputClass   = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 ${inputBg} border ${inputBorder} ${textPrimary} focus:border-green-400 focus:ring-2 focus:ring-green-400/30`;
  const saveBtn      = `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-green-700 via-green-500 to-green-400 shadow-[0_4px_20px_rgba(34,197,94,0.35)] hover:opacity-90 active:scale-95 transition-all duration-150`;

  return (
    <div className={`min-h-screen overflow-y-auto ${isDark ? 'bg-[#0a0f0a]' : 'bg-[#f8faf8]'} ${textPrimary}`}>
      <StaticGrid isDark={isDark} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0,   x: '-50%' }}
            exit={{   opacity: 0, y: -20,  x: '-50%' }}
            className="fixed top-6 left-1/2 z-[200] flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white pointer-events-none"
            style={{
              background: toast.type === 'success' ? '#22c55e' : '#ef4444',
              boxShadow: toast.type === 'success' ? '0 4px 20px rgba(34,197,94,0.4)' : '0 4px 20px rgba(239,68,68,0.4)',
            }}
          >
            <AlertCircle className="w-4 h-4" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 border-b backdrop-blur-sm ${navBg}`}>
        <div className="max-w-lg mx-auto flex items-center justify-between relative">
          <button
            onClick={() => router.back()}
            className={`text-sm font-medium underline underline-offset-2 transition-colors ${
              isDark ? 'text-green-400/70 hover:text-green-300' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Back
          </button>

          <h1 className={`text-base font-bold absolute left-1/2 -translate-x-1/2 ${textPrimary}`}>
            Settings
          </h1>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl border transition-all duration-200 ${
              isDark
                ? 'bg-green-900/20 border-green-900/40 hover:bg-green-900/40 text-green-400'
                : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-600'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Page content — natural document scroll */}
      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-lg mx-auto space-y-4">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <p className="text-[11px] font-bold tracking-widest uppercase text-green-400 mb-1">Configuration</p>
            <h2 className={`text-2xl font-extrabold ${textPrimary}`}>Your Preferences</h2>
          </motion.div>

          <div className={`flex items-center justify-between p-4 rounded-xl border ${cardBorder} ${cardBg}`}>
            <span className={`text-xs font-semibold ${textPrimary}`}>API mode</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setApiMode('auto'); localStorage.setItem('apiMode', 'auto'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${apiMode === 'auto' ? 'bg-green-600 text-white border-green-500' : 'bg-transparent text-gray-500 border-gray-300 hover:bg-gray-100'}`}
              >Auto</button>
              <button
                onClick={() => { setApiMode('custom'); localStorage.setItem('apiMode', 'custom'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${apiMode === 'custom' ? 'bg-green-600 text-white border-green-500' : 'bg-transparent text-gray-500 border-gray-300 hover:bg-gray-100'}`}
              >Custom key</button>
            </div>
          </div>

          {/* ── AI Provider card ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`${card} p-5 sm:p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                <Key className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${textPrimary}`}>AI Provider</h3>
                <p className={`text-xs mt-0.5 ${textMuted}`}>Connect your own API key</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Provider dropdown */}
              <div>
                <label className={`block text-[11px] font-bold tracking-widest uppercase mb-2 ${labelColor}`}>Provider</label>
                <div className="relative">
                  <button
                    onClick={() => setProviderDropdownOpen(p => !p)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm border transition-all duration-200 ${inputBg} ${inputBorder} border ${textPrimary} focus:border-green-400`}
                  >
                    <span className="font-semibold">{selectedProvider.label}</span>
                    <motion.div animate={{ rotate: providerDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className={`w-4 h-4 ${isDark ? 'text-green-200/40' : 'text-gray-400'}`} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {providerDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0,  scaleY: 1 }}
                        exit={{   opacity: 0, y: -6, scaleY: 0.95 }}
                        className={`absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-xl overflow-hidden border shadow-2xl ${
                          isDark ? 'bg-[#0f1a0f] border-green-900/40' : 'bg-white border-gray-200'
                        }`}
                      >
                        {AI_PROVIDERS.map(p => (
                          <button
                            key={p.id}
                            onClick={() => { setSelectedProvider(p); setProviderDropdownOpen(false); setApiKey(''); }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                              selectedProvider.id === p.id
                                ? isDark ? 'bg-green-950/50 text-green-400 font-semibold' : 'bg-green-50 text-green-600 font-semibold'
                                : `${textPrimary} ${rowHover}`
                            }`}
                          >
                            {p.label}
                            {selectedProvider.id === p.id && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className={`block text-[11px] font-bold tracking-widest uppercase mb-2 ${labelColor}`}>API Key</label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder={`Enter your ${selectedProvider.label} API key`}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    onClick={() => setShowKey(p => !p)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${isDark ? 'text-green-200/40 hover:text-green-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className={`text-[11px] mt-1.5 ${textMuted}`}>Get your key at {selectedProvider.hint}</p>
                <p className={`text-[11px] mt-1 ${textMuted}`}>
                  Active mode: {apiMode === 'custom' ? 'Custom API key (client)' : 'Auto server-provided API key'}
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <button onClick={handleSaveApiKey} className={saveBtn}>
                  {apiKeySaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {apiKeySaved ? 'Saved!' : 'Save API Key'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Profile card ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className={`${card} p-5 sm:p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                <User className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${textPrimary}`}>Profile</h3>
                <p className={`text-xs mt-0.5 ${textMuted}`}>Update your account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-[11px] font-bold tracking-widest uppercase mb-2 ${labelColor}`}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className={inputClass}
                />
              </div>
              <div className="flex justify-end pt-1">
                <button onClick={handleSaveUsername} className={saveBtn}>
                  {usernameSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {usernameSaved ? 'Saved!' : 'Update Profile'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Account card ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} className={`${card} p-5 sm:p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${textPrimary}`}>Account</h3>
                <p className={`text-xs mt-0.5 ${textMuted}`}>Manage your session</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`text-sm ${textMuted}`}>
                Signed in as <span className={`font-semibold ${textPrimary}`}>@{username}</span>
              </p>
              <button
                onClick={() => router.push('/')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 text-red-500 ${
                  isDark ? 'border-red-900/40 hover:bg-red-950/30' : 'border-red-200 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className={`text-center text-xs pt-2 ${isDark ? 'text-green-900' : 'text-gray-400'}`}
          >
            Smart Gauge · Your keys are stored locally and never shared
          </motion.p>

        </div>
      </main>
    </div>
  );
}

// ssr: false equivalent — wrap with dynamic so Next.js never SSR's this
export default dynamic(() => Promise.resolve(SettingsContent), { ssr: false });