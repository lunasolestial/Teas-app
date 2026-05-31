// In-app video player with side-by-side notes panel and clip tool.
// The iframe is ALWAYS rendered in the same DOM position so it never remounts
// and the video never stops when the notes panel opens or closes.

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { useClips } from '../hooks/useClips'

export default function VideoPlayer({ video, topicId, onClose, isWatched, onMarkWatched }) {
  const { progress, saveNote, saveVideoTranscript, getVideoTranscript } = useProgress()
  const { addClip } = useClips()
  const navigate = useNavigate()

  const [notesOpen,  setNotesOpen]  = useState(false)
  const [notesSaved, setNotesSaved] = useState(false)
  const [clipOpen,   setClipOpen]   = useState(false)
  const [clipText,   setClipText]   = useState('')
  const [clipType,   setClipType]   = useState('concept')
  const [clipSaved,  setClipSaved]  = useState(false)

  // Notes source: topic-level when topicId present (connected to Notebook tab),
  // video-level transcript when used without a topic (VideoHub standalone flow).
  const [notesText, setNotesText] = useState('')

  useEffect(() => {
    if (!video) return
    const text = topicId
      ? (progress.notes[topicId] ?? '')
      : (getVideoTranscript(video.id)?.text ?? '')
    setNotesText(text)
    setNotesSaved(false)
    setNotesOpen(false)
    setClipOpen(false)
  }, [video?.id])

  if (!video) return null

  const embedSrc  = video.embedUrl  ? `${video.embedUrl}?rel=0&modestbranding=1&color=white` : null
  const ytFallback = video.youtubeId ? `https://www.youtube.com/watch?v=${video.youtubeId}` : null

  function handleSaveNotes() {
    if (topicId) saveNote(topicId, notesText)
    saveVideoTranscript(video.id, notesText)
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2500)
  }

  function handleOpenNotebook() {
    onClose()
    navigate(`/topic/${topicId}`)
  }

  function handleSaveClip() {
    const text = clipText.trim()
    if (!text) return
    addClip({
      topicId:  topicId || null,
      source:   'video',
      type:     clipType,
      content:  text,
      tags:     ['video', video.channel].filter(Boolean),
    })
    setClipText('')
    setClipSaved(true)
    setTimeout(() => setClipSaved(false), 2200)
  }

  const CLIP_TYPES = [
    { id: 'concept',  label: '💡 Concept' },
    { id: 'keyTerm',  label: '📚 Key Term' },
    { id: 'trap',     label: '⚠️ Trap' },
    { id: 'summary',  label: '📝 Summary' },
    { id: 'question', label: '❓ Question' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-5"
      style={{ background: 'rgba(19,10,46,0.88)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      {/*
        Max-width widens when notes are open.
        The iframe lives inside the LEFT column which is ALWAYS rendered —
        it never moves in the tree, so the video keeps playing.
      */}
      <div
        className={`bg-white rounded-3xl w-full overflow-hidden shadow-2xl flex flex-col transition-[max-width] duration-300 ease-out ${
          notesOpen ? 'max-w-5xl' : 'max-w-3xl'
        }`}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className="px-5 py-4 flex items-start justify-between gap-4 shrink-0"
          style={{ background: 'linear-gradient(135deg, #1e0a4a 0%, #4a2080 100%)' }}
        >
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-white leading-snug text-sm">{video.title}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-white/50 text-xs font-medium">{video.channel}</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-white/50 text-xs">{video.watchTime}</span>
              {isWatched && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-white/80 text-xs font-semibold">
                  ✓ Watched
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Body — flex row ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">

          {/* LEFT — video + description (always rendered, iframe never remounts) */}
          <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">

            {/* Video frame */}
            <div className="relative w-full bg-black shrink-0" style={{ aspectRatio: '16/9' }}>
              {embedSrc ? (
                <iframe
                  src={embedSrc}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                  style={{ background: 'linear-gradient(135deg, #1e0a4a 0%, #4a2080 100%)' }}
                >
                  <span className="text-5xl opacity-40">📺</span>
                  <p className="text-white/60 font-semibold text-sm">Embed not available</p>
                  {ytFallback && (
                    <a
                      href={ytFallback}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-bold transition-colors"
                    >
                      ▶ Open on YouTube
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            {video.description && (
              <p className="px-5 py-3 text-xs text-slate-500 leading-relaxed border-b border-warm-100 shrink-0">
                {video.description}
              </p>
            )}

            {/* ── Clip entry panel (inside left col so it never resizes the iframe) */}
            {clipOpen && (
              <div className="px-4 py-3 border-b border-warm-100 space-y-2.5 bg-amber-50/50 shrink-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-navy">📌 Save a Clip</p>
                  <button
                    onClick={() => setClipOpen(false)}
                    className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xs"
                  >✕</button>
                </div>
                {/* Type picker */}
                <div className="flex gap-1 flex-wrap">
                  {CLIP_TYPES.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setClipType(ct.id)}
                      className={`text-xs px-2 py-1 rounded-lg font-semibold transition-colors ${
                        clipType === ct.id
                          ? 'bg-lavender text-white'
                          : 'bg-white border border-warm-200 text-slate-600 hover:border-lavender-200 hover:text-lavender'
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={clipText}
                  onChange={(e) => setClipText(e.target.value)}
                  placeholder="Type or paste the text you want to clip — a key term, concept, trap, or anything worth remembering…"
                  className="w-full h-24 px-3 py-2.5 text-xs border border-warm-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-lavender/40 bg-white text-navy placeholder:text-slate-300"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveClip}
                    disabled={!clipText.trim()}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-colors disabled:opacity-40 ${
                      clipSaved
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-lavender text-white hover:bg-lavender-500'
                    }`}
                  >
                    {clipSaved ? '✓ Saved to Clips' : '📌 Save Clip'}
                  </button>
                  <span className="text-xs text-slate-400">
                    {topicId ? 'Filed to this topic automatically' : 'Saved to Clips inbox'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — notes panel, only when open */}
          {notesOpen && (
            <div className="md:w-80 border-t md:border-t-0 md:border-l border-warm-200 flex flex-col shrink-0">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-warm-100 shrink-0">
                <div>
                  <p className="font-extrabold text-navy text-sm">📝 Topic Notes</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {topicId ? 'Saved to your topic notebook' : 'Saved to this video'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {topicId && (
                    <button
                      onClick={handleOpenNotebook}
                      className="text-[10px] font-bold text-lavender hover:text-lavender-500 transition-colors"
                      title="Open full topic notebook"
                    >
                      Full Notebook →
                    </button>
                  )}
                  <button
                    onClick={() => setNotesOpen(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-warm-100 transition-colors text-sm"
                    aria-label="Close notes"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={notesText}
                onChange={(e) => { setNotesText(e.target.value); setNotesSaved(false) }}
                placeholder="Write notes while the video plays…&#10;&#10;These are saved to your topic notebook and are available for AI review and the notebook generator."
                className="flex-1 p-4 text-sm resize-none focus:outline-none min-h-[160px] leading-relaxed text-navy placeholder:text-slate-300"
                autoFocus
              />

              {/* Save row */}
              <div className="flex items-center gap-3 px-4 py-3 border-t border-warm-100 shrink-0 bg-warm-50/50">
                <button
                  onClick={handleSaveNotes}
                  className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                    notesSaved
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-lavender text-white hover:bg-lavender-500'
                  }`}
                >
                  {notesSaved ? '✓ Saved' : 'Save'}
                </button>
                <span className="text-xs text-slate-400">{notesText.length} chars</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-t border-warm-100 flex-wrap shrink-0 bg-warm-50/50">
          <button
            onClick={onMarkWatched}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isWatched
                ? 'bg-lavender-50 text-lavender border border-lavender-200'
                : 'bg-white text-slate-600 border border-warm-200 hover:border-lavender-200 hover:text-lavender'
            }`}
          >
            {isWatched ? '✓ Watched' : '☐ Mark Watched'}
          </button>

          <button
            onClick={() => { setNotesOpen((o) => !o); setClipOpen(false) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              notesOpen
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-white text-slate-600 border border-warm-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
            }`}
          >
            📝 {notesOpen ? 'Hide Notes' : 'Take Notes'}
          </button>

          <button
            onClick={() => { setClipOpen((o) => !o); if (notesOpen) setNotesOpen(false) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              clipOpen
                ? 'bg-lavender-50 text-lavender border border-lavender-200'
                : 'bg-white text-slate-600 border border-warm-200 hover:bg-lavender-50 hover:text-lavender hover:border-lavender-200'
            }`}
          >
            📌 {clipOpen ? 'Hide Clip' : 'Save Clip'}
          </button>

          {ytFallback && (
            <a
              href={ytFallback}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              ↗ YouTube
            </a>
          )}
        </div>

      </div>
    </div>
  )
}
