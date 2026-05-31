// Design tokens — single source of truth for JS usage.
// Tailwind colours mirror these in tailwind.config.js.

export const colors = {
  // Backgrounds
  bg:           '#FAF8F5',
  surface:      '#FFFFFF',
  surfaceHover: '#FDFCFB',

  // Primary — soft teal
  primary:      '#2AAFA3',
  primaryLight: '#E6F7F5',
  primaryDark:  '#1C8780',

  // Secondary — lavender
  lavender:      '#9580D4',
  lavenderLight: '#F5F3FF',

  // Accent — blush / terracotta
  blush:      '#E8927C',
  blushLight: '#FDF1EE',

  // Text
  textPrimary: '#1A2235',
  textMuted:   '#5C6778',
  textLight:   '#9CA3AF',

  // Borders / warm neutrals
  border:      '#EBE0D5',
  borderLight: '#F4EDE5',

  // Semantic
  success:      '#5BAD8F',
  successLight: '#EDFAF3',
  danger:       '#E07070',
  dangerLight:  '#FDF2F2',
  warning:      '#E8A84A',
  warningLight: '#FEF8EE',

  // Notebook section backgrounds
  notebook: {
    definitions: '#FEF9C3',
    concepts:    '#EFF6FF',
    important:   '#FCE7F3',
    examples:    '#ECFDF5',
    traps:       '#FEF2F2',
    memory:      '#F5F3FF',
    diagrams:    '#EFF6FF',
    practice:    '#ECFDF5',
  },
}

export const radius = {
  sm:   '0.5rem',
  md:   '0.75rem',
  lg:   '1rem',
  xl:   '1.25rem',
  '2xl':'1.5rem',
  full: '9999px',
}

export const shadow = {
  card:     '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.06)',
  cardMd:   '0 2px 6px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.08)',
  cardHover:'0 4px 12px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.09)',
}

export const spacing = {
  section: '1.5rem',    // gap between page sections
  card:    '1.25rem',   // card inner padding
  tight:   '0.75rem',   // tight gaps
}
