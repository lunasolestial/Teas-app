import { useEffect, useRef } from 'react'

const COLORS = ['#9580D4', '#2AAFA3', '#E8927C', '#c4b5fd', '#6ee7b7', '#fbbf24', '#f87171', '#a78bfa', '#34d399']
const COUNT = 90

export default function Confetti() {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const pieces = []

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div')
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const x = Math.random() * 100
      const delay = Math.random() * 1.8
      const dur = 2.6 + Math.random() * 2.2
      const size = 5 + Math.random() * 9
      const isCircle = Math.random() > 0.55
      const isRect = !isCircle && Math.random() > 0.5

      el.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: -24px;
        width: ${isRect ? size * 2.2 : size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : isRect ? '2px' : '3px'};
        animation: confetti-fall ${dur}s ${delay}s ease-in forwards;
        pointer-events: none;
        opacity: 0;
      `
      container.appendChild(el)
      pieces.push(el)
    }

    return () => pieces.forEach((el) => el.remove())
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    />
  )
}
