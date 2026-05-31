import { useState, useMemo } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { SUBJECTS, getAllTopics, getTopicById, getTopicSubject } from '../data/subjects'
import { getQuizPoolByTopic, getQuizPoolBySubject, QUIZ_POOL } from '../data/questions'
import { getEnrichedQuestion } from '../data/questionsMeta'
import { useProgress } from '../hooks/useProgress'
import { useMissedBank } from '../hooks/useMissedBank'
import SaveClipButton from '../components/SaveClipButton'
import { generateTEASQuestions } from '../lib/aiClient'

// ── Question-type helpers ─────────────────────────────────────────────────────

function isMCQ(q) {
  return !q.questionType || q.questionType === 'multiple_choice'
}

// Normalize question so both static-bank (q.correct) and AI-bank (q.correctIndex)
// work transparently. All MCQ code that reads q.correct still works unchanged.
function normalizeQuestion(q) {
  const rawType = q.questionType
  // AI may return 'mcq' — normalize to canonical type name
  const questionType = (!rawType || rawType === 'mcq') ? 'multiple_choice' : rawType
  const correctIdx = q.correctIndex ?? q.correct ?? 0
  return {
    ...q,
    questionType,
    correctIndex: correctIdx,
    correct: correctIdx,
  }
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
    case 'supply_answer': {
      return (answer || '').trim().toLowerCase() === (q.correctAnswer || '').trim().toLowerCase()
    }
    case 'ordered_response': {
      const order = q.correctOrder || []
      return Array.isArray(answer) && order.length === answer.length &&
        order.every((idx, pos) => answer[pos] === idx)
    }
    default: return false
  }
}

function answerPrompt(q) {
  switch (q.questionType) {
    case 'multiple_select':  return 'Select all that apply'
    case 'supply_answer':    return 'Type your answer'
    case 'ordered_response': return 'Place all items in order'
    default: return 'Select an answer'
  }
}

// ── Non-MCQ input components ──────────────────────────────────────────────────

// Dispatcher — routes to the right input based on questionType
function NonMCQInput({ q, answer, setAnswer, revealed }) {
  switch (q.questionType) {
    case 'multiple_select':
      return <MultipleSelectInput q={q} answer={answer} setAnswer={setAnswer} revealed={revealed} />
    case 'supply_answer':
      return <SupplyAnswerInput q={q} answer={answer} setAnswer={setAnswer} revealed={revealed} />
    case 'ordered_response':
      return <OrderedResponseInput q={q} answer={answer} setAnswer={setAnswer} revealed={revealed} />
    default:
      return (
        <p className="text-sm text-slate-400 italic">
          Unsupported question type: {q.questionType}
        </p>
      )
  }
}

