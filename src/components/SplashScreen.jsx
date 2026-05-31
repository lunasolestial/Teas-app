import { useState, useEffect } from 'react'

// Shows once per browser session. After 2.2s it fades out and calls onDone.
export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1600)
    const t2 = setTimeout(() => onDone(), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center transition-opacity duration-600"
      style={{
        background: 'linear-gradient(145deg, #060410 0%, #15083A 25%, #220E68 50%, #1C3082 70%, #9580D4 90%, #A87898 100%)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20 blob-a"
           style={{ background: 'radial-gradient(circle, #c4b5fd, transparent 70%)' }} />
      <div className="pointer-events-none absolute -bottom-12 -left-12 w-52 h-52 rounded-full opacity-15 blob-b"
           style={{ background: 'radial-gradient(circle, #2AAFA3, transparent 70%)' }} />

      {/* Logo mark */}
      <div className="flex flex-col items-center gap-8 reveal-up" style={{ animationDuration: '0.5s' }}>
        {/* Syringe — large glow circle */}
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: '220px',
            height: '220px',
            background: 'linear-gradient(135deg, #9580D4 0%, #2050C8 55%, #2AAFA3 100%)',
            boxShadow: '0 0 0 6px rgba(149,128,212,0.25), 0 0 120px rgba(149,128,212,0.5)',
          }}
        >
          <img
            src="/brand/syringe.png"
            alt="LI Lab"
            style={{ width: '176px', height: '176px', objectFit: 'contain' }}
          />
        </div>

        {/* Wordmark */}
        <div className="flex items-end gap-[4px]">
          <span
            className="text-white leading-none"
            style={{
              fontFamily: 'Cormorant Garamond, Palatino Linotype, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '72px',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            li
          </span>
          <span
            className="text-white/55 leading-none"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 800,
              fontSize: '26px',
              letterSpacing: '0.07em',
              lineHeight: 1,
              paddingBottom: '10px',
            }}
          >
            lab.
          </span>
        </div>

        <p
          className="text-white/40 text-sm font-semibold uppercase"
          style={{ letterSpacing: '0.3em' }}
        >
          TEAS v7 Study Coach
        </p>
      </div>
    </div>
  )
}
