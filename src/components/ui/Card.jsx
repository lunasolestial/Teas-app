export function Card({ children, className = '', noPad = false }) {
  return (
    <div className={`bg-white rounded-2xl shadow-card border border-warm-200 ${noPad ? '' : 'p-5'} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-3.5 border-b border-warm-100 ${className}`}>
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  )
}
