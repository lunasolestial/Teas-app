import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import OnboardingModal from '../components/OnboardingModal'
import { SUBJECTS, getTopicById, getTopicSubject } from '../data/subjects'
import { getMasteryLevel, getOverallScore, getSubjectScore, getCPCCReadiness, getWeakestTopics } from '../utils/scoring'
import { useSchoolProfile } from '../hooks/useSchoolProfile'
import ProgressBar from '../components/ProgressBar'
import MasteryBadge from '../components/MasteryBadge'

const TOTAL_VIDEOS = SUBJECTS.flatMap((s) => s.topics.flatMap((t) => t.videos)).length

function StatCard({ label, value, sub, color = 'gray' }) {
  const colors = {
    gray:   'bg-warm-50 border-warm-200',
    blue:   'bg-blue-50 border-blue-200',
    green:  'bg-lavender-50 border-lavender-100',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
    teal:   'bg-primary-50 border-primary-100',
    rose:   'bg-rose-50 border-rose-200',
  }
  return (
    <div className={`rounded-2xl border p-4 ${colors[color] || colors.gray}`}>
      <div className="text-2xl font-extrabold text-navy">{value}</div>
      <div className="text-sm font-semibold text-slate-700 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function ProgressTracker() {
  const { progress, resetProgress, resetTopicProgress, getWatchedCount, getNotesCount } = useProgress()
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const { quizHistory, topicScores, streak, watchedVideos, notes } = progress

  const { getGoals } = useSchoolProfile()
  const goals = getGoals()
  const overall = getOverallScore(quizHistory)
  const subjectScores = Object.fromEntries(SUBJECTS.map((s) => [s.id, getSubjectScore(quizHistory, s.id)]))
  const readiness = getCPCCReadiness(overall, subjectScores, goals)
  const totalQuestions = quizHistory.reduce((a, b) => a + b.total, 0)
  const bestEver = quizHistory.length ? Math.max(...quizHistory.map((h) => h.pct)) : null
  const recentScore = quizHistory[0]?.pct ?? null
  const weakest = getWeakestTopics(topicScores, 5)
  const watchedCount = getWatchedCount()
  const notesCount = getNotesCount()

  function handleReset() {
    if (window.confirm('Reset ALL progress data (quizzes, videos, notes)? This cannot be undone.')) {
      resetProgress()
    }
  }

  return (
    <div className="space-y-6 page-enter">
      {tutorialOpen && (
        <OnboardingModal onClose={() => setTutorialOpen(false)} />
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-navy tracking-tight text-2xl">Progress Tracker</h1>
          <p className="text-slate-500 text-sm mt-0.5">All study activity in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTutorialOpen(true)}
            className="text-xs font-bold text-lavender hover:text-lavender-500 transition-colors"
          >
            📖 Tutorial
          </button>
          <button onClick={handleReset} className="text-xs text-red-500 hover:text-red-700 underline">
            Reset all progress
          </button>
        </div>
      </div>

      {/* Key stats — horizontal strip, not a grid of widgets */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x-0 md:divide-x divide-warm-100">
          {[
            { label: 'Average Score',  value: overall !== null ? `${overall}%` : '—',  sub: 'all quizzes' },
            { label: 'Best Score',     value: bestEver !== null ? `${bestEver}%` : '—', sub: 'personal best' },
            { label: 'Questions Done', value: totalQuestions,                            sub: 'total answered' },
            { label: 'Study Streak',   value: `${streak.count}d`,                       sub: streak.count > 0 ? 'days in a row' : 'not started' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="px-5 py-4 text-center">
              <div className="text-2xl font-extrabold text-navy tabular-nums">{value}</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y-0 divide-x-0 md:divide-x divide-warm-100 border-t border-warm-100">
          {[
            { label: 'Videos',      value: `${watchedCount}/${TOTAL_VIDEOS}`, sub: `${Math.round((watchedCount / TOTAL_VIDEOS) * 100)}% complete` },
            { label: 'Notes Saved', value: notesCount,                         sub: 'topics with notes' },
            { label: 'Quizzes',     value: quizHistory.length,                 sub: 'all time' },
            { label: 'Recent',      value: recentScore !== null ? `${recentScore}%` : '—', sub: 'last quiz score' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="px-5 py-4 text-center">
              <div className="text-xl font-extrabold text-slate-600 tabular-nums">{value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Progress by Subject */}
      <div className="bg-white rounded-2xl border border-warm-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-navy">Video Progress</h2>
          <Link to="/videos" className="text-xs font-bold text-lavender hover:text-lavender-500 transition-colors">Open Video Hub →</Link>
        </div>
        <div className="space-y-3">
          {SUBJECTS.map((s) => {
            const vids = s.topics.flatMap((t) => t.videos)
            const watched = vids.filter((v) => watchedVideos[v.id]).length
            const pct = vids.length > 0 ? Math.round((watched / vids.length) * 100) : 0
            return (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-navy flex items-center gap-1.5">
                    {s.icon} {s.name}
                  </span>
                  <span className="text-xs text-slate-500">{watched}/{vids.length} watched ({pct}%)</span>
                </div>
                <ProgressBar value={pct} barClass={pct === 100 ? 'bg-lavender' : s.barClass} height="h-2" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Readiness status */}
      <div className={`rounded-2xl border p-5 ${
        readiness.color === 'green'  ? 'bg-lavender-50 border-lavender-100' :
        readiness.color === 'blue'   ? 'bg-blue-50 border-blue-200' :
        readiness.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      }`}>
        <h2 className="text-sm font-extrabold text-navy mb-1">Readiness Status</h2>
        <div className={`text-lg font-extrabold mb-3 ${
          readiness.color === 'green'  ? 'text-lavender' :
          readiness.color === 'blue'   ? 'text-blue-700' :
          readiness.color === 'yellow' ? 'text-yellow-700' :
          'text-red-700'
        }`}>
          {readiness.status}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { label: goals.overall != null ? `Overall (goal ${goals.overall}%)` : 'Overall', score: overall, goal: goals.overall },
            ...SUBJECTS.map((s) => ({
              label: goals[s.id] != null ? `${s.name} (goal ${goals[s.id]}%)` : s.name,
              score: subjectScores[s.id],
              goal: goals[s.id],
            })),
          ].map(({ label, score, goal }) => {
            const met = score !== null && score >= goal
            return (
              <div key={label} className="bg-white/60 rounded-xl p-2">
                <div className="text-xs text-slate-600 mb-1">{label}</div>
                <div className={`text-sm font-bold ${met ? 'text-lavender' : 'text-slate-600'}`}>
                  {score === null ? 'No data' : `${score}%`} {met ? '✓' : ''}
                </div>
                {score !== null && (
                  <ProgressBar
                    value={score}
                    barClass={met ? 'bg-lavender' : 'bg-orange-400'}
                    height="h-1.5"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Topic mastery */}
      <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-warm-100">
          <h2 className="text-sm font-extrabold text-navy">Topic Mastery</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tap ✕ next to any topic to reset its quiz history</p>
        </div>
        <div className="divide-y divide-warm-100">
          {SUBJECTS.flatMap((s) =>
            s.topics.map((t) => {
              const ts = topicScores[t.id]
              const scores = ts?.scores ?? []
              const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
              const m = getMasteryLevel(avg)
              const vidsWatched = t.videos.filter((v) => watchedVideos[v.id]).length
              const hasNote = !!(notes[t.id]?.trim())
              return (
                <div key={t.id} className="px-5 py-3 flex items-center gap-3">
                  <span className={`text-sm ${s.textClass} w-4 shrink-0`}>{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <Link to={`/topic/${t.id}`} className="text-sm font-medium text-navy hover:text-lavender transition-colors block truncate">
                      {t.name}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      {scores.length > 0 && (
                        <div className="flex-1">
                          <ProgressBar value={avg} barClass={m.bar} height="h-1.5" />
                        </div>
                      )}
                      <span className="text-xs text-slate-400 shrink-0">
                        ▶ {vidsWatched}/{t.videos.length}
                        {hasNote && <span className="ml-1.5 text-amber-500">📝</span>}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {scores.length > 0 ? (
                      <>
                        <span className={`text-sm font-bold ${m.text}`}>{avg}%</span>
                        <span className="text-xs text-slate-400">({scores.length}×)</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">Not started</span>
                    )}
                    <MasteryBadge score={avg} />
                    <Link
                      to={`/quiz?topicId=${t.id}`}
                      className={`text-xs font-semibold ${s.textClass} underline hover:opacity-70`}
                    >
                      Quiz
                    </Link>
                    {scores.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Reset quiz history for "${t.name}"? This cannot be undone.`)) {
                            resetTopicProgress(t.id)
                          }
                        }}
                        className="text-xs text-slate-300 hover:text-red-400 transition-colors ml-0.5"
                        title={`Reset ${t.name}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Recent quiz history */}
      {quizHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-warm-100">
            <h2 className="text-sm font-extrabold text-navy">Recent Quiz History</h2>
          </div>
          <div className="divide-y divide-warm-100">
            {quizHistory.slice(0, 20).map((h) => {
              const topic = getTopicById(h.topicId)
              const m = getMasteryLevel(h.pct)
              return (
                <div key={h.id} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy truncate">
                      {topic?.name || (h.topicId === 'mixed' ? 'Random Quiz' : h.topicId)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(h.date).toLocaleDateString()} · {h.score}/{h.total} correct
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm font-bold ${m.text}`}>{h.pct}%</span>
                    <MasteryBadge score={h.pct} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {weakest.length > 0 && (
        <div className="bg-lavender-50 border border-lavender-100 rounded-2xl p-5">
          <h2 className="text-sm font-extrabold text-navy mb-3">📌 Study Recommendations</h2>
          <ul className="space-y-2">
            {weakest.map(({ topicId: tid, avg }) => {
              const t = getTopicById(tid)
              const s = getTopicSubject(tid)
              const goal = s ? (goals[s.id] ?? 75) : 75
              const gap = goal - avg
              return (
                <li key={tid} className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-lavender-100">
                  <div>
                    <Link to={`/topic/${tid}`} className="text-sm font-medium text-navy hover:text-lavender transition-colors">{t?.name}</Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {avg}% · {gap > 0 ? `${gap}% below goal` : 'At or above goal'}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      to={`/topic/${tid}`}
                      className="px-3 py-1.5 text-xs font-bold border border-lavender-200 text-lavender rounded-xl hover:bg-lavender-50 transition-colors"
                    >
                      Study
                    </Link>
                    <Link
                      to={`/quiz?topicId=${tid}`}
                      className="px-3 py-1.5 text-xs font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors"
                    >
                      Quiz
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {quizHistory.length === 0 && watchedCount === 0 && (
        <div className="bg-white rounded-2xl border border-warm-200 p-10 text-center space-y-3">
          <div className="text-4xl">📊</div>
          <p className="font-extrabold text-navy">No activity yet</p>
          <p className="text-sm text-slate-400">Watch a video or take a quiz to start tracking your progress.</p>
          <div className="flex gap-3 justify-center mt-2">
            <Link to="/videos" className="px-4 py-2 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors">
              ▶ Watch Videos
            </Link>
            <Link to="/quiz" className="px-4 py-2 text-sm font-bold border-2 border-warm-200 text-navy rounded-xl hover:bg-warm-50 transition-colors">
              ✏️ Take a Quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
