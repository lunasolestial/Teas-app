import { SUBJECTS, CPCC_GOALS } from '../data/subjects'

export function getMasteryLevel(pct) {
  if (pct === null || pct === undefined) return { label: 'Not started', color: 'gray', bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-300', priority: 5 }
  if (pct >= 90) return { label: 'Mastered', color: 'green', bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500', priority: 0 }
  if (pct >= 80) return { label: 'Strong', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500', priority: 1 }
  if (pct >= 70) return { label: 'Light Review', color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-400', priority: 2 }
  if (pct >= 60) return { label: 'Weak', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-400', priority: 3 }
  return { label: 'Priority Review', color: 'red', bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500', priority: 4 }
}

export function getOverallScore(quizHistory) {
  if (!quizHistory.length) return null
  const avg = quizHistory.reduce((a, b) => a + b.pct, 0) / quizHistory.length
  return Math.round(avg)
}

export function getSubjectScore(quizHistory, subjectId) {
  const filtered = quizHistory.filter((h) => h.subjectId === subjectId)
  if (!filtered.length) return null
  return Math.round(filtered.reduce((a, b) => a + b.pct, 0) / filtered.length)
}

export function getCPCCReadiness(overall, subjectScores, goals = null) {
  if (overall === null) return { status: 'No data yet', color: 'gray', ready: false }
  const g = goals ?? {
    overall:     CPCC_GOALS.overall,
    competitive: CPCC_GOALS.competitive,
    reading:     CPCC_GOALS.reading,
    math:        CPCC_GOALS.math,
    science:     CPCC_GOALS.science,
    english:     CPCC_GOALS.english,
  }
  const meetsOverall = g.overall == null || overall >= g.overall
  const meetsAll = ['reading', 'math', 'science', 'english'].every((k) => {
    const goal = g[k]
    if (goal == null) return true
    const score = subjectScores[k]
    return score === null || score >= goal
  })
  if (meetsOverall && meetsAll) return { status: 'Ready! 🎉', color: 'green', ready: true }
  if (g.competitive != null && overall >= g.competitive) return { status: 'Competitive Range', color: 'blue', ready: false }
  if (overall >= 70) return { status: 'Getting Closer', color: 'yellow', ready: false }
  return { status: 'Keep Studying', color: 'red', ready: false }
}

export function getWeakestTopics(topicScores, limit = 3) {
  return Object.entries(topicScores)
    .filter(([, v]) => v.scores.length > 0)
    .map(([topicId, v]) => {
      const avg = Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length)
      return { topicId, avg }
    })
    .sort((a, b) => a.avg - b.avg)
    .slice(0, limit)
}

export function getStrongestTopics(topicScores, limit = 3) {
  return Object.entries(topicScores)
    .filter(([, v]) => v.scores.length > 0)
    .map(([topicId, v]) => {
      const avg = Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length)
      return { topicId, avg }
    })
    .sort((a, b) => b.avg - a.avg)
    .slice(0, limit)
}

export function getRecommendedTopic(topicScores, quizHistory) {
  const allTopics = SUBJECTS.flatMap((s) => s.topics.map((t) => ({ ...t, subjectId: s.id })))

  // Prioritize: never studied > lowest score
  const studied = Object.keys(topicScores).filter((k) => topicScores[k].scores.length > 0)
  const unStudied = allTopics.filter((t) => !studied.includes(t.id))
  if (unStudied.length > 0) return unStudied[0]

  const weakest = getWeakestTopics(topicScores, 1)
  if (weakest.length) {
    return allTopics.find((t) => t.id === weakest[0].topicId) || null
  }
  return null
}
