import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPoolQuestionById as getQuestionById } from '../data/questions'
import { getEnrichedQuestion } from '../data/questionsMeta'
import { getTopicById, getTopicSubject } from '../data/subjects'
import { useMissedBank } from '../hooks/useMissedBank'
import { getMasteryLevel } from '../utils/scoring'

// ── Question-type helpers ─────────────────────────────────────────────────────

function isMCQ(q) {
  return !q.questionType || q.questionType === 'multiple_choice'
}

function hasValidAnswer(q, answer) {
  switch (q.questionType) {
    case 'multiple_select':  return Array.isArray(answer) && answer.length > 0
    case 'supply_answer':    return typeof answer === 'string' && answer.trim().length > 0
    case 'ordered_response': return Array.isArray(answer) && answer.length === (q.options || []).length
    default: return false
  }
}

function checkIsCorrect(q, answer) {
  switch (q.questionType) {
    case 'multiple_select': {
      const correct = new Set(q.correctIndices || [])
      const given   = new Set(Array.isArray(answer) ? answer : [])
      return correct.size === given.size && [...correct].every(i => given.has(i))
    }
    case 'supply_answer':
      return (answer || '').trim().toLowerCase() === (q.correctAnswer || '').trim().toLowerCase()
    case 'ordered_response': {
      const order = q.correctOrder || []
      return Array.isArray(answer) && order.length === answer.length &&
        order.every((idx, pos) => answer[pos] === idx)
    }
    default: return false
  }
}

// ── Multiple-select input ─────────────────────────────────────────────────────

