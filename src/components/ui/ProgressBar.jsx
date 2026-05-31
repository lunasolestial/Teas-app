// Replaces src/components/ProgressBar.jsx — same props interface, warmer palette + gradient support.
export default function ProgressBar({
  value,
  max = 100,
  barClass = '',
  height = 'h-2',
  showLabel = false,
  gradient = false,
}) {
  const pct = Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0))
  const fill = gradient
    ? 'bg-gradient-teal'
    : barClass || 'bg-primary-500'

  return (
    <div className="w-full">
      <div className={`w-full bg-warm-200 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${fill} ${height} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-500 mt-0.5 block text-right">{Math.round(pct)}%</span>
      )}
    </div>
  )
}
