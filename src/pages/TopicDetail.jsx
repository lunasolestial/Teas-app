import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { getTopicById, getTopicSubject } from '../data/subjects'
import { getAIContent } from '../data/aiContent'
import { APP_NAME } from '../constants/brand'
import VideoPlayer from '../components/VideoPlayer'
import NotebookSheet from '../components/NotebookSheet'
import { useProgress } from '../hooks/useProgress'
import { getMasteryLevel } from '../utils/scoring'
import MasteryBadge from '../components/MasteryBadge'
import ProgressBar from '../components/ProgressBar'

const CHANNEL_COLORS = {
  'Nurse Cheung':               { bg: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-700',   dot: 'bg-rose-500' },
  'The Organic Chemistry Tutor':{ bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
  'RegisteredNurseRN':          { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  'Simple Nursing':             { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
}
function channelStyle(ch) {
  return CHANNEL_COLORS[ch] || { bg: 'bg-warm-50', border: 'border-warm-200', text: 'text-slate-600', dot: 'bg-slate-400' }
}

const TABS = ['Study Flow', 'Lesson', 'Key Terms', 'TEAS Traps', 'Memory Tips', 'Videos', 'AI Notes', 'Notebook Mode']

function StudyFlowBanner({ topic, watchedVideos, hasNote, hasQuiz }) {
  const totalVids = topic.videos.length
  const watchedVids = topic.videos.filter((v) => watchedVideos[v.id]).length
  const steps = [
    { label: 'Watch Videos', done: watchedVids > 0, sub: `${watchedVids}/${totalVids} watched` },
    { label: 'Take Notes',   done: hasNote,         sub: hasNote ? 'Notes saved' : 'Not yet' },
    { label: 'AI Review',    done: hasNote,         sub: 'Available now' },
    { label: 'Take Quiz',    done: hasQuiz,         sub: hasQuiz ? 'Quiz taken' : 'Not yet' },
    { label: 'Track Score',  done: hasQuiz,         sub: hasQuiz ? 'Saved!' : 'After quiz' },
  ]
  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center shrink-0">
          <div className="flex flex-col items-center text-center w-20">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
              s.done ? 'bg-lavender text-white' : 'bg-warm-100 text-slate-400 border-2 border-warm-200'
            }`}>
              {s.done ? '✓' : i + 1}
            </div>
            <p className={`text-xs font-semibold leading-tight ${s.done ? 'text-lavender' : 'text-slate-500'}`}>{s.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 mx-1 mt-[-20px] ${s.done ? 'bg-lavender/50' : 'bg-warm-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function BulletifyNotes(text) {
  if (!text.trim()) return []
  const lines = text
    .split(/[.\n\r]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 8)
  return lines.slice(0, 12)
}

export default function TopicDetail() {
  const { topicId } = useParams()
  const [tab, setTab] = useState(0)
  const { progress, saveNote, markVideoWatched, markVideoUnwatched, saveVideoNote } = useProgress()

  const [noteText, setNoteText] = useState(progress.notes[topicId] ?? '')
  const [noteSaved, setNoteSaved] = useState(false)
  const [bulletified, setBulletified] = useState(null)
  const [aiSection, setAiSection] = useState(null)
  const [notebookPrint, setNotebookPrint] = useState(false)
  const [videoNoteTarget, setVideoNoteTarget] = useState(null)
  const [videoNoteText, setVideoNoteText] = useState('')
  const [playerVideo, setPlayerVideo] = useState(null)

  const topic = getTopicById(topicId)
  const subject = getTopicSubject(topicId)
  const ai = getAIContent(topicId)

  if (!topic || !subject) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Topic not found.</p>
        <Link to="/subjects" className="text-lavender underline mt-2 block">Back to Subjects</Link>
      </div>
    )
  }

  const ts = progress.topicScores[topicId]
  const scores = ts?.scores ?? []
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  const m = getMasteryLevel(avg)
  const hasNote = !!(progress.notes[topicId]?.trim())
  const hasQuiz = scores.length > 0

  function handleSaveNote() {
    saveNote(topicId, noteText)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2500)
  }

  function handleToggleVideo(videoId, isWatched) {
    if (isWatched) markVideoUnwatched(videoId)
    else markVideoWatched(videoId, topicId)
  }

  function openVideoNote(video) {
    setVideoNoteTarget(video)
    setVideoNoteText(progress.videoNotes[video.id] || '')
  }

  function handleSaveVideoNote() {
    if (videoNoteTarget) {
      saveVideoNote(videoNoteTarget.id, videoNoteText)
      setVideoNoteTarget(null)
    }
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
        <Link to="/subjects" className="hover:text-lavender transition-colors">Subjects</Link>
        <span>›</span>
        <span className={subject.textClass}>{subject.name}</span>
        <span>›</span>
        <span className="text-slate-600">{topic.name}</span>
      </nav>

      {/* Header card */}
      <div className={`${subject.bgClass} border ${subject.borderClass} rounded-2xl p-5`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{subject.icon}</span>
              <span className={`text-xs font-semibold uppercase tracking-wide ${subject.textClass}`}>{subject.name}</span>
            </div>
            <h1 className="text-xl font-extrabold text-navy">{topic.name}</h1>
            <p className="text-sm text-slate-500 mt-1">{topic.description}</p>
          </div>
          <MasteryBadge score={avg} size="lg" />
        </div>

        {scores.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/60 rounded-xl p-2">
              <div className={`text-lg font-bold ${m.text}`}>{avg}%</div>
              <div className="text-xs text-slate-500">Average</div>
            </div>
            <div className="bg-white/60 rounded-xl p-2">
              <div className="text-lg font-bold text-navy">{ts.bestScore}%</div>
              <div className="text-xs text-slate-500">Best</div>
            </div>
            <div className="bg-white/60 rounded-xl p-2">
              <div className="text-lg font-bold text-navy">{ts.questionsCompleted}</div>
              <div className="text-xs text-slate-500">Questions</div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4 flex-wrap">
          <Link
            to={`/quiz?topicId=${topicId}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl bg-lavender hover:bg-lavender-500 transition-colors"
          >
            ✏️ Take Quiz
          </Link>
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-lavender bg-white/80 rounded-xl border border-lavender-100 hover:bg-white transition-colors"
          >
            ▶ Video Hub
          </Link>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white rounded-t-2xl border-b border-warm-200">
        <div className="px-4 pt-3 pb-0">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
            Full Study Page — use the tabs below
          </p>
        </div>
        <div className="flex overflow-x-auto gap-0.5">
          {TABS.map((label, i) => (
            <button
              key={label}
              onClick={() => setTab(i)}
              className={`px-3 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                tab === i
                  ? 'border-lavender text-lavender'
                  : 'border-transparent text-slate-400 hover:text-navy hover:border-warm-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-b-2xl shadow-card border border-warm-200 border-t-0 p-5">

        {/* ── STUDY FLOW ── */}
        {tab === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-extrabold text-navy text-lg mb-1">Your Study Path</h2>
              <p className="text-sm text-slate-500 mb-5">Follow these steps in order for the best results.</p>
              <StudyFlowBanner
                topic={topic}
                watchedVideos={progress.watchedVideos}
                hasNote={hasNote}
                hasQuiz={hasQuiz}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Step 1 */}
              <div className="border border-warm-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-lavender text-white flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-extrabold text-navy">Watch the Videos</h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">Start here. Watch in order for the best foundation.</p>
                <div className="space-y-2">
                  {topic.videos.map((v) => {
                    const isWatched = !!progress.watchedVideos[v.id]
                    const cs = channelStyle(v.channel)
                    return (
                      <div key={v.id} className="flex items-center gap-2 p-2 bg-warm-50 rounded-xl">
                        <button
                          onClick={() => handleToggleVideo(v.id, isWatched)}
                          className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isWatched ? 'border-lavender bg-lavender text-white' : 'border-warm-300 bg-white'}`}
                        >
                          {isWatched && <span className="text-xs">✓</span>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-navy truncate">{v.title}</p>
                          <p className={`text-xs ${cs.text}`}>{v.channel} · {v.watchTime}</p>
                        </div>
                        <button
                          onClick={() => setPlayerVideo(v)}
                          className="text-xs font-bold text-primary-500 hover:text-primary-600 shrink-0"
                          title="Watch in app"
                        >
                          ▶
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Step 2 */}
              <div className="border border-warm-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-lavender text-white flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-extrabold text-navy">Take Notes</h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">Write what you learned in your own words.</p>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write your notes here..."
                  className="w-full h-28 p-3 text-sm border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender/50 resize-none"
                />
                <button
                  onClick={handleSaveNote}
                  className="mt-2 w-full py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors"
                >
                  {noteSaved ? '✓ Saved!' : 'Save Notes'}
                </button>
              </div>

              {/* Step 3 */}
              <div className="border border-warm-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-lavender text-white flex items-center justify-center text-xs font-bold">3</span>
                  <h3 className="font-extrabold text-navy">Review AI Explanations</h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">Get simplified explanations and memory tricks.</p>
                <button
                  onClick={() => setTab(6)}
                  className="w-full py-2 text-sm font-bold border-2 border-lavender-100 text-lavender rounded-xl hover:bg-lavender-50 transition-colors"
                >
                  Open AI Notes Tab →
                </button>
              </div>

              {/* Steps 4+5 */}
              <div className="border border-warm-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-lavender text-white flex items-center justify-center text-xs font-bold">4</span>
                  <h3 className="font-extrabold text-navy">Take the Quiz</h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">10 TEAS-style questions. Score saved automatically.</p>
                {hasQuiz && (
                  <div className="mb-3 p-2 bg-lavender-50 rounded-xl text-xs text-lavender font-medium">
                    Last score: {ts?.recentScore}% · Best: {ts?.bestScore}%
                  </div>
                )}
                <Link
                  to={`/quiz?topicId=${topicId}`}
                  className="block text-center py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors"
                >
                  Start 10-Question Quiz →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── LESSON ── */}
        {tab === 1 && (
          <div className="prose prose-sm max-w-none text-navy">
            {topic.lesson.split('\n\n').map((para, i) => {
              if (para.startsWith('**') && para.split('\n').length === 1) {
                return <h3 key={i} className="font-extrabold text-navy mt-4 mb-1 text-base">{para.replace(/\*\*/g, '')}</h3>
              }
              const rendered = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              return <p key={i} className="mb-3 leading-relaxed text-sm text-navy" dangerouslySetInnerHTML={{ __html: rendered }} />
            })}
          </div>
        )}

        {/* ── KEY TERMS ── */}
        {tab === 2 && (
          <div className="space-y-3">
            <h2 className="text-sm font-extrabold text-navy mb-3">Key Terms</h2>
            {topic.keyTerms.map((kt) => (
              <div key={kt.term} className={`border-l-4 ${subject.borderClass} pl-3 py-1`}>
                <span className="font-extrabold text-sm text-navy">{kt.term}</span>
                <p className="text-sm text-slate-600 mt-0.5">{kt.definition}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── TEAS TRAPS ── */}
        {tab === 3 && (
          <div className="space-y-3">
            <h2 className="text-sm font-extrabold text-navy mb-1">Common TEAS Traps ⚠️</h2>
            <p className="text-xs text-slate-500 mb-3">These are the most frequent ways students get tricked on this topic.</p>
            {topic.traps.map((trap, i) => (
              <div key={i} className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-red-500 mt-0.5 shrink-0">⚠️</span>
                <p className="text-sm text-red-800">{trap}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── MEMORY TIPS ── */}
        {tab === 4 && (
          <div className="space-y-3">
            <h2 className="text-sm font-extrabold text-navy mb-3">Memory Tips 🧠</h2>
            {topic.memoryTips.map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 bg-lavender-50 border border-lavender-100 rounded-xl">
                <span className="mt-0.5 shrink-0">💡</span>
                <p className="text-sm text-navy">{tip}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── VIDEOS ── */}
        {tab === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-navy">Study Videos</h2>
              <Link to="/videos" className="text-xs font-bold text-lavender hover:text-lavender-500 transition-colors">Open Video Hub →</Link>
            </div>
            <p className="text-xs text-slate-500">Watch in order. Mark as watched to track progress. Add notes to save what you learned.</p>

            {topic.videos.map((v) => {
              const isWatched = !!progress.watchedVideos[v.id]
              const hasVideoNote = !!(progress.videoNotes[v.id]?.trim())
              const cs = channelStyle(v.channel)

              return (
                <div key={v.id} className={`rounded-2xl border overflow-hidden transition-all ${isWatched ? 'border-lavender-100 bg-lavender-50/30' : 'border-warm-200 bg-white'}`}>
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isWatched ? 'border-lavender bg-lavender text-white' : 'border-warm-300 bg-white text-slate-500'}`}>
                        {isWatched ? '✓' : v.watchOrder}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cs.bg} ${cs.text} border ${cs.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cs.dot}`} />
                            {v.channel}
                          </span>
                          <span className="text-xs text-slate-400">{v.watchTime}</span>
                        </div>
                        <p className="text-sm font-semibold text-navy">{v.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{v.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => handleToggleVideo(v.id, isWatched)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${isWatched ? 'bg-lavender-100 text-lavender hover:bg-lavender-200' : 'bg-warm-100 text-slate-700 hover:bg-lavender-50 hover:text-lavender'}`}
                      >
                        {isWatched ? '✓ Watched' : '☐ Mark Watched'}
                      </button>
                      <button
                        onClick={() => openVideoNote(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${hasVideoNote ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-warm-100 text-slate-600 hover:bg-warm-200'}`}
                      >
                        {hasVideoNote ? '📝 My Notes' : '📝 Add Notes'}
                      </button>
                      <Link
                        to={`/quiz?topicId=${topicId}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-lavender-50 text-lavender hover:bg-lavender-100 transition-colors"
                      >
                        ✏️ Quiz Me
                      </Link>
                      <button
                        onClick={() => setPlayerVideo(v)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary-500 text-white hover:bg-primary-600 transition-colors ml-auto"
                      >
                        ▶ Watch
                      </button>
                    </div>

                    {hasVideoNote && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-xs font-semibold text-amber-800 mb-1">Your Notes:</p>
                        <p className="text-xs text-amber-700 whitespace-pre-line line-clamp-3">{progress.videoNotes[v.id]}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Video note modal */}
            {videoNoteTarget && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-warm-100">
                    <p className="font-extrabold text-navy">{videoNoteTarget.title}</p>
                    <button onClick={() => setVideoNoteTarget(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
                  </div>
                  <div className="p-5 space-y-3">
                    <textarea
                      value={videoNoteText}
                      onChange={(e) => setVideoNoteText(e.target.value)}
                      placeholder="Key points, things to remember, questions to look up..."
                      className="w-full h-40 p-3 text-sm border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender/50 resize-none"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveVideoNote}
                        className="flex-1 py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors"
                      >
                        Save Notes
                      </button>
                      <button
                        onClick={() => setVideoNoteTarget(null)}
                        className="px-4 py-2 text-sm font-medium bg-warm-100 text-slate-600 rounded-xl hover:bg-warm-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AI NOTES HELPER ── */}
        {tab === 6 && ai && (
          <div className="space-y-5">
            <div>
              <h2 className="font-extrabold text-navy text-lg mb-1">AI Notes Helper</h2>
              <p className="text-xs text-slate-500">Simplified explanations, memory tricks, and notebook keys — all in one place.</p>
            </div>

            <AISection title="✦ Simplify This Topic" color="lavender" open={aiSection === 'simplify'} onToggle={() => setAiSection(aiSection === 'simplify' ? null : 'simplify')}>
              <p className="text-sm text-navy leading-relaxed">{ai.simplify}</p>
            </AISection>

            <AISection title="🩺 Explain It Like I'm New to Nursing" color="blue" open={aiSection === 'newbie'} onToggle={() => setAiSection(aiSection === 'newbie' ? null : 'newbie')}>
              <p className="text-sm text-navy leading-relaxed">{ai.nursingNewbie}</p>
            </AISection>

            <AISection title="📓 Key Things to Write in My Notebook" color="amber" open={aiSection === 'notebook'} onToggle={() => setAiSection(aiSection === 'notebook' ? null : 'notebook')}>
              <ul className="space-y-2">
                {ai.notebookKeys.map((k, i) => (
                  <li key={i} className="flex gap-2 text-sm text-navy">
                    <span className="text-amber-500 shrink-0 mt-0.5">★</span>
                    {k}
                  </li>
                ))}
              </ul>
            </AISection>

            <AISection title="🧠 Memory Tricks" color="lavender" open={aiSection === 'memory'} onToggle={() => setAiSection(aiSection === 'memory' ? null : 'memory')}>
              <ul className="space-y-2">
                {topic.memoryTips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-navy">
                    <span className="shrink-0">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </AISection>

            <AISection title="⚠️ Common TEAS Traps" color="red" open={aiSection === 'traps'} onToggle={() => setAiSection(aiSection === 'traps' ? null : 'traps')}>
              <ul className="space-y-2">
                {topic.traps.map((trap, i) => (
                  <li key={i} className="flex gap-2 text-sm text-red-800">
                    <span className="shrink-0">⚠️</span>
                    {trap}
                  </li>
                ))}
              </ul>
            </AISection>

            <AISection title="✅ Must-Know Facts" color="green" open={aiSection === 'facts'} onToggle={() => setAiSection(aiSection === 'facts' ? null : 'facts')}>
              <ul className="space-y-2">
                {ai.mustKnowFacts.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm text-green-800">
                    <span className="shrink-0 text-green-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </AISection>

            {/* My notes + Turn into study bullets */}
            <div className="border border-warm-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-navy">My Notes</h3>
                {noteSaved && <span className="text-lavender text-xs font-bold">✓ Saved!</span>}
              </div>
              <textarea
                value={noteText}
                onChange={(e) => { setNoteText(e.target.value); setBulletified(null) }}
                placeholder="Write your own notes here — then turn them into study bullets below."
                className="w-full h-32 p-3 text-sm border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender/50 resize-none"
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors"
                >
                  Save Notes
                </button>
                <button
                  onClick={() => setBulletified(BulletifyNotes(noteText))}
                  className="px-4 py-2 text-sm font-bold bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition-colors"
                  disabled={!noteText.trim()}
                >
                  ✦ Turn Into Study Bullets
                </button>
              </div>

              {bulletified && bulletified.length > 0 && (
                <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-800 mb-2">Your Study Bullets:</p>
                  <ul className="space-y-1.5">
                    {bulletified.map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-amber-900">
                        <span className="text-amber-500 shrink-0">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {bulletified && bulletified.length === 0 && (
                <p className="text-xs text-slate-400">Add more detail to your notes to generate bullets.</p>
              )}
            </div>
          </div>
        )}

        {/* ── AI NOTES (no content) ── */}
        {tab === 6 && !ai && (
          <div className="text-center py-10 text-slate-400">
            <p>AI content not available for this topic yet.</p>
          </div>
        )}

        {/* ── NOTEBOOK MODE ── */}
        {tab === 7 && (
          <NotebookSheet topicId={topicId} topic={topic} subject={subject} />
        )}
      </div>

      {/* In-app video player */}
      <VideoPlayer
        video={playerVideo}
        topicId={topicId}
        onClose={() => setPlayerVideo(null)}
        isWatched={playerVideo ? !!progress.watchedVideos[playerVideo.id] : false}
        onMarkWatched={() => {
          if (playerVideo) handleToggleVideo(playerVideo.id, !!progress.watchedVideos[playerVideo.id])
        }}
      />

      {/* Bottom quiz CTA */}
      <div className="bg-lavender-50 border border-lavender-100 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-extrabold text-navy">Ready to test yourself?</p>
          <p className="text-xs text-lavender mt-0.5">10 TEAS-style questions on {topic.name}</p>
        </div>
        <Link
          to={`/quiz?topicId=${topicId}`}
          className="px-4 py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors"
        >
          Start Quiz →
        </Link>
      </div>
    </div>
  )
}

function AISection({ title, color, open, onToggle, children }) {
  const colors = {
    lavender: { header: 'bg-lavender-50 border-lavender-100 text-lavender hover:bg-lavender-100',   body: 'bg-lavender-50/50 border-lavender-100' },
    blue:     { header: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',               body: 'bg-blue-50/50 border-blue-200' },
    amber:    { header: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100',            body: 'bg-amber-50/50 border-amber-200' },
    red:      { header: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',                   body: 'bg-red-50/50 border-red-200' },
    green:    { header: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',            body: 'bg-green-50/50 border-green-200' },
  }
  const c = colors[color] || colors.lavender

  return (
    <div className={`border rounded-2xl overflow-hidden ${c.body}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 border-b text-sm font-bold text-left transition-colors ${c.header}`}
      >
        <span>{title}</span>
        <span className="text-lg leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-4 py-4">
          {children}
        </div>
      )}
    </div>
  )
}
