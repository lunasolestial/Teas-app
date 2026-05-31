/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        // Body — humanist sans, warm and readable
        sans: ['Plus Jakarta Sans', 'Nunito', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // Display — editorial serif for h1 / major headings
        display: ['Playfair Display', 'Georgia', 'ui-serif', 'serif'],
        // Script — flowing italic for the "li" brand mark (matches logo)
        script: ['Cormorant Garamond', 'Palatino Linotype', 'ui-serif', 'serif'],
      },

      // ── Colour tokens ──────────────────────────────────────────────────────
      colors: {
        // Subject accent colours (keep for subject-coded UI throughout the app)
        reading: { DEFAULT: '#3b82f6', light: '#eff6ff', border: '#bfdbfe' },
        math:    { DEFAULT: '#8b5cf6', light: '#f5f3ff', border: '#ddd6fe' },
        science: { DEFAULT: '#10b981', light: '#ecfdf5', border: '#a7f3d0' },
        english: { DEFAULT: '#f59e0b', light: '#fffbeb', border: '#fde68a' },

        // App background — slightly purple-tinted
        cream: { DEFAULT: '#F8F5FF', 50: '#FDFCFF', 100: '#F0EBFF' },

        // Primary — soft teal
        primary: {
          50:  '#E6F7F5',
          100: '#C2EBE7',
          500: '#2AAFA3',
          600: '#249E93',
          700: '#1C8780',
          DEFAULT: '#2AAFA3',
        },

        // Lavender — richer, more saturated
        lavender: {
          50:  '#F5F3FF',
          100: '#EDE8FC',
          200: '#DDD6FE',
          300: '#B8A9EC',
          400: '#A78BFA',
          500: '#8B75D7',
          DEFAULT: '#9580D4',
        },

        // Violet — deep premium purple scale
        violet: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },

        // Accent — muted blush / terracotta (used for review/alert states)
        blush: {
          50:  '#FDF1EE',
          100: '#F9DDD8',
          300: '#E8A594',
          500: '#D47563',
          DEFAULT: '#E8927C',
        },

        // Electric blue — from syringe chromatic zone; atmospheric only
        electric: {
          50:  '#EEF3FF',
          100: '#D4E0FF',
          300: '#7B9EEF',
          500: '#2550C8',
          DEFAULT: '#2550C8',
        },

        // Cyan — from the syringe needle tip / liquid drop
        chrome: {
          50:  '#E8FEFF',
          100: '#C0F8FF',
          300: '#60E4F8',
          DEFAULT: '#00D0EE',
        },

        // Ambient rose — dusty mauve-rose for atmospheric depth only
        // Never full-saturation; always diffused, glowing, or at low opacity.
        rose: {
          50:  '#FDF4F7',
          100: '#F5E0EA',
          200: '#E8BDD0',
          300: '#D194B2',
          400: '#C07494',
          DEFAULT: '#B08098',  // dusty mauve-rose — the ambient anchor
        },

        // Warm neutrals
        warm: {
          50:  '#FAF8F5',
          100: '#F4EDE5',
          200: '#EBE0D5',
          300: '#DDD3C7',
          400: '#C5BAB0',
        },

        // Text navy
        navy: {
          DEFAULT: '#1A2235',
          700: '#1F2D42',
          800: '#141C2C',
        },

        // Sidebar — deep purple-navy
        sidebar: '#130a2e',

        // Semantic
        success: { DEFAULT: '#5BAD8F', light: '#EDFAF3' },
        danger:  { DEFAULT: '#E07070', light: '#FDF2F2' },
        warning: { DEFAULT: '#E8A84A', light: '#FEF8EE' },

        // Notebook section highlight backgrounds
        nb: {
          definitions: '#FEF9C3',
          concepts:    '#EFF6FF',
          important:   '#FCE7F3',
          examples:    '#ECFDF5',
          traps:       '#FEF2F2',
          memory:      '#F5F3FF',
          diagrams:    '#EFF6FF',
          practice:    '#ECFDF5',
        },
      },

      // ── Shadows ─────────────────────────────────────────────────────────────
      boxShadow: {
        card:         '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)',
        'card-md':    '0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.10), 0 16px 48px rgba(0,0,0,0.07)',
        'card-lift':  '0 2px 12px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset',
        'glow-lav':   '0 0 32px rgba(149,128,212,0.4)',
        'glow-lav-sm':'0 0 16px rgba(149,128,212,0.25)',
        'glow-teal':  '0 0 24px rgba(42,175,163,0.35)',
        'glow-rose':   '0 0 28px rgba(176,128,152,0.28)',
        'glow-chrome': '0 0 24px rgba(0,208,238,0.30)',   // cyan syringe-drop glow
        inner:        'inset 0 2px 8px rgba(0,0,0,0.10)',
        'nav':        '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)',
      },

      // ── Background gradients ─────────────────────────────────────────────────
      backgroundImage: {
        'gradient-teal':     'linear-gradient(90deg, #2AAFA3 0%, #3CC4B7 100%)',
        'gradient-lavender': 'linear-gradient(90deg, #9580D4 0%, #B8A9EC 100%)',
        'gradient-blush':    'linear-gradient(90deg, #E8927C 0%, #F0B0A0 100%)',
        'gradient-hero':     'linear-gradient(135deg, #1e0a4a 0%, #4a2080 55%, #9580D4 100%)',
        'gradient-sidebar':  'linear-gradient(180deg, #130a2e 0%, #1e0f45 100%)',
        'gradient-card-lav': 'linear-gradient(135deg, #F8F5FF 0%, #EDE8FC 100%)',
        'gradient-violet':   'linear-gradient(135deg, #7c3aed 0%, #9580D4 100%)',
      },

      // ── Border radius ────────────────────────────────────────────────────────
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
