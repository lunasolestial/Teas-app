import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SUBJECTS } from '../data/subjects'
import { useProgress } from '../hooks/useProgress'
import { useMissedBank } from '../hooks/useMissedBank'
import { useSchoolProfile } from '../hooks/useSchoolProfile'
import { getOverallScore, getSubjectScore } from '../utils/scoring'
import { useFocusMode } from '../contexts/FocusMode'
import GlassCard from '../components/GlassCard'

// ─── constants ────────────────────────────────────────────────────────────────

const DURATIONS = [
  { label: '15 min', value: 15, desc: 'Sprint' },
  { label: '25 min', value: 25, desc: 'Focus' },
  { label: '45 min', value: 45, desc: 'Deep Work' },
]

const FOCUS_OPTIONS = [
  { id: 'auto',    label: '✨ Auto',    desc: 'Coach picks your focus' },
  { id: 'reading', label: '📖 Reading', desc: 'Key ideas & craft' },
  { id: 'math',    label: '➗ Math',    desc: 'Numbers & measurement' },
  { id: 'science', label: '🧬 Science', desc: 'A&P, bio, chemistry' },
  { id: 'english', label: '✍️ English', desc: 'Conventions & vocab' },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

function pad2(n) { return String(n).padStart(2, '0') }
function formatTime(s) { return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}` }

function buildSteps({ focus, dueCount, topicScores, watchedVideos, gaps, duration = 25 }) {
  let subject = null
  let topic = null
  let nextVideo = null

  const pickWeakestTopic = (subj) =>
    subj.topics
      .map((t) => {
        const ts = topicScores[t.id]
        const avg = ts?.scores.length
          ? Math.round(ts.scores.reduce((a, b) => a + b, 0) / ts.scores.length)
          : null
        return { topic: t, avg }
      })
      .sort((a, b) => (a.avg ?? -1) - (b.avg ?? -1))[0]?.topic ?? null

  if (focus === 'auto') {
    const gapSubjects = SUBJECTS
      .filter((s) => (gaps[s.id] ?? 0) > 0)
      .sort((a, b) => (gaps[b.id] ?? 0) - (gaps[a.id] ?? 0))
    subject = gapSubjects[0] ?? SUBJECTS[0]
  } else {
    subject = SUBJECTS.find((s) => s.id === focus) ?? SUBJECTS[0]
  }

  topic = pickWeakestTopic(subject)

  // Next unwatched video (prefer subject, fallback any)
  outer: for (const s of [subject, ...SUBJECTS.filter((x) => x.id !== subject.id)]) {
    for (const t of s.topics) {
      const v = t.videos.find((v) => !watchedVideos[v.id])
      if (v) { nextVideo = { video: v, topic: t }; break outer }
    }
  }

  const steps = []

  if (nextVideo) {
    steps.push({
      id: 'watch', icon: '▶️',
      label: 'Watch a Lesson',
      detail: nextVideo.video.title,
      to: '/videos',
      hint: duration >= 45 ? '~15 min' : '~10 min',
    })
  }

  if (topic) {
    steps.push({
      id: 'study', icon: '📖',
      label: 'Study Notes & Key Terms',
      detail: topic.name,
      to: `/topic/${topic.id}`,
      hint: '~8 min',
    })
  }

  if (dueCount > 0) {
    steps.push({
      id: 'review', icon: '🔁',
      label: 'Review Missed Cards',
      detail: `${dueCount} due today`,
      to: '/review',
      hint: '~5 min',
    })
  }

  steps.push({
    id: 'quiz', icon: '✏️',
    label: 'Quick Quiz',
    detail: topic ? topic.name : 'Random mix',
    to: topic ? `/quiz?topicId=${topic.id}` : '/quiz',
    hint: '~7 min',
  })

  return { steps, topic, subject }
}

// ─── Step row ────────────────────────────────────────────────────────────────

function StepRow({ step, checked, onToggle }) {
  return (
    <div className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${
      checked
        ? 'bg-success-light border border-success/20'
        : 'bg-white/80 backdrop-blur-sm border border-warm-200/80 hover:border-lavender-200 hover:bg-lavender-50/50'
    }`}>
      <button
        onClick={() => onToggle(step.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          checked ? 'border-success bg-success text-white' : 'border-warm-300 hover:border-lavender'
        }`}
        aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
      >
        {checked && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${checked ? 'text-success line-through' : 'text-navy'}`}>
            {step.icon} {step.label}
          </span>
          {step.hint && (
            <span className="text-xs text-slate-400 font-medium hidden sm:block">{step.hint}</span>
          )}
        </div>
        <p className={`text-xs mt-0.5 truncate ${checked ? 'text-success/70' : 'text-slate-500'}`}>
          {step.detail}
        </p>
      </div>
      {!checked && (
        <Link
          to={step.to}
          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold bg-lavender/10 text-lavender border border-lavender/20 hover:bg-lavender hover:text-white transition-all"
        >
          Go →
        </Link>
      )}
    </div>
  )
}

// ─── Minimal Focus Top Bar ────────────────────────────────────────────────────

function FocusTopBar({ duration, secondsLeft, isUrgent, focus, paused, onPause, onResume, onEnd, onExitHome }) {
  const [confirmExit, setConfirmExit] = useState(false)
  const focusLabel = FOCUS_OPTIONS.find((f) => f.id === focus)?.label ?? '✨ Auto'

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 backdrop-blur-xl"
      style={{ background: 'rgba(6, 4, 16, 0.95)' }}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">

        {/* Left — back / confirm */}
        {!confirmExit ? (
          <button
            onClick={() => setConfirmExit(true)}
            className="flex items-center gap-1 text-white/50 hover:text-white text-sm font-medium transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 12L6 8l4-4" />
            </svg>
            Home
          </button>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-white/50 text-xs">Exit?</span>
            <button
              onClick={() => setConfirmExit(false)}
              className="text-xs text-white/60 hover:text-white px-2 py-0.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Keep going
            </button>
            <Link
              to="/"
              onClick={onExitHome}
              className="text-xs font-bold text-blush-300 hover:text-blush px-2 py-0.5 rounded-lg hover:bg-blush/10 transition-colors"
            >
              Yes, exit
            </Link>
          </div>
        )}

        {/* Center */}
        <div className="flex-1 text-center min-w-0">
          <span className="text-white/55 text-xs font-semibold truncate">
            ✨ {duration}min · {focusLabel}
          </span>
        </div>

        {/* Right — timer + pause/resume + end */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className={`text-sm font-extrabold tabular-nums tracking-tight transition-colors ${
            paused ? 'text-amber-400' : isUrgent ? 'text-blush-300' : 'text-white/90'
          }`}>
            {paused ? 'Paused' : formatTime(secondsLeft)}
          </span>
          {paused ? (
            <button
              onClick={onResume}
              className="px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-400/50 text-amber-300 hover:border-amber-400 hover:text-amber-200 transition-all"
            >
              Resume
            </button>
          ) : (
            <button
              onClick={onPause}
              className="px-2.5 py-1 rounded-lg text-xs font-bold border border-white/18 text-white/55 hover:border-white/35 hover:text-white transition-all"
            >
              Pause
            </button>
          )}
          <button
            onClick={onEnd}
            className="px-2.5 py-1 rounded-lg text-xs font-bold border border-white/18 text-white/55 hover:border-white/35 hover:text-white transition-all"
          >
            End
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Phase screens ────────────────────────────────────────────────────────────

function SetupScreen({ duration, setDuration, focus, setFocus, onStart, coachFocus }) {
  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div
          className="inline-flex w-16 h-16 rounded-3xl items-center justify-center text-3xl mx-auto mb-1 shadow-glow-lav"
          style={{ background: 'linear-gradient(135deg, #9580D4 0%, #2AAFA3 100%)' }}
        >
          ✨
        </div>
        <h1 className="font-display font-bold text-navy tracking-tight text-2xl">Study Studio</h1>
        <p className="text-slate-500 text-sm">A guided focus loop · Watch → Study → Review → Quiz</p>
      </div>

      <GlassCard className="space-y-5">
        {/* Duration */}
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.14em] mb-3">Session Length</p>
          <div className="grid grid-cols-3 gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => setDuration(d.value)}
                className={`py-3 px-2 rounded-xl border-2 text-center transition-all active:scale-[0.97] ${
                  duration === d.value
                    ? 'border-lavender bg-lavender-50 shadow-[0_0_0_3px_rgba(149,128,212,0.12)]'
                    : 'border-warm-200 bg-white/60 hover:border-lavender-200 hover:bg-lavender-50/40'
                }`}
              >
                <div className={`text-sm font-extrabold ${duration === d.value ? 'text-lavender' : 'text-navy'}`}>{d.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Focus area */}
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.14em] mb-3">Focus Area</p>
          <div className="grid grid-cols-2 gap-2">
            {FOCUS_OPTIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFocus(f.id)}
                className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl border-2 text-left transition-all active:scale-[0.97] ${
                  focus === f.id
                    ? 'border-lavender bg-lavender-50 shadow-[0_0_0_3px_rgba(149,128,212,0.10)]'
                    : 'border-warm-200 bg-white/60 hover:border-lavender-200 hover:bg-lavender-50/40'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold leading-tight ${focus === f.id ? 'text-lavender' : 'text-navy'}`}>{f.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-tight">{f.desc}</div>
                </div>
                {focus === f.id && (
                  <div className="w-4 h-4 rounded-full bg-lavender flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2 2 4-4" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          {focus === 'auto' && coachFocus && (
            <p className="mt-2 text-xs text-lavender font-semibold px-1">
              ✨ Coach picked: <strong>{coachFocus}</strong>
            </p>
          )}
        </div>

        {/* Start */}
        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.97] shadow-sm"
          style={{ background: 'linear-gradient(135deg, #9580D4 0%, #2AAFA3 100%)' }}
        >
          Start {duration}-Minute Session →
        </button>
      </GlassCard>

      <div className="flex items-center justify-center gap-5 text-xs text-slate-400">
        {['Watch', 'Study', 'Review', 'Quiz'].map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-warm-300">→</span>}
            <span className="font-semibold">{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActiveScreen({ duration, steps, secondsLeft, paused, checkedSteps, onToggle, onPause, onResume, onEnd, onExitHome, focus }) {
  const totalSeconds = duration * 60
  const elapsed = totalSeconds - secondsLeft
  const pct = Math.min((elapsed / totalSeconds) * 100, 100)
  const isUrgent = secondsLeft <= 120 && secondsLeft > 0
  const focusLabel = FOCUS_OPTIONS.find((f) => f.id === focus)?.label ?? 'Auto'

  return (
    <>
      <FocusTopBar
        duration={duration}
        secondsLeft={secondsLeft}
        isUrgent={isUrgent}
        focus={focus}
        paused={paused}
        onPause={onPause}
        onResume={onResume}
        onEnd={onEnd}
        onExitHome={onExitHome}
      />

      <div className="space-y-5 page-enter">
        {/* Session progress card */}
        <div className={`bg-white/80 backdrop-blur-md border rounded-2xl shadow-[0_2px_20px_rgba(149,128,212,0.08)] px-5 py-4 space-y-3 transition-colors ${
          paused ? 'border-amber-300/60' : 'border-warm-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-navy">{focusLabel}</p>
              <p className={`text-xs mt-0.5 ${paused ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>
                {paused ? '⏸ Paused — tap Resume to continue' : `${checkedSteps.size} of ${steps.length} steps done`}
              </p>
            </div>
            <div className={`text-2xl font-extrabold tabular-nums tracking-tight transition-colors ${
              paused ? 'text-amber-500' : isUrgent ? 'text-blush' : 'text-lavender'
            }`}>
              {paused ? '⏸' : formatTime(secondsLeft)}
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-warm-100 overflow-hidden">
            <div
              className="h-1.5 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #9580D4 0%, #2AAFA3 100%)' }}
            />
          </div>
        </div>

        {/* Steps */}
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.14em] mb-3">Your Loop</p>
          <div className="space-y-2">
            {steps.map((step) => (
              <StepRow
                key={step.id}
                step={step}
                checked={checkedSteps.has(step.id)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function DoneScreen({ duration, checkedSteps, steps, onRestart, nextMove }) {
  const completedCount = checkedSteps.size
  const allDone = completedCount === steps.length
  const emoji = allDone ? '🏆' : completedCount >= steps.length / 2 ? '⭐' : '💪'
  const message = allDone ? 'Perfect Session!' : completedCount > 0 ? 'Great Work!' : 'Session Done!'

  return (
    <div className="max-w-lg mx-auto space-y-5 page-enter">
      <div
        className="relative rounded-3xl overflow-hidden p-8 text-center"
        style={{ background: 'linear-gradient(135deg, #1e0a4a 0%, #4a2080 60%, #9580D4 100%)' }}
      >
        <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20 blob-a"
             style={{ background: 'radial-gradient(circle, #c4b5fd, transparent 70%)' }} />
        <div className="text-5xl mb-3 score-pop">{emoji}</div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">{message}</h2>
        <p className="text-white/55 text-sm">{duration} min · {completedCount}/{steps.length} steps</p>
      </div>

      <GlassCard>
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.14em] mb-3">What You Did</p>
        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 py-1.5">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                checkedSteps.has(step.id) ? 'border-success bg-success' : 'border-warm-300'
              }`}>
                {checkedSteps.has(step.id) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-semibold ${
                checkedSteps.has(step.id) ? 'text-success' : 'text-slate-400 line-through'
              }`}>
                {step.icon} {step.label}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {nextMove && (
        <GlassCard variant="tinted" className="!p-4">
          <p className="text-[10px] font-extrabold text-lavender uppercase tracking-[0.14em] mb-2">Next Recommended Move</p>
          <div className="flex items-center gap-3">
            <span className="text-xl">{nextMove.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-navy">{nextMove.headline}</p>
              <p className="text-xs text-slate-500">{nextMove.why}</p>
            </div>
            <Link to={nextMove.to} className="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold bg-lavender text-white hover:bg-lavender-500 transition-colors">
              Go →
            </Link>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRestart}
          className="py-3 rounded-2xl border-2 border-lavender-200 text-lavender text-sm font-bold hover:bg-lavender-50 transition-colors"
        >
          ✨ New Session
        </button>
        <Link to="/" className="py-3 rounded-2xl bg-lavender text-white text-sm font-bold text-center hover:bg-lavender-500 transition-colors shadow-sm">
          🏠 Back Home
        </Link>
      </div>
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function StudyStudio() {
  const [phase, setPhase] = useState('setup')
  const [duration, setDuration] = useState(25)
  const [focus, setFocus] = useState('auto')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [paused, setPaused] = useState(false)
  const [checkedSteps, setCheckedSteps] = useState(new Set())
  const intervalRef = useRef(null)
  const endTimeRef = useRef(null)
  const pausedSecondsRef = useRef(0)

  const { enter: enterFocus, exit: exitFocus } = useFocusMode()
  const { progress } = useProgress()
  const { quizHistory, topicScores, watchedVideos } = progress
  const { getBankStats } = useMissedBank()
  const { getGaps } = useSchoolProfile()

  const dueCount = getBankStats().due
  const overall = getOverallScore(quizHistory)
  const subjectScores = Object.fromEntries(SUBJECTS.map((s) => [s.id, getSubjectScore(quizHistory, s.id)]))
  const gaps = getGaps(subjectScores, overall)

  const { steps, topic } = useMemo(
    () => buildSteps({ focus, dueCount, topicScores, watchedVideos, gaps, duration }),
    [focus, dueCount, topicScores, watchedVideos, gaps, duration]
  )

  const coachFocus = useMemo(() => {
    if (focus !== 'auto') return null
    const gapSubjects = SUBJECTS
      .filter((s) => (gaps[s.id] ?? 0) > 0)
      .sort((a, b) => (gaps[b.id] ?? 0) - (gaps[a.id] ?? 0))
    const s = gapSubjects[0]
    if (s) return `${s.icon} ${s.name} (${gaps[s.id]}% gap)`
    return topic?.name ?? null
  }, [focus, gaps, topic])

  // Sync focus mode with phase — no cleanup so toggling phase doesn't
  // momentarily flick active back to false before the new effect body runs.
  useEffect(() => {
    if (phase === 'active') enterFocus()
    else exitFocus()
  }, [phase, enterFocus, exitFocus])

  // Separate unmount cleanup: ensure focus mode is cleared if user navigates away
  useEffect(() => {
    return () => exitFocus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer — stops when paused; resumes with the stored remaining seconds
  useEffect(() => {
    if (phase !== 'active' || paused) return
    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining <= 0) {
        setPhase('done')
        clearInterval(intervalRef.current)
      }
    }, 500)
    return () => clearInterval(intervalRef.current)
  }, [phase, paused])

  function handleStart() {
    endTimeRef.current = Date.now() + duration * 60 * 1000
    setSecondsLeft(duration * 60)
    setPaused(false)
    setCheckedSteps(new Set())
    setPhase('active')
  }

  function handlePause() {
    pausedSecondsRef.current = secondsLeft
    setPaused(true)
  }

  function handleResume() {
    endTimeRef.current = Date.now() + pausedSecondsRef.current * 1000
    setPaused(false)
  }

  function handleToggle(stepId) {
    setCheckedSteps((prev) => {
      const next = new Set(prev)
      next.has(stepId) ? next.delete(stepId) : next.add(stepId)
      return next
    })
  }

  function handleEnd() {
    clearInterval(intervalRef.current)
    setPhase('done')
  }

  function handleRestart() {
    setPhase('setup')
    setCheckedSteps(new Set())
    clearInterval(intervalRef.current)
  }

  const nextMove = useMemo(() => {
    if (dueCount > 0) return { icon: '🔁', headline: `${dueCount} Reviews Due`, why: 'Keep your spaced repetition on track.', to: '/review' }
    if (topic) return { icon: '🎯', headline: topic.name, why: 'Keep building mastery on your focus topic.', to: `/quiz?topicId=${topic.id}` }
    return { icon: '▶️', headline: 'Watch a Lesson', why: 'Video context makes quiz answers stick.', to: '/videos' }
  }, [dueCount, topic])

  return (
    <div className="py-2">
      {phase === 'setup' && (
        <SetupScreen
          duration={duration}
          setDuration={setDuration}
          focus={focus}
          setFocus={setFocus}
          onStart={handleStart}
          coachFocus={coachFocus}
        />
      )}
      {phase === 'active' && (
        <ActiveScreen
          duration={duration}
          steps={steps}
          secondsLeft={secondsLeft}
          paused={paused}
          checkedSteps={checkedSteps}
          onToggle={handleToggle}
          onPause={handlePause}
          onResume={handleResume}
          onEnd={handleEnd}
          onExitHome={exitFocus}
          focus={focus}
        />
      )}
      {phase === 'done' && (
        <DoneScreen
          duration={duration}
          checkedSteps={checkedSteps}
          steps={steps}
          onRestart={handleRestart}
          nextMove={nextMove}
        />
      )}
    </div>
  )
}
