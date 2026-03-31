'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Eye, EyeOff, Braces, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Static grid background — no animated lines, just the grid mesh + a single soft glow
const StaticGrid = ({ isDark }: { isDark: boolean }) => (
  <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? 'bg-[#0a0f0a]' : 'bg-surface'}`}>
    {/* Grid lines */}
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
    {/* Ambient green glow — top-left */}
    <div
      className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
      style={{
        background: isDark
          ? 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
      }}
    />
    {/* Ambient green glow — bottom-right */}
    <div
      className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
      style={{
        background: isDark
          ? 'radial-gradient(circle, rgba(74,222,128,0.09) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)',
      }}
    />
  </div>
);

type Mode = 'login' | 'signup';

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(true); // default dark for this page
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const router = useRouter();
  const isDark = darkMode;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setStatusMessage('Fill in email and password');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload: any = { email: email.trim().toLowerCase(), password };
      if (mode === 'signup') payload.username = email.split('@')[0] || 'User';

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatusMessage(data.message || 'Authentication failed');
        setIsSubmitting(false);
        return;
      }

      // Store a lightweight session indicator for client routing/authorization
      if (data.user) {
        localStorage.setItem('smartgauge_user', JSON.stringify(data.user));
        localStorage.setItem('smartgauge_logged_in', 'true');
      }

      setStatusMessage(data.message || 'Success! Redirecting...');
      setTimeout(() => router.push('/home'), 500);
    } catch (err: any) {
      console.error('Auth error', err);
      setStatusMessage(err?.message || 'Error during auth');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setEmail('');
    setPassword('');
  };

  // dark base: deep forest-black, not slate/ash
  const bg = isDark ? 'bg-[#0a0f0a]' : 'bg-surface';
  const cardBg = isDark ? 'bg-[#0f1a0f]' : 'bg-white';
  const cardBorder = isDark ? 'border border-green-900/40' : 'border border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-green-200/50' : 'text-gray-400';
  const inputBg = isDark ? 'bg-[#0a140a]' : 'bg-gray-50';
  const inputBorder = isDark ? 'border-green-900/50' : 'border-gray-200';
  const inputFocusBorder = 'border-green-400';
  const inputText = isDark ? 'text-green-100' : 'text-gray-900';
  const inputPlaceholder = isDark ? 'placeholder-green-900' : 'placeholder-gray-400';
  const labelColor = isDark ? 'text-green-300/70' : 'text-gray-500';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 relative ${bg} ${textPrimary}`}>
      <StaticGrid isDark={isDark} />

      {/* Nav */}
      <nav className={`relative z-50 px-6 py-4 flex items-center justify-between border-b ${
        isDark ? 'border-green-900/30 bg-[#0a0f0a]/90' : 'border-gray-200/60 bg-surface/90'
      } backdrop-blur-sm`}>
        <Link href="/landing" className="flex items-center gap-2 group">
          <img
            src="/smart gauge.png"
            alt="Smart Gauge"
            className="w-8 h-8 object-contain"
          />
          <span className={`font-bold text-sm sm:text-base transition-colors ${
            isDark ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'
          }`}>
            Smart Gauge
          </span>
        </Link>

        <button
          onClick={() => setDarkMode((p) => !p)}
          className={`p-2 rounded-xl transition-all duration-300 ${
            isDark
              ? 'bg-green-900/20 border border-green-900/40 hover:bg-green-900/40 text-green-400'
              : 'bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-600'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-green-950/60 border border-green-900/40' : 'bg-green-50 border border-green-100'}`}>
                <motion.span
                                  className="absolute"
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                >
 <Braces className="w-7 h-7 text-green-400" />

                                </motion.span>
               
              </div>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-1 ${textPrimary}`}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className={`text-sm ${textMuted}`}>
              {mode === 'login'
                ? 'Sign in to continue analysing your contracts'
                : 'Start estimating gas costs in seconds'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className={`relative flex rounded-xl p-1 mb-6 ${isDark ? 'bg-[#0a140a] border border-green-900/30' : 'bg-gray-100 border border-gray-200'}`}>
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`relative flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 z-10 ${
                  mode === m
                    ? isDark ? 'text-white' : 'text-gray-900'
                    : isDark ? 'text-green-700 hover:text-green-400' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="tab-bg"
                    className={`absolute inset-0 rounded-lg ${
                      isDark
                        ? 'bg-green-900/50 border border-green-700/40 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10 capitalize">{m === 'login' ? 'Log in' : 'Sign up'}</span>
              </button>
            ))}
          </div>

          {/* Card */}
          <div className={`rounded-2xl p-6 sm:p-8 ${cardBg} ${cardBorder} shadow-[0_8px_40px_rgba(0,0,0,0.4)]`}>
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: mode === 'login' ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'login' ? 12 : -12 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ${labelColor}`}>
                    Email
                  </label>
                  <div className={`relative rounded-xl border transition-all duration-200 ${
                    focusedField === 'email' ? inputFocusBorder : inputBorder
                  } ${inputBg}`}>
                    {focusedField === 'email' && (
                      <div className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{ boxShadow: '0 0 0 3px rgba(34,197,94,0.12)' }} />
                    )}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      required
                      className={`w-full bg-transparent px-4 py-3 text-sm rounded-xl focus:outline-none ${inputText} ${inputPlaceholder}`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs font-semibold uppercase tracking-widest ${labelColor}`}>
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        className={`text-xs transition-colors ${
                          isDark ? 'text-green-500 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className={`relative rounded-xl border transition-all duration-200 ${
                    focusedField === 'password' ? inputFocusBorder : inputBorder
                  } ${inputBg}`}>
                    {focusedField === 'password' && (
                      <div className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{ boxShadow: '0 0 0 3px rgba(34,197,94,0.12)' }} />
                    )}
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                      required
                      className={`w-full bg-transparent pl-4 pr-12 py-3 text-sm rounded-xl focus:outline-none ${inputText} ${inputPlaceholder}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors ${
                        isDark ? 'text-green-700 hover:text-green-400' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength bar for signup */}
                  {mode === 'signup' && password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => {
                          const strength = Math.min(
                            Math.floor(password.length / 3),
                            password.length > 0 && /[A-Z]/.test(password) ? 2 : 1,
                            password.length > 0 && /[0-9!@#$%^&*]/.test(password) ? 3 : 2,
                            4
                          );
                          const filled = level <= strength;
                          const color = strength <= 1
                            ? 'bg-red-500'
                            : strength === 2
                            ? 'bg-yellow-400'
                            : strength === 3
                            ? 'bg-green-400'
                            : 'bg-green-300';
                          return (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                filled ? color : isDark ? 'bg-green-950' : 'bg-gray-200'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !password.trim()}
                  whileHover={{ scale: isSubmitting ? 1 : 1.015 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full relative py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden
                    bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white
                    shadow-[0_4px_24px_rgba(34,197,94,0.35)]
                    hover:shadow-[0_6px_32px_rgba(34,197,94,0.5)]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{mode === 'login' ? 'Signing in…' : 'Creating account…'}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </motion.form>

              {statusMessage && (
                <p className="mt-3 text-center text-sm text-yellow-300">{statusMessage}</p>
              )}

            </AnimatePresence>

            {/* Divider
            
            <div className="flex items-center gap-3 my-6">
              <div className={`flex-1 h-px ${isDark ? 'bg-green-900/40' : 'bg-gray-200'}`} />
              <span className={`text-xs ${textMuted}`}>or continue with</span>
              <div className={`flex-1 h-px ${isDark ? 'bg-green-900/40' : 'bg-gray-200'}`} />
            </div>
            */}
            

            {/* Google OAuth placeholder
            <button
              type="button"
              className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-200 border ${
                isDark
                  ? 'bg-[#0a140a] border-green-900/40 text-green-200/80 hover:bg-green-950/60 hover:border-green-700/50'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
             Google G icon 
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            
            
            
            */}
            
          </div>

          {/* Footer switch */}
          <p className={`text-center text-xs mt-5 ${textMuted}`}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              className={`font-semibold underline underline-offset-2 transition-colors ${
                isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
              }`}
            >
              {mode === 'login' ? 'Sign up free' : 'Log in'}
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  );
}