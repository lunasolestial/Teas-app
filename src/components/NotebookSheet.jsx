import { useState, useEffect, useRef } from 'react'
import { useNotebook, makeEmptyNotebook, seedNotebook, MAX_SCREENSHOT_BYTES, WARN_SCREENSHOT_BYTES } from '../hooks/useNotebook'
import { useClips } from '../hooks/useClips'
import { useProgress } from '../hooks/useProgress'
import { generateNotebookFromTranscript, explainClip as explainClipAI } from '../lib/aiClient'
import { getAIContent } from '../data/aiContent'
import { APP_NAME } from '../constants/brand'

// ── Section tokens — maps to nb.* Tailwind colour tokens ────────────────────
// accentL: border-l-* colour class (4 px left accent bar, print-visible)
// headerBg / headerText: top header strip
// bodyBg: tinted section body — nb.* palette from tailwind.config.js
const SECTION_STYLES = {
  mainIdea:          { icon: '💡', label: 'Main Idea',                accentL: 'border-l-blue-500',    headerBg: 'bg-blue-100/80',    headerText: 'text-blue-900',    bodyBg: 'bg-nb-concepts' },
  keyTerms:          { icon: '📋', label: 'Key Terms',                accentL: 'border-l-amber-500',   headerBg: 'bg-amber-100/80',   headerText: 'text-amber-900',   bodyBg: 'bg-nb-definitions' },
  mustKnowFacts:     { icon: '⭐', label: 'Must-Know Facts',          accentL: 'border-l-pink-500',    headerBg: 'bg-pink-100/80',    headerText: 'text-pink-900',    bodyBg: 'bg-nb-important' },
  notebookBullets:   { icon: '✏️', label: 'Write in My Notebook',     accentL: 'border-l-yellow-500',  headerBg: 'bg-yellow-100/80',  headerText: 'text-yellow-900',  bodyBg: 'bg-amber-50' },
  traps:             { icon: '⚠️', label: 'Common Traps',             accentL: 'border-l-red-500',     headerBg: 'bg-red-100/80',     headerText: 'text-red-900',     bodyBg: 'bg-nb-traps' },
  confusions:        { icon: '↔️', label: "Don't Confuse: X vs Y",   accentL: 'border-l-orange-500',  headerBg: 'bg-orange-100/80',  headerText: 'text-orange-900',  bodyBg: 'bg-orange-50' },
  practiceQuestions: { icon: '❓', label: 'Practice Questions',       accentL: 'border-l-emerald-500', headerBg: 'bg-emerald-100/80', headerText: 'text-emerald-900', bodyBg: 'bg-nb-examples' },
  diagrams:          { icon: '📐', label: 'Diagrams to Draw',         accentL: 'border-l-indigo-500',  headerBg: 'bg-indigo-100/80',  headerText: 'text-indigo-900',  bodyBg: 'bg-nb-diagrams' },
  categories:        { icon: '🔷', label: 'Categorized Notes',        accentL: 'border-l-sky-500',     headerBg: 'bg-sky-100/80',     headerText: 'text-sky-900',     bodyBg: 'bg-sky-50' },
  screenshots:       { icon: '📸', label: 'Screenshots / Visuals',    accentL: 'border-l-slate-400',   headerBg: 'bg-slate-100/80',   headerText: 'text-slate-700',   bodyBg: 'bg-slate-50' },
  unknown:           { icon: '🤔', label: "Still Don't Understand",   accentL: 'border-l-gray-400',    headerBg: 'bg-gray-100/80',    headerText: 'text-gray-700',    bodyBg: 'bg-white' },
  clips:             { icon: '📌', label: 'Saved Clips',              accentL: 'border-l-purple-500',  headerBg: 'bg-purple-100/80',  headerText: 'text-purple-900',  bodyBg: 'bg-nb-memory' },
}

const CAT_LABELS = { definitions: 'Definitions', concepts: 'Concepts', examples: 'Examples', clinical: 'Clinical' }

// ── Local uid (mirrors useNotebook's private uid) ────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

