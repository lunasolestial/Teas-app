import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function AuthModal({ onClose }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const googleEnabled = false // requires Google Cloud OAuth setup in Supabase dashboard

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

  const inputCls = 'w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-lavender/40 transition placeholder:text-slate-300'

  if (emailSent) {
    return (
      <ModalShell onClose={onClose}>
        <div className="text-center py-4">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="font-bold text-navy text-lg mb-2">Check your email</h2>
          <p className="text-sm text-slate-500">
            We sent a confirmation link to <strong>{email}</strong>.<br />
            Click it to activate your account, then sign in.
          </p>
          <button
            onClick={() => setEmailSent(false)}
            className="mt-5 text-sm font-bold text-lavender hover:text-lavender-500 transition-colors"
          >
            ← Back to sign in
          </button>
        </div>
      </ModalShell>
    )
  }

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

      {/* Google */}
      {googleEnabled && (
        <>
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 text-sm font-bold text-navy hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
        </>
      )}

      {/* Email form */}
      <form onSubmit={handleEmailSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className={inputCls}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className={inputCls}
        />
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
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
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
