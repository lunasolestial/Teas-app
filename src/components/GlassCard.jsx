export default function GlassCard({
  children,
  className = '',
  variant = 'light',
  noPad = false,
  as: Tag = 'div',
  ...props
}) {
  const v = {
    light: [
      'bg-white/80 backdrop-blur-md',
      'border border-white/95',
      'shadow-[0_2px_24px_rgba(149,128,212,0.09),0_1px_6px_rgba(0,0,0,0.04)]',
    ].join(' '),
    dark: [
      'bg-white/10 backdrop-blur-md',
      'border border-white/15',
      'shadow-[0_4px_28px_rgba(0,0,0,0.20)]',
    ].join(' '),
    tinted: [
      'bg-lavender-50/85 backdrop-blur-md',
      'border border-lavender-100/80',
      'shadow-[0_2px_20px_rgba(149,128,212,0.10),0_1px_4px_rgba(0,0,0,0.04)]',
    ].join(' '),
  }

  return (
    <Tag
      className={`rounded-2xl overflow-hidden ${v[variant] ?? v.light} ${noPad ? '' : 'p-5'} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