// ── Map an AI-generated practice question to the notebook storage schema ──────
// Handles both the legacy {question, answer, rationale} format and the new
// {questionType, difficulty, options, correctIndex, rationale:{...}} format.
function mapAIPracticeQuestion(q) {
  // New rich schema
  if (q.options && q.correctIndex != null) {
    const correct = q.options[q.correctIndex] ?? ''
    const r = q.rationale ?? {}
    const rationaleText = [
      r.whyCorrect ?? '',
      r.commonTrap ? `Trap: ${r.commonTrap}` : '',
      r.memoryTip  ? `Memory tip: ${r.memoryTip}` : '',
    ].filter(Boolean).join('\n')

    return {
      id: uid(),
      question: q.question,
      // Store all options with the correct one labelled, then the rationale
      answer: [
        q.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}${i === q.correctIndex ? ' ✓' : ''}`).join('\n'),
        rationaleText ? `\n${rationaleText}` : '',
      ].join(''),
      difficulty: q.difficulty ?? 2,
      teasConceptTested: q.teasConceptTested ?? '',
      questionType: q.questionType ?? 'multiple_choice',
    }
  }

  // Legacy fallback: {question, answer, rationale as string}
  return {
    id: uid(),
    question: q.question ?? '',
    answer: [q.answer, q.rationale ? `Rationale: ${q.rationale}` : ''].filter(Boolean).join('\n\n'),
    difficulty: q.difficulty ?? 2,
    teasConceptTested: q.teasConceptTested ?? '',
    questionType: q.questionType ?? 'multiple_choice',
  }
}

// ── Merge AI-generated data into existing notebook (non-destructive) ─────────
function mergeAIData(existing, ai) {
  return {
    ...existing,
    mainIdea: existing.mainIdea?.trim() ? existing.mainIdea : (ai.recapOneMinute || ai.mainIdea || existing.mainIdea || ''),
    keyTerms: [...existing.keyTerms, ...(ai.keyTerms || []).map((kt) => ({ id: uid(), term: kt.term, definition: kt.meaning || '' }))],
    mustKnowFacts: [...existing.mustKnowFacts, ...(ai.mustKnowFacts || []).map((f) => ({ id: uid(), text: f, checked: false }))],
    notebookBullets: [
      ...existing.notebookBullets,
      ...(ai.writeInNotebook || []).map((k) => ({ id: uid(), text: k })),
      ...(ai.memoryTricks || []).map((m) => ({ id: uid(), text: `💡 ${m}` })),
    ],
    traps: [...existing.traps, ...(ai.commonTraps || []).map((t) => ({ id: uid(), text: t }))],
    confusions: [
      ...existing.confusions,
      ...(ai.confuseWith || []).map((c) => ({ id: uid(), itemA: c.conceptA, itemB: c.conceptB, distinction: c.difference })),
    ],
    practiceQuestions: [
      ...existing.practiceQuestions,
      ...(ai.practiceQuestions || []).map((q) => mapAIPracticeQuestion(q)),
    ],
    diagrams: [...existing.diagrams, ...(ai.diagramSuggestions || []).map((d) => ({ id: uid(), description: d }))],
  }
}

// ── Replace all notebook sections with AI-generated data ─────────────────────
function replaceWithAI(existing, ai) {
  return {
    ...existing,
    mainIdea: ai.recapOneMinute || ai.mainIdea || '',
    keyTerms: (ai.keyTerms || []).map((kt) => ({ id: uid(), term: kt.term, definition: kt.meaning || '' })),
    mustKnowFacts: (ai.mustKnowFacts || []).map((f) => ({ id: uid(), text: f, checked: false })),
    notebookBullets: [
      ...(ai.writeInNotebook || []).map((k) => ({ id: uid(), text: k })),
      ...(ai.memoryTricks || []).map((m) => ({ id: uid(), text: `💡 ${m}` })),
    ],
    traps: (ai.commonTraps || []).map((t) => ({ id: uid(), text: t })),
    confusions: (ai.confuseWith || []).map((c) => ({ id: uid(), itemA: c.conceptA, itemB: c.conceptB, distinction: c.difference })),
    practiceQuestions: (ai.practiceQuestions || []).map((q) => mapAIPracticeQuestion(q)),
    diagrams: (ai.diagramSuggestions || []).map((d) => ({ id: uid(), description: d })),
  }
}

// ── NoteSection — study-block with left accent bar + tinted body ─────────────
function NoteSection({ sectionKey, collapsed, onToggle, children, printHide = false }) {
  const s = SECTION_STYLES[sectionKey]
  return (
    <div
      className={`nb-section-card rounded-2xl shadow-card overflow-hidden
        border border-warm-200 border-l-4 ${s.accentL}
        ${printHide ? 'print:hidden' : 'print:break-inside-avoid print:shadow-none'}`}
    >
      {/* Header strip */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 ${s.headerBg} ${s.headerText} text-left`}
      >
        <span className="flex items-center gap-2 text-sm font-bold tracking-wide">
          <span className="text-base leading-none">{s.icon}</span>
          {s.label}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body — tinted background, white in print */}
      {!collapsed && (
        <div className={`nb-section-body px-5 py-5 ${s.bodyBg} print:bg-white`}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Inline-editable item ─────────────────────────────────────────────────────
function EditableItem({ children, onDelete, editContent }) {
  const [editing, setEditing] = useState(false)
  return (
    <div className="group flex items-start gap-2">
      <div className="flex-1 min-w-0">
        {editing ? (
          <div>
            {editContent({ done: () => setEditing(false) })}
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <div className="flex-1">{children}</div>
            <div className="shrink-0 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity print:hidden">
              <button onClick={() => setEditing(true)} className="text-xs text-slate-400 hover:text-teal-600 p-0.5">✎</button>
              <button onClick={onDelete} className="text-xs text-slate-400 hover:text-red-500 p-0.5">✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section: Main Idea ───────────────────────────────────────────────────────
function MainIdeaSection({ topicId, value, setField }) {
  return (
    <textarea
      value={value}
      onChange={(e) => setField(topicId, 'mainIdea', e.target.value)}
      placeholder="Write the main idea of this topic in your own words..."
      className="w-full min-h-[80px] p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
    />
  )
}

// ── Section: Key Terms ───────────────────────────────────────────────────────
function KeyTermsSection({ topicId, items, addItem, updateItem, deleteItem }) {
  const [newTerm, setNewTerm] = useState('')
  const [newDef, setNewDef] = useState('')
  const [adding, setAdding] = useState(false)

  function handleAdd() {
    if (!newTerm.trim()) return
    addItem(topicId, 'keyTerms', { term: newTerm.trim(), definition: newDef.trim() })
    setNewTerm(''); setNewDef(''); setAdding(false)
  }

  const isGrid = items.length > 4

  return (
    <div className={isGrid ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' : 'space-y-2'}>
      {items.map((item) => (
        <EditableItem
          key={item.id}
          onDelete={() => deleteItem(topicId, 'keyTerms', item.id)}
          editContent={({ done }) => (
            <EditTermForm
              defaultTerm={item.term}
              defaultDef={item.definition}
              onSave={(t, d) => { updateItem(topicId, 'keyTerms', item.id, { term: t, definition: d }); done() }}
              onCancel={done}
            />
          )}
        >
          {/* Term chip + definition. Chip has hover tooltip showing definition again. */}
          <div className="flex items-start gap-2 flex-wrap">
            <span className="group/term relative shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300/60 cursor-default">
                {item.term}
              </span>
              {item.definition && (
                <span className="pointer-events-none absolute left-0 top-full z-10 mt-1.5 w-56 bg-navy text-white text-xs rounded-xl p-2.5 shadow-card-md leading-relaxed hidden group-hover/term:block print:hidden">
                  {item.definition}
                  <span className="absolute -top-1 left-3 w-2 h-2 bg-navy rotate-45" />
                </span>
              )}
            </span>
            {item.definition && (
              <span className="text-sm text-slate-600 leading-snug pt-0.5">{item.definition}</span>
            )}
          </div>
        </EditableItem>
      ))}

      {adding ? (
        <div className="space-y-1.5 pt-1 print:hidden">
          <input value={newTerm} onChange={(e) => setNewTerm(e.target.value)} placeholder="Term" className="w-full px-3 py-1.5 text-sm border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400" />
          <input value={newDef} onChange={(e) => setNewDef(e.target.value)} placeholder="Definition" className="w-full px-3 py-1.5 text-sm border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-3 py-1 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700">Add</button>
            <button onClick={() => setAdding(false)} className="px-3 py-1 text-xs text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="text-xs font-semibold text-violet-600 hover:text-violet-800 print:hidden">+ Add term</button>
      )}
    </div>
  )
}

function EditTermForm({ defaultTerm, defaultDef, onSave, onCancel }) {
  const [t, setT] = useState(defaultTerm)
  const [d, setD] = useState(defaultDef)
  return (
    <div className="space-y-1 print:hidden">
      <input value={t} onChange={(e) => setT(e.target.value)} className="w-full px-2 py-1 text-sm border border-violet-200 rounded focus:outline-none" />
      <input value={d} onChange={(e) => setD(e.target.value)} className="w-full px-2 py-1 text-sm border border-violet-200 rounded focus:outline-none" />
      <div className="flex gap-2">
        <button onClick={() => onSave(t, d)} className="px-2 py-0.5 text-xs bg-violet-600 text-white rounded">Save</button>
        <button onClick={onCancel} className="px-2 py-0.5 text-xs bg-slate-100 rounded">Cancel</button>
      </div>
    </div>
  )
}

// ── Section: Checklist (mustKnowFacts) ───────────────────────────────────────
function ChecklistSection({ topicId, section, items, addItem, updateItem, deleteItem, placeholder, accentColor = 'emerald' }) {
  const [newText, setNewText] = useState('')

  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.id} className="group flex items-start gap-2">
          <input
            type="checkbox"
            checked={!!item.checked}
            onChange={() => updateItem(topicId, section, item.id, { checked: !item.checked })}
            className="mt-0.5 shrink-0 cursor-pointer"
          />
          <p className={`flex-1 text-sm ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>{item.text}</p>
          <button onClick={() => deleteItem(topicId, section, item.id)} className="shrink-0 text-xs text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 print:hidden">✕</button>
        </div>
      ))}
      <div className="flex gap-2 mt-2 print:hidden">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && newText.trim()) { addItem(topicId, section, { text: newText.trim(), checked: false }); setNewText('') } }}
          placeholder={placeholder || 'Add item...'}
          className={`flex-1 px-3 py-1.5 text-sm border border-${accentColor}-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-400`}
        />
        <button
          onClick={() => { if (newText.trim()) { addItem(topicId, section, { text: newText.trim(), checked: false }); setNewText('') } }}
          className={`px-3 py-1.5 text-xs font-semibold bg-${accentColor}-600 text-white rounded-lg hover:bg-${accentColor}-700`}
        >+ Add</button>
      </div>
    </div>
  )
}

// ── Section: Simple bullet list (traps, notebookBullets, unknown) ────────────
function BulletListSection({
  topicId, section, items, addItem, updateItem, deleteItem,
  placeholder, bulletChar = '•', accentColor = 'slate',
  showRuledLines = false,     // when true: shows ruled-lines toggle
  isUnknown = false,          // when true: dotted-line style for each empty slot
}) {
  const [newText, setNewText] = useState('')
  const [ruledLines, setRuledLines] = useState(false)

  return (
    <div>
      {/* Ruled-lines toggle (for notebookBullets) */}
      {showRuledLines && (
        <label className="flex items-center gap-2 mb-3 pb-2 border-b border-warm-100 text-xs text-slate-500 cursor-pointer print:hidden w-fit">
          <input
            type="checkbox"
            checked={ruledLines}
            onChange={(e) => setRuledLines(e.target.checked)}
            className="w-3.5 h-3.5 accent-amber-500"
          />
          Show ruled lines for hand-copying
        </label>
      )}

      <div className={`space-y-2 ${ruledLines ? 'nb-ruled rounded-lg p-2' : ''}`}>
        {items.map((item) => (
          <EditableItem
            key={item.id}
            onDelete={() => deleteItem(topicId, section, item.id)}
            editContent={({ done }) => (
              <InlineTextEdit
                defaultValue={item.text}
                onSave={(v) => { updateItem(topicId, section, item.id, { text: v }); done() }}
                onCancel={done}
              />
            )}
          >
            {isUnknown ? (
              /* Dotted-line style for "still don't understand" */
              <div className="nb-dotted-line flex gap-2 pb-1">
                <span className="shrink-0 text-slate-300 font-bold text-sm">?</span>
                <span className="text-sm text-slate-700 flex-1">
                  {item.text || <span className="text-slate-300 italic">click ✎ to add</span>}
                </span>
              </div>
            ) : (
              <p className={`text-sm text-slate-800 flex gap-2 ${ruledLines ? 'leading-8' : ''}`}>
                <span className="shrink-0 text-slate-400">{bulletChar}</span>
                <span>{item.text || <span className="text-slate-300 italic">Empty — click ✎ to edit</span>}</span>
              </p>
            )}
          </EditableItem>
        ))}
      </div>{/* end ruled/plain list */}

      <div className="flex gap-2 mt-2 print:hidden">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && newText.trim()) { addItem(topicId, section, { text: newText.trim() }); setNewText('') } }}
          placeholder={placeholder || 'Add item...'}
          className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <button
          onClick={() => { if (newText.trim()) { addItem(topicId, section, { text: newText.trim() }); setNewText('') } }}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg hover:bg-slate-700"
        >+ Add</button>
      </div>
    </div>
  )
}

function InlineTextEdit({ defaultValue, onSave, onCancel }) {
  const [v, setV] = useState(defaultValue)
  return (
    <div className="flex gap-2 print:hidden">
      <input value={v} onChange={(e) => setV(e.target.value)} className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none" autoFocus />
      <button onClick={() => onSave(v)} className="px-2 py-0.5 text-xs bg-teal-600 text-white rounded">Save</button>
      <button onClick={onCancel} className="px-2 py-0.5 text-xs bg-slate-100 rounded">✕</button>
    </div>
  )
}

// ── Section: X vs Y Confusions ───────────────────────────────────────────────
function ConfusionsSection({ topicId, items, addItem, updateItem, deleteItem }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ itemA: '', itemB: '', distinction: '' })

  function handleAdd() {
    if (!form.itemA.trim() || !form.itemB.trim()) return
    addItem(topicId, 'confusions', form)
    setForm({ itemA: '', itemB: '', distinction: '' }); setAdding(false)
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="group rounded-xl border border-blush-300/40 bg-blush-50 p-3 relative">
          <button onClick={() => deleteItem(topicId, 'confusions', item.id)} className="absolute top-2 right-2 text-xs text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 print:hidden">✕</button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-blush text-white text-xs font-bold">{item.itemA}</span>
            <span className="text-slate-400 text-xs font-semibold">vs</span>
            <span className="px-2.5 py-0.5 rounded-full bg-lavender text-white text-xs font-bold">{item.itemB}</span>
          </div>
          {item.distinction && <p className="text-sm text-slate-700">{item.distinction}</p>}
        </div>
      ))}

      {adding ? (
        <div className="space-y-2 pt-1 print:hidden">
          <div className="grid grid-cols-2 gap-2">
            <input value={form.itemA} onChange={(e) => setForm({ ...form, itemA: e.target.value })} placeholder="Term A" className="px-3 py-1.5 text-sm border border-orange-200 rounded-lg focus:outline-none" />
            <input value={form.itemB} onChange={(e) => setForm({ ...form, itemB: e.target.value })} placeholder="Term B" className="px-3 py-1.5 text-sm border border-orange-200 rounded-lg focus:outline-none" />
          </div>
          <input value={form.distinction} onChange={(e) => setForm({ ...form, distinction: e.target.value })} placeholder="Key distinction (optional)" className="w-full px-3 py-1.5 text-sm border border-orange-200 rounded-lg focus:outline-none" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-3 py-1 text-xs font-semibold bg-orange-600 text-white rounded-lg">Add</button>
            <button onClick={() => setAdding(false)} className="px-3 py-1 text-xs bg-slate-100 rounded-lg">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="text-xs font-semibold text-orange-600 hover:text-orange-800 print:hidden">+ Add confusion pair</button>
      )}
    </div>
  )
}

// ── Section: Practice Questions ──────────────────────────────────────────────
function PracticeQSection({ topicId, items, addItem, updateItem, deleteItem }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ question: '', answer: '' })

  function handleAdd() {
    if (!form.question.trim()) return
    addItem(topicId, 'practiceQuestions', form)
    setForm({ question: '', answer: '' }); setAdding(false)
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <PracticeQCard
          key={item.id}
          item={item}
          onDelete={() => deleteItem(topicId, 'practiceQuestions', item.id)}
        />
      ))}

      {adding ? (
        <div className="space-y-2 pt-1 print:hidden">
          <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question" rows={2} className="w-full px-3 py-2 text-sm border border-teal-200 rounded-xl focus:outline-none resize-none" />
          <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Answer (optional)" rows={2} className="w-full px-3 py-2 text-sm border border-teal-200 rounded-xl focus:outline-none resize-none" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-3 py-1 text-xs font-semibold bg-teal-600 text-white rounded-lg">Add</button>
            <button onClick={() => setAdding(false)} className="px-3 py-1 text-xs bg-slate-100 rounded-lg">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="text-xs font-semibold text-teal-600 hover:text-teal-800 print:hidden">+ Add practice question</button>
      )}
    </div>
  )
}

function PracticeQCard({ item, onDelete }) {
  const [showAnswer, setShowAnswer] = useState(false)

  const difficultyLabel = { 1: 'Foundation', 2: 'Moderate', 3: 'Advanced' }[item.difficulty]
  const difficultyColor = {
    1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    2: 'bg-amber-50 text-amber-700 border-amber-200',
    3: 'bg-red-50 text-red-600 border-red-200',
  }[item.difficulty] ?? 'bg-slate-50 text-slate-500 border-slate-200'

  return (
    <div className="group rounded-xl border border-teal-200 bg-teal-50/40 p-3 relative">
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 text-xs text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 print:hidden"
      >
        ✕
      </button>

      {/* Metadata row — difficulty + concept */}
      {(item.difficulty || item.teasConceptTested) && (
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {item.difficulty && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor}`}>
              {difficultyLabel}
            </span>
          )}
          {item.teasConceptTested && (
            <span className="text-[10px] text-slate-500 font-medium truncate">
              {item.teasConceptTested}
            </span>
          )}
        </div>
      )}

      <p className="text-sm font-semibold text-slate-800 mb-1.5 leading-snug pr-4">
        {item.question}
      </p>

      {item.answer && (
        <>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors print:hidden"
          >
            {showAnswer ? '▼ Hide answer & rationale' : '▶ Show answer & rationale'}
          </button>
          {showAnswer && (
            <div className="mt-2 pt-2 border-t border-teal-200">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                {item.answer}
              </pre>
            </div>
          )}
          <div className="hidden print:block mt-2 pt-2 border-t border-teal-200">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{item.answer}</pre>
          </div>
        </>
      )}
    </div>
  )
}

// ── Section: Diagrams ────────────────────────────────────────────────────────
function DiagramsSection({ topicId, items, addItem, deleteItem }) {
  const [newDesc, setNewDesc] = useState('')

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-indigo-800 flex items-center gap-1.5">
              <span className="text-indigo-400">□</span> {item.description}
            </p>
            <button onClick={() => deleteItem(topicId, 'diagrams', item.id)} className="text-xs text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 print:hidden">✕</button>
          </div>
          {/* Sketch box — white in print, tinted on screen */}
          <div className="nb-sketch-box min-h-32 border-2 border-dashed border-indigo-300/60 rounded-xl bg-white/70 print:bg-white flex items-center justify-center relative">
            <span className="text-sm text-indigo-200 font-medium select-none print:text-gray-300">
              [ Sketch here ]
            </span>
          </div>
        </div>
      ))}
      <div className="flex gap-2 print:hidden">
        <input
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && newDesc.trim()) { addItem(topicId, 'diagrams', { description: newDesc.trim() }); setNewDesc('') } }}
          placeholder="Add diagram suggestion..."
          className="flex-1 px-3 py-1.5 text-sm border border-indigo-200 rounded-lg focus:outline-none"
        />
        <button
          onClick={() => { if (newDesc.trim()) { addItem(topicId, 'diagrams', { description: newDesc.trim() }); setNewDesc('') } }}
          className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >+ Add</button>
      </div>
    </div>
  )
}

