import { useState, useCallback } from 'react'

const STORAGE_KEY = 'teas_clips_v1'

// Clip schema:
// { id, subjectId, topicId (null = inbox), source, type, content, structuredData, timestamp, tags, filed }
// source: 'video' | 'quiz' | 'rationale' | 'custom'
// type:   'keyTerm' | 'concept' | 'trap' | 'question' | 'summary' | 'screenshot'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
function persist(clips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clips))
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

export function useClips() {
  const [clips, setClips] = useState(load)

  const commit = useCallback((updater) => {
    setClips((prev) => {
      const next = updater(prev)
      persist(next)
      return next
    })
  }, [])

  const addClip = useCallback(
    ({ subjectId = null, topicId = null, source, type, content, structuredData = null, tags = [] }) => {
      const clip = {
        id: uid(),
        subjectId,
        topicId,
        source,
        type,
        content,
        structuredData,
        timestamp: new Date().toISOString(),
        tags,
        filed: !!topicId,
      }
      commit((prev) => [...prev, clip])
      return clip.id
    },
    [commit]
  )

  const removeClip = useCallback(
    (clipId) => commit((prev) => prev.filter((c) => c.id !== clipId)),
    [commit]
  )

  const fileClip = useCallback(
    (clipId, topicId, subjectId) =>
      commit((prev) =>
        prev.map((c) =>
          c.id === clipId
            ? { ...c, topicId, subjectId: subjectId || c.subjectId, filed: true }
            : c
        )
      ),
    [commit]
  )

  const updateClip = useCallback(
    (clipId, updates) =>
      commit((prev) => prev.map((c) => (c.id === clipId ? { ...c, ...updates } : c))),
    [commit]
  )

  const getClipsByTopic = useCallback(
    (topicId) => clips.filter((c) => c.topicId === topicId),
    [clips]
  )

  const getInboxClips = useCallback(
    () => clips.filter((c) => !c.topicId),
    [clips]
  )

  const clearClips = useCallback(() => {
    persist([])
    setClips([])
  }, [])

  return { clips, addClip, removeClip, fileClip, updateClip, getClipsByTopic, getInboxClips, clearClips }
}
