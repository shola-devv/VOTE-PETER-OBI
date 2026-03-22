'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Key, LogOut, Trash2, ChevronRight, AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
        {gridLines.filter(l => !l.isHorizontal).map((line) => (
          <motion.div
            key={`v-${line.id}`}
            className="absolute top-0 bottom-0"
            style={{ left: `${line.position}%` }}
            initial={{ height: 0, top: '50%' }}
            animate={{ height: '100%', top: 0 }}
            transition={{ duration: 2, delay: line.delay, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 w-3 -translate-x-1/2 bg-gradient-to-b from-transparent via-green-200/90 to-transparent blur-lg" />
            <div className="absolute inset-0 w-1.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-green-200 to-transparent blur-md" />
            <div className="absolute inset-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-green-500 to-transparent" />
          </motion.div>
        ))}
        {gridLines.filter(l => l.isHorizontal).map((line) => (
          <motion.div
            key={`h-${line.id}`}
            className="absolute left-0 right-0"
            style={{ top: `${line.position}%` }}
            initial={{ width: 0, left: '50%' }}
            animate={{ width: '100%', left: 0 }}
            transition={{ duration: 2, delay: line.delay, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
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

// Delete confirmation modal
const DeleteModal = ({
  username,
  onConfirm,
  onCancel,
}: {
  username: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center px-4"
  >
    {/* Backdrop */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
    />

    {/* Modal */}
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8"
    >
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>

      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-1">
            Delete Account
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">@{username}</span>?
            This action is <span className="text-red-500 font-semibold">permanent</span> and cannot be undone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
              text-slate-700 dark:text-slate-300 font-semibold text-sm
              hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-2.5 rounded-xl
              bg-red-500 hover:bg-red-600 active:bg-red-700
              text-white font-semibold text-sm
              shadow-lg shadow-red-500/30
              transition-all duration-200"
          >
            Yes, delete it
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default function ProfilePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Replace with real auth data
  const username = 'john_dev';
  const email = 'john@example.com';
  const joinedDate = 'March 2025';

  // Check if user has a custom API key saved
  const hasApiKey = typeof window !== 'undefined' &&
    ['openai', 'gemini', 'groq', 'anthropic'].some(
      (p) => localStorage.getItem(`apiKey_${p}`)
    );

  useEffect(() => {
    const isDark =
      localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
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

  const handleLogout = () => {
    router.push('/');
  };

  const handleHome = () => {
    router.push('/home');
  };

  const handleDeleteAccount = () => {
    // Add your delete account logic here
    setShowDeleteModal(false);
    router.push('/');
  };

  const cardClass = `
    bg-white/80 dark:bg-slate-800/60
    backdrop-blur-md
    border border-white/60 dark:border-slate-700/50
    rounded-2xl
    shadow-[8px_8px_24px_rgba(0,0,0,0.08),_-4px_-4px_16px_rgba(255,255,255,0.8)]
    dark:shadow-[8px_8px_24px_rgba(0,0,0,0.4),_-4px_-4px_16px_rgba(255,255,255,0.04)]
  `;

  // Avatar initials
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${darkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      <AnimatedGrid darkMode={darkMode} />

      {/* Delete modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteModal
            username={username}
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-green-500 dark:hover:text-green-400 transition-colors"
          >
            <span className=" underline cursor:pointer">Back </span>
          </button>
         
          

          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white absolute left-1/2 -translate-x-1/2">
            Profile
          </h1>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-green-400 transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
          >
            {darkMode
              ? <Sun className="w-4 h-4 text-green-400" />
              : <Moon className="w-4 h-4 text-slate-600" />
            }
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-lg mx-auto space-y-4">

          {/* ── Avatar + Name card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`${cardClass} p-6 sm:p-8 flex flex-col items-center text-center gap-4`}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-500 via-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <span className="text-2xl sm:text-3xl font-bold text-white">{initials}</span>
              </div>
              {/* Online dot */}
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-900" />
            </div>

            {/* Name & email */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                @{username}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{email}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Member since {joinedDate}</p>
            </div>
          </motion.div>

          {/* ── API Key status ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className={`${cardClass} overflow-hidden`}
          >
            <button
              onClick={() => router.push('/settings')}
              className="w-full flex items-center gap-4 p-5 sm:p-6 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors group"
            >
              {/* Icon */}
              <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-colors
                ${hasApiKey
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-amber-500/10 border-amber-500/20'
                }`}
              >
                <Key className={`w-5 h-5 ${hasApiKey ? 'text-green-500' : 'text-amber-500'}`} />
              </div>

              {/* Text */}
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {hasApiKey ? 'Custom API key active' : 'No custom API key'}
                </p>
                <p className={`text-xs mt-0.5 ${hasApiKey ? 'text-green-500' : 'text-amber-500'}`}>
                  {hasApiKey
                    ? 'Your own key is being used'
                    : 'Tap to add your API key in Settings →'
                  }
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          </motion.div>

          {/* ── Actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.19 }}
            className={`${cardClass} divide-y divide-slate-100 dark:divide-slate-700/50 overflow-hidden`}
          >
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex-shrink-0">
                <LogOut className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Log out</p>
                <p className="text-xs text-slate-400 mt-0.5">Sign out of your account</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>

            {/* Delete account */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
            >
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-red-500">Delete account</p>
                <p className="text-xs text-red-400/70 mt-0.5">Permanently remove your account</p>
              </div>
              <ChevronRight className="w-4 h-4 text-red-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center text-xs text-slate-400 dark:text-slate-600 pt-2"
          >
            Smart Gauge · v1.0.0
          </motion.p>
        </div>
      </main>
    </div>
  );
}