import { useState, useCallback } from 'react'

const BANK_KEY = 'teas_missed_bank_v1'

// Mastery rule: 3 consecutive correct + high-confidence answers → mastered.
// Chosen because it balances repetition with demonstrated confidence.
const MASTERY_STREAK = 3

function today() {
  return new Date().toISOString().split('T')[0]
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function loadBank() {
  try {
    const raw = localStorage.getItem(BANK_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveBank(bank) {
  localStorage.setItem(BANK_KEY, JSON.stringify(bank))
}

// Scheduling rules (deterministic, no randomness):
//   incorrect              → +1 day
//   correct + low          → +3 days
//   correct + medium       → +7 days
//   correct + high         → +10 days
//   correct + high × MASTERY_STREAK consecutive → mastered
function nextReviewDate(correct, confidence) {
  if (!correct) return addDays(today(), 1)
  if (confidence === 'low') return addDays(today(), 3)
  if (confidence === 'medium') return addDays(today(), 7)
  return addDays(today(), 10) // high
}

export function useMissedBank() {
  const [bank, setBank] = useState(loadBank)

  const update = useCallback((updater) => {
    setBank((prev) => {
      const next = updater(prev)
      saveBank(next)
      return next
    })
  }, [])

  // Call after each question in a quiz or review session.
  // Adds to bank if incorrect or correct+low.
  // Updates schedule if already in bank.
  const processAnswer = useCallback(
    (questionId, topicId, subjectId, { correct, confidence }) => {
      const shouldTrack = !correct || confidence === 'low'
      if (!shouldTrack && !bank[questionId]) return // not in bank, not worth adding

      update((prev) => {
        const existing = prev[questionId]
        const now = new Date().toISOString()

        if (!existing && !shouldTrack) return prev // don't add if didn't miss

        const streak = correct ? (existing?.correctStreak ?? 0) + 1 : 0
        const mastered =
          correct && confidence === 'high' && streak >= MASTERY_STREAK ? now : (existing?.masteredAt ?? null)

        const entry = {
          questionId,
          topicId,
          subjectId,
          addedAt: existing?.addedAt ?? now,
          lastAttemptAt: now,
          nextReviewAt: mastered ? null : nextReviewDate(correct, confidence),
          correctStreak: streak,
          totalAttempts: (existing?.totalAttempts ?? 0) + 1,
          lastConfidence: confidence,
          masteredAt: mastered,
        }

        return { ...prev, [questionId]: entry }
      })
    },
    [bank, update]
  )

  // Returns array of question IDs due today (nextReviewAt <= today AND not mastered).
  const getDueIds = useCallback(() => {
    const t = today()
    return Object.values(bank)
      .filter((e) => !e.masteredAt && e.nextReviewAt && e.nextReviewAt <= t)
      .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt))
      .map((e) => e.questionId)
  }, [bank])

  const getBankStats = useCallback(() => {
    const entries = Object.values(bank)
    const total = entries.length
    const mastered = entries.filter((e) => e.masteredAt).length
    const due = getDueIds().length
    const upcoming = entries.filter((e) => !e.masteredAt && e.nextReviewAt && e.nextReviewAt > today()).length
    return { total, mastered, due, upcoming }
  }, [bank, getDueIds])

  const dismissQuestion = useCallback(
    (questionId) => {
      update((prev) => {
        const { [questionId]: _removed, ...rest } = prev
        return rest
      })
    },
    [update]
  )

  const resetBank = useCallback(() => {
    saveBank({})
    setBank({})
  }, [])

  return { bank, processAnswer, getDueIds, getBankStats, dismissQuestion, resetBank }
}
