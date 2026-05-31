import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { useMissedBank } from '../hooks/useMissedBank'
import { SUBJECTS, getTopicById } from '../data/subjects'
import {
  getMasteryLevel, getOverallScore, getSubjectScore,
  getCPCCReadiness, getWeakestTopics, getStrongestTopics, getRecommendedTopic,
} from '../utils/scoring'
import { useSchoolProfile } from '../hooks/useSchoolProfile'
import ProgressBar from '../components/ProgressBar'
import MasteryBadge from '../components/MasteryBadge'

const TOTAL_VIDEOS = SUBJECTS.flatMap((s) => s.topics.flatMap((t) => t.videos)).length

// Subject left-border accent colors
const SUBJECT_BORDERS = {
  reading: 'border-blue-400',
  math:    'border-violet-400',
  science: 'border-emerald-400',
  english: 'border-amber-400',
}
const SUBJECT_ICON_BG = {
  reading: 'bg-blue-50 text-blue-500',
  math:    'bg-violet-50 text-violet-500',
  science: 'bg-emerald-50 text-emerald-500',
  english: 'bg-amber-50 text-amber-600',
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

// ── Build coach agenda ─────────────────────────────────────────────────────
function buildCoach({ dueCount, recommended, nextVideo, gaps, topicScores }) {
  const actions = []

  if (dueCount > 0) {
    actions.push({
      key: 'review', icon: '🔁',
      headline: `${dueCount} Review${dueCount !== 1 ? 's' : ''} Due`,
      subheading: 'Your retention loop needs attention.',
      whyLine1: `${dueCount} spaced repetition card${dueCount !== 1 ? 's' : ''} scheduled for today.`,
      whyLine2: 'Skipping pushes your next review date back by days.',
      cta: 'Start Review →',
      to: '/review',
      accent: 'blush',
      priority: 1,
    })
  }

  if (recommended) {
    const gap = gaps[recommended.subjectId] ?? 0
    const ts = topicScores[recommended.id]
    const avg = ts?.scores.length
      ? Math.round(ts.scores.reduce((a, b) => a + b, 0) / ts.scores.length)
      : null

    if (gap > 0) {
      actions.push({
        key: 'gap-quiz', icon: '🎯',
        headline: recommended.name,
        subheading: `Highest-leverage move for your ${cap(recommended.subjectId)} goal.`,
        whyLine1: `You're ${gap}% below your ${cap(recommended.subjectId)} target.`,
        whyLine2: 'Review the lesson + key terms, then quiz from inside the study page.',
        cta: 'Study This Topic →',
        to: `/topic/${recommended.id}`,
        accent: 'lavender',
        priority: 2,
      })
    } else {
      actions.push({
        key: 'mastery-quiz', icon: avg === null ? '📖' : '🎯',
        headline: recommended.name,
        subheading: avg === null ? 'Start here — untouched topics hide score gaps.' : 'Your next highest-leverage topic.',
        whyLine1: avg === null
          ? 'You haven\'t studied this topic yet.'
          : `Currently at ${avg}% — your lowest-scoring topic.`,
        whyLine2: avg === null
          ? 'Every unstarted topic is a hidden score gap.'
          : 'Targeted practice here has the highest ROI.',
        cta: avg === null ? 'Start Studying →' : 'Quiz This Topic →',
        to: avg === null ? `/topic/${recommended.id}` : `/quiz?topicId=${recommended.id}`,
        accent: 'lavender',
        priority: 3,
      })
    }
  }

  if (nextVideo) {
    actions.push({
      key: 'video', icon: '▶️',
      headline: nextVideo.video.title,
      subheading: 'Build context before your next quiz.',
      whyLine1: 'This is next in your curriculum sequence.',
      whyLine2: 'Video context makes quiz answers stick.',
      cta: 'Watch Now →',
      to: '/videos',
      accent: 'teal',
      priority: 4,
    })
  }

  if (actions.length === 0) {
    actions.push({
      key: 'streak', icon: '🏆',
      headline: 'All Caught Up!',
      subheading: 'Keep your momentum going.',
      whyLine1: 'No urgent reviews or gaps right now.',
      whyLine2: 'A random quiz keeps your retention sharp.',
      cta: 'Random Quiz →',
      to: '/quiz',
      accent: 'lavender',
      priority: 5,
    })
  }

  actions.sort((a, b) => a.priority - b.priority)
  return { primary: actions[0] }
}

const ACCENT = {
  blush: {
    iconBg:  'bg-blush/20',
    btn:     'bg-blush hover:bg-blush-500 text-white',
    secBtn:  'text-blush-300',
  },
  lavender: {
    iconBg:  'bg-lavender/20',
    btn:     'bg-lavender hover:bg-lavender-500 text-white',
    secBtn:  'text-lavender-300',
  },
  teal: {
    iconBg:  'bg-primary-500/20',
    btn:     'bg-primary-500 hover:bg-primary-600 text-white',
    secBtn:  'text-primary-300',
  },
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { progress } = useProgress()
  const { quizHistory, topicScores, watchedVideos } = progress
  const { profile, getGoals, getGaps } = useSchoolProfile()
  const { getBankStats } = useMissedBank()

  const goals         = getGoals()
  const dueCount      = getBankStats().due
  const overall       = getOverallScore(quizHistory)
  const subjectScores = Object.fromEntries(SUBJECTS.map((s) => [s.id, getSubjectScore(quizHistory, s.id)]))
  const readiness     = getCPCCReadiness(overall, subjectScores, goals)
  const gaps          = getGaps(subjectScores, overall)
  const weakest       = getWeakestTopics(topicScores, 3)
  const strongest     = getStrongestTopics(topicScores, 3)

  // Next unwatched video
  const nextVideo = (() => {
    for (const s of SUBJECTS) {
      for (const t of s.topics) {
        const v = t.videos.find((v) => !watchedVideos[v.id])
        if (v) return { video: v, topic: t }
      }
    }
    return null
  })()

  // Gap-aware recommendation
  const recommended = (() => {
    const gapSubjects = SUBJECTS
      .filter((s) => (gaps[s.id] ?? 0) > 0)
      .sort((a, b) => (gaps[b.id] ?? 0) - (gaps[a.id] ?? 0))
    for (const s of gapSubjects) {
      const ranked = s.topics
        .map((t) => {
          const ts = topicScores[t.id]
          const avg = ts?.scores.length
            ? Math.round(ts.scores.reduce((a, b) => a + b, 0) / ts.scores.length)
            : null
          return { topic: { ...t, subjectId: s.id }, avg }
        })
        .sort((a, b) => (a.avg ?? -1) - (b.avg ?? -1))
      if (ranked[0]) return ranked[0].topic
    }
    return getRecommendedTopic(topicScores, quizHistory)
  })()

  // Test countdown
  const daysUntilTest = profile.testDate ? (() => {
    const d = new Date(profile.testDate + 'T00:00:00')
    const now = new Date(); now.setHours(0, 0, 0, 0)
    return Math.ceil((d - now) / 86400000)
  })() : null

  // Coach agenda
  const { primary } = buildCoach({ dueCount, recommended, nextVideo, gaps, topicScores })
  const ac = ACCENT[primary.accent]

  return (
    <div className="space-y-8">

      {/* ══════════════════════════════════════════════════
          A. COACH HERO — gradient bg + dark glass agenda
      ══════════════════════════════════════════════════ */}
      {/* Edge-to-edge hero — chromatic gradient mirrors syringe palette */}
      <div
        className="-mx-4 md:-mx-6 relative overflow-hidden md:rounded-3xl stagger-1"
        style={{
          background: 'linear-gradient(145deg, #060410 0%, #15083A 20%, #220E68 40%, #1C3082 55%, #9580D4 78%, #A87898 100%)',
          boxShadow: '0 12px 64px rgba(0,0,0,0.35)',
        }}
      >
        {/* Atmospheric blobs — pulled from syringe chromatic palette */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-25 blob-a"
             style={{ background: 'radial-gradient(circle, #c4b5fd, transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-44 h-44 rounded-full opacity-[0.15] blob-b"
             style={{ background: 'radial-gradient(circle, #00D0EE, transparent 70%)' }} />
        <div className="pointer-events-none absolute top-1/2 left-1/3 w-36 h-36 rounded-full opacity-[0.10] blob-a"
             style={{ background: 'radial-gradient(circle, #B08098, transparent 70%)', animationDelay: '3s' }} />
        {/* Electric blue flare — syringe body highlight zone */}
        <div className="pointer-events-none absolute -top-4 left-1/4 w-52 h-52 rounded-full opacity-[0.12] blob-b"
             style={{ background: 'radial-gradient(circle, #4070E0, transparent 70%)', animationDelay: '5s' }} />


        <div className="relative px-5 md:px-8 pt-6 pb-7">
          {/* Top bar: school chip + countdown */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <Link
              to="/school"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/12 border border-white/18 text-white/85 text-xs font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              🏫 <span className="truncate max-w-[150px]">{profile.schoolName || 'Set School Goals'}</span>
            </Link>
            {daysUntilTest !== null && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${
                daysUntilTest < 0   ? 'bg-white/8 border-white/15 text-white/40' :
                daysUntilTest === 0 ? 'bg-red-500/30 border-red-400/40 text-red-200' :
                daysUntilTest <= 7  ? 'bg-orange-500/22 border-orange-400/30 text-orange-200' :
                daysUntilTest <= 30 ? 'bg-amber-500/18 border-amber-400/28 text-amber-200' :
                'bg-lavender/22 border-lavender-300/28 text-lavender-200'
              }`}>
                📅 {daysUntilTest < 0 ? 'Test date passed'
                     : daysUntilTest === 0 ? 'Test is TODAY!'
                     : `${daysUntilTest}d to test`}
              </span>
            )}
          </div>

          {/* ── Coach Agenda dark glass card ── */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/14 p-5 space-y-5">
            {/* Header row */}
            <div>
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-[0.2em] mb-1">
                Today's Agenda
              </p>
              <p className="text-white/70 text-sm font-semibold leading-snug">{primary.subheading}</p>
            </div>

            {/* Next Best Step */}
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${ac.iconBg}`}>
                {primary.icon}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-white font-extrabold text-lg leading-tight">{primary.headline}</p>
                <div className="space-y-0.5">
                  <p className="text-white/80 text-xs font-semibold leading-snug">{primary.whyLine1}</p>
                  <p className="text-white/50 text-xs leading-snug">{primary.whyLine2}</p>
                </div>
              </div>
            </div>

            {/* Primary CTA — unmistakably dominant */}
            <Link
              to={primary.to}
              className={`block w-full text-center py-4 rounded-2xl font-extrabold text-base transition-all shadow-md active:scale-[0.97] ${ac.btn}`}
            >
              {primary.cta}
            </Link>

            {/* Studio secondary — single, minimal */}
            <Link
              to="/studio"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 text-center rounded-xl text-xs font-bold border border-white/15 text-white/55 hover:bg-white/8 hover:text-white/80 transition-all"
            >
              ✨ Open Study Studio
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          B. SUBJECTS — editorial course rows, not a stat grid
      ══════════════════════════════════════════════════ */}
      <section className="stagger-2">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display font-bold text-navy text-xl tracking-tight">Your Subjects</h2>
          <Link to="/subjects" className="text-xs font-semibold text-lavender hover:text-lavender-500 transition-colors">
            All topics →
          </Link>
        </div>

        <div className="space-y-2.5">
          {SUBJECTS.map((s) => {
            const score    = subjectScores[s.id]
            const goal     = goals[s.id]
            const gap      = gaps[s.id] ?? 0
            const vCount   = s.topics.flatMap((t) => t.videos).length
            const vWatched = s.topics.flatMap((t) => t.videos).filter((v) => watchedVideos[v.id]).length
            const pct      = score ?? 0
            const m        = getMasteryLevel(score)

            // Each subject has a distinct hover color wash
            const hoverBg = {
              reading: 'hover:bg-blue-50/70',
              math:    'hover:bg-violet-50/70',
              science: 'hover:bg-emerald-50/70',
              english: 'hover:bg-amber-50/70',
            }[s.id] ?? 'hover:bg-warm-50'

            return (
              <div
                key={s.id}
                className={`group bg-white rounded-2xl border-l-[3px] border border-warm-200/80 ${SUBJECT_BORDERS[s.id]} shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${hoverBg} hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-warm-300 transition-all duration-200`}
              >
                <div className="px-5 py-4 flex items-center gap-4">
                  {/* Subject icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-200 group-hover:scale-110 ${SUBJECT_ICON_BG[s.id]}`}>
                    {s.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-bold text-navy text-sm">{s.name}</p>
                      <MasteryBadge score={score} />
                      {goal != null && gap > 0 && (
                        <span className="text-[10px] font-bold text-danger bg-danger-light px-1.5 py-0.5 rounded-full">
                          +{gap}% needed
                        </span>
                      )}
                      {goal != null && gap <= 0 && score !== null && (
                        <span className="text-[10px] font-bold text-success bg-success-light px-1.5 py-0.5 rounded-full">
                          ✓ Goal met
                        </span>
                      )}
                    </div>
                    <div className="relative mb-1.5">
                      <ProgressBar value={pct} barClass={s.barClass} height="h-1.5" />
                      {goal != null && score !== null && (
                        <div className="absolute top-0 h-1.5 w-0.5 bg-slate-400/40" style={{ left: `${Math.min(goal, 100)}%` }} />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-semibold text-navy tabular-nums">{score === null ? '—' : `${score}%`}</span>
                      {goal != null && <span>goal {goal}%</span>}
                      <span>{vWatched}/{vCount} videos</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/subjects/${s.id}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-lavender-50 text-lavender border border-lavender-200 hover:bg-lavender hover:text-white transition-all active:scale-95"
                    >
                      Study →
                    </Link>
                    <Link
                      to={`/quiz?subjectId=${s.id}`}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${SUBJECT_ICON_BG[s.id]} border-current/20 hover:opacity-80`}
                      style={{ borderColor: 'currentColor' }}
                    >
                      Quiz
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          C. INSIGHTS — Needs Work + Looking Good
      ══════════════════════════════════════════════════ */}
      <section className="grid md:grid-cols-2 gap-4 stagger-3">

        {/* Needs Work */}
        <div className="rounded-2xl overflow-hidden bg-white border border-warm-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="px-5 py-4 border-b border-warm-100 flex items-center gap-2.5">
            <span className="text-base">⚠️</span>
            <h3 className="font-extrabold text-navy text-sm">Needs Work</h3>
            {weakest.length > 0 && (
              <Link to="/quiz" className="ml-auto text-xs font-semibold text-lavender hover:text-lavender-500 transition-colors">
                Quiz all →
              </Link>
            )}
          </div>
          <div className="divide-y divide-warm-100">
            {weakest.length === 0 ? (
              <p className="px-5 py-5 text-sm text-slate-400">Take quizzes to surface weak areas.</p>
            ) : weakest.map(({ topicId, avg }) => {
              const topic = getTopicById(topicId)
              if (!topic) return null
              const m = getMasteryLevel(avg)
              return (
                <Link
                  key={topicId}
                  to={`/topic/${topicId}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-warm-50 transition-colors group"
                >
                  <span className="text-sm font-semibold text-navy group-hover:text-lavender transition-colors leading-snug">{topic.name}</span>
                  <span className={`ml-3 shrink-0 text-xs font-extrabold px-2.5 py-1 rounded-full ${m.bg} ${m.text}`}>{avg}%</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Looking Good */}
        <div className="rounded-2xl overflow-hidden bg-white border border-warm-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="px-5 py-4 border-b border-warm-100 flex items-center gap-2.5">
            <span className="text-base">⭐</span>
            <h3 className="font-extrabold text-navy text-sm">Looking Good</h3>
            {strongest.length > 0 && (
              <Link to="/progress" className="ml-auto text-xs font-semibold text-lavender hover:text-lavender-500 transition-colors">
                Full view →
              </Link>
            )}
          </div>
          <div className="divide-y divide-warm-100">
            {strongest.length === 0 ? (
              <p className="px-5 py-5 text-sm text-slate-400">Keep studying to build your strengths.</p>
            ) : strongest.map(({ topicId, avg }) => {
              const topic = getTopicById(topicId)
              if (!topic) return null
              const m = getMasteryLevel(avg)
              return (
                <Link
                  key={topicId}
                  to={`/topic/${topicId}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-warm-50 transition-colors group"
                >
                  <span className="text-sm font-semibold text-navy group-hover:text-lavender transition-colors leading-snug">{topic.name}</span>
                  <span className={`ml-3 shrink-0 text-xs font-extrabold px-2.5 py-1 rounded-full ${m.bg} ${m.text}`}>{avg}%</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
