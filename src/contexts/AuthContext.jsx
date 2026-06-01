import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase, readAllLocal, writeAllLocal } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const autoSaveRef = useRef(null)

  // ── Push local data → Supabase ─────────────────────────────────────────────
  const push = useCallback(async (silent = false) => {
    if (!supabase || !user) return
    if (!silent) setSyncing(true)
    const local = readAllLocal()
    try {
      await supabase.from('user_data').upsert({
        user_id:        user.id,
        progress:       local.progress,
        missed_bank:    local.missedBank,
        clips:          local.clips,
        notebook:       local.notebook,
        school_profile: local.schoolProfile,
        updated_at:     new Date().toISOString(),
      }, { onConflict: 'user_id' })
      setLastSync(new Date())
    } catch (e) {
      console.error('[sync] push failed', e)
    } finally {
      if (!silent) setSyncing(false)
    }
  }, [user])

  // ── Pull Supabase → local, then reload ────────────────────────────────────
  const pull = useCallback(async () => {
    if (!supabase || !user) return false
    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error || !data) return false
    writeAllLocal(data)
    return true
  }, [user])

  // ── On login: pull if remote data exists, otherwise push local ────────────
  useEffect(() => {
    if (!user) return
    ;(async () => {
      const hadRemote = await pull()
      if (hadRemote) {
        // Remote data loaded into localStorage — reload so all hooks re-init
        window.location.reload()
      } else {
        // First time on this account — seed Supabase with existing local data
        await push(true)
      }
    })()
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save every 60 seconds while logged in ────────────────────────────
  useEffect(() => {
    if (!user) { clearInterval(autoSaveRef.current); return }
    autoSaveRef.current = setInterval(() => push(true), 60_000)
    return () => clearInterval(autoSaveRef.current)
  }, [user, push])

  // ── Push on page hide (tab switch, close) ─────────────────────────────────
  useEffect(() => {
    if (!user) return
    const onHide = () => { if (document.visibilityState === 'hidden') push(true) }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [user, push])

  // ── Boot: restore session ─────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Auth actions ──────────────────────────────────────────────────────────
  async function signInWithGoogle() {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signInWithEmail(email, password) {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signUpWithEmail(email, password) {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    return supabase.auth.signUp({ email, password })
  }

  async function signOut() {
    if (!supabase) return
    await push(true)
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user, loading, syncing, lastSync,
      signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, push,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
