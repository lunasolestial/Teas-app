import { useState } from 'react'
import { useClips } from '../hooks/useClips'

// Immediately saves a clip and shows a brief "Saved ✓" confirmation.
// Props: clip (full clip shape minus id/timestamp), label, size ('sm' | 'xs')
export default function SaveClipButton({ clip, label = 'Save to Notes', size = 'xs' }) {
  const { addClip } = useClips()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    addClip(clip)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const base = size === 'sm'
    ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors'
    : 'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors'

  if (saved) {
    return (
      <span className={`${base} bg-teal-100 text-teal-700`}>
        ✓ Saved
      </span>
    )
  }

  return (
    <button
      onClick={handleSave}
      className={`${base} bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors`}
      title={label}
    >
      📌 {label}
    </button>
  )
}
