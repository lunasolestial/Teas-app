const VARIANTS = {
  primary:   'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300',
  secondary: 'bg-lavender-100 text-lavender hover:bg-lavender-100/80 border border-lavender-300/40',
  ghost:     'text-slate-600 hover:bg-warm-100 border border-transparent',
  outline:   'border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
  teal:      'bg-teal-600 text-white hover:bg-teal-700',          // alias for existing pages
  blush:     'bg-blush-50 text-blush hover:bg-blush-100 border border-blush-300/40',
  danger:    'bg-danger-light text-danger border border-danger/30 hover:bg-red-100',
  warning:   'bg-warning-light text-warning border border-warning/30',
  success:   'bg-success-light text-success border border-success/30',
}

const SIZES = {
  xs: 'px-2.5 py-1   text-xs  rounded-lg  gap-1',
  sm: 'px-3   py-1.5 text-sm  rounded-xl  gap-1.5',
  md: 'px-4   py-2   text-sm  rounded-xl  gap-2',
  lg: 'px-5   py-2.5 text-base rounded-2xl gap-2',
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANTS[variant] ?? VARIANTS.primary}
        ${SIZES[size] ?? SIZES.md}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
