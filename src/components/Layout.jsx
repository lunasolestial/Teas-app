import { NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { APP_NAME } from '../constants/brand'
import { useMissedBank } from '../hooks/useMissedBank'
import { useProgress } from '../hooks/useProgress'
import { useFocusMode } from '../contexts/FocusMode'

// ── Navigation items ────────────────────────────────────────────────────────
// Ordered by study-session frequency: the first 5 are the core loop.
const NAV_ITEMS = [
  { to: '/',         label: 'Home',     icon: '🏠', end: true },
  { to: '/studio',   label: 'Studio',   icon: '✨' },
  { to: '/quiz',     label: 'Quiz',     icon: '✏️' },
  { to: '/review',   label: 'Review',   icon: '🔁' },
  { to: '/subjects', label: 'Study',    icon: '📚' },
  { to: '/videos',   label: 'Videos',   icon: '▶️' },
  { to: '/clips',    label: 'Notes',    icon: '📔' },
  { to: '/progress', label: 'Progress', icon: '📊' },
  { to: '/school',   label: 'School',   icon: '🏫' },
]

// Streak hook — reads from progress without adding a separate context
function useStreak() {
  const { progress } = useProgress()
  return progress.streak?.count ?? 0
}

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { active: focusMode } = useFocusMode()
  const { getBankStats } = useMissedBank()
  const streakCount = useStreak()
  const due = getBankStats().due

  // Reduce nav chrome when scrolling — makes content feel less framed
  useEffect(() => {
    if (focusMode) return
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [focusMode])

  // Inject the review badge onto the Review nav item
  const nav = NAV_ITEMS.map((n) =>
    n.to === '/review' && due > 0 ? { ...n, badge: due } : n
  )

  return (
    // Single top-level div — never restructured so children (Studio) never remount.
    // focusMode hides the top nav but keeps the same DOM tree.
    <div className="min-h-screen bg-cream flex flex-col">

      {/* ── Top navigation bar — dark glass ───────────────────────────────── */}
      {!focusMode && (
        <header
          className="sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-500"
          style={{
            background: scrolled ? 'rgba(10, 8, 22, 0.72)' : 'rgba(10, 8, 22, 0.93)',
            borderColor: scrolled ? 'transparent' : 'rgba(255,255,255,0.055)',
            boxShadow: scrolled ? 'none' : '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4), 0 16px 80px rgba(176,128,152,0.06)',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="h-14 flex items-center gap-2">

              {/* Brand mark — syringe logo in gradient circle */}
              <Link
                to="/"
                className="flex items-center gap-2.5 shrink-0 mr-3 group"
                aria-label={APP_NAME}
              >
                <div
                  className="shrink-0 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.06]"
                  style={{
                    width: '46px',
                    height: '46px',
                    background: 'linear-gradient(135deg, #9580D4 0%, #2050C8 55%, #2AAFA3 100%)',
                    boxShadow: '0 0 0 2px rgba(149,128,212,0.35)',
                  }}
                >
                  <img
                    src="/brand/syringe.png"
                    alt="LI Lab"
                    className="select-none"
                    style={{ width: '38px', height: '38px', objectFit: 'contain' }}
                  />
                </div>
                <span className="hidden lg:flex items-center gap-[2px]">
                  <span
                    className="text-white leading-none"
                    style={{ fontFamily: 'Cormorant Garamond, Palatino Linotype, serif', fontStyle: 'italic', fontWeight: 300, fontSize: '22px', letterSpacing: '-0.01em', lineHeight: 1 }}
                  >
                    li
                  </span>
                  <span
                    className="text-white/60 leading-none"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '11px', letterSpacing: '0.06em', lineHeight: 1, paddingBottom: '1px' }}
                  >
                    lab.
                  </span>
                </span>
              </Link>

              {/* Divider */}
              <div className="hidden md:block w-px h-5 bg-white/10 shrink-0 mr-1" />

              {/* Desktop horizontal nav */}
              <nav className="hidden md:flex items-center gap-0.5 flex-1 min-w-0">
                {nav.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    className={({ isActive }) =>
                      `relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150 whitespace-nowrap ${
                        isActive
                          ? 'bg-white/12 text-white'
                          : 'text-white/45 hover:text-white/85 hover:bg-white/8'
                      }`
                    }
                  >
                    <span className="text-sm leading-none">{n.icon}</span>
                    {n.label}
                    {n.badge > 0 && (
                      <span className="bg-blush text-white text-[9px] font-black rounded-full min-w-[1rem] h-4 px-1 flex items-center justify-center leading-none ml-0.5">
                        {n.badge > 9 ? '9+' : n.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Right side: streak + mobile trigger */}
              <div className="flex items-center gap-2 ml-auto shrink-0">
                {streakCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    🔥 {streakCount}d
                  </span>
                )}

                {/* Mobile menu button */}
                <button
                  className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </header>
      )}

      {/* ── Mobile full-screen nav overlay ─────────────────────────────────── */}
      {/* Slides down from the top — much more consumer-app-like than a sidebar */}
      {!focusMode && menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          {/* Dimmed backdrop */}
          <div
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu panel — dark glass to match the nav */}
          <div
            className="relative shadow-2xl rounded-b-3xl overflow-hidden border-b border-white/[0.06]"
            style={{ background: 'rgba(10, 8, 22, 0.97)' }}
          >
            {/* Menu header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div
                  className="shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #9580D4 0%, #2050C8 55%, #2AAFA3 100%)',
                    boxShadow: '0 0 0 2px rgba(149,128,212,0.35)',
                  }}
                >
                  <img
                    src="/brand/syringe.png"
                    alt="LI Lab"
                    className="select-none"
                    style={{ width: '33px', height: '33px', objectFit: 'contain' }}
                  />
                </div>
                <span className="flex items-center gap-[2px]">
                  <span
                    className="text-white leading-none"
                    style={{ fontFamily: 'Cormorant Garamond, Palatino Linotype, serif', fontStyle: 'italic', fontWeight: 300, fontSize: '20px', lineHeight: 1 }}
                  >
                    li
                  </span>
                  <span
                    className="text-white/55 leading-none"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '10px', letterSpacing: '0.06em', lineHeight: 1, paddingBottom: '1px' }}
                  >
                    lab.
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {streakCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                    🔥 {streakCount}d
                  </span>
                )}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Nav grid — 3 columns */}
            <div className="px-4 py-4 grid grid-cols-3 gap-2">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-2xl text-center transition-all ${
                      isActive
                        ? 'bg-white/14 border border-white/14 text-white'
                        : 'bg-white/[0.04] border border-white/[0.06] text-white/50 hover:border-white/12 hover:bg-white/8 hover:text-white/85'
                    }`
                  }
                >
                  <span className="text-2xl leading-none">{n.icon}</span>
                  <span className="text-xs font-bold">{n.label}</span>
                  {n.badge > 0 && (
                    <span className="absolute top-2 right-2 bg-blush text-white text-[9px] font-black rounded-full min-w-[1.1rem] h-[1.1rem] flex items-center justify-center px-0.5">
                      {n.badge > 9 ? '9+' : n.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────────────────────── */}
      {/* Always the same DOM position — Studio never remounts. */}
      <main className="flex-1">
        <div className={
          focusMode
            ? 'max-w-2xl mx-auto px-4 pt-16 pb-10'  // clear Studio's FocusTopBar (h-14=56px)
            : 'max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8'
        }>
          {children}
        </div>
      </main>

    </div>
  )
}
