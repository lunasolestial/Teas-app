import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SUBJECTS } from '../data/subjects'
import { useProgress } from '../hooks/useProgress'
import VideoPlayer from '../components/VideoPlayer'
import SaveClipButton from '../components/SaveClipButton'

const CHANNEL_COLORS = {
  'Nurse Cheung':               { bg: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-700',   dot: 'bg-rose-500' },
  'The Organic Chemistry Tutor':{ bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
  'RegisteredNurseRN':          { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  'Simple Nursing':             { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', dot: 'bg-violet-500' },
}
function channelStyle(channel) {
  return CHANNEL_COLORS[channel] || { bg: 'bg-warm-50', border: 'border-warm-200', text: 'text-slate-600', dot: 'bg-slate-400' }
}

function VideoNoteModal({ video, initialNote, onSave, onClose }) {
  const [text, setText] = useState(initialNote || '')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-card-md w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-100">
          <div>
            <p className="font-bold text-navy">{video.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{video.channel} · {video.watchTime}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-warm-100">✕</button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-500">Notes saved to your progress tracker.</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did you learn? Key points, questions, things to review..."
            className="w-full h-40 p-3 text-sm border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender/40 resize-none"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => { onSave(video.id, text); onClose() }}
              className="flex-1 py-2.5 text-sm font-bold bg-lavender text-white rounded-xl hover:bg-lavender-500 transition-colors"
            >
              Save Notes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-warm-100 rounded-xl hover:bg-warm-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoCard({ video, topicId, isWatched, onToggleWatch, onOpenNotes, onWatch, hasNote }) {
  const cs = channelStyle(video.channel)
  return (
    <div className={`rounded-2xl border transition-all shadow-card ${
      isWatched ? 'border-lavender-200 bg-lavender-50/30' : 'border-warm-200 bg-white hover:shadow-card-md'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold border-2 ${
            isWatched ? 'border-lavender bg-lavender text-white' : 'border-warm-300 bg-white text-slate-400'
          }`}>
            {isWatched ? '✓' : video.watchOrder}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cs.bg} ${cs.text} border ${cs.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cs.dot}`} />
                {video.channel}
              </span>
              <span className="text-xs text-slate-400">{video.watchTime}</span>
            </div>
            <p className="text-sm font-semibold text-navy leading-snug">{video.title}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{video.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button
            onClick={() => onWatch({ video, topicId })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            ▶ Watch
          </button>

          <button
            onClick={() => onToggleWatch(video.id, topicId, isWatched)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              isWatched
                ? 'bg-lavender-50 text-lavender border border-lavender-200'
                : 'bg-warm-100 text-slate-600 hover:bg-lavender-50 hover:text-lavender'
            }`}
          >
            {isWatched ? '✓ Watched' : '☐ Mark Watched'}
          </button>

          <button
            onClick={() => onOpenNotes(video)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              hasNote ? 'bg-warning-light text-warning border border-warning/30' : 'bg-warm-100 text-slate-600 hover:bg-warm-200'
            }`}
          >
            {hasNote ? '📝 Edit Notes' : '📝 Add Notes'}
          </button>

          <Link
            to={`/quiz?topicId=${topicId}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-lavender-50 text-lavender hover:bg-lavender-100 transition-colors ml-auto"
          >
            ✏️ Quiz Me
          </Link>

          <SaveClipButton
            clip={{
              topicId,
              source: 'video',
              type: 'concept',
              content: `${video.title} — ${video.channel}\n${video.description}`,
              tags: ['video'],
            }}
            label="Save"
          />
        </div>
      </div>
    </div>
  )
}

function TopicVideoSection({ topic, subject, watchedVideos, videoNotes, onToggleWatch, onOpenNotes, onWatch }) {
  const watchedInTopic = topic.videos.filter((v) => watchedVideos[v.id]).length
  const total = topic.videos.length
  const pct   = total > 0 ? Math.round((watchedInTopic / total) * 100) : 0

  return (
    <div className={`bg-white rounded-2xl border-l-4 border-t border-r border-b border-warm-200 overflow-hidden shadow-card`}
         style={{ borderLeftColor: subject.id === 'reading' ? '#60a5fa' : subject.id === 'math' ? '#a78bfa' : subject.id === 'science' ? '#34d399' : '#fbbf24' }}>
      <div className={`px-5 py-3.5 border-b ${subject.borderClass} ${subject.bgClass} flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{subject.icon}</span>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.14em]">{subject.name}</p>
            <h3 className="font-extrabold text-navy text-sm">{topic.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs text-slate-500">{watchedInTopic}/{total} watched</p>
            <div className="w-20 bg-warm-200 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full transition-all ${pct === 100 ? 'bg-lavender' : subject.barClass}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <Link
            to={`/topic/${topic.id}`}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-lavender-50 text-lavender border border-lavender-200 hover:bg-lavender hover:text-white transition-colors whitespace-nowrap"
          >
            Study →
          </Link>
        </div>
      </div>

      <div className="divide-y divide-warm-100">
        {topic.videos.map((video) => (
          <div key={video.id} className="p-3">
            <VideoCard
              video={video}
              topicId={topic.id}
              isWatched={!!watchedVideos[video.id]}
              hasNote={!!(videoNotes[video.id]?.trim())}
              onToggleWatch={onToggleWatch}
              onOpenNotes={onOpenNotes}
              onWatch={onWatch}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function VideoHub() {
  const [filter,      setFilter]      = useState('all')
  const [noteModal,   setNoteModal]   = useState(null)
  const [playerState, setPlayerState] = useState(null)
  const { progress, markVideoWatched, markVideoUnwatched, saveVideoNote } = useProgress()
  const { watchedVideos, videoNotes } = progress

  const allVideos    = SUBJECTS.flatMap((s) => s.topics.flatMap((t) => t.videos))
  const totalVideos  = allVideos.length
  const watchedCount = Object.keys(watchedVideos).length
  const watchPct     = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0
  const filteredSubjects = filter === 'all' ? SUBJECTS : SUBJECTS.filter((s) => s.id === filter)

  function handleToggleWatch(videoId, topicId, isWatched) {
    if (isWatched) markVideoUnwatched(videoId)
    else markVideoWatched(videoId, topicId)
  }

  const playerVideo   = playerState?.video   ?? null
  const playerTopicId = playerState?.topicId ?? null

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-navy tracking-tight text-2xl">Video Study Hub</h1>
          <p className="text-slate-500 text-sm mt-0.5">Watch · Take Notes · Quiz Yourself</p>
        </div>
        <Link
          to="/studio"
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold bg-lavender text-white hover:bg-lavender-500 transition-colors shadow-sm"
        >
          ✨ Studio
        </Link>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-2xl shadow-card border border-warm-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-extrabold text-navy">Overall Video Progress</p>
            <p className="text-xs text-slate-500 mt-0.5">{watchedCount} of {totalVideos} videos watched</p>
          </div>
          <span className={`text-2xl font-extrabold ${watchPct >= 100 ? 'text-success' : watchPct >= 50 ? 'text-lavender' : 'text-slate-400'}`}>
            {watchPct}%
          </span>
        </div>
        <div className="w-full bg-warm-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{ width: `${watchPct}%`, background: 'linear-gradient(90deg, #9580D4 0%, #2AAFA3 100%)' }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(CHANNEL_COLORS).map(([channel, cs]) => (
            <span key={channel} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cs.bg} ${cs.text} border ${cs.border}`}>
              <span className={`w-2 h-2 rounded-full ${cs.dot}`} />
              {channel}
            </span>
          ))}
        </div>
      </div>

      {/* Study flow banner */}
      <div className="bg-lavender-50 border border-lavender-100 rounded-2xl p-4">
        <p className="text-sm font-bold text-navy mb-2">Recommended Study Order</p>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
          {['Watch the video', 'Add your notes', 'Review AI explanations', 'Take the quiz', 'Check your score'].map((step, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="bg-lavender text-white rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] font-extrabold">{i + 1}</span>
              <span>{step}</span>
              {i < 4 && <span className="text-warm-300 mx-1">→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Subject filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors border ${
            filter === 'all'
              ? 'bg-lavender text-white border-lavender shadow-sm'
              : 'bg-white text-slate-600 border-warm-200 hover:border-lavender-200 hover:text-lavender'
          }`}
        >
          All ({totalVideos})
        </button>
        {SUBJECTS.map((s) => {
          const count   = s.topics.flatMap((t) => t.videos).length
          const watched = s.topics.flatMap((t) => t.videos).filter((v) => watchedVideos[v.id]).length
          return (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors border ${
                filter === s.id
                  ? `${s.barClass} text-white border-transparent shadow-sm`
                  : `bg-white ${s.textClass} ${s.borderClass} hover:opacity-80`
              }`}
            >
              {s.icon} {s.name} ({watched}/{count})
            </button>
          )
        })}
      </div>

      {/* Video sections */}
      <div className="space-y-4">
        {filteredSubjects.flatMap((subject) =>
          subject.topics.map((topic) => (
            <TopicVideoSection
              key={topic.id}
              topic={topic}
              subject={subject}
              watchedVideos={watchedVideos}
              videoNotes={videoNotes}
              onToggleWatch={handleToggleWatch}
              onOpenNotes={(video) => setNoteModal(video)}
              onWatch={(state) => setPlayerState(state)}
            />
          ))
        )}
      </div>

      {noteModal && (
        <VideoNoteModal
          video={noteModal}
          initialNote={videoNotes[noteModal.id] || ''}
          onSave={saveVideoNote}
          onClose={() => setNoteModal(null)}
        />
      )}

      <VideoPlayer
        video={playerVideo}
        topicId={playerTopicId}
        onClose={() => setPlayerState(null)}
        isWatched={playerVideo ? !!watchedVideos[playerVideo.id] : false}
        onMarkWatched={() => {
          if (playerVideo && playerTopicId)
            handleToggleWatch(playerVideo.id, playerTopicId, !!watchedVideos[playerVideo.id])
        }}
      />
    </div>
  )
}
