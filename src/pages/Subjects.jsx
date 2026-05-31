import { Link, useParams } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { useSchoolProfile } from '../hooks/useSchoolProfile'
import { SUBJECTS } from '../data/subjects'
import { getMasteryLevel, getSubjectScore } from '../utils/scoring'
import ProgressBar from '../components/ProgressBar'
import MasteryBadge from '../components/MasteryBadge'

const SUBJECT_ICON_BG = {
  reading: 'bg-blue-50 text-blue-500',
  math:    'bg-violet-50 text-violet-500',
  science: 'bg-emerald-50 text-emerald-500',
  english: 'bg-amber-50 text-amber-600',
}
const SUBJECT_BORDER_L = {
  reading: 'border-l-blue-400',
  math:    'border-l-violet-400',
  science: 'border-l-emerald-400',
  english: 'border-l-amber-400',
}

export default function Subjects() {
  const { subjectId } = useParams()
  const { progress } = useProgress()
  const { quizHistory, topicScores } = progress
  const { getGoals, getGaps } = useSchoolProfile()
  const goals = getGoals()
  const subjectScores = Object.fromEntries(SUBJECTS.map((s) => [s.id, getSubjectScore(quizHistory, s.id)]))
  const gaps = getGaps(subjectScores, null)

  const displaySubjects = subjectId
    ? SUBJECTS.filter((s) => s.id === subjectId)
    : SUBJECTS

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-display font-bold text-navy tracking-tight text-2xl">
          {subjectId
            ? SUBJECTS.find((s) => s.id === subjectId)?.name ?? 'Study Topics'
            : 'Study Topics'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {subjectId
            ? 'Tap any topic to open its full study page.'
            : 'Tap any topic to open its full study page.'}
        </p>
      </div>

      {/* Discovery callout — tells users what's inside a topic page */}
      <div className="rounded-2xl border border-lavender-100 bg-gradient-to-r from-lavender-50/80 to-white p-4 flex items-start gap-3.5">
        <span className="text-2xl shrink-0 mt-0.5">📖</span>
        <div>
          <p className="text-sm font-extrabold text-navy">Every topic has a full study page</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Tap any topic name below to open its complete study page — Lesson, Key Terms, TEAS Traps,
            Memory Tips, AI Notes, and your personal Notebook Mode are all inside.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {displaySubjects.map((subject) => {
          const subjectScore = subjectScores[subject.id]
          const goal = goals[subject.id]
          const gap  = gaps[subject.id] ?? 0

          return (
            <section key={subject.id}>
              {/* Subject header */}
              <div className={`flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-2xl border-l-[3px] ${SUBJECT_BORDER_L[subject.id]} ${subject.bgClass} border border-current/10 mb-3`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0 ${SUBJECT_ICON_BG[subject.id]}`}>
                    {subject.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className={`font-extrabold text-base ${subject.textClass}`}>{subject.name}</h2>
                      <MasteryBadge score={subjectScore} />
                      {goal != null && gap > 0 && (
                        <span className="text-[10px] font-bold text-danger bg-danger-light px-2 py-0.5 rounded-full">
                          +{gap}% to goal
                        </span>
                      )}
                      {goal != null && gap <= 0 && subjectScore !== null && (
                        <span className="text-[10px] font-bold text-success bg-success-light px-2 py-0.5 rounded-full">
                          ✓ Goal met
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>{subject.topics.length} topics</span>
                      {subjectScore !== null && <span>avg {subjectScore}%</span>}
                      {goal != null && <span>goal {goal}%</span>}
                    </div>
                    {subjectScore !== null && (
                      <div className="mt-2 w-40">
                        <div className="relative">
                          <ProgressBar value={subjectScore} barClass={subject.barClass} height="h-1.5" />
                          {goal != null && (
                            <div className="absolute top-0 h-1.5 w-0.5 bg-slate-400/50" style={{ left: `${goal}%` }} />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Link
                  to={`/quiz?subjectId=${subject.id}`}
                  className={`shrink-0 self-start sm:self-center text-xs font-bold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90 ${subject.barClass}`}
                >
                  Full Subject Quiz
                </Link>
              </div>

              {/* Topics */}
              <div className="bg-white rounded-2xl border border-warm-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-4 py-2.5 bg-warm-50/80 border-b border-warm-100 flex items-center justify-between">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Topics</p>
                  <p className="text-[10px] text-slate-400">Tap "Study →" for lessons, key terms, traps &amp; your notebook</p>
                </div>
                <div className="divide-y divide-warm-100">
                  {subject.topics.map((topic) => {
                    const ts = topicScores[topic.id]
                    const scores = ts?.scores ?? []
                    const avg = scores.length
                      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                      : null
                    const m = getMasteryLevel(avg)

                    return (
                      <div key={topic.id} className="px-4 py-3.5 flex items-center gap-3 hover:bg-lavender-50/40 transition-colors group">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/topic/${topic.id}`}
                            className="text-sm font-bold text-navy group-hover:text-lavender transition-colors flex items-center gap-1.5"
                          >
                            {topic.name}
                            <span className="text-[10px] font-bold text-lavender/60 group-hover:text-lavender transition-colors opacity-0 group-hover:opacity-100">
                              Open study page →
                            </span>
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 leading-snug">
                            {topic.description}
                          </p>
                          {avg !== null && (
                            <div className="mt-1.5 max-w-[140px]">
                              <ProgressBar value={avg} barClass={m.bar} height="h-1" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {avg !== null && (
                            <span className={`text-xs font-extrabold ${m.text} tabular-nums`}>{avg}%</span>
                          )}
                          <MasteryBadge score={avg} />
                          <Link
                            to={`/topic/${topic.id}`}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-lavender-50 text-lavender border border-lavender-200 hover:bg-lavender hover:text-white transition-colors"
                          >
                            Study →
                          </Link>
                          <Link
                            to={`/quiz?topicId=${topic.id}`}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${subject.bgClass} ${subject.textClass} border-current/20 hover:opacity-80`}
                          >
                            Quiz →
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
