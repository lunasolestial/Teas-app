import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useClips } from '../hooks/useClips'
import { useProgress } from '../hooks/useProgress'
import { explainClip as explainClipAI } from '../lib/aiClient'
import { SUBJECTS, getAllTopics, getTopicById, getTopicSubject } from '../data/subjects'

const CLIP_TYPE_ICON = { keyTerm: '📚', concept: '💡', trap: '⚠️', question: '❓', summary: '📝', screenshot: '📸' }
const SOURCE_COLOR   = { video: 'bg-rose-100 text-rose-700', quiz: 'bg-lavender-100 text-lavender', rationale: 'bg-amber-100 text-amber-700', custom: 'bg-warm-100 text-slate-600' }

// Renders the practice question embedded in an AI clip explanation.
// pq shape: { question, options[], correctIndex, rationale }
function ClipPracticeQuestion({ pq }) {
  const [revealed, setRevealed] = useState(false)
  if (!pq?.question || !Array.isArray(pq.options)) return null
  return (
    <div className="p-3 bg-white border border-warm-200 rounded-xl space-y-2.5">
      <p className="text-[10px] font-extrabold text-lavender uppercase tracking-[0.12em]">Practice Question</p>
      <p className="text-xs font-semibold text-navy leading-snug">{pq.question}</p>
      <div className="space-y-1">
        {pq.options.map((opt, i) => {
          const isCorrect = i === pq.correctIndex
          const show = revealed
          return (
            <div
              key={i}
              className={`flex items-start gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                show && isCorrect
                  ? 'bg-success-light text-success font-semibold'
                  : show && !isCorrect
                  ? 'text-slate-400'
                  : 'text-navy'
              }`}
            >
              <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black mt-px ${
                show && isCorrect ? 'bg-success text-white' : 'bg-warm-100 text-slate-400'
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </div>
          )
        })}
      </div>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="text-[10px] font-bold text-lavender hover:text-lavender-500 transition-colors"
        >
          Reveal answer →
        </button>
      ) : (
        pq.rationale && (
          <p className="text-xs text-slate-500 leading-snug border-t border-warm-100 pt-2">
            {pq.rationale}
          </p>
        )
      )}
    </div>
  )
}

