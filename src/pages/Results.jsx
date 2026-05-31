import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getTopicById } from '../data/subjects'
import { getMasteryLevel } from '../utils/scoring'
import { useMissedBank } from '../hooks/useMissedBank'
import MasteryBadge from '../components/MasteryBadge'
import ProgressBar from '../components/ProgressBar'
import Confetti from '../components/Confetti'
import { Card } from '../components/ui'

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target == null) return
    let start = null
    function step(ts) {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

const MASTERY_SCALE = [
  { label: 'Priority',     range: '<60%',    bg: 'bg-danger-light',  text: 'text-danger' },
  { label: 'Weak',         range: '60–69%',  bg: 'bg-orange-100',    text: 'text-orange-700' },
  { label: 'Light Review', range: '70–79%',  bg: 'bg-warning-light', text: 'text-warning' },
  { label: 'Strong',       range: '80–89%',  bg: 'bg-lavender-100',  text: 'text-lavender' },
  { label: 'Mastered',     range: '90–100%', bg: 'bg-success-light', text: 'text-success' },
]

function ConfidenceChip({ confidence }) {
  if (!confidence) return null
  const map = {
    low:    'bg-danger-light text-danger',
    medium: 'bg-warning-light text-warning',
    high:   'bg-success-light text-success',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[confidence] || 'bg-warm-100 text-slate-600'}`}>
      {confidence} confidence
    </span>
  )
}

export default function Results() {
  const location  = useLocation()
  const result    = location.state?.result
  const { getBankStats } = useMissedBank()

  if (!result) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-slate-500">No quiz result found.</p>
        <Link to="/quiz" className="text-lavender underline text-sm font-semibold">Take a Quiz</Link>
      </div>
    )
  }

  const { score, total, pct, topicId, subjectId, answers, questions, quizMode, quizId } = result
  const topic          = getTopicById(topicId)

  const retakeLink = quizMode === 'subject' ? `/quiz?subjectId=${quizId}`
    : quizMode === 'random'  ? '/quiz'
    : quizMode === 'ai'      ? '/quiz'
    : `/quiz?topicId=${topicId}`
  const m              = getMasteryLevel(pct)
  const bankStats      = getBankStats()
  const missedCount    = answers.filter((a) => !a.isCorrect).length
  const lowConf        = answers.filter((a) => a.isCorrect && a.confidence === 'low').length
  const reviewScheduled = missedCount + lowConf
  const displayPct     = useCountUp(pct)

  const heroGrad = pct >= 80
    // Chromatic sweep mirrors the syringe palette — deep midnight → indigo → electric blue → lavender → rose
    ? 'linear-gradient(145deg, #060410 0%, #15083A 20%, #220E68 40%, #1C3082 58%, #9580D4 82%, #A87898 100%)'
    : pct >= 70
    ? 'linear-gradient(145deg, #3d1f00 0%, #c05c08 100%)'
    : 'linear-gradient(145deg, #2d0808 0%, #b83535 100%)'

  const message = pct >= 90 ? 'Outstanding!' : pct >= 80 ? 'Test Ready!' : pct >= 70 ? 'Keep pushing.' : 'Keep studying.'

  return (
    <div className="max-w-2xl mx-auto space-y-5 page-enter">

      {pct >= 80 && <Confetti />}

      {/* Score hero — display font for the score itself */}
      <div className="rounded-3xl overflow-hidden relative shadow-[0_8px_48px_rgba(0,0,0,0.22)]" style={{ background: heroGrad }}>
        <div className="pointer-events-none absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-25 blob-a"
             style={{ background: 'radial-gradient(circle, #c4b5fd, transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-15 blob-b"
             style={{ background: 'radial-gradient(circle, #2AAFA3, transparent 70%)' }} />
        <div className="relative px-8 py-10 text-center">
          {/* Score — display serif for gravitas */}
          <div
            className="font-display font-bold text-white tabular-nums leading-none score-pop mb-2"
            style={{ fontSize: 'clamp(4rem, 15vw, 7rem)', animationDelay: '0.15s' }}
          >
            {displayPct}%
          </div>
          <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em] mb-4">{message}</p>
          <MasteryBadge score={pct} size="lg" />
          <p className="text-white/55 text-sm mt-5 font-medium">{score} of {total} correct</p>
          {topic && <p className="text-white/35 text-xs mt-1">{topic.name}</p>}
        </div>
      </div>

      {/* Review bank notice */}
      {reviewScheduled > 0 && quizMode !== 'ai' && (
        <div className="bg-blush-50 border border-blush-100 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-navy">
              🔁 {reviewScheduled} question{reviewScheduled !== 1 ? 's' : ''} scheduled for review
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {missedCount} missed · {lowConf} low confidence · {bankStats.due} due today
            </p>
          </div>
          <Link
            to="/review"
            className="shrink-0 px-3 py-2 text-xs font-bold bg-blush text-white rounded-xl hover:bg-blush-500 transition-colors"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* AI quiz notice — missed questions don't enter spaced repetition */}
      {quizMode === 'ai' && (
        <div className="bg-lavender-50 border border-lavender-100 rounded-2xl p-4">
          <p className="text-sm font-bold text-navy">✦ AI-Generated Quiz</p>
          <p className="text-xs text-slate-500 mt-1">
            Missed questions from AI quizzes don't enter your spaced-repetition review bank — AI questions are freshly generated each time. To build your review queue, take a standard topic or subject quiz.
          </p>
        </div>
      )}

      {/* Score bar + mastery scale */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-navy">Your Score</span>
          <span className={`text-sm font-extrabold ${m.text}`}>{pct}%</span>
        </div>
        <ProgressBar value={pct} barClass={m.bar} height="h-3" />
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>0%</span>
          <span className="text-warning">70% review</span>
          <span className="text-success">90% mastered</span>
          <span>100%</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 mt-4">
          {MASTERY_SCALE.map((lvl) => (
            <div key={lvl.label} className={`rounded-xl p-2 text-center ${lvl.bg}`}>
              <div className={`text-xs font-bold ${lvl.text}`}>{lvl.label}</div>
              <div className={`text-xs ${lvl.text} opacity-70 mt-0.5`}>{lvl.range}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Question review */}
      <Card noPad>
        <div className="px-5 py-4 border-b border-warm-100">
          <h2 className="font-extrabold text-navy">Question Review</h2>
        </div>
        <div className="divide-y divide-warm-100">
          {answers.map((a, i) => {
            const q = questions?.find((x) => x.id === a.questionId) || questions?.[i]
            if (!q) return null
            return (
              <div key={i} className="overflow-hidden">
                <div className={`px-5 py-3 flex items-center gap-2 text-sm font-semibold ${
                  a.isCorrect ? 'bg-success-light text-success' : 'bg-danger-light text-danger'
                }`}>
                  <span>{a.isCorrect ? '✓' : '✗'}</span>
                  <span>Q{i + 1}</span>
                  <ConfidenceChip confidence={a.confidence} />
                  {!a.isCorrect && (() => {
                    // MCQ: show the option label
                    if (!a.questionType || a.questionType === 'multiple_choice') {
                      return a.selected != null && q.options?.[a.selected]
                        ? <span className="ml-auto text-xs font-normal text-slate-500">
                            You chose: <strong>{q.options[a.selected]}</strong>
                          </span>
                        : null
                    }
                    // supply_answer: show typed text
                    if (a.questionType === 'supply_answer') {
                      return a.studentAnswer
                        ? <span className="ml-auto text-xs font-normal text-slate-500">
                            You answered: <strong>{a.studentAnswer}</strong>
                          </span>
                        : null
                    }
                    return null
                  })()}
                </div>
                <div className="px-5 py-3.5 space-y-2 bg-white">
                  <p className="text-sm text-navy leading-relaxed">{q.question}</p>
                  {/* Correct answer display — type-aware */}
                  {(() => {
                    const qType = q.questionType || 'multiple_choice'
                    if (qType === 'multiple_choice') {
                      const correctOpt = q.options?.[q.correct ?? q.correctIndex]
                      return correctOpt
                        ? <p className="text-sm font-semibold text-success">✓ {correctOpt}</p>
                        : null
                    }
                    if (qType === 'multiple_select' && q.correctIndices) {
                      const labels = q.correctIndices.map(i => q.options?.[i]).filter(Boolean)
                      return <p className="text-sm font-semibold text-success">✓ {labels.join(', ')}</p>
                    }
                    if (qType === 'supply_answer' && q.correctAnswer) {
                      return <p className="text-sm font-semibold text-success">✓ {q.correctAnswer}</p>
                    }
                    if (qType === 'ordered_response' && q.correctOrder) {
                      const labels = q.correctOrder.map(i => q.options?.[i]).filter(Boolean)
                      return <p className="text-sm font-semibold text-success">✓ {labels.join(' → ')}</p>
                    }
                    return null
                  })()}
                  {q.rationale ? (
                    <div className="mt-2 pt-2 border-t border-warm-100 space-y-1.5">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-500">Why: </strong>{q.rationale.simpleExplanation}
                      </p>
                      {q.rationale.commonTrap && (
                        <p className="text-xs text-amber-900 bg-warning-light rounded-xl px-2.5 py-1.5 border border-warning/30">
                          ⚠ {q.rationale.commonTrap}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-2 border-t border-warm-100 pt-2 leading-relaxed">{q.explanation}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to={retakeLink}
          className="flex items-center justify-center gap-2 py-3 text-sm font-bold border-2 border-lavender-200 text-lavender rounded-2xl hover:bg-lavender-50 transition-colors"
        >
          🔁 Retake Quiz
        </Link>
        {quizMode === 'subject' ? (
          <Link
            to={`/subjects/${subjectId}`}
            className="flex items-center justify-center gap-2 py-3 text-sm font-bold bg-lavender text-white rounded-2xl hover:bg-lavender-500 transition-colors shadow-sm"
          >
            📚 Review Subject
          </Link>
        ) : quizMode === 'random' ? (
          <Link
            to="/progress"
            className="flex items-center justify-center gap-2 py-3 text-sm font-bold bg-lavender text-white rounded-2xl hover:bg-lavender-500 transition-colors shadow-sm"
          >
            📊 View Progress
          </Link>
        ) : topic ? (
          <Link
            to={`/topic/${topicId}`}
            className="flex items-center justify-center gap-2 py-3 text-sm font-bold bg-lavender text-white rounded-2xl hover:bg-lavender-500 transition-colors shadow-sm"
          >
            📖 Review Topic
          </Link>
        ) : (
          <Link
            to="/review"
            className="flex items-center justify-center gap-2 py-3 text-sm font-bold bg-blush text-white rounded-2xl hover:bg-blush-500 transition-colors shadow-sm"
          >
            🔁 Go to Review
          </Link>
        )}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 py-3 text-sm font-bold border-2 border-warm-200 text-slate-600 rounded-2xl hover:bg-warm-100 transition-colors col-span-2"
        >
          🏠 Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
