'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Key, LogOut, Trash2, ChevronRight, AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// Same static grid as login page — no animated lines
const StaticGrid = ({ isDark }: { isDark: boolean }) => (
  <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? 'bg-[#0a0f0a]' : 'bg-surface'}`}>
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
    {/* Ambient glow — top-left */}
    <div
      className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
      style={{
        background: isDark
          ? 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
      }}
    />
    {/* Ambient glow — bottom-right */}
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

const DeleteModal = ({
  username,
  isDark,
  onConfirm,
  onCancel,
}: {
  username: string;
  isDark: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center px-4"
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      className={`relative w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border ${
        isDark
          ? 'bg-[#0f1a0f] border-green-900/40'
          : 'bg-white border-gray-200'
      }`}
    >
      <button
        onClick={onCancel}
        className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
          isDark ? 'hover:bg-green-950/60 text-green-700 hover:text-green-400' : 'hover:bg-gray-100 text-gray-400'
        }`}
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
          isDark ? 'bg-red-950/50 border border-red-900/40' : 'bg-red-100'
        }`}>
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>

        <div>
          <h3 className={`text-lg sm:text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Delete Account
          </h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-green-200/50' : 'text-gray-500'}`}>
            Are you sure you want to delete{' '}
            <span className={`font-semibold ${isDark ? 'text-green-300/80' : 'text-gray-700'}`}>@{username}</span>?
            This action is <span className="text-red-500 font-semibold">permanent</span> and cannot be undone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <button
            onClick={onCancel}
            className={`flex-1 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-200 ${
              isDark
                ? 'border-green-900/40 text-green-300/70 hover:bg-green-950/60 hover:border-green-700/50'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold text-sm shadow-lg shadow-red-500/30 transition-all duration-200"
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
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [joinedDate, setJoinedDate] = useState('Loading...');

  const username = session?.user?.name || '...';
  const email = session?.user?.email || '...';
  const initials = username.slice(0, 2).toUpperCase();
  const [hasApiKey, setHasApiKey] = useState(false);
  

  const isDark = darkMode;

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'true' : prefersDark;
    setDarkMode(dark);
  }, []);

useEffect(() => {
  const stored = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = stored ? stored === 'true' : prefersDark;
  setDarkMode(dark);

  // ← add this
  const keyFound = ['openai', 'gemini', 'groq', 'anthropic'].some(
    (p) => localStorage.getItem(`apiKey_${p}`)
  );
  setHasApiKey(keyFound);
}, []);

useEffect(() => {
  if ((session?.user as any)?.id) {
    fetch(`/api/auth/users/${(session.user as any).id}`)
      .then(res => res.json())
      .then(data => {
        if (data.user?.createdAt) {
          const date = new Date(data.user.createdAt);
          setJoinedDate(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }));
        }
      })
      .catch(err => {
        console.error('Failed to fetch user data:', err);
        setJoinedDate('Unknown');
      });
  }
}, [session]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('darkMode', String(next));
      return next;
    });
  };

  const handleLogout = () => router.push('/');
  const handleDeleteAccount = () => { setShowDeleteModal(false); router.push('/'); };

  // Shard token classes from login page palette
  const pageBg    = isDark ? 'bg-[#0a0f0a]'   : 'bg-[#f8faf8]';
  const cardBg    = isDark ? 'bg-[#0f1a0f]'   : 'bg-white';
  const cardBorder = isDark ? 'border-green-900/40' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white'    : 'text-gray-900';
  const textMuted   = isDark ? 'text-green-200/50' : 'text-gray-400';
  const divider   = isDark ? 'divide-green-900/30' : 'divide-gray-100';
  const rowHover  = isDark ? 'hover:bg-green-950/40' : 'hover:bg-gray-50';

  const card = `${cardBg} border ${cardBorder} rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]`;

  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${pageBg} ${textPrimary}`}>
      <StaticGrid isDark={isDark} />

      <AnimatePresence>
        {showDeleteModal && (
          <DeleteModal
            username={username}
            isDark={isDark}
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 border-b backdrop-blur-sm ${
        isDark
          ? 'bg-[#0a0f0a]/90 border-green-900/30'
          : 'bg-surface/90 border-gray-200/60'
      }`}>
        <div className="max-w-lg mx-auto flex items-center justify-between relative">
          <button
            onClick={() => router.back()}
            className={`text-sm font-medium underline underline-offset-2 transition-colors ${
              isDark ? 'text-green-400/70 hover:text-green-300' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Back
          </button>

          <h1 className={`text-base sm:text-lg font-bold absolute left-1/2 -translate-x-1/2 ${textPrimary}`}>
            Profile
          </h1>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-all duration-200 border ${
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

      {/* Content */}
      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-lg mx-auto space-y-4">

          {/* Avatar + Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`${card} p-6 sm:p-8 flex flex-col items-center text-center gap-4`}
          >
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-600 via-green-500 to-green-400 flex items-center justify-center shadow-[0_0_32px_rgba(34,197,94,0.4)]">
                <span className="text-2xl sm:text-3xl font-bold text-white">{initials}</span>
              </div>
              {/* Online dot */}
              <span className={`absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 ${
                isDark ? 'border-[#0f1a0f]' : 'border-white'
              } shadow-[0_0_8px_rgba(74,222,128,0.8)]`} />
            </div>

            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
                @{username}
              </h2>
              <p className={`text-sm mt-0.5 ${textMuted}`}>{email}</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-green-900' : 'text-gray-400'}`}>
                Member since {joinedDate}
              </p>
            </div>
          </motion.div>

          {/* API Key status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className={`${card} overflow-hidden`}
          >
            <button
              onClick={() => router.push('/settings')}
              className={`w-full flex items-center gap-4 p-5 sm:p-6 transition-colors group ${rowHover}`}
            >
              <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-colors ${
                hasApiKey
                  ? isDark ? 'bg-green-950/60 border-green-700/40' : 'bg-green-500/10 border-green-500/20'
                  : isDark ? 'bg-yellow-950/40 border-yellow-800/30' : 'bg-amber-500/10 border-amber-500/20'
              }`}>
                <Key className={`w-5 h-5 ${hasApiKey ? 'text-green-400' : 'text-yellow-500'}`} />
              </div>

              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold ${textPrimary}`}>
                  {hasApiKey ? 'Custom API key active' : 'No custom API key'}
                </p>
                <p className={`text-xs mt-0.5 ${hasApiKey ? 'text-green-500' : 'text-yellow-500'}`}>
                  {hasApiKey ? 'Your own key is being used' : 'Tap to add your API key in Settings →'}
                </p>
              </div>

              <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all group-hover:translate-x-0.5 ${
                isDark ? 'text-green-800 group-hover:text-green-400' : 'text-gray-300 group-hover:text-green-500'
              }`} />
            </button>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.19 }}
            className={`${card} divide-y ${divider} overflow-hidden`}
          >
            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 px-5 sm:px-6 py-4 transition-colors group ${rowHover}`}
            >
              <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
                isDark
                  ? 'bg-[#0a140a] border-green-900/40'
                  : 'bg-gray-100 border-gray-200'
              }`}>
                <LogOut className={`w-5 h-5 ${isDark ? 'text-green-700' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold ${textPrimary}`}>Log out</p>
                <p className={`text-xs mt-0.5 ${textMuted}`}>Sign out of your account</p>
              </div>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all group-hover:translate-x-0.5 ${
                isDark ? 'text-green-900 group-hover:text-green-400' : 'text-gray-300 group-hover:text-gray-500'
              }`} />
            </button>

            {/* Delete account */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className={`w-full flex items-center gap-4 px-5 sm:px-6 py-4 transition-colors group ${
                isDark ? 'hover:bg-red-950/30' : 'hover:bg-red-50'
              }`}
            >
              <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
                isDark ? 'bg-red-950/40 border-red-900/30' : 'bg-red-50 border-red-200'
              }`}>
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-red-500">Delete account</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-red-800' : 'text-red-400/70'}`}>
                  Permanently remove your account
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-red-800 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className={`text-center text-xs pt-2 ${
              isDark ? 'text-green-900' : 'text-gray-400'
            }`}
          >
            Smart Gauge · v1.0.0
          </motion.p>
        </div>
      </main>
    </div>
  );
}