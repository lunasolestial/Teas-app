export function SectionHeader({ title, subtitle, icon, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div>
        <h2 className="flex items-center gap-2 text-base font-bold text-navy">
          {icon && <span className="text-lg">{icon}</span>}
          {title}
        </h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
