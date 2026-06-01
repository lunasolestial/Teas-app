import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

export default function AuthModal({ onClose }) {
  const { signInWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fn = mode === 'signup' ? signUpWithEmail : signInWithEmail
    const { error: err, data } = await fn(email, password)
    setLoading(false)
    if (err) { setError(err.message); return }
    if (mode === 'signup' && data?.user && !data.session) {
      setEmailSent(true)
    } else {
      onClose()
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setEmailSent(true)
  }

  function switchMode(next) {
    setMode(next)
    setError('')
    setEmailSent(false)
    setPassword('')
    setShowPassword(false)
  }

  const inputCls = 'w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-lavender/40 transition placeholder:text-slate-300'

  // ── Email sent confirmation ─────────────────────────────────────────────────
  if (emailSent) {
    const isReset = mode === 'forgot'
    return (
      <ModalShell onClose={onClose}>
        <div className="text-center py-4">
          <div className="text-4xl mb-4">{isReset ? '🔑' : '📬'}</div>
          <h2 className="font-bold text-navy text-lg mb-2">Check your email</h2>
          <p className="text-sm text-slate-500">
            {isReset
              ? <>We sent a password reset link to <strong>{email}</strong>.<br />Click it to set a new password.</>
              : <>We sent a confirmation link to <strong>{email}</strong>.<br />Click it to activate your account, then sign in.</>
            }
          </p>
          <button
            onClick={() => switchMode('signin')}
            className="mt-5 text-sm font-bold text-lavender hover:text-lavender-500 transition-colors"
          >
            ← Back to sign in
          </button>
        </div>
      </ModalShell>
    )
  }

  // ── Forgot password ─────────────────────────────────────────────────────────
  if (mode === 'forgot') {
    return (
      <ModalShell onClose={onClose}>
        <div className="text-center mb-6">
          <h2 className="font-bold text-navy text-xl">Reset your password</h2>
          <p className="text-sm text-slate-500 mt-1">Enter your email and we'll send a reset link.</p>
        </div>
        <form onSubmit={handleForgotPassword} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className={inputCls}
          />
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lavender hover:bg-lavender-500 disabled:opacity-60 text-white font-bold rounded-xl py-3 text-sm transition-colors"
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
        <button
          onClick={() => switchMode('signin')}
          className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors mt-4"
        >
          ← Back to sign in
        </button>
      </ModalShell>
    )
  }

  // ── Sign in / Sign up ───────────────────────────────────────────────────────
  return (
    <ModalShell onClose={onClose}>
      <div className="text-center mb-6">
        <h2 className="font-bold text-navy text-xl">
          {mode === 'signin' ? 'Sign in to sync your progress' : 'Create your account'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {mode === 'signin'
            ? 'Pick up where you left off on any device.'
            : 'Save your progress across all your devices.'}
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className={inputCls}
        />

        {/* Password with show/hide toggle */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className={`${inputCls} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        {/* Forgot password — only on sign in */}
        {mode === 'signin' && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="text-xs font-bold text-slate-400 hover:text-lavender transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-lavender hover:bg-lavender-500 disabled:opacity-60 text-white font-bold rounded-xl py-3 text-sm transition-colors"
        >
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-4">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
          className="font-bold text-lavender hover:text-lavender-500 transition-colors"
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>

      <p className="text-center text-xs text-slate-400 mt-3">
        Guest mode works without an account — sign in only to sync across devices.
      </p>
    </ModalShell>
  )
}

function ModalShell({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
