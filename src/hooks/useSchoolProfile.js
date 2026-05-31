import { useState, useCallback } from 'react'

const STORAGE_KEY = 'teas_school_profile_v1'

// Default profile — CPCC values for Kaliya; any user can override.
// These also match the hardcoded CPCC_GOALS in subjects.js so existing
// users see no change on first load.
export const DEFAULT_PROFILE = {
  schoolName:  'Central Piedmont Community College',
  programName: 'Nursing / Associate Degree',
  requiredOverall: 80,
  requiredBySubject: {
    reading: 80,
    math:    70,
    science: 75,
    english: 75,
  },
  testDate: '',  // ISO date string or empty
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROFILE
    const stored = JSON.parse(raw)
    // Deep-merge so new fields added in future versions don't vanish
    return {
      ...DEFAULT_PROFILE,
      ...stored,
      requiredBySubject: { ...DEFAULT_PROFILE.requiredBySubject, ...(stored.requiredBySubject || {}) },
    }
  } catch {
    return DEFAULT_PROFILE
  }
}

export function useSchoolProfile() {
  const [profile, setProfile] = useState(load)

  const saveProfile = useCallback((updates) => {
    const next = {
      ...profile,
      ...updates,
      requiredBySubject: { ...profile.requiredBySubject, ...(updates.requiredBySubject || {}) },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setProfile(next)
  }, [profile])

  // Returns a flat goals object { overall, reading, math, science, english }
  // suitable for passing to scoring functions.
  const getGoals = useCallback(() => ({
    overall:  profile.requiredOverall        ?? DEFAULT_PROFILE.requiredOverall,
    reading:  profile.requiredBySubject?.reading  ?? DEFAULT_PROFILE.requiredBySubject.reading,
    math:     profile.requiredBySubject?.math     ?? DEFAULT_PROFILE.requiredBySubject.math,
    science:  profile.requiredBySubject?.science  ?? DEFAULT_PROFILE.requiredBySubject.science,
    english:  profile.requiredBySubject?.english  ?? DEFAULT_PROFILE.requiredBySubject.english,
  }), [profile])

  // Returns per-subject gap (positive = still needs points, null = no goal set)
  const getGaps = useCallback((subjectScores, overallScore) => {
    const goals = getGoals()
    const subjects = ['reading', 'math', 'science', 'english']
    const bySubject = Object.fromEntries(
      subjects.map((k) => {
        const goal  = goals[k]
        const score = subjectScores[k]
        if (goal == null) return [k, null]
        if (score == null) return [k, goal]   // not yet tested = full gap
        return [k, Math.max(0, goal - score)]
      })
    )
    const overallGap = goals.overall != null
      ? Math.max(0, goals.overall - (overallScore ?? 0))
      : null
    return { overall: overallGap, ...bySubject }
  }, [getGoals])

  return { profile, saveProfile, getGoals, getGaps }
}