// ── multiple_select ───────────────────────────────────────────────────────────
// Square checkboxes; after reveal shows ✓ correct, ✗ wrong, dashed border for missed.
function MultipleSelectInput({ q, answer, setAnswer, revealed }) {
  const selected = new Set(Array.isArray(answer) ? answer : [])
  const correct  = new Set(q.correctIndices || [])

  function toggle(i) {
    if (revealed) return
    const next = new Set(selected)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setAnswer([...next])
  }

  function optState(i) {
    if (!revealed) return selected.has(i) ? 'selected' : 'default'
    const isCorrect = correct.has(i)
    const wasPicked = selected.has(i)
    if (isCorrect && wasPicked)  return 'correct'
    if (isCorrect && !wasPicked) return 'missed'   // should have been selected
    if (!isCorrect && wasPicked) return 'wrong'
    return 'dimmed'
  }

  const stateStyles = {
    default:  { wrap: 'border-warm-200/80 bg-white hover:border-lavender/35 hover:bg-lavender-50/30 cursor-pointer active:scale-[0.99]', badge: 'bg-warm-100 text-slate-400', text: 'text-navy' },
    selected: { wrap: 'border-lavender bg-lavender-50 shadow-[0_0_0_3px_rgba(149,128,212,0.12)] cursor-pointer', badge: 'bg-lavender text-white', text: 'text-lavender font-semibold' },
    correct:  { wrap: 'border-success/40 bg-success-light answer-correct', badge: 'bg-success text-white', text: 'text-success font-semibold' },
    missed:   { wrap: 'border-success/50 bg-success-light/40 border-dashed', badge: 'bg-success/70 text-white', text: 'text-success' },
    wrong:    { wrap: 'border-danger/35 bg-danger-light answer-wrong', badge: 'bg-danger text-white', text: 'text-danger' },
    dimmed:   { wrap: 'border-warm-100 bg-warm-50/40 opacity-40', badge: 'bg-warm-100 text-slate-300', text: 'text-slate-400' },
  }

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        Select all that apply
      </p>
      {q.options.map((opt, i) => {
        const s = stateStyles[optState(i)]
        const st = optState(i)
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            disabled={revealed}
            className={`w-full text-left flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 ${s.wrap}`}
          >
            {/* Square badge — visually distinct from MCQ circle badges */}
            <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all ${s.badge}`}>
              {st === 'selected' || st === 'correct' || st === 'missed' ? '✓'
               : st === 'wrong' ? '✗'
               : String.fromCharCode(65 + i)}
            </span>
            <span className={`text-sm leading-relaxed pt-0.5 flex-1 ${s.text}`}>{opt}</span>
            {revealed && st === 'missed' && (
              <span className="text-[10px] text-success font-bold shrink-0 mt-1">should select</span>
            )}
          </button>
        )
      })}
      {!revealed && selected.size > 0 && (
        <p className="text-xs text-slate-400 text-center">
          {selected.size} selected — select all correct answers before revealing
        </p>
      )}
    </div>
  )
}

// ── supply_answer ─────────────────────────────────────────────────────────────
// Text input; after reveal shows whether the answer matched.
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
          className={`w-full px-5 py-4 rounded-2xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
            !revealed
              ? 'border-warm-200 bg-white focus:border-lavender/50 focus:ring-lavender/10'
              : isCorrect
              ? 'border-success/40 bg-success-light text-success focus:ring-0'
              : 'border-danger/35 bg-danger-light text-danger focus:ring-0'
          }`}
        />
        {revealed && (
          <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold ${isCorrect ? 'text-success' : 'text-danger'}`}>
            {isCorrect ? '✓' : '✗'}
          </span>
        )}
      </div>
      {revealed && !isCorrect && q.correctAnswer && (
        <p className="text-sm">
          <span className="font-semibold text-success">Correct answer: </span>
          <span className="text-navy">{q.correctAnswer}</span>
        </p>
      )}
    </div>
  )
}

