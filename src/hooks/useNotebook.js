import { useState, useCallback } from 'react'

const STORAGE_KEY = 'teas_notebooks_v1'
export const MAX_SCREENSHOT_BYTES = 1_000_000   // 1 MB hard limit
export const WARN_SCREENSHOT_BYTES = 400_000    // 400 KB — compress above this

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
function persist(notebooks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks))
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

// ── Empty structure ────────────────────────────────────────────────────────
export function makeEmptyNotebook(topicId) {
  return {
    topicId,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    collapsed: {},
    mainIdea: '',
    keyTerms: [],          // [{ id, term, definition }]
    mustKnowFacts: [],     // [{ id, text, checked }]
    notebookBullets: [],   // [{ id, text }]
    traps: [],             // [{ id, text }]
    confusions: [],        // [{ id, itemA, itemB, distinction }]
    practiceQuestions: [], // [{ id, question, answer }]
    diagrams: [],          // [{ id, description }]
    unknown: [             // prefill three blank prompt lines
      { id: uid(), text: '' },
      { id: uid(), text: '' },
      { id: uid(), text: '' },
    ],
    categories: { definitions: [], concepts: [], examples: [], clinical: [] },
    screenshots: [],       // [{ id, dataUrl, caption, size, createdAt }]
  }
}

// Auto-seed from aiContent + topic data on first open
export function seedNotebook(empty, topic, ai) {
  return {
    ...empty,
    mainIdea: ai?.simplify || topic?.description || '',
    keyTerms: (topic?.keyTerms || []).map((kt) => ({ id: uid(), term: kt.term, definition: kt.definition })),
    mustKnowFacts: (ai?.mustKnowFacts || []).map((f) => ({ id: uid(), text: f, checked: false })),
    notebookBullets: (ai?.notebookKeys || []).map((k) => ({ id: uid(), text: k })),
    traps: (topic?.traps || []).map((t) => ({ id: uid(), text: t })),
    diagrams: (ai?.diagramsToDraw || []).map((d) => ({ id: uid(), description: d })),
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useNotebook() {
  const [notebooks, setNotebooks] = useState(load)

  const commit = useCallback((updater) => {
    setNotebooks((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      persist(next)
      return next
    })
  }, [])

  const stamp = (nb) => ({ ...nb, lastModified: new Date().toISOString() })

  const getNotebook = useCallback((topicId) => notebooks[topicId] || null, [notebooks])

  const initNotebook = useCallback(
    (topicId, data) => commit((prev) => ({ ...prev, [topicId]: data })),
    [commit]
  )

  // Plain-text field (mainIdea)
  const setField = useCallback(
    (topicId, field, value) =>
      commit((prev) => ({
        ...prev,
        [topicId]: stamp({ ...prev[topicId], [field]: value }),
      })),
    [commit]
  )

  // Generic array-section helpers
  const addItem = useCallback(
    (topicId, section, item) =>
      commit((prev) => {
        const nb = prev[topicId] || makeEmptyNotebook(topicId)
        const list = Array.isArray(nb[section]) ? nb[section] : []
        return { ...prev, [topicId]: stamp({ ...nb, [section]: [...list, { id: uid(), ...item }] }) }
      }),
    [commit]
  )

  const updateItem = useCallback(
    (topicId, section, itemId, updates) =>
      commit((prev) => {
        const nb = prev[topicId]
        if (!nb) return prev
        return {
          ...prev,
          [topicId]: stamp({
            ...nb,
            [section]: nb[section].map((x) => (x.id === itemId ? { ...x, ...updates } : x)),
          }),
        }
      }),
    [commit]
  )

  const deleteItem = useCallback(
    (topicId, section, itemId) =>
      commit((prev) => {
        const nb = prev[topicId]
        if (!nb) return prev
        return {
          ...prev,
          [topicId]: stamp({ ...nb, [section]: nb[section].filter((x) => x.id !== itemId) }),
        }
      }),
    [commit]
  )

  // Categories sub-items
  const addCategoryItem = useCallback(
    (topicId, cat, text) =>
      commit((prev) => {
        const nb = prev[topicId] || makeEmptyNotebook(topicId)
        const cats = nb.categories || {}
        return {
          ...prev,
          [topicId]: stamp({
            ...nb,
            categories: { ...cats, [cat]: [...(cats[cat] || []), { id: uid(), text }] },
          }),
        }
      }),
    [commit]
  )

  const deleteCategoryItem = useCallback(
    (topicId, cat, itemId) =>
      commit((prev) => {
        const nb = prev[topicId]
        if (!nb) return prev
        const cats = nb.categories || {}
        return {
          ...prev,
          [topicId]: stamp({
            ...nb,
            categories: { ...cats, [cat]: (cats[cat] || []).filter((x) => x.id !== itemId) },
          }),
        }
      }),
    [commit]
  )

  // Screenshots
  const addScreenshot = useCallback(
    (topicId, dataUrl, caption) =>
      commit((prev) => {
        const nb = prev[topicId] || makeEmptyNotebook(topicId)
        return {
          ...prev,
          [topicId]: stamp({
            ...nb,
            screenshots: [
              ...nb.screenshots,
              { id: uid(), dataUrl, caption, size: dataUrl.length, createdAt: new Date().toISOString() },
            ],
          }),
        }
      }),
    [commit]
  )

  const deleteScreenshot = useCallback(
    (topicId, screenshotId) =>
      commit((prev) => {
        const nb = prev[topicId]
        if (!nb) return prev
        return {
          ...prev,
          [topicId]: stamp({ ...nb, screenshots: nb.screenshots.filter((s) => s.id !== screenshotId) }),
        }
      }),
    [commit]
  )

  const toggleCollapse = useCallback(
    (topicId, key) =>
      commit((prev) => {
        const nb = prev[topicId]
        if (!nb) return prev
        const c = nb.collapsed || {}
        return { ...prev, [topicId]: stamp({ ...nb, collapsed: { ...c, [key]: !c[key] } }) }
      }),
    [commit]
  )

  const clearNotebook = useCallback(
    (topicId) =>
      commit((prev) => {
        const { [topicId]: _, ...rest } = prev
        return rest
      }),
    [commit]
  )

  return {
    notebooks,
    getNotebook,
    initNotebook,
    setField,
    addItem,
    updateItem,
    deleteItem,
    addCategoryItem,
    deleteCategoryItem,
    addScreenshot,
    deleteScreenshot,
    toggleCollapse,
    clearNotebook,
  }
}