// ── Section: Categories ──────────────────────────────────────────────────────
function CategoriesSection({ topicId, categories, addCategoryItem, deleteCategoryItem }) {
  const [activeTab, setActiveTab] = useState('definitions')
  const [newText, setNewText] = useState('')
  const items = (categories || {})[activeTab] || []

  function handleAdd() {
    if (!newText.trim()) return
    addCategoryItem(topicId, activeTab, newText.trim())
    setNewText('')
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1 flex-wrap print:hidden">
        {Object.entries(CAT_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${activeTab === key ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Print: show all categories */}
      <div className="hidden print:block space-y-3">
        {Object.entries(CAT_LABELS).map(([key, label]) => {
          const catItems = (categories || {})[key] || []
          if (!catItems.length) return null
          return (
            <div key={key}>
              <p className="text-xs font-bold text-sky-800 uppercase tracking-wide mb-1">{label}</p>
              <ul className="space-y-0.5">{catItems.map((i) => <li key={i.id} className="text-sm text-slate-700">• {i.text}</li>)}</ul>
            </div>
          )
        })}
      </div>

      {/* Interactive: show active tab */}
      <div className="space-y-1.5 print:hidden">
        {items.length === 0 && <p className="text-xs text-slate-400 italic">No {CAT_LABELS[activeTab].toLowerCase()} yet — add some below.</p>}
        {items.map((item) => (
          <div key={item.id} className="group flex items-start gap-2">
            <span className="text-slate-400 text-xs mt-0.5">•</span>
            <p className="flex-1 text-sm text-slate-800">{item.text}</p>
            <button onClick={() => deleteCategoryItem(topicId, activeTab, item.id)} className="text-xs text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100">✕</button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
            placeholder={`Add to ${CAT_LABELS[activeTab].toLowerCase()}...`}
            className="flex-1 px-3 py-1.5 text-sm border border-sky-200 rounded-lg focus:outline-none"
          />
          <button onClick={handleAdd} className="px-3 py-1.5 text-xs font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-700">+ Add</button>
        </div>
      </div>
    </div>
  )
}

// ── Section: Screenshots ─────────────────────────────────────────────────────
function ScreenshotsSection({ topicId, screenshots, addScreenshot, deleteScreenshot }) {
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (file.size > MAX_SCREENSHOT_BYTES) {
      setError(`Image too large for local-only storage (${(file.size / 1024).toFixed(0)} KB). Please use an image under 1 MB.`)
      return
    }
    setError(null)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      if (file.size > WARN_SCREENSHOT_BYTES) {
        // Compress via canvas
        const img = new Image()
        img.onload = () => {
          const scale = Math.sqrt(WARN_SCREENSHOT_BYTES / file.size)
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(img.width * scale)
          canvas.height = Math.round(img.height * scale)
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
          addScreenshot(topicId, canvas.toDataURL('image/jpeg', 0.75), file.name)
        }
        img.src = dataUrl
      } else {
        addScreenshot(topicId, dataUrl, file.name)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">{error}</div>
      )}

      {screenshots.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {screenshots.map((s) => (
            <div key={s.id} className="group relative rounded-xl overflow-hidden border border-slate-200">
              <img src={s.dataUrl} alt={s.caption} className="w-full h-28 object-cover" />
              <div className="px-2 py-1 bg-white">
                <p className="text-xs text-slate-500 truncate">{s.caption}</p>
                <p className="text-xs text-slate-400">{(s.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                onClick={() => deleteScreenshot(topicId, s.id)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center print:hidden"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="print:hidden">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-dashed border-slate-300 text-slate-600 rounded-xl hover:border-teal-400 hover:text-teal-700 transition-colors"
        >
          📎 Upload Screenshot
        </button>
        <p className="text-xs text-slate-400 mt-1">Images over 400 KB are automatically compressed. Hard limit: 1 MB.</p>
      </div>
    </div>
  )
}

// ── Section: Saved Clips ─────────────────────────────────────────────────────
const CLIP_TYPE_ICON = { keyTerm: '📚', concept: '💡', trap: '⚠️', question: '❓', summary: '📝', screenshot: '📸' }
const SOURCE_LABEL   = { video: 'Video', quiz: 'Quiz', rationale: 'Rationale', custom: 'Custom' }

function ClipsSection({ clips, onRemove, onExplain, explainLoadingIds = {}, explainCooldownIds = {} }) {
  if (clips.length === 0) {
    return <p className="text-xs text-slate-400 italic">No clips yet. Save clips from quizzes and videos to see them here.</p>
  }

  const grouped = clips.reduce((acc, c) => {
    const key = c.source
    if (!acc[key]) acc[key] = []
    acc[key].push(c)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([source, items]) => (
        <div key={source}>
          <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">From {SOURCE_LABEL[source] || source}</p>
          <div className="space-y-2">
            {items.map((c) => (
              <div key={c.id} className="group p-2.5 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 text-base">{CLIP_TYPE_ICON[c.type] || '📌'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-purple-800 capitalize">{c.type}</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{c.content}</p>
                    {c.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {c.tags.map((t) => <span key={t} className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <button onClick={() => onRemove(c.id)} className="shrink-0 text-xs text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 print:hidden">✕</button>
                </div>

                {/* AI context (if available) */}
                {c.aiContext && (
                  <div className="ml-6 p-2.5 bg-white border border-purple-200 rounded-lg space-y-1.5">
                    <p className="text-xs font-semibold text-purple-700">AI Explanation</p>
                    {c.aiContext.clipSummary && <p className="text-xs text-slate-700"><span className="font-medium">Summary:</span> {c.aiContext.clipSummary}</p>}
                    {c.aiContext.keyTakeaway && <p className="text-xs text-slate-700"><span className="font-medium">Key takeaway:</span> {c.aiContext.keyTakeaway}</p>}
                    {c.aiContext.teasConceptTested && <p className="text-xs text-slate-600"><span className="font-medium">TEAS concept:</span> {c.aiContext.teasConceptTested}</p>}
                    {c.aiContext.commonTrap && (
                      <p className="text-xs bg-amber-50 border border-amber-200 rounded p-1.5 text-amber-800">⚠ {c.aiContext.commonTrap}</p>
                    )}
                    {c.aiContext.memoryTip && <p className="text-xs text-indigo-700">💡 {c.aiContext.memoryTip}</p>}
                    {c.aiContext.whereItFits && <p className="text-xs text-slate-500 italic">{c.aiContext.whereItFits}</p>}
                  </div>
                )}

                {/* Explain button */}
                {onExplain && (
                  <div className="ml-6 space-y-1 print:hidden">
                    {explainLoadingIds[c.id] ? (
                      <span className="text-xs text-purple-500 animate-pulse">Explaining…</span>
                    ) : explainCooldownIds[c.id] ? (
                      <span className="text-xs text-slate-400">⏳ Wait…</span>
                    ) : c.aiContext ? (
                      <button
                        onClick={() => onExplain(c)}
                        className="text-xs text-slate-400 hover:text-purple-600 underline"
                      >
                        Re-explain (AI)
                      </button>
                    ) : (
                      <button
                        onClick={() => onExplain(c)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800 border border-purple-200 px-2 py-0.5 rounded-lg"
                      >
                        ✦ Explain (AI)
                      </button>
                    )}
                    <p className="text-xs text-slate-400 italic">
                      AI may be imperfect — always verify with TEAS-aligned materials.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main NotebookSheet ────────────────────────────────────────────────────────
export default function NotebookSheet({ topicId, topic, subject }) {
  const nb = useNotebook()
  const { getClipsByTopic, removeClip, updateClip } = useClips()
  const { progress } = useProgress()

  // AI smart notes state
  const [aiStatus, setAiStatus] = useState(null) // null | 'loading' | 'ready' | 'error'
  const [aiData, setAiData] = useState(null)
  const [aiError, setAiError] = useState('')
  // Per-clip explain loading: { [clipId]: true }
  const [explainLoading, setExplainLoading] = useState({})
  const [generateCooldown, setGenerateCooldown] = useState(false)
  const [explainCooldown, setExplainCooldown] = useState({}) // { [clipId]: true }

  // Auto-seed on first open
  useEffect(() => {
    if (!topicId || !topic) return
    if (!nb.getNotebook(topicId)) {
      const ai = getAIContent(topicId)
      const empty = makeEmptyNotebook(topicId)
      nb.initNotebook(topicId, seedNotebook(empty, topic, ai))
    }
  }, [topicId])

  const data = nb.getNotebook(topicId)
  const clips = getClipsByTopic(topicId)

  // Collect transcript text for all videos in this topic
  function getTopicTranscript() {
    if (!topic?.videos?.length) return ''
    const parts = topic.videos
      .map((v) => {
        const entry = progress.videoTranscripts?.[v.id]
        if (!entry?.text?.trim()) return null
        return `[${v.title}]\n${entry.text.trim()}`
      })
      .filter(Boolean)
    return parts.join('\n\n')
  }

  async function handleGenerateSmartNotes() {
    const transcriptText = getTopicTranscript()
    if (!transcriptText) {
      setAiStatus('error')
      setAiError('No notes found. Open any video on this topic, click "Take Notes" in the player, write or paste your notes, and save them first.')
      return
    }
    setAiStatus('loading')
    setAiError('')
    setAiData(null)
    try {
      const result = await generateNotebookFromTranscript(transcriptText, {
        subjectId: subject?.id,
        topicId,
      })
      setAiData(result)
      setAiStatus('ready')
    } catch (err) {
      setAiStatus('error')
      setAiError(err.message ?? 'AI request failed. Make sure the proxy server is running.')
    } finally {
      // 10-second cooldown prevents rapid re-triggers after the call resolves
      setGenerateCooldown(true)
      setTimeout(() => setGenerateCooldown(false), 10_000)
    }
  }

  function applyAI(mode) {
    if (!aiData || !data) return
    const updated = mode === 'replace' ? replaceWithAI(data, aiData) : mergeAIData(data, aiData)
    nb.initNotebook(topicId, { ...updated, lastModified: new Date().toISOString() })
    setAiStatus(null)
    setAiData(null)
  }

  async function handleExplainClip(clip) {
    setExplainLoading((prev) => ({ ...prev, [clip.id]: true }))
    try {
      const transcriptText = getTopicTranscript()
      const aiContext = await explainClipAI({
        content: clip.content,
        type: clip.type,
        userCaption: clip.tags?.join(', '),
        transcriptText,
      })
      updateClip(clip.id, { aiContext })
    } catch (err) {
      console.error('[explain clip]', err.message)
    } finally {
      setExplainLoading((prev) => { const n = { ...prev }; delete n[clip.id]; return n })
      // 8-second per-clip cooldown
      setExplainCooldown((prev) => ({ ...prev, [clip.id]: true }))
      setTimeout(() => setExplainCooldown((prev) => { const n = { ...prev }; delete n[clip.id]; return n }), 8_000)
    }
  }

  function isCollapsed(key) {
    return !!(data?.collapsed?.[key])
  }
  function toggle(key) {
    if (data) nb.toggleCollapse(topicId, key)
  }

  function handleExport() {
    const exportData = { topicId, topicName: topic?.name, subjectName: subject?.name, exportDate: new Date().toISOString(), notebook: data, clips }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${topicId}-notebook.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClear() {
    if (window.confirm('Reset this notebook? This removes all your edits but keeps clips. Cannot be undone.')) {
      nb.clearNotebook(topicId)
    }
  }

  if (!data) return (
    <div className="flex items-center justify-center py-10">
      <p className="text-sm text-slate-400">Initializing notebook…</p>
    </div>
  )

  const hasTranscript = !!getTopicTranscript()

  return (
    <div className="space-y-3">
      {/* Generate Smart Notes banner */}
      <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200 rounded-xl p-4 print:hidden space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-teal-800">✦ Generate Smart Notes (AI)</p>
            <p className="text-xs text-teal-600 mt-0.5">
              {hasTranscript
                ? 'Video notes found — AI will fill all notebook sections from your saved notes.'
                : 'No notes yet. Open a video → click "Take Notes" → save your notes, then come back here.'}
            </p>
          </div>
          <button
            onClick={handleGenerateSmartNotes}
            disabled={aiStatus === 'loading' || generateCooldown}
            className={`shrink-0 px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
              aiStatus === 'loading' || generateCooldown
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : hasTranscript
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            {aiStatus === 'loading' ? '⏳ Generating…' : generateCooldown ? '⏳ Wait…' : '✦ Generate'}
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 italic">
          AI may be imperfect — always verify with TEAS-aligned materials.
        </p>

        {/* Error state */}
        {aiStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {aiError}
            <button onClick={() => setAiStatus(null)} className="ml-2 text-xs underline">Dismiss</button>
          </div>
        )}

        {/* Ready state — merge/replace prompt */}
        {aiStatus === 'ready' && aiData && (
          <div className="bg-white border border-teal-300 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-800">
              AI notes ready — how would you like to apply them?
            </p>
            <p className="text-xs text-slate-500">
              <strong>Merge</strong> adds AI content alongside what you already have.
              <strong> Replace</strong> overwrites all sections (your notes will be lost).
            </p>
            {aiData.recapOneMinute && (
              <p className="text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-lg p-2 line-clamp-2">
                Preview: {aiData.recapOneMinute}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => applyAI('merge')}
                className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-xl hover:bg-teal-700"
              >
                Merge
              </button>
              <button
                onClick={() => applyAI('replace')}
                className="px-4 py-2 text-sm font-semibold border-2 border-red-200 text-red-700 rounded-xl hover:bg-red-50"
              >
                Replace
              </button>
              <button
                onClick={() => { setAiStatus(null); setAiData(null) }}
                className="px-4 py-2 text-sm text-slate-500 rounded-xl hover:bg-slate-100"
              >
                Discard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notebook header */}
      <div className="flex items-start justify-between gap-3 print:hidden">
        <div>
          <p className="text-xs text-slate-400">
            Last modified: {new Date(data.lastModified).toLocaleDateString()}
            {' '}· {clips.length} clip{clips.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <button onClick={() => window.print()} className="px-3 py-1.5 text-xs font-semibold border-2 border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">🖨 Print</button>
          <button onClick={handleExport} className="px-3 py-1.5 text-xs font-semibold border-2 border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">⬇ Export JSON</button>
          <button onClick={handleClear} className="px-3 py-1.5 text-xs font-semibold text-red-500 border-2 border-red-100 rounded-lg hover:bg-red-50">Reset</button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block border-b-2 border-slate-300 pb-3 mb-4">
        <p className="font-bold text-xl text-slate-900">{topic?.name}</p>
        <p className="text-slate-500 text-xs">{subject?.name} · {APP_NAME} · {new Date().toLocaleDateString()}</p>
      </div>

      {/* Sections */}
      <NoteSection sectionKey="mainIdea" collapsed={isCollapsed('mainIdea')} onToggle={() => toggle('mainIdea')}>
        <MainIdeaSection topicId={topicId} value={data.mainIdea} setField={nb.setField} />
      </NoteSection>

      <NoteSection sectionKey="keyTerms" collapsed={isCollapsed('keyTerms')} onToggle={() => toggle('keyTerms')}>
        <KeyTermsSection topicId={topicId} items={data.keyTerms} addItem={nb.addItem} updateItem={nb.updateItem} deleteItem={nb.deleteItem} />
      </NoteSection>

      <NoteSection sectionKey="mustKnowFacts" collapsed={isCollapsed('mustKnowFacts')} onToggle={() => toggle('mustKnowFacts')}>
        <ChecklistSection topicId={topicId} section="mustKnowFacts" items={data.mustKnowFacts} addItem={nb.addItem} updateItem={nb.updateItem} deleteItem={nb.deleteItem} placeholder="Add a must-know fact…" accentColor="emerald" />
      </NoteSection>

      <NoteSection sectionKey="notebookBullets" collapsed={isCollapsed('notebookBullets')} onToggle={() => toggle('notebookBullets')}>
        <BulletListSection topicId={topicId} section="notebookBullets" items={data.notebookBullets} addItem={nb.addItem} updateItem={nb.updateItem} deleteItem={nb.deleteItem} placeholder="Add notebook bullet…" bulletChar="★" showRuledLines />
      </NoteSection>

      <NoteSection sectionKey="traps" collapsed={isCollapsed('traps')} onToggle={() => toggle('traps')}>
        <BulletListSection topicId={topicId} section="traps" items={data.traps} addItem={nb.addItem} updateItem={nb.updateItem} deleteItem={nb.deleteItem} placeholder="Add a common trap…" bulletChar="⚠️" />
      </NoteSection>

      <NoteSection sectionKey="confusions" collapsed={isCollapsed('confusions')} onToggle={() => toggle('confusions')}>
        <ConfusionsSection topicId={topicId} items={data.confusions} addItem={nb.addItem} updateItem={nb.updateItem} deleteItem={nb.deleteItem} />
      </NoteSection>

      <NoteSection sectionKey="practiceQuestions" collapsed={isCollapsed('practiceQuestions')} onToggle={() => toggle('practiceQuestions')}>
        <PracticeQSection topicId={topicId} items={data.practiceQuestions} addItem={nb.addItem} updateItem={nb.updateItem} deleteItem={nb.deleteItem} />
      </NoteSection>

      <NoteSection sectionKey="diagrams" collapsed={isCollapsed('diagrams')} onToggle={() => toggle('diagrams')}>
        <DiagramsSection topicId={topicId} items={data.diagrams} addItem={nb.addItem} deleteItem={nb.deleteItem} />
      </NoteSection>

      <NoteSection sectionKey="categories" collapsed={isCollapsed('categories')} onToggle={() => toggle('categories')}>
        <CategoriesSection topicId={topicId} categories={data.categories} addCategoryItem={nb.addCategoryItem} deleteCategoryItem={nb.deleteCategoryItem} />
      </NoteSection>

      <NoteSection sectionKey="unknown" collapsed={isCollapsed('unknown')} onToggle={() => toggle('unknown')}>
        <BulletListSection topicId={topicId} section="unknown" items={data.unknown} addItem={nb.addItem} updateItem={nb.updateItem} deleteItem={nb.deleteItem} placeholder="Write something you want to revisit…" bulletChar="?" isUnknown />
      </NoteSection>

      <NoteSection sectionKey="screenshots" collapsed={isCollapsed('screenshots')} onToggle={() => toggle('screenshots')} printHide={false}>
        <ScreenshotsSection topicId={topicId} screenshots={data.screenshots} addScreenshot={nb.addScreenshot} deleteScreenshot={nb.deleteScreenshot} />
      </NoteSection>

      <NoteSection sectionKey="clips" collapsed={isCollapsed('clips')} onToggle={() => toggle('clips')} printHide={true}>
        <ClipsSection
          clips={clips}
          onRemove={removeClip}
          onExplain={handleExplainClip}
          explainLoadingIds={explainLoading}
          explainCooldownIds={explainCooldown}
        />
      </NoteSection>
    </div>
  )
}
