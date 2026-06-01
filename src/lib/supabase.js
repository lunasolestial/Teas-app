import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null

// All localStorage keys that get synced to Supabase
export const SYNC_KEYS = {
  progress:      'teas_hub_v1',
  missedBank:    'teas_missed_bank_v1',
  clips:         'teas_clips_v1',
  notebook:      'teas_notebooks_v1',
  schoolProfile: 'teas_school_profile_v1',
}

export function readAllLocal() {
  const out = {}
  for (const [field, key] of Object.entries(SYNC_KEYS)) {
    try {
      const raw = localStorage.getItem(key)
      out[field] = raw ? JSON.parse(raw) : null
    } catch { out[field] = null }
  }
  return out
}

export function writeAllLocal(data) {
  const map = {
    progress:      SYNC_KEYS.progress,
    missed_bank:   SYNC_KEYS.missedBank,
    clips:         SYNC_KEYS.clips,
    notebook:      SYNC_KEYS.notebook,
    school_profile: SYNC_KEYS.schoolProfile,
  }
  for (const [col, key] of Object.entries(map)) {
    if (data[col] != null) localStorage.setItem(key, JSON.stringify(data[col]))
  }
}