// ── ordered_response ──────────────────────────────────────────────────────────
// Two-zone click-to-order interface: tap "Available" items to add them in sequence;
// tap placed items to remove them. No drag-and-drop required.
function OrderedResponseInput({ q, answer, setAnswer, revealed }) {
  const placed    = Array.isArray(answer) ? answer : []
  const remaining = (q.options || []).map((_, i) => i).filter(i => !placed.includes(i))
  const correctOrder = q.correctOrder || []

  function addItem(i) {
    if (revealed) return
    setAnswer([...placed, i])
  }
  function removeItem(pos) {
    if (revealed) return
    setAnswer(placed.filter((_, idx) => idx !== pos))
  }

  return (
    <div className="space-y-5">
      {/* Placed zone */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Your order</p>
        {placed.length === 0 && !revealed && (
          <div className="px-4 py-6 rounded-2xl border border-dashed border-warm-300 text-center text-sm text-slate-300">
            Tap items below to add them in sequence
          </div>
        )}
        {placed.map((optIdx, pos) => {
          const isCorrectPos = !revealed || correctOrder[pos] === optIdx
          return (
            <div
              key={pos}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
                !revealed
                  ? 'border-lavender/30 bg-lavender-50'
                  : isCorrectPos ? 'border-success/40 bg-success-light' : 'border-danger/35 bg-danger-light'
              }`}
            >
              <span className={`shrink-0 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                !revealed ? 'bg-lavender text-white'
                : isCorrectPos ? 'bg-success text-white' : 'bg-danger text-white'
              }`}>{pos + 1}</span>
              <span className={`text-sm flex-1 ${
                revealed ? (isCorrectPos ? 'text-success font-semibold' : 'text-danger') : 'text-navy'
              }`}>{q.options[optIdx]}</span>
              {!revealed && (
                <button
                  onClick={() => removeItem(pos)}
                  className="text-slate-300 hover:text-danger transition-colors text-sm font-bold shrink-0"
                  aria-label="Remove"
                >✕</button>
              )}
              {revealed && !isCorrectPos && (
                <span className="text-[10px] text-danger font-semibold shrink-0">
                  → step {correctOrder.indexOf(optIdx) + 1}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Available zone — hidden once all placed */}
      {!revealed && remaining.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Available</p>
          {remaining.map(optIdx => (
            <button
              key={optIdx}
              onClick={() => addItem(optIdx)}
              className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-warm-200 bg-white hover:border-lavender/35 hover:bg-lavender-50/30 transition-all active:scale-[0.99] text-sm text-navy"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-warm-100 text-slate-400 text-xs font-bold flex items-center justify-center">+</span>
              {q.options[optIdx]}
            </button>
          ))}
        </div>
      )}

      {/* After reveal: show correct order if any position was wrong */}
      {revealed && placed.some((optIdx, pos) => correctOrder[pos] !== optIdx) && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-success uppercase tracking-widest">Correct order</p>
          {correctOrder.map((optIdx, pos) => (
            <p key={pos} className="flex items-center gap-2 text-sm text-navy">
              <span className="w-5 h-5 rounded-full bg-success text-white text-xs font-black flex items-center justify-center shrink-0">{pos + 1}</span>
              {q.options[optIdx]}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function SelectScreen({ onStart }) {
  const [mode, setMode]                 = useState('topic')
  const [selectedTopic, setSelectedTopic]   = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  // AI quiz state — separate from the static session
  const [aiTopic, setAiTopic]       = useState('')
  const [aiCount, setAiCount]       = useState(5)
  const [aiLoading, setAiLoading]   = useState(false)
  const [aiError, setAiError]       = useState(null)

  function handleStart() {
    if (mode === 'topic'   && selectedTopic)   onStart({ mode: 'topic',   id: selectedTopic })
    else if (mode === 'subject' && selectedSubject) onStart({ mode: 'subject', id: selectedSubject })
    else if (mode === 'random') onStart({ mode: 'random' })
  }

  async function handleAiStart() {
    if (!aiTopic) return
    setAiLoading(true)
    setAiError(null)

    // Yield one frame so React flushes the loading state to the DOM
    // before the network request begins. Without this, React 18's batching
    // can collapse setAiLoading(true) + setAiError() into one render if the
    // fetch fails instantly (e.g. proxy not running), making the loading
    // state invisible to the user.
    await new Promise(r => setTimeout(r, 80))

    try {
      const topic   = getAllTopics().find(t => t.id === aiTopic)
      const subject = SUBJECTS.find(s => s.topics.some(t => t.id === aiTopic))

      const questions = await generateTEASQuestions({
        subjectId:        subject?.id || '',
        topicId:          aiTopic,
        topicName:        topic?.name || aiTopic,
        count:            aiCount,
        difficultyProfile:'balanced',
        // All three UI-supported non-hotspot types
        questionTypes:    ['multiple_choice', 'multiple_select', 'supply_answer'],
      })

      if (!questions || questions.length === 0) {
        throw new Error('No questions returned — the AI may be unavailable.')
      }

      onStart({
        mode:      'ai',
        id:        aiTopic,
        subjectId: subject?.id || '',
        topicId:   aiTopic,
        questions,
      })
    } catch (err) {
      const msg = err.message || ''
      // Surface a human-readable hint for common failure modes:
      // empty msg = proxy error with no message, fetch/network/ECONNREFUSED = proxy down
      const needsHint = !msg || msg.includes('fetch') || msg.includes('network') || msg.includes('ECONNREFUSED') || msg.includes('API key')
      setAiError(
        needsHint
          ? 'Could not reach the AI service. Make sure ANTHROPIC_API_KEY is set in .env and the server is running.'
          : msg
      )
    } finally {
      setAiLoading(false)
    }
  }

  const staticDisabled = (mode === 'topic' && !selectedTopic) || (mode === 'subject' && !selectedSubject)

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      {/* Page title */}
      <div className="text-center pt-2">
        <h1 className="font-display font-bold text-navy" style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}>
          Quiz
        </h1>
        <p className="text-slate-400 text-sm mt-2 font-medium">ATI TEAS 7 · Confidence-rated · Spaced review</p>
      </div>

      {/* ── Static quiz modes ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'topic',   icon: '📖', label: 'By Topic',  desc: 'One focused area' },
          { id: 'subject', icon: '📚', label: 'By Subject', desc: 'Mix of topics' },
          { id: 'random',  icon: '🎲', label: 'Random',     desc: 'All subjects' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl border-2 text-center transition-all active:scale-[0.97] ${
              mode === m.id
                ? 'border-lavender bg-lavender-50 shadow-[0_0_0_3px_rgba(149,128,212,0.12)]'
                : 'border-warm-200 bg-white hover:border-lavender-200 hover:bg-lavender-50/40'
            }`}
          >
            <span className="text-2xl">{m.icon}</span>
            <span className={`text-sm font-bold ${mode === m.id ? 'text-lavender' : 'text-navy'}`}>{m.label}</span>
            <span className="text-xs text-slate-400">{m.desc}</span>
          </button>
        ))}
      </div>

      {mode === 'topic' && (
        <div className="bg-white rounded-2xl border border-warm-200 p-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Choose a topic</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full border border-warm-200 rounded-xl px-3 py-2.5 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-lavender/40 transition"
          >
            <option value="">— Select a topic —</option>
            {SUBJECTS.map((s) => (
              <optgroup key={s.id} label={`${s.icon} ${s.name}`}>
                {s.topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {mode === 'subject' && (
        <div className="bg-white rounded-2xl border border-warm-200 p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Choose a subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full border border-warm-200 rounded-xl px-3 py-2.5 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-lavender/40 transition"
            >
              <option value="">— Select a subject —</option>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </select>
          </div>
          {selectedSubject && (() => {
            const s    = SUBJECTS.find((x) => x.id === selectedSubject)
            const pool = s ? getQuizPoolBySubject(selectedSubject).length : 0
            return pool > 10 ? (
              <p className="text-xs text-slate-400 bg-warm-50 rounded-xl px-3 py-2 border border-warm-200">
                10 questions randomly sampled from {pool} in the {s?.name} pool — you may see different questions each attempt.
              </p>
            ) : null
          })()}
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={staticDisabled}
        className="w-full py-4 text-base font-extrabold text-white rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #9580D4 0%, #7c3aed 100%)' }}
      >
        Start Quiz →
      </button>

      {/* ── AI-generated quiz ────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-warm-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-cream px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            or generate fresh questions
          </span>
        </div>
      </div>

      {/* AI card — swaps to cinematic loading state during generation */}
      {aiLoading ? (
        /* ── Branded generation state — syringe as hero ── */
        <div
          className="rounded-2xl overflow-hidden relative text-center"
          style={{ background: 'linear-gradient(145deg, #060410 0%, #15083A 45%, #1C3082 100%)' }}
        >
          {/* Ambient glow bloom behind the syringe */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-56 h-56 rounded-full opacity-20 animate-pulse"
              style={{ background: 'radial-gradient(circle, #4070E0 20%, transparent 70%)' }}
            />
          </div>

          {/* Syringe — prominent, centered, luminous */}
          <div className="relative pt-8 pb-2">
            <img
              src="/brand/syringe.png"
              alt=""
              aria-hidden="true"
              className="relative w-40 h-40 mx-auto object-contain select-none"
              style={{
                filter: 'drop-shadow(0 0 28px rgba(37, 80, 200, 0.55)) brightness(1.15) saturate(1.1)',
              }}
            />
          </div>

          {/* Copy */}
          <div className="relative px-6 pb-2">
            <p className="text-white font-extrabold text-sm tracking-wide">Generating questions…</p>
            <p className="text-white/40 text-[11px] mt-1 leading-snug">
              Calibrated to ATI TEAS 7 · {aiCount} questions · Balanced difficulty
            </p>
          </div>

          {/* Chromatic shimmer progress bar */}
          <div className="relative px-6 pb-6 mt-3">
            <div className="h-px rounded-full bg-white/10 overflow-hidden">
              <div className="shimmer-sweep" />
            </div>
          </div>
        </div>
      ) : (
        /* ── Normal AI card ── */
        <div className="rounded-2xl border border-lavender-100 bg-gradient-to-br from-lavender-50/60 to-white p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">✦</span>
            <div>
              <p className="text-sm font-extrabold text-navy">AI-Generated Quiz</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Fresh TEAS 7 questions generated on-demand — includes mixed question types.
                Requires an active API connection.
              </p>
            </div>
          </div>

          {/* Topic selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Topic</label>
            <select
              value={aiTopic}
              onChange={(e) => { setAiTopic(e.target.value); setAiError(null) }}
              className="w-full border border-lavender-100 rounded-xl px-3 py-2.5 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-lavender/40 transition"
            >
              <option value="">— Select a topic —</option>
              {SUBJECTS.map((s) => (
                <optgroup key={s.id} label={`${s.icon} ${s.name}`}>
                  {s.topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Question count */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Questions</label>
            <div className="flex gap-2">
              {[5, 8, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setAiCount(n)}
                  className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                    aiCount === n
                      ? 'border-lavender bg-lavender-50 text-lavender'
                      : 'border-warm-200 bg-white text-slate-500 hover:border-lavender-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Error state */}
          {aiError && (
            <div className="rounded-xl bg-danger-light border border-danger/25 px-3 py-2.5 space-y-1">
              <p className="text-xs font-bold text-danger">Generation failed</p>
              <p className="text-xs text-danger/80 leading-snug">{aiError}</p>
              {selectedTopic && (
                <button
                  onClick={() => {
                    setAiError(null)
                    onStart({ mode: 'topic', id: selectedTopic || aiTopic })
                  }}
                  className="text-xs font-semibold text-lavender hover:underline"
                >
                  Use static questions for this topic instead →
                </button>
              )}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleAiStart}
            disabled={!aiTopic}
            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #9580D4 0%, #2AAFA3 100%)' }}
          >
            {`✦ Generate ${aiCount} Questions →`}
          </button>
        </div>
      )}

      <p className="text-center text-xs text-slate-400 pb-2">
        Rate your confidence after each answer — missed questions enter spaced review automatically.
      </p>
    </div>
  )
}

function CommonlyMissedBadge({ label }) {
  const [showTip, setShowTip] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 cursor-help"
        aria-label="Commonly missed question"
      >
        ⚠ Commonly Missed{label ? `: ${label}` : ''}
      </button>
      {showTip && (
        <div className="absolute left-0 top-7 z-20 w-64 bg-navy text-white text-xs rounded-xl p-3 shadow-xl">
          Commonly missed on the TEAS — slow down and watch for traps.
          <div className="absolute -top-1.5 left-4 w-3 h-3 bg-navy rotate-45" />
        </div>
      )}
    </div>
  )
}

function RationaleCard({ q, isCorrect }) {
  const r = q.rationale

  // Inline result line — no card, fits the unboxed quiz environment
  const resultLine = (
    <div className="flex items-center gap-2 mb-4">
      <span className={`text-sm font-bold ${isCorrect ? 'text-success' : 'text-danger'}`}>
        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
      </span>
      {q.teasConceptTested && (
        <span className="text-[10px] font-semibold text-slate-400 bg-warm-100 px-2 py-0.5 rounded-full">
          {q.teasConceptTested}
        </span>
      )}
    </div>
  )

  // No rich rationale — fall back to plain explanation
  if (!r) return (
    <div className="space-y-2">
      {resultLine}
      <p className="text-sm text-navy leading-relaxed">{q.explanation}</p>
    </div>
  )

  // Rich rationale — inline sections, no white card boxing
  return (
    <div className="space-y-4">
      {resultLine}

      {/* Primary explanation */}
      {(r.simpleExplanation || r.whyCorrect) && (
        <p className="text-sm text-navy leading-relaxed">
          {r.simpleExplanation || r.whyCorrect}
        </p>
      )}

      {/* Why others fail — only shown when both simpleExplanation AND whyCorrect exist */}
      {r.simpleExplanation && r.whyCorrect && (
        <p className="text-sm text-slate-500 leading-relaxed">
          <span className="font-semibold text-slate-600">Why others fail: </span>
          {r.whyWrong}
        </p>
      )}

      {/* Trap — tinted callout but no heavy border */}
      {r.commonTrap && (
        <div className={`rounded-xl px-3 py-2.5 ${
          q.isCommonlyMissed
            ? 'bg-amber-50 border border-amber-200/70'
            : 'bg-warm-100/80'
        }`}>
          <p className={`text-xs font-bold mb-0.5 ${q.isCommonlyMissed ? 'text-amber-700' : 'text-slate-400'}`}>
            {q.isCommonlyMissed ? '⚠ Common Trap' : 'Trap'}
          </p>
          <p className={`text-sm leading-snug ${q.isCommonlyMissed ? 'text-amber-900' : 'text-slate-600'}`}>
            {r.commonTrap}
          </p>
        </div>
      )}

      {/* Memory tip — inline, no card */}
      {r.memoryTip && (
        <p className="text-sm text-lavender leading-snug">
          💡 {r.memoryTip}
        </p>
      )}
    </div>
  )
}

function ConfidenceSelector({ value, onChange }) {
  const options = [
    { id: 'low',    label: 'Low',    desc: 'Guessed or unsure', color: 'border-danger/40 bg-danger-light text-danger hover:bg-red-100' },
    { id: 'medium', label: 'Medium', desc: 'Fairly confident',  color: 'border-warning/40 bg-warning-light text-warning hover:bg-amber-100' },
    { id: 'high',   label: 'High',   desc: 'Very confident',    color: 'border-success/40 bg-success-light text-success hover:bg-green-100' },
  ]
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.14em]">How confident were you?</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`p-2.5 rounded-xl border-2 text-center transition-all ${
              value === o.id ? `${o.color} border-opacity-100 ring-2 ring-offset-1 ring-current` : `${o.color} border-opacity-50`
            }`}
          >
            <div className="text-sm font-bold">{o.label}</div>
            <div className="text-xs opacity-80">{o.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Quiz() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { saveQuizResult } = useProgress()
  const { processAnswer } = useMissedBank()

  const urlTopicId   = searchParams.get('topicId')
  const urlSubjectId = searchParams.get('subjectId')

  const [quizConfig, setQuizConfig] = useState(() => {
    if (urlTopicId)   return { mode: 'topic',   id: urlTopicId }
    if (urlSubjectId) return { mode: 'subject',  id: urlSubjectId }
    return null
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected,     setSelected]     = useState(null)  // MCQ only
  const [answer,       setAnswer]       = useState(null)  // non-MCQ: array | string
  const [revealed,     setRevealed]     = useState(false)
  const [confidence,   setConfidence]   = useState(null)
  const [answers,      setAnswers]      = useState([])
  const [finished,     setFinished]     = useState(false)
  const [savedResult,  setSavedResult]  = useState(null)

  const rawQuestions = useMemo(() => {
    if (!quizConfig) return []
    // AI mode: questions pre-fetched in SelectScreen and passed via quizConfig
    if (quizConfig.mode === 'ai')      return quizConfig.questions || []
    if (quizConfig.mode === 'topic')   return getQuizPoolByTopic(quizConfig.id, 10)
    if (quizConfig.mode === 'subject') {
      const pool = getQuizPoolBySubject(quizConfig.id)
      return [...pool].sort(() => Math.random() - 0.5).slice(0, 10)
    }
    return [...QUIZ_POOL].sort(() => Math.random() - 0.5).slice(0, 10)
  }, [quizConfig])

  // normalizeQuestion unifies static-bank (q.correct) and AI-bank (q.correctIndex)
  // so all downstream code works regardless of which pool the question came from.
  const questions = useMemo(
    () => rawQuestions.map(q => normalizeQuestion(getEnrichedQuestion(q))),
    [rawQuestions]
  )

  function handleSelect(i) { if (!revealed) setSelected(i) }  // MCQ only — unchanged

  function handleReveal() {
    const q = questions[currentIndex]
    if (isMCQ(q)) {
      if (selected !== null) setRevealed(true)
    } else {
      if (hasValidAnswer(q, answer)) setRevealed(true)
    }
  }

  function handleNext() {
    const q = questions[currentIndex]
    const mcq = isMCQ(q)
    const isCorrect = mcq ? selected === q.correct : checkIsCorrect(q, answer)
    const conf = confidence || 'medium'

    const newAnswer = {
      questionId:    q.id,
      questionType:  q.questionType,
      selected:      mcq ? selected : null,        // kept for Results MCQ display
      studentAnswer: mcq ? selected : answer,      // full answer for any type
      correct:       q.correct ?? null,            // MCQ correct index
      correctAnswer: mcq ? null : (q.correctIndices ?? q.correctAnswer ?? q.correctOrder ?? null),
      isCorrect,
      confidence: conf,
    }
    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)

    // AI questions are session-only — their IDs are not in the static bank,
    // so adding them to the spaced-repetition bank creates zombie entries that
    // crash the Review page. Skip until AI question persistence is designed.
    if (quizConfig.mode !== 'ai') {
      processAnswer(q.id, q.topicId, q.subjectId, { correct: isCorrect, confidence: conf })
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelected(null)
      setAnswer(null)
      setRevealed(false)
      setConfidence(null)
    } else {
      const score     = newAnswers.filter((a) => a.isCorrect).length
      const subjectId = quizConfig.mode === 'topic'   ? getTopicSubject(quizConfig.id)?.id
        : quizConfig.mode === 'subject' ? quizConfig.id
        : quizConfig.mode === 'ai'      ? (quizConfig.subjectId || questions[0]?.subjectId)
        : questions[0]?.subjectId
      const topicId   = quizConfig.mode === 'topic'   ? quizConfig.id
        : quizConfig.mode === 'ai'      ? (quizConfig.topicId || questions[0]?.topicId)
        : questions[0]?.topicId

      const result = saveQuizResult({
        subjectId: subjectId || 'reading',
        topicId:   topicId   || quizConfig.id || 'mixed',
        score,
        total: questions.length,
        answers: newAnswers,
      })
      setSavedResult({ ...result, questions, answers: newAnswers, quizMode: quizConfig.mode, quizId: quizConfig.id })
      setFinished(true)
    }
  }

  if (!quizConfig) return <SelectScreen onStart={setQuizConfig} />

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-500">
          {quizConfig.mode === 'ai'
            ? 'No AI questions were returned. The API may be unavailable.'
            : 'No questions found for this selection.'}
        </p>
        <button onClick={() => setQuizConfig(null)} className="text-lavender underline text-sm font-semibold">
          Back to Quiz Selector
        </button>
      </div>
    )
  }

  if (finished && savedResult) {
    navigate('/results', { state: { result: savedResult } })
    return null
  }

  const q = questions[currentIndex]
  const subject = getTopicSubject(q.topicId) || SUBJECTS[0]
  const progressPct = ((currentIndex + (revealed ? 1 : 0)) / questions.length) * 100
  const canProceed = revealed && confidence !== null
  const correctSoFar = answers.filter((a) => a.isCorrect).length
  const mcq = isMCQ(q)
  const answerReady = mcq ? selected !== null : hasValidAnswer(q, answer)

  // Per-option visual state: default | selected | correct | wrong | dimmed
  function optionState(i) {
    if (!revealed) return selected === i ? 'selected' : 'default'
    if (i === q.correct) return 'correct'
    if (i === selected)  return 'wrong'
    return 'dimmed'
  }

  const optionStyles = {
    default:  {
      wrap: 'border-warm-200/80 bg-white hover:border-lavender/35 hover:bg-lavender-50/30 active:scale-[0.99] cursor-pointer',
      badge: 'bg-warm-100 text-slate-400 border border-warm-200',
      text: 'text-navy',
    },
    selected: {
      wrap: 'border-lavender bg-lavender-50 shadow-[0_0_0_3px_rgba(149,128,212,0.12)] cursor-pointer',
      badge: 'bg-lavender text-white',
      text: 'text-lavender font-semibold',
    },
    correct: {
      wrap: 'border-success/40 bg-success-light answer-correct',
      badge: 'bg-success text-white',
      text: 'text-success font-semibold',
    },
    wrong: {
      wrap: 'border-danger/35 bg-danger-light answer-wrong',
      badge: 'bg-danger text-white',
      text: 'text-danger',
    },
    dimmed: {
      wrap: 'border-warm-100 bg-warm-50/40 opacity-40',
      badge: 'bg-warm-100 text-slate-300',
      text: 'text-slate-400',
    },
  }

  return (
    <>
      {/* Exam progress ribbon — fixed 2px line under the nav, full viewport width */}
      <div className="fixed top-14 left-0 right-0 z-30 pointer-events-none">
        <div className="h-[2px] bg-warm-200/60">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #9580D4 0%, #2AAFA3 100%)' }}
          />
        </div>
        {/* Answered pip track */}
        <div className="flex gap-px mt-px">
          {questions.map((_, i) => {
            const ans = answers[i]
            return (
              <div
                key={i}
                className={`flex-1 h-[3px] transition-all duration-300 ${
                  ans ? (ans.isCorrect ? 'bg-success/50' : 'bg-danger/40') : 'bg-transparent'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* Exam environment — unboxed, the question IS the page */}
      <div className="max-w-2xl mx-auto page-enter pt-4">

        {/* Minimal context row */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(149,128,212,0.1)', color: '#9580D4' }}
            >
              {quizConfig.mode === 'topic'
                ? getTopicById(quizConfig.id)?.name
                : quizConfig.mode === 'subject' ? subject.name
                : quizConfig.mode === 'ai'      ? `✦ ${getTopicById(quizConfig.id)?.name || 'AI Quiz'}`
                : 'TEAS Prep'}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {currentIndex + 1} <span className="opacity-50">/ {questions.length}</span>
            </span>
            {answers.length > 0 && (
              <span className="text-xs font-semibold text-success">{correctSoFar} correct</span>
            )}
          </div>
          <button
            onClick={() => setQuizConfig(null)}
            className="text-xs text-slate-300 hover:text-slate-500 font-medium transition-colors"
          >
            ← Exit
          </button>
        </div>

        {/* Question — unboxed, editorial, keyed for slide-in */}
        <div key={currentIndex} className="journey-forward">

          {/* Metadata badges */}
          {(q.isCommonlyMissed || q.difficulty || q.skillTag) && (
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {q.isCommonlyMissed && <CommonlyMissedBadge label={q.commonlyMissedLabel} />}
              {q.difficulty && (
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${
                  q.difficulty === 1 ? 'bg-emerald-50 text-emerald-600' :
                  q.difficulty === 2 ? 'bg-amber-50 text-amber-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {q.difficulty === 1 ? 'Straightforward' : q.difficulty === 2 ? 'Moderate' : 'Tricky'}
                </span>
              )}
              {q.skillTag && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-warm-100 text-slate-500 font-medium">
                  {q.skillTag.replace(/-/g, ' ')}
                </span>
              )}
            </div>
          )}

          {/* Question text — large and typographically dominant */}
          <p className="text-lg md:text-xl font-semibold text-navy leading-relaxed mb-8">
            {q.question}
          </p>

          {/* Answer input — MCQ uses the existing elegant option buttons;
               non-MCQ routes to the appropriate input component            */}
          {mcq ? (
            <div className="space-y-2.5">
              {q.options.map((opt, i) => {
                const s = optionStyles[optionState(i)]
                return (
                  <button
                    key={i}
                    onClick={() => !revealed && handleSelect(i)}
                    disabled={revealed}
                    className={`w-full text-left flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 ${s.wrap}`}
                  >
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${s.badge}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`text-sm leading-relaxed pt-0.5 flex-1 ${s.text}`}>{opt}</span>
                    {revealed && i === q.correct && (
                      <svg className="w-5 h-5 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 10l4 4 8-8" />
                      </svg>
                    )}
                    {revealed && i === selected && i !== q.correct && (
                      <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M14 6l-8 8" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <NonMCQInput q={q} answer={answer} setAnswer={setAnswer} revealed={revealed} />
          )}

          {/* Post-reveal: rationale + confidence */}
          {revealed && (
            <div className="mt-8 pt-8 border-t border-warm-200 space-y-6 reveal-up">
              <RationaleCard q={q} isCorrect={mcq ? selected === q.correct : checkIsCorrect(q, answer)} />
              <ConfidenceSelector value={confidence} onChange={setConfidence} />
              <div className="flex justify-end print:hidden">
                <SaveClipButton
                  clip={{
                    subjectId: q.subjectId,
                    topicId:   q.topicId,
                    source:    (mcq ? selected === q.correct : checkIsCorrect(q, answer)) ? 'quiz' : 'rationale',
                    type:      (mcq ? selected === q.correct : checkIsCorrect(q, answer)) ? 'concept' : 'trap',
                    content: [
                      `Q: ${q.question}`,
                      mcq ? `\nCorrect: ${q.options[q.correct]}` : (q.correctAnswer ? `\nCorrect: ${q.correctAnswer}` : ''),
                      q.rationale?.simpleExplanation ? `\n\n${q.rationale.simpleExplanation}` : '',
                      q.rationale?.whyCorrect        ? `\nWhy correct: ${q.rationale.whyCorrect}` : '',
                      q.rationale?.whyWrong          ? `\nWhy others fail: ${q.rationale.whyWrong}` : '',
                      q.rationale?.commonTrap        ? `\nTrap: ${q.rationale.commonTrap}` : '',
                      q.rationale?.memoryTip         ? `\nMemory: ${q.rationale.memoryTip}` : '',
                      !q.rationale && q.explanation  ? `\n\n${q.explanation}` : '',
                    ].filter(Boolean).join(''),
                    tags: [
                      ...((mcq ? selected !== q.correct : !checkIsCorrect(q, answer)) ? ['missed'] : ['correct']),
                      ...(q.isCommonlyMissed ? ['commonly_missed'] : []),
                    ],
                  }}
                  label="Save"
                />
              </div>
            </div>
          )}
        </div>

        {/* Centered bottom action */}
        <div className="flex flex-col items-center gap-3 py-10">
          {!revealed ? (
            <button
              onClick={handleReveal}
              disabled={!answerReady}
              className="px-10 py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-25 disabled:cursor-not-allowed active:scale-[0.97]"
              style={
                answerReady
                  ? { background: 'linear-gradient(135deg, #9580D4 0%, #7c3aed 100%)', color: '#fff', boxShadow: '0 4px 20px rgba(124,58,237,0.25)' }
                  : { background: '#EBE0D5', color: '#C5BAB0' }
              }
            >
              {answerReady ? 'Reveal Answer →' : answerPrompt(q)}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-10 py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #9580D4 0%, #7c3aed 100%)', boxShadow: canProceed ? '0 4px 20px rgba(124,58,237,0.25)' : 'none' }}
            >
              {confidence === null
                ? 'Rate your confidence above'
                : currentIndex < questions.length - 1 ? 'Continue →' : 'See Results →'}
            </button>
          )}
          {!revealed && answerReady && (
            <p className="text-xs text-slate-300">Your answer is locked in — tap to see if you're right</p>
          )}
        </div>
      </div>
    </>
  )
}
