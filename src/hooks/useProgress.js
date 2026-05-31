import { useState, useCallback } from 'react'

const STORAGE_KEY = 'teas_hub_v1'

const defaultState = {
  quizHistory: [],
  topicScores: {},
  notes: {},
  watchedVideos: {},
  videoNotes: {},
  videoTranscripts: {}, // { [videoId]: { text: string, savedAt: string } }
  streak: { count: 0, lastDate: null },
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultState, ...JSON.parse(raw) }
    // migrate from old key
    const legacy = localStorage.getItem('teas_progress')
    if (legacy) {
      const old = { ...defaultState, ...JSON.parse(legacy) }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(old))
      return old
    }
    return defaultState
  } catch {
    return defaultState
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  const update = useCallback((updater) => {
    setProgress((prev) => {
      const next = updater(prev)
      save(next)
      return next
    })
  }, [])

  const saveQuizResult = useCallback(
    ({ subjectId, topicId, score, total, answers }) => {
      const pct = Math.round((score / total) * 100)
      const today = new Date().toISOString().split('T')[0]
      const entry = {
        id: Date.now().toString(),
        subjectId,
        topicId,
        date: new Date().toISOString(),
        score,
        total,
        pct,
        answers,
      }

      update((prev) => {
        const existing = prev.topicScores[topicId] || { scores: [], bestScore: 0, questionsCompleted: 0 }
        const newScores = [...existing.scores, pct].slice(-10)
        const updatedTopic = {
          scores: newScores,
          bestScore: Math.max(existing.bestScore, pct),
          recentScore: pct,
          questionsCompleted: (existing.questionsCompleted || 0) + total,
          lastDate: today,
        }

        const lastDate = prev.streak.lastDate
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        const streakCount =
          lastDate === today ? prev.streak.count
          : lastDate === yesterdayStr ? prev.streak.count + 1
          : 1

        return {
          ...prev,
          quizHistory: [entry, ...prev.quizHistory].slice(0, 100),
          topicScores: { ...prev.topicScores, [topicId]: updatedTopic },
          streak: { count: streakCount, lastDate: today },
        }
      })

      return entry
    },
    [update]
  )

  const saveNote = useCallback(
    (topicId, text) => {
      update((prev) => ({ ...prev, notes: { ...prev.notes, [topicId]: text } }))
    },
    [update]
  )

  const markVideoWatched = useCallback(
    (videoId, topicId) => {
      update((prev) => ({
        ...prev,
        watchedVideos: {
          ...prev.watchedVideos,
          [videoId]: { watchedAt: new Date().toISOString(), topicId },
        },
      }))
    },
    [update]
  )

  const markVideoUnwatched = useCallback(
    (videoId) => {
      update((prev) => {
        const { [videoId]: _removed, ...rest } = prev.watchedVideos
        return { ...prev, watchedVideos: rest }
      })
    },
    [update]
  )

  const saveVideoNote = useCallback(
    (videoId, text) => {
      update((prev) => ({ ...prev, videoNotes: { ...prev.videoNotes, [videoId]: text } }))
    },
    [update]
  )

  const saveVideoTranscript = useCallback(
    (videoId, text) => {
      update((prev) => ({
        ...prev,
        videoTranscripts: {
          ...prev.videoTranscripts,
          [videoId]: { text, savedAt: new Date().toISOString() },
        },
      }))
    },
    [update]
  )

  const getVideoTranscript = useCallback(
    (videoId) => progress.videoTranscripts[videoId] ?? null,
    [progress.videoTranscripts]
  )

  const getTopicStats = useCallback(
    (topicId) => {
      const t = progress.topicScores[topicId]
      if (!t || t.scores.length === 0) return null
      const avg = Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length)
      return {
        averageScore: avg,
        bestScore: t.bestScore,
        recentScore: t.recentScore,
        questionsCompleted: t.questionsCompleted,
        lastDate: t.lastDate,
        attempts: t.scores.length,
      }
    },
    [progress.topicScores]
  )

  const getSubjectStats = useCallback(
    (subjectId) => {
      const relevantHistory = progress.quizHistory.filter((h) => h.subjectId === subjectId)
      if (relevantHistory.length === 0) return null
      const avg = Math.round(relevantHistory.reduce((a, b) => a + b.pct, 0) / relevantHistory.length)
      const best = Math.max(...relevantHistory.map((h) => h.pct))
      const recent = relevantHistory[0]?.pct ?? 0
      const total = relevantHistory.reduce((a, b) => a + b.total, 0)
      return { averageScore: avg, bestScore: best, recentScore: recent, questionsCompleted: total, attempts: relevantHistory.length }
    },
    [progress.quizHistory]
  )

  const resetProgress = useCallback(() => {
    save(defaultState)
    setProgress(defaultState)
  }, [])

  const resetTopicProgress = useCallback(
    (topicId) => {
      update((prev) => {
        const { [topicId]: _removed, ...restScores } = prev.topicScores
        const updatedHistory = prev.quizHistory.filter((h) => h.topicId !== topicId)
        return { ...prev, topicScores: restScores, quizHistory: updatedHistory }
      })
    },
    [update]
  )

  const getWatchedCount = useCallback(
    () => Object.keys(progress.watchedVideos).length,
    [progress.watchedVideos]
  )

  const getNotesCount = useCallback(
    () => Object.values(progress.notes).filter((n) => n && n.trim().length > 10).length,
    [progress.notes]
  )

  return {
    progress,
    saveQuizResult,
    saveNote,
    markVideoWatched,
    markVideoUnwatched,
    saveVideoNote,
    saveVideoTranscript,
    getVideoTranscript,
    getTopicStats,
    getSubjectStats,
    resetProgress,
    resetTopicProgress,
    getWatchedCount,
    getNotesCount,
  }
}
