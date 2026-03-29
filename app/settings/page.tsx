'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Key, User, LogOut, ChevronDown, Check, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Same static grid as login + profile pages
const StaticGrid = ({ isDark }: { isDark: boolean }) => (
  <div
    className="fixed inset-0 pointer-events-none z-0"
    style={{ background: isDark ? '#0a0f0a' : '#f8faf8' }}
  >
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
  { id: 'openai',    label: 'OpenAI',         hint: 'platform.openai.com/api-keys' },
  { id: 'gemini',    label: 'Google Gemini',   hint: 'aistudio.google.com' },
  { id: 'groq',      label: 'Groq',            hint: 'console.groq.com' },
  { id: 'anthropic', label: 'Anthropic',       hint: 'console.anthropic.com' },
];

type ToastType = 'success' | 'error';
interface Toast { message: string; type: ToastType; }

export default function SettingsPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true); // SSR-safe default

  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS[0]);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const [username, setUsername] = useState('john_dev');
  const [usernameSaved, setUsernameSaved] = useState(false);

  const [toast, setToast] = useState<Toast | null>(null);

  const isDark = darkMode;

  // SSR-safe: only read localStorage on the client after mount
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(stored ? stored === 'true' : prefersDark);
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
    localStorage.setItem(`apiKey_${selectedProvider.id}`, apiKey);
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

  const handleLogout = () => router.push('/');

  // ── Palette (mirrors login + profile pages) ──────────────────────────
  const pageBg     = isDark ? '#0a0f0a'  : '#f8faf8';
  const cardBg     = isDark ? '#0f1a0f'  : '#ffffff';
  const cardBorder = isDark ? 'rgba(20,83,45,0.4)' : 'rgba(229,231,235,1)';
  const textPrimary   = isDark ? '#ffffff'        : '#111827';
  const textMuted     = isDark ? 'rgba(187,247,208,0.4)' : '#6b7280';
  const labelColor    = isDark ? 'rgba(134,239,172,0.6)'  : '#6b7280';
  const inputBg       = isDark ? '#0a140a'  : '#f9fafb';
  const inputBorder   = isDark ? 'rgba(20,83,45,0.5)'  : '#e5e7eb';
  const inputFocus    = 'rgba(74,222,128,0.5)';
  const dividerColor  = isDark ? 'rgba(20,83,45,0.3)'  : '#f3f4f6';
  const rowHoverBg    = isDark ? 'rgba(20,83,45,0.2)'  : '#f9fafb';
  const dropdownBg    = isDark ? '#0f1a0f' : '#ffffff';
  const dropdownHover = isDark ? 'rgba(20,83,45,0.3)'  : '#f0fdf4';
  const navBg         = isDark ? 'rgba(10,15,10,0.92)' : 'rgba(248,250,248,0.92)';
  const navBorder     = isDark ? 'rgba(20,83,45,0.3)'  : 'rgba(229,231,235,0.6)';

  const cardStyle: React.CSSProperties = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: isDark
      ? '0 8px 40px rgba(0,0,0,0.5)'
      : '0 4px 24px rgba(0,0,0,0.06)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: textPrimary,
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, color: textPrimary, position: 'relative' }}>
      <StaticGrid isDark={isDark} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0,  x: '-50%' }}
            exit={{   opacity: 0, y: -20, x: '-50%' }}
            style={{
              position: 'fixed', top: '1.5rem', left: '50%', zIndex: 200,
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
              fontWeight: 600, fontSize: '0.875rem',
              background: toast.type === 'success' ? '#22c55e' : '#ef4444',
              color: '#fff',
              boxShadow: toast.type === 'success'
                ? '0 4px 20px rgba(34,197,94,0.4)'
                : '0 4px 20px rgba(239,68,68,0.4)',
            }}
          >
            {toast.type === 'success'
              ? <Check style={{ width: 16, height: 16 }} />
              : <AlertCircle style={{ width: 16, height: 16 }} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0.75rem 1.5rem',
        background: navBg,
        borderBottom: `1px solid ${navBorder}`,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
           <button
            onClick={() => router.back()}
            className={`text-sm font-medium underline underline-offset-2 transition-colors ${
              isDark ? 'text-green-400/70 hover:text-green-300' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Back
          </button>

          <h1 style={{ fontWeight: 700, fontSize: '1rem', color: textPrimary, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            Settings
          </h1>

          <button
            onClick={toggleDarkMode}
            style={{
              padding: '0.5rem', borderRadius: '0.75rem', cursor: 'pointer',
              background: isDark ? 'rgba(20,83,45,0.2)' : '#f3f4f6',
              border: `1px solid ${isDark ? 'rgba(20,83,45,0.4)' : '#e5e7eb'}`,
              color: isDark ? '#4ade80' : '#4b5563',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={{ position: 'relative', zIndex: 10, paddingTop: '6rem', paddingBottom: '4rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Section label */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4ade80', marginBottom: '0.25rem' }}>
              Configuration
            </p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: textPrimary }}>Your Preferences</h2>
          </motion.div>

          {/* ── AI Provider card ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={cardStyle}>
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Key style={{ width: 20, height: 20, color: '#4ade80' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: textPrimary }}>AI Provider</h3>
                <p style={{ fontSize: '0.75rem', color: textMuted }}>Connect your own API key</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Provider dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: labelColor, marginBottom: '0.5rem' }}>
                  Provider
                </label>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setProviderDropdownOpen(p => !p)}
                    style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 600, color: textPrimary }}>{selectedProvider.label}</span>
                    <motion.div animate={{ rotate: providerDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown style={{ width: 16, height: 16, color: textMuted }} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {providerDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0,  scaleY: 1 }}
                        exit={{   opacity: 0, y: -8, scaleY: 0.95 }}
                        style={{
                          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 50,
                          background: dropdownBg,
                          border: `1px solid ${cardBorder}`,
                          borderRadius: '0.75rem',
                          overflow: 'hidden',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                        }}
                      >
                        {AI_PROVIDERS.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => { setSelectedProvider(p); setProviderDropdownOpen(false); setApiKey(''); }}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '0.75rem 1rem', fontSize: '0.875rem', cursor: 'pointer', border: 'none',
                              background: selectedProvider.id === p.id ? dropdownHover : 'transparent',
                              color: selectedProvider.id === p.id ? '#4ade80' : textPrimary,
                              fontWeight: selectedProvider.id === p.id ? 600 : 400,
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = dropdownHover)}
                            onMouseLeave={e => (e.currentTarget.style.background = selectedProvider.id === p.id ? dropdownHover : 'transparent')}
                          >
                            {p.label}
                            {selectedProvider.id === p.id && <Check style={{ width: 14, height: 14 }} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* API Key input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: labelColor, marginBottom: '0.5rem' }}>
                  API Key
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder={`Enter your ${selectedProvider.label} API key`}
                    style={{ ...inputStyle, paddingRight: '3rem' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#4ade80'; e.currentTarget.style.boxShadow = `0 0 0 3px ${inputFocus}`; }}
                    onBlur={e  => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  <button
                    onClick={() => setShowKey(p => !p)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: textMuted, display: 'flex' }}
                  >
                    {showKey ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
                <p style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: textMuted }}>
                  Get your key at {selectedProvider.hint}
                </p>
              </div>

              {/* Save API key */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                <motion.button
                  onClick={handleSaveApiKey}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #16a34a, #22c55e, #4ade80)',
                    color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                    boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
                  }}
                >
                  {apiKeySaved ? <Check style={{ width: 16, height: 16 }} /> : <Save style={{ width: 16, height: 16 }} />}
                  {apiKeySaved ? 'Saved!' : 'Save API Key'}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── Profile card ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <User style={{ width: 20, height: 20, color: '#4ade80' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: textPrimary }}>Profile</h3>
                <p style={{ fontSize: '0.75rem', color: textMuted }}>Update your account details</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: labelColor, marginBottom: '0.5rem' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = '#4ade80'; e.currentTarget.style.boxShadow = `0 0 0 3px ${inputFocus}`; }}
                  onBlur={e  => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                <motion.button
                  onClick={handleSaveUsername}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #16a34a, #22c55e, #4ade80)',
                    color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                    boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
                  }}
                >
                  {usernameSaved ? <Check style={{ width: 16, height: 16 }} /> : <Save style={{ width: 16, height: 16 }} />}
                  {usernameSaved ? 'Saved!' : 'Update Profile'}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── Account / Logout card ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <LogOut style={{ width: 20, height: 20, color: '#ef4444' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: textPrimary }}>Account</h3>
                <p style={{ fontSize: '0.75rem', color: textMuted }}>Manage your session</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: textMuted }}>
                Signed in as{' '}
                <span style={{ fontWeight: 600, color: textPrimary }}>@{username}</span>
              </p>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.625rem 1.25rem', borderRadius: '0.75rem', cursor: 'pointer',
                  background: 'transparent',
                  border: `1px solid ${isDark ? 'rgba(239,68,68,0.4)' : '#fca5a5'}`,
                  color: '#ef4444', fontWeight: 600, fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut style={{ width: 16, height: 16 }} />
                Log out
              </motion.button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ textAlign: 'center', fontSize: '0.7rem', color: isDark ? 'rgba(20,83,45,0.8)' : '#9ca3af', paddingBottom: '1rem' }}
          >
            Smart Gauge · Your keys are stored locally and never shared
          </motion.p>

        </div>
      </main>
    </div>
  );
}