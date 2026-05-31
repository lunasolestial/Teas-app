import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  {
    id: 'welcome',
    icon: null,  // uses logo
    title: 'Welcome to LI Lab',
    subtitle: 'Your personal TEAS v7 study coach',
    body: (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 leading-relaxed">
          LI Lab is built for the <strong className="text-navy">ATI TEAS 7</strong> exam — the nursing school
          entrance test. Every feature is designed around one goal: getting you to your target score
          so you can get into the program you want.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: '📖', label: '12 Topics',       sub: 'Full TEAS v7 curriculum' },
            { icon: '✏️', label: '120+ Questions',   sub: 'TEAS-style practice' },
            { icon: '▶️', label: 'Curated Videos',   sub: 'Top nursing educators' },
            { icon: '🔁', label: 'Spaced Review',    sub: 'Smart repeat scheduling' },
            { icon: '✦',  label: 'AI Notes',         sub: 'Notebook from your notes' },
            { icon: '🎯', label: 'Goal Tracking',    sub: 'CPCC readiness score' },
          ].map((f) => (
            <div key={f.label} className="flex items-start gap-2.5 p-3 bg-warm-50 rounded-xl border border-warm-200">
              <span className="text-base mt-0.5">{f.icon}</span>
              <div>
                <p className="text-xs font-bold text-navy">{f.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'flow',
    icon: '🗺️',
    title: 'Your Study Flow',
    subtitle: 'Follow this loop for every topic',
    body: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">The most effective study path is a loop, not a list. Here's the order:</p>
        <div className="space-y-2">
          {[
            {
              step: 1, icon: '▶️', label: 'Watch the Video',
              detail: 'Go to Videos → pick a topic → watch. The video gives you the mental model first.',
              color: 'bg-blue-50 border-blue-200',
            },
            {
              step: 2, icon: '📖', label: 'Study the Topic Page',
              detail: 'Go to Study → tap any topic → read the Lesson, Key Terms, TEAS Traps, and Memory Tips tabs.',
              color: 'bg-emerald-50 border-emerald-200',
            },
            {
              step: 3, icon: '📝', label: 'Take Notes',
              detail: 'In the video player, tap "Take Notes." Notes save directly to your topic notebook.',
              color: 'bg-amber-50 border-amber-200',
            },
            {
              step: 4, icon: '✦', label: 'Generate AI Notes',
              detail: 'In your topic\'s Notebook Mode tab, hit "Generate Notebook" to get an AI-structured study sheet from your notes.',
              color: 'bg-lavender-50 border-lavender-100',
            },
            {
              step: 5, icon: '✏️', label: 'Take the Quiz',
              detail: 'Quiz yourself right from the topic page, or go to Quiz. Wrong answers automatically enter your review queue.',
              color: 'bg-rose-50 border-rose-200',
            },
            {
              step: 6, icon: '🔁', label: 'Do Your Daily Reviews',
              detail: 'Each day, check the Review tab. Spaced repetition re-shows questions you missed — timed to stick in memory.',
              color: 'bg-purple-50 border-purple-200',
            },
          ].map((s) => (
            <div key={s.step} className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border ${s.color}`}>
              <div className="shrink-0 w-6 h-6 rounded-full bg-white border border-current/20 flex items-center justify-center text-[11px] font-black text-slate-500">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-navy">{s.icon} {s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'features',
    icon: '🧰',
    title: 'What\'s Inside',
    subtitle: 'Every section and what it does',
    body: (
      <div className="space-y-2">
        {[
          {
            nav: '✨ Studio',     path: '/studio',
            desc: 'Start here each session. The coach picks your best next move and runs a timed focus loop.',
          },
          {
            nav: '📖 Study',      path: '/subjects',
            desc: 'Every topic has a full page: Lesson, Key Terms, TEAS Traps, Memory Tips, AI Notes, and Notebook Mode. Tap any topic name to open it.',
          },
          {
            nav: '▶️ Videos',    path: '/videos',
            desc: 'Curated videos by Nurse Cheung, RegisteredNurseRN, Simple Nursing, and The Organic Chemistry Tutor. Take notes right inside the player.',
          },
          {
            nav: '✏️ Quiz',      path: '/quiz',
            desc: 'Quiz by topic, by subject, or randomly. TEAS-style questions including multiple select, fill-in, and ordered response.',
          },
          {
            nav: '🔁 Review',    path: '/review',
            desc: 'Your spaced-repetition queue. Questions you missed come back at +1d, +3d, +7d, or +10d intervals based on your confidence.',
          },
          {
            nav: '📔 Notes',     path: '/clips',
            desc: 'Save clips of key terms, concepts, and traps while studying. Use "📌 Save Clip" in videos, quizzes, and topic pages.',
          },
          {
            nav: '📊 Progress',  path: '/progress',
            desc: 'Your overall score, subject mastery, topic-by-topic breakdown, and CPCC readiness status.',
          },
          {
            nav: '🏫 School',    path: '/school',
            desc: 'Enter your program\'s required scores. The app tracks your gap to each target and adjusts the coach recommendations accordingly.',
          },
        ].map((f) => (
          <div key={f.nav} className="flex items-start gap-3 px-3.5 py-2.5 rounded-xl bg-warm-50 border border-warm-100">
            <p className="text-xs font-bold text-navy whitespace-nowrap w-20 shrink-0 mt-0.5">{f.nav}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'goals',
    icon: '🎯',
    title: 'Set Your CPCC Goals',
    subtitle: 'Personalise your readiness dashboard',
    body: (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 leading-relaxed">
          Every nursing program has different score requirements. Go to <strong className="text-navy">School Profile</strong> and
          enter yours — the app uses them to track your readiness and tell you exactly what to study next.
        </p>

        <div className="bg-lavender-50 border border-lavender-100 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-extrabold text-navy uppercase tracking-wide">What to enter</p>
          <div className="space-y-2">
            {[
              { label: 'Overall composite',     sub: 'The minimum overall score your program requires' },
              { label: 'Reading score target',   sub: 'Usually the highest — reading is heavily tested' },
              { label: 'Math score target',      sub: 'Dosage calculations, conversions, percentages' },
              { label: 'Science score target',   sub: 'A&P, biology, chemistry, scientific reasoning' },
              { label: 'English score target',   sub: 'Grammar, vocabulary, knowledge of language' },
            ].map((g) => (
              <div key={g.label} className="flex items-start gap-2.5 px-3 py-2 bg-white rounded-xl border border-warm-100">
                <span className="text-slate-300 mt-0.5 text-xs">→</span>
                <div>
                  <p className="text-xs font-semibold text-navy">{g.label}</p>
                  <p className="text-xs text-slate-400">{g.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
          <strong>Tip:</strong> Your Dashboard "Today's Agenda" uses your goals to pick what you study next.
          Set goals first and the coach becomes specific to your gaps.
        </div>
      </div>
    ),
  },
]

const STORAGE_KEY = 'teas_onboarded_v1'

export function useOnboarding() {
  const done = typeof localStorage !== 'undefined' && !!localStorage.getItem(STORAGE_KEY)
  function markDone() {
    localStorage.setItem(STORAGE_KEY, '1')
  }
  return { needsOnboarding: !done, markDone }
}

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, '1')
    onClose()
  }

  function handleGoToSchool() {
    handleClose()
    navigate('/school')
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(6,4,16,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-5 shrink-0"
          style={{ background: 'linear-gradient(135deg, #1e0a4a 0%, #4a2080 60%, #9580D4 100%)' }}
        >
          {/* Step dots */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === step ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleClose}
              className="text-white/40 hover:text-white text-sm transition-colors"
              aria-label="Skip onboarding"
            >
              Skip
            </button>
          </div>

          {/* Step header */}
          <div className="flex items-start gap-3.5">
            {step === 0 ? (
              <div
                className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #9580D4 0%, #2050C8 55%, #2AAFA3 100%)',
                  boxShadow: '0 0 0 2px rgba(149,128,212,0.4)',
                }}
              >
                <img src="/brand/syringe.png" alt="LI Lab" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
              </div>
            ) : (
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                {current.icon}
              </div>
            )}
            <div>
              <h2 className="text-lg font-extrabold text-white leading-tight">{current.title}</h2>
              <p className="text-white/55 text-sm mt-0.5">{current.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {current.body}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-warm-100 flex items-center justify-between gap-3 shrink-0 bg-warm-50/60">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            className={`text-sm font-bold transition-colors ${
              step > 0 ? 'text-slate-600 hover:text-navy' : 'text-transparent pointer-events-none'
            }`}
          >
            ← Back
          </button>

          <div className="flex gap-2">
            {isLast && (
              <button
                onClick={handleGoToSchool}
                className="px-4 py-2.5 text-sm font-bold border-2 border-lavender-200 text-lavender rounded-xl hover:bg-lavender-50 transition-colors"
              >
                Set My Goals →
              </button>
            )}
            <button
              onClick={isLast ? handleClose : () => setStep(step + 1)}
              className="px-5 py-2.5 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors shadow-sm"
            >
              {isLast ? 'Start Studying 🚀' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
