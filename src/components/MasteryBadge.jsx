import { getMasteryLevel } from '../utils/scoring'

export default function MasteryBadge({ score, size = 'sm' }) {
  const m = getMasteryLevel(score)
  const pad = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
  return (
    <span className={`inline-flex items-center rounded-full font-bold ${pad} ${m.bg} ${m.text}`}>
      {m.label}
    </span>
  )
}
