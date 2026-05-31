const VARIANTS = {
  default:  'bg-warm-100 text-slate-700',
  primary:  'bg-primary-50 text-primary-600 border border-primary-200',
  lavender: 'bg-lavender-50 text-lavender border border-lavender-300/40',
  blush:    'bg-blush-50 text-blush border border-blush-300/40',
  success:  'bg-success-light text-success',
  danger:   'bg-danger-light text-danger',
  warning:  'bg-warning-light text-warning',
  // Subject colours
  reading:  'bg-blue-50 text-blue-700 border border-blue-200',
  math:     'bg-purple-50 text-purple-700 border border-purple-200',
  science:  'bg-green-50 text-green-700 border border-green-200',
  english:  'bg-amber-50 text-amber-700 border border-amber-200',
  // Mastery
  mastered:     'bg-green-100 text-green-700',
  strong:       'bg-blue-100 text-blue-700',
  lightReview:  'bg-yellow-100 text-yellow-700',
  weak:         'bg-orange-100 text-orange-700',
  priority:     'bg-red-100 text-red-700',
  notStarted:   'bg-warm-100 text-slate-500',
}

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const pad = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${pad} ${VARIANTS[variant] ?? VARIANTS.default} ${className}`}>
      {children}
    </span>
  )
}