function MultipleSelectInput({ q, answer, setAnswer, revealed }) {
  const selected = new Set(Array.isArray(answer) ? answer : [])
  const correct  = new Set(q.correctIndices || [])

  function toggle(i) {
    if (revealed) return
    const next = new Set(selected)
    if (next.has(i)) { next.delete(i) } else { next.add(i) }
    setAnswer([...next])
  }

  function optState(i) {
    if (!revealed) return selected.has(i) ? 'selected' : 'default'
    const isCorrect = correct.has(i)
    const wasPicked = selected.has(i)
    if (isCorrect && wasPicked)  return 'correct'
    if (isCorrect && !wasPicked) return 'missed'
    if (!isCorrect && wasPicked) return 'wrong'
    return 'dimmed'
  }

  const stateStyles = {
    default:  { wrap: 'border-warm-200 bg-white hover:border-lavender/35 hover:bg-lavender-50/30 cursor-pointer',     badge: 'bg-warm-100 text-slate-400',    text: 'text-navy' },
    selected: { wrap: 'border-lavender bg-lavender-50 cursor-pointer',                                                  badge: 'bg-lavender text-white',         text: 'text-lavender font-semibold' },
    correct:  { wrap: 'border-green-400 bg-green-50',                                                                   badge: 'bg-green-500 text-white',        text: 'text-green-800 font-semibold' },
    missed:   { wrap: 'border-green-400 bg-green-50/40 border-dashed',                                                  badge: 'bg-green-400 text-white',        text: 'text-green-700' },
    wrong:    { wrap: 'border-red-400 bg-red-50',                                                                       badge: 'bg-red-500 text-white',          text: 'text-red-800' },
    dimmed:   { wrap: 'border-warm-100 bg-warm-50/40 opacity-40',                                                       badge: 'bg-warm-100 text-slate-300',     text: 'text-slate-400' },
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Select all that apply</p>
      {q.options.map((opt, i) => {
        const s  = stateStyles[optState(i)]
        const st = optState(i)
        return (
          <button key={i} onClick={() => toggle(i)} disabled={revealed}
            className={`w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 transition-all ${s.wrap}`}
          >
            <span className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${s.badge}`}>
              {st === 'selected' || st === 'correct' || st === 'missed' ? '✓'
               : st === 'wrong' ? '✗'
               : String.fromCharCode(65 + i)}
            </span>
            <span className={`text-sm leading-relaxed flex-1 ${s.text}`}>{opt}</span>
            {revealed && st === 'missed' && <span className="text-[10px] text-green-600 font-bold shrink-0 mt-0.5">should select</span>}
          </button>
        )
      })}
      {!revealed && selected.size > 0 && (
        <p className="text-xs text-slate-400 text-center">{selected.size} selected — select all correct answers before checking</p>
      )}
    </div>
  )
}

// ── Supply-answer input ───────────────────────────────────────────────────────

function SupplyAnswerInput({ q, answer, setAnswer, revealed }) {
  const typed = answer || ''
  const isCorrect = revealed &&
    typed.trim().toLowerCase() === (q.correctAnswer || '').trim().toLowerCase()

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={typed}
          onChange={(e) => { if (!revealed) setAnswer(e.target.value) }}
          disabled={revealed}
          placeholder="Type your answer…"
          autoComplete="off"
          className={`w-full px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
            !revealed
              ? 'border-warm-200 bg-white focus:border-lavender/50 focus:ring-lavender/10'
              : isCorrect
              ? 'border-green-400 bg-green-50 text-green-800 focus:ring-0'
              : 'border-red-400 bg-red-50 text-red-800 focus:ring-0'
          }`}
        />
        {revealed && (
          <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '✓' : '✗'}
          </span>
        )}
      </div>
      {revealed && !isCorrect && q.correctAnswer && (
        <p className="text-sm"><span className="font-semibold text-green-700">Correct answer: </span><span className="text-navy">{q.correctAnswer}</span></p>
      )}
    </div>
  )
}

// ── Ordered-response input ────────────────────────────────────────────────────

function OrderedResponseInput({ q, answer, setAnswer, revealed }) {
  const placed       = Array.isArray(answer) ? answer : []
  const remaining    = (q.options || []).map((_, i) => i).filter(i => !placed.includes(i))
  const correctOrder = q.correctOrder || []

  function addItem(i)    { if (revealed) return; setAnswer([...placed, i]) }
  function removeItem(p) { if (revealed) return; setAnswer(placed.filter((_, idx) => idx !== p)) }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Your order</p>
        {placed.length === 0 && !revealed && (
          <div className="px-4 py-5 rounded-xl border-2 border-dashed border-warm-300 text-center text-sm text-slate-300">
            Tap items below to add them in sequence
          </div>
        )}
        {placed.map((optIdx, pos) => {
          const isCorrectPos = !revealed || correctOrder[pos] === optIdx
          return (
            <div key={pos} className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
              !revealed ? 'border-lavender/30 bg-lavender-50'
              : isCorrectPos ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
            }`}>
              <span className={`shrink-0 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                !revealed ? 'bg-lavender text-white'
                : isCorrectPos ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>{pos + 1}</span>
              <span className={`text-sm flex-1 ${
                revealed ? (isCorrectPos ? 'text-green-800 font-semibold' : 'text-red-800') : 'text-navy'
              }`}>{q.options[optIdx]}</span>
              {!revealed && (
                <button onClick={() => removeItem(pos)} className="text-slate-300 hover:text-red-500 text-sm font-bold shrink-0" aria-label="Remove">✕</button>
              )}
              {revealed && !isCorrectPos && (
                <span className="text-[10px] text-red-600 font-semibold shrink-0">→ step {correctOrder.indexOf(optIdx) + 1}</span>
              )}
            </div>
          )
        })}
      </div>
      {!revealed && remaining.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Available</p>
          {remaining.map(optIdx => (
            <button key={optIdx} onClick={() => addItem(optIdx)}
              className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-warm-200 bg-white hover:border-lavender/35 hover:bg-lavender-50/30 transition-all text-sm text-navy"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-warm-100 text-slate-400 text-xs font-bold flex items-center justify-center">+</span>
              {q.options[optIdx]}
            </button>
          ))}
        </div>
      )}
      {revealed && placed.some((optIdx, pos) => correctOrder[pos] !== optIdx) && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest">Correct order</p>
          {correctOrder.map((optIdx, pos) => (
            <p key={pos} className="flex items-center gap-2 text-sm text-navy">
              <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs font-black flex items-center justify-center shrink-0">{pos + 1}</span>
              {q.options[optIdx]}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Non-MCQ dispatcher ────────────────────────────────────────────────────────

function NonMCQInput({ q, answer, setAnswer, revealed }) {
  switch (q.questionType) {
    case 'multiple_select':  return <MultipleSelectInput  q={q} answer={answer} setAnswer={setAnswer} revealed={revealed} />
    case 'supply_answer':    return <SupplyAnswerInput     q={q} answer={answer} setAnswer={setAnswer} revealed={revealed} />
    case 'ordered_response': return <OrderedResponseInput  q={q} answer={answer} setAnswer={setAnswer} revealed={revealed} />
    default: return <p className="text-sm text-slate-400 italic">Unsupported type: {q.questionType}</p>
  }
}

function ConfidenceSelector({ value, onChange }) {
  const options = [
    { id: 'low', label: 'Low', desc: 'Still unsure', color: 'border-red-300 bg-red-50 text-red-800 hover:bg-red-100' },
    { id: 'medium', label: 'Medium', desc: 'Fairly sure', color: 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100' },
    { id: 'high', label: 'High', desc: 'Got it!', color: 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100' },
  ]
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">How confident were you?</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((o) => (
          <button key={o.id} onClick={() => onChange(o.id)}
            className={`p-2.5 rounded-xl border-2 text-center transition-all ${value === o.id ? `${o.color} ring-2 ring-offset-1 ring-current` : `${o.color} border-opacity-50`}`}
          >
            <div className="text-sm font-bold">{o.label}</div>
            <div className="text-xs opacity-80">{o.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function RationaleCard({ q, isCorrect }) {
  const r = q.rationale
  return (
    <div className={`rounded-2xl border overflow-hidden ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
      <div className={`px-4 py-2.5 flex items-center gap-2 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
        <span className={`text-sm font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </span>
        {q.teasConceptTested && (
          <span className="ml-auto text-xs text-slate-500 bg-white/70 px-2 py-0.5 rounded-full border border-warm-200">{q.teasConceptTested}</span>
        )}
      </div>
      <div className="p-4 space-y-3 bg-white">
        {r ? (
          <>
            <p className="text-sm text-navy"><span className="font-semibold text-slate-500 text-xs uppercase">Simple: </span>{r.simpleExplanation}</p>
            <p className="text-sm text-navy"><span className="font-semibold text-slate-500 text-xs uppercase">Why correct: </span>{r.whyCorrect}</p>
            <div className={`rounded-xl p-3 border ${q.isCommonlyMissed ? 'bg-amber-50 border-amber-300' : 'bg-warm-50 border-warm-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${q.isCommonlyMissed ? 'text-amber-700' : 'text-slate-500'}`}>
                {q.isCommonlyMissed ? '⚠ Common Trap' : 'Common Trap'}
              </p>
              <p className={`text-sm ${q.isCommonlyMissed ? 'text-amber-900 font-medium' : 'text-navy'}`}>{r.commonTrap}</p>
            </div>
            <div className="bg-lavender-50 border border-lavender-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-lavender uppercase tracking-wide mb-1">Memory Tip</p>
              <p className="text-sm text-navy">💡 {r.memoryTip}</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-navy">{q.explanation}</p>
        )}
      </div>
    </div>
  )
}

function ReviewDashboard({ stats, dueQuestions, onStart, bank, onDismiss }) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto page-enter">
      <div>
        <h1 className="font-display font-bold text-navy tracking-tight text-2xl">Review Queue</h1>
        <p className="text-slate-500 text-sm mt-0.5">Spaced repetition — questions scheduled by your performance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Due Today',  value: stats.due,      color: stats.due > 0 ? 'bg-amber-50 border-amber-200' : 'bg-warm-50 border-warm-200' },
          { label: 'In Queue',   value: stats.total,    color: 'bg-warm-50 border-warm-200' },
          { label: 'Upcoming',   value: stats.upcoming, color: 'bg-blue-50 border-blue-200' },
          { label: 'Mastered',   value: stats.mastered, color: 'bg-lavender-50 border-lavender-100' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
            <div className="text-2xl font-extrabold text-navy">{s.value}</div>
            <div className="text-xs font-medium text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-warm-200 p-4 text-xs text-slate-500 space-y-1">
        <p className="font-extrabold text-navy text-sm mb-2">Scheduling rules</p>
        {[
          ['Incorrect answer',              '+1 day'],
          ['Correct + Low confidence',      '+3 days'],
          ['Correct + Medium confidence',   '+7 days'],
          ['Correct + High confidence',     '+10 days'],
          ['Correct + High × 3 in a row',  '★ Mastered'],
        ].map(([rule, result]) => (
          <div key={rule} className="flex items-center justify-between">
            <span>{rule}</span>
            <span className="font-semibold text-navy">{result}</span>
          </div>
        ))}
      </div>

      {dueQuestions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-200 p-8 text-center space-y-3">
          <div className="text-4xl">🎉</div>
          <p className="font-extrabold text-navy">Nothing due today!</p>
          <p className="text-sm text-slate-400">
            {stats.upcoming > 0
              ? `${stats.upcoming} question${stats.upcoming !== 1 ? 's' : ''} coming up in future sessions.`
              : 'Take a quiz to start building your review queue.'}
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Link to="/quiz" className="px-4 py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors">
              Take a Quiz
            </Link>
            <Link to="/studio" className="px-4 py-2 text-sm font-bold border-2 border-lavender-200 text-lavender rounded-xl hover:bg-lavender-50 transition-colors">
              ✨ Study Studio
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="font-extrabold text-navy">{dueQuestions.length} question{dueQuestions.length !== 1 ? 's' : ''} due today</p>
            <button
              onClick={onStart}
              className="px-5 py-2.5 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors"
            >
              Start Review →
            </button>
          </div>

          <div className="space-y-2">
            {dueQuestions.map((q) => {
              const topic = getTopicById(q.topicId)
              const subject = getTopicSubject(q.topicId)
              const entry = bank[q.id]
              return (
                <div key={q.id} className="bg-white rounded-2xl border border-warm-200 px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{q.question.slice(0, 80)}…</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {subject && <span className={`text-xs ${subject.textClass}`}>{subject.icon} {topic?.name}</span>}
                      {q.isCommonlyMissed && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">⚠ Commonly Missed</span>}
                      {entry && (
                        <span className="text-xs text-slate-400">
                          {entry.totalAttempts} attempt{entry.totalAttempts !== 1 ? 's' : ''} · streak: {entry.correctStreak}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDismiss(q.id)}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    title="Remove from queue"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function ReviewSession({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer]             = useState(null)  // int (MCQ) | array (multi/ordered) | string (supply)
  const [revealed, setRevealed]         = useState(false)
  const [confidence, setConfidence]     = useState(null)
  const [sessionResults, setSessionResults] = useState([])
  const { processAnswer } = useMissedBank()

  const q       = questions[currentIndex]
  const subject = getTopicSubject(q?.topicId) || null
  const progressPct = (currentIndex / questions.length) * 100

  if (!q) return null

  const mcq       = isMCQ(q)
  const canReveal = mcq ? answer !== null : hasValidAnswer(q, answer)
  const isCorrect = revealed
    ? (mcq ? answer === q.correct : checkIsCorrect(q, answer))
    : false

  function handleNext() {
    const correct = mcq ? answer === q.correct : checkIsCorrect(q, answer)
    const conf    = confidence || 'medium'
    processAnswer(q.id, q.topicId, q.subjectId, { correct, confidence: conf })
    const newResults = [...sessionResults, { questionId: q.id, isCorrect: correct, confidence: conf }]
    setSessionResults(newResults)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setAnswer(null)
      setRevealed(false)
      setConfidence(null)
    } else {
      onComplete(newResults)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-navy tracking-tight">Review Session</h1>
          <p className="text-sm text-slate-500">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <button onClick={() => onComplete(sessionResults)} className="text-xs text-slate-400 hover:text-slate-600 underline">End Session</button>
      </div>

      <div className="w-full bg-warm-200 rounded-full h-2">
        <div className="bg-lavender h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="bg-white rounded-2xl border border-warm-200 p-5 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {q.isCommonlyMissed && (
            <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-semibold">⚠ Commonly Missed</span>
          )}
          {subject && <span className={`text-xs ${subject.textClass} font-medium`}>{subject.icon} {getTopicById(q.topicId)?.name}</span>}
          {!mcq && (
            <span className="text-xs bg-lavender-50 text-lavender border border-lavender-100 px-2 py-0.5 rounded-full font-semibold capitalize">
              {q.questionType?.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        <p className="text-sm font-semibold text-navy leading-relaxed">{q.question}</p>

        {mcq ? (
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let style = 'border-warm-200 bg-white text-navy hover:border-lavender/40 hover:bg-lavender-50'
              if (revealed) {
                if (i === q.correct) style = 'border-green-400 bg-green-50 text-green-800'
                else if (i === answer && i !== q.correct) style = 'border-red-400 bg-red-50 text-red-800'
                else style = 'border-warm-200 bg-white text-slate-400'
              } else if (answer === i) {
                style = 'border-lavender bg-lavender-50 text-lavender'
              }
              return (
                <button key={i} onClick={() => !revealed && setAnswer(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${style}`}
                >
                  <span className="mr-2 font-bold text-slate-400">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {revealed && i === q.correct && <span className="ml-2 text-green-600">✓</span>}
                  {revealed && i === answer && i !== q.correct && <span className="ml-2 text-red-600">✗</span>}
                </button>
              )
            })}
          </div>
        ) : (
          <NonMCQInput q={q} answer={answer} setAnswer={setAnswer} revealed={revealed} />
        )}

        {revealed && (
          <div className="space-y-4 pt-1">
            <RationaleCard q={q} isCorrect={isCorrect} />
            <ConfidenceSelector value={confidence} onChange={setConfidence} />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        {!revealed ? (
          <button onClick={() => setRevealed(true)} disabled={!canReveal}
            className="px-5 py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 disabled:opacity-40 transition-colors"
          >
            Check Answer
          </button>
        ) : (
          <button onClick={handleNext} disabled={!confidence}
            className="px-5 py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 disabled:opacity-40 transition-colors"
          >
            {confidence === null ? 'Rate confidence first' : currentIndex < questions.length - 1 ? 'Next →' : 'Finish Review →'}
          </button>
        )}
      </div>
    </div>
  )
}

function SessionSummary({ results, onBack }) {
  const correct = results.filter((r) => r.isCorrect).length
  const pct = Math.round((correct / results.length) * 100)
  const highConf = results.filter((r) => r.isCorrect && r.confidence === 'high').length
  const m = getMasteryLevel(pct)

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div className={`rounded-2xl p-6 ${pct >= 80 ? 'bg-lavender-50 border border-lavender-100' : pct >= 60 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
        <div className={`text-5xl font-extrabold mb-2 ${m.text}`}>{pct}%</div>
        <p className="text-sm text-slate-600">{correct} of {results.length} correct</p>
        {highConf > 0 && <p className="text-xs text-lavender mt-1">{highConf} answered with high confidence ★</p>}
      </div>
      <p className="text-sm text-slate-500">Schedules updated. Check back tomorrow for the next review.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={onBack} className="px-4 py-2 text-sm font-bold border-2 border-warm-200 text-navy rounded-xl hover:bg-warm-50 transition-colors">
          Back to Queue
        </button>
        <Link to="/" className="px-4 py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors">
          Dashboard
        </Link>
      </div>
    </div>
  )
}

export default function Review() {
  const { getDueIds, getBankStats, bank, dismissQuestion } = useMissedBank()
  const [started, setStarted] = useState(false)
  const [sessionResults, setSessionResults] = useState(null)

  const dueIds = getDueIds()
  const stats = getBankStats()

  const dueQuestions = useMemo(
    () =>
      dueIds
        // Resolve IDs against the static bank first — drop any unknown IDs
        // (e.g. AI-generated question IDs from a previous session) before
        // passing to getEnrichedQuestion, which crashes on undefined input.
        .map((id) => getQuestionById(id))
        .filter(Boolean)
        .map((q) => getEnrichedQuestion(q)),
    [dueIds]
  )

  if (sessionResults !== null) {
    return <SessionSummary results={sessionResults} onBack={() => { setStarted(false); setSessionResults(null) }} />
  }

  if (started && dueQuestions.length > 0) {
    return <ReviewSession questions={dueQuestions} onComplete={setSessionResults} />
  }

  return (
    <ReviewDashboard
      stats={stats}
      dueQuestions={dueQuestions}
      bank={bank}
      onStart={() => setStarted(true)}
      onDismiss={dismissQuestion}
    />
  )
}