function ClipCard({ clip, onRemove, onFile, onExplain, isExplaining, isCoolingDown }) {
  const [filing, setFiling] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState('')
  const [showContext, setShowContext] = useState(false)
  const topic = clip.topicId ? getTopicById(clip.topicId) : null
  const subject = topic ? getTopicSubject(topic.id) : null

  function handleFile() {
    if (!selectedTopic) return
    const t = getAllTopics().find((x) => x.id === selectedTopic)
    const s = t ? SUBJECTS.find((sub) => sub.topics.some((tp) => tp.id === t.id)) : null
    onFile(clip.id, selectedTopic, s?.id || null)
    setFiling(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-warm-200 p-4 space-y-2 shadow-card">
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">{CLIP_TYPE_ICON[clip.type] || '📌'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${SOURCE_COLOR[clip.source] || 'bg-warm-100 text-slate-600'}`}>
              {clip.source}
            </span>
            <span className="text-xs font-medium text-slate-500 capitalize">{clip.type}</span>
            {topic && subject && (
              <Link to={`/topic/${topic.id}`} className={`text-xs ${subject.textClass} hover:underline`}>
                {subject.icon} {topic.name}
              </Link>
            )}
            <span className="text-xs text-slate-400 ml-auto">{new Date(clip.timestamp).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-navy whitespace-pre-wrap break-words">{clip.content}</p>
          {clip.tags?.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {clip.tags.map((t) => (
                <span key={t} className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI context */}
      {clip.aiContext && (
        <div>
          <button
            onClick={() => setShowContext(!showContext)}
            className="text-xs text-lavender hover:text-lavender-500 font-semibold transition-colors"
          >
            {showContext ? '▼ Hide AI explanation' : '▶ Show AI explanation'}
          </button>
          {showContext && (
            <div className="mt-2 space-y-2">
              <div className="p-3 bg-lavender-50 border border-lavender-100 rounded-xl space-y-1.5">
                {clip.aiContext.clipSummary && <p className="text-xs text-navy"><span className="font-semibold">Summary:</span> {clip.aiContext.clipSummary}</p>}
                {clip.aiContext.keyTakeaway && <p className="text-xs text-navy"><span className="font-semibold">Key takeaway:</span> {clip.aiContext.keyTakeaway}</p>}
                {clip.aiContext.teasConceptTested && <p className="text-xs text-slate-600"><span className="font-semibold">TEAS concept:</span> {clip.aiContext.teasConceptTested}</p>}
                {clip.aiContext.commonTrap && (
                  <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-1.5 text-amber-800">⚠ {clip.aiContext.commonTrap}</p>
                )}
                {clip.aiContext.memoryTip && <p className="text-xs text-lavender">💡 {clip.aiContext.memoryTip}</p>}
                {clip.aiContext.whereItFits && <p className="text-xs text-slate-500 italic">{clip.aiContext.whereItFits}</p>}
              </div>

              {/* Practice question embedded in the AI explanation — render if present */}
              {clip.aiContext.practiceQuestion && (
                <ClipPracticeQuestion pq={clip.aiContext.practiceQuestion} />
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        {!clip.topicId && (
          <>
            {filing ? (
              <div className="flex gap-2 flex-1">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="flex-1 text-xs border border-warm-200 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-lavender/50"
                >
                  <option value="">— Select topic —</option>
                  {SUBJECTS.map((s) => (
                    <optgroup key={s.id} label={`${s.icon} ${s.name}`}>
                      {s.topics.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <button onClick={handleFile} disabled={!selectedTopic} className="px-2.5 py-1.5 text-xs font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 disabled:opacity-40 transition-colors">File</button>
                <button onClick={() => setFiling(false)} className="px-2.5 py-1.5 text-xs bg-warm-100 text-slate-600 rounded-xl hover:bg-warm-200 transition-colors">✕</button>
              </div>
            ) : (
              <button onClick={() => setFiling(true)} className="text-xs font-bold text-lavender hover:text-lavender-500 border border-lavender-200 px-2.5 py-1 rounded-xl transition-colors">
                📂 File to Topic
              </button>
            )}
          </>
        )}
        {clip.topicId && (
          <Link to={`/topic/${clip.topicId}`} className="text-xs font-bold text-lavender hover:text-lavender-500 border border-lavender-200 px-2.5 py-1 rounded-xl transition-colors">
            Open Notebook →
          </Link>
        )}

        {/* Explain Clip (AI) */}
        {onExplain && (
          <div className="flex flex-col gap-0.5">
            {isExplaining ? (
              <span className="text-xs text-lavender animate-pulse">Explaining…</span>
            ) : isCoolingDown ? (
              <span className="text-xs text-slate-400">⏳ Wait…</span>
            ) : (
              <button
                onClick={() => onExplain(clip)}
                className="text-xs font-bold text-lavender hover:text-lavender-500 border border-lavender-200 px-2.5 py-1 rounded-xl transition-colors"
              >
                {clip.aiContext ? 'Re-explain (AI)' : '✦ Explain (AI)'}
              </button>
            )}
            <p className="text-xs text-slate-400 italic">AI may be imperfect — always verify.</p>
          </div>
        )}

        <button onClick={() => onRemove(clip.id)} className="ml-auto text-xs text-slate-400 hover:text-red-500 transition-colors">Delete</button>
      </div>
    </div>
  )
}

export default function ClipsPage() {
  const { clips, removeClip, fileClip, updateClip, clearClips } = useClips()
  const { progress } = useProgress()
  const [view, setView] = useState('inbox')
  const [filterSource, setFilterSource] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [explainLoading, setExplainLoading] = useState({})
  const [explainCooldown, setExplainCooldown] = useState({})

  async function handleExplainClip(clip) {
    setExplainLoading((prev) => ({ ...prev, [clip.id]: true }))
    try {
      let transcriptText = ''
      if (clip.topicId) {
        const topicSub = SUBJECTS.find((s) => s.topics.some((t) => t.id === clip.topicId))
        const topic = topicSub?.topics.find((t) => t.id === clip.topicId)
        if (topic?.videos) {
          const parts = topic.videos
            .map((v) => {
              const entry = progress.videoTranscripts?.[v.id]
              return entry?.text?.trim() ? `[${v.title}]\n${entry.text.trim()}` : null
            })
            .filter(Boolean)
          transcriptText = parts.join('\n\n')
        }
      }
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
      setExplainCooldown((prev) => ({ ...prev, [clip.id]: true }))
      setTimeout(() => setExplainCooldown((prev) => { const n = { ...prev }; delete n[clip.id]; return n }), 8_000)
    }
  }

  const inboxClips = clips.filter((c) => !c.topicId)
  const filedClips = clips.filter((c) => c.topicId)

  const searchLower = searchQuery.trim().toLowerCase()
  const filtered = (view === 'inbox' ? inboxClips : clips)
    .filter((c) => filterSource === 'all' || c.source === filterSource)
    .filter((c) => {
      if (!searchLower) return true
      const topicName = c.topicId ? getTopicById(c.topicId)?.name?.toLowerCase() || '' : ''
      return (
        c.content.toLowerCase().includes(searchLower) ||
        (c.tags || []).some((t) => t.toLowerCase().includes(searchLower)) ||
        topicName.includes(searchLower)
      )
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  const topicGroups = SUBJECTS.flatMap((s) =>
    s.topics.map((t) => ({
      topic: t,
      subject: s,
      clips: filedClips.filter((c) => c.topicId === t.id),
    }))
  ).filter((g) => g.clips.length > 0)

  function handleReset() {
    if (window.confirm('Delete ALL clips? This cannot be undone.')) clearClips()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-navy tracking-tight text-2xl">Clips &amp; Notes</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {inboxClips.length} in inbox · {filedClips.length} filed · {clips.length} total
          </p>
        </div>
        {clips.length > 0 && (
          <button onClick={handleReset} className="text-xs text-red-400 hover:text-red-600 underline">Delete all</button>
        )}
      </div>

      {clips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-200 p-10 text-center space-y-3">
          <div className="text-4xl">📌</div>
          <p className="font-extrabold text-navy">No clips yet</p>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Save clips from quiz rationale cards, video cards, and topic notebooks. They'll appear here.
          </p>
          <div className="flex gap-3 justify-center mt-2">
            <Link to="/quiz" className="px-4 py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors">Take a Quiz</Link>
            <Link to="/videos" className="px-4 py-2 text-sm font-bold border-2 border-warm-200 text-navy rounded-xl hover:bg-warm-50 transition-colors">Video Hub</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clips by content, tag, or topic…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-warm-200 bg-white text-sm text-navy placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-lavender/40 transition"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm pointer-events-none">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* View + filter controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-1 bg-warm-100 rounded-xl p-1">
              {[
                { id: 'inbox',   label: `Inbox (${inboxClips.length})` },
                { id: 'all',     label: `All (${clips.length})` },
                { id: 'byTopic', label: 'By Topic' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${view === v.id ? 'bg-white text-navy shadow-sm' : 'text-slate-600 hover:text-navy'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {view !== 'byTopic' && (
              <div className="flex gap-1 flex-wrap">
                {['all', 'video', 'quiz', 'rationale', 'custom'].map((src) => (
                  <button
                    key={src}
                    onClick={() => setFilterSource(src)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors border ${filterSource === src ? 'bg-lavender text-white border-lavender' : 'bg-white text-slate-600 border-warm-200 hover:border-warm-300'}`}
                  >
                    {src === 'all' ? 'All sources' : src}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Inbox / All view */}
          {view !== 'byTopic' && (
            <div className="space-y-3">
              {view === 'inbox' && inboxClips.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                  <strong>{inboxClips.length} clip{inboxClips.length !== 1 ? 's' : ''}</strong> not yet assigned to a topic. Use "File to Topic" to organize them.
                </div>
              )}
              {filtered.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No clips match this filter.</p>
              ) : (
                filtered.map((c) => (
                  <ClipCard
                    key={c.id}
                    clip={c}
                    onRemove={removeClip}
                    onFile={fileClip}
                    onExplain={handleExplainClip}
                    isExplaining={!!explainLoading[c.id]}
                    isCoolingDown={!!explainCooldown[c.id]}
                  />
                ))
              )}
            </div>
          )}

          {/* By Topic view */}
          {view === 'byTopic' && (
            <div className="space-y-5">
              {topicGroups.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No filed clips yet. File inbox clips to topics to see them here.</p>
              ) : (
                topicGroups.map(({ topic, subject, clips: tClips }) => (
                  <div key={topic.id} className={`rounded-2xl border ${subject.borderClass} overflow-hidden`}>
                    <div className={`${subject.bgClass} px-4 py-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <span>{subject.icon}</span>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{subject.name}</p>
                        <span className="text-slate-300">›</span>
                        <p className="text-sm font-extrabold text-navy">{topic.name}</p>
                      </div>
                      <Link to={`/topic/${topic.id}`} className={`text-xs font-bold ${subject.textClass} hover:underline`}>
                        Open Notebook →
                      </Link>
                    </div>
                    <div className="divide-y divide-warm-100 bg-white">
                      {tClips.map((c) => (
                        <div key={c.id} className="px-4 py-3 flex items-start gap-3">
                          <span className="text-base shrink-0">{CLIP_TYPE_ICON[c.type] || '📌'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${SOURCE_COLOR[c.source] || 'bg-warm-100 text-slate-600'}`}>{c.source}</span>
                              <span className="text-xs text-slate-400 capitalize">{c.type}</span>
                            </div>
                            <p className="text-sm text-navy line-clamp-2">{c.content}</p>
                          </div>
                          <button onClick={() => removeClip(c.id)} className="text-xs text-slate-300 hover:text-red-400 shrink-0">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
