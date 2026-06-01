import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSchoolProfile, DEFAULT_PROFILE } from '../hooks/useSchoolProfile'
import { searchSchools } from '../data/schools'

const SUBJECT_FIELDS = [
  { key: 'reading', label: 'Reading',  icon: '📖', color: 'text-blue-600' },
  { key: 'math',    label: 'Math',     icon: '🔢', color: 'text-violet-600' },
  { key: 'science', label: 'Science',  icon: '🔬', color: 'text-emerald-600' },
  { key: 'english', label: 'English',  icon: '✍️', color: 'text-amber-600' },
]

function clamp(val) {
  const n = parseInt(val, 10)
  if (isNaN(n)) return ''
  return Math.min(100, Math.max(0, n))
}

const inputCls = 'w-full rounded-xl border border-warm-200 px-3.5 py-2.5 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-lavender/40 transition placeholder:text-slate-300'
const numInputCls = 'w-20 rounded-xl border border-warm-200 px-3 py-2.5 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-lavender/40 transition text-center font-bold'

function SchoolSearch({ value, onChange, onSelect }) {
  const [query, setQuery] = useState(value || '')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const wrapRef = useRef(null)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  useEffect(() => {
    const found = searchSchools(query)
    setResults(found)
    setOpen(found.length > 0 && query.length >= 2)
    setActiveIdx(-1)
  }, [query])

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleKey(e) {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)) }
    if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); pick(results[activeIdx]) }
    if (e.key === 'Escape') setOpen(false)
  }

  function pick(school) {
    setQuery(school.name)
    setOpen(false)
    onSelect(school)
  }

  function handleChange(e) {
    const v = e.target.value
    setQuery(v)
    onChange(v)
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKey}
        onFocus={() => { if (results.length > 0) setOpen(true) }}
        placeholder="Search by school name or city…"
        className={inputCls}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-warm-200 rounded-xl shadow-lg overflow-hidden">
          {results.map((school, i) => (
            <li
              key={school.name}
              onMouseDown={() => pick(school)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`px-4 py-3 cursor-pointer text-sm border-b border-warm-100 last:border-0 ${
                i === activeIdx ? 'bg-lavender-50' : 'hover:bg-warm-50'
              }`}
            >
              <p className="font-bold text-navy leading-tight">{school.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {school.city}, {school.state} · {school.program}
                {school.teas.overall != null && (
                  <span className="ml-1.5 text-teal-600 font-semibold">
                    · Min {school.teas.overall}% overall
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function SchoolProfile() {
  const { profile, saveProfile } = useSchoolProfile()
  const [form, setForm] = useState({
    schoolName:        profile.schoolName,
    programName:       profile.programName,
    testDate:          profile.testDate,
    requiredOverall:   profile.requiredOverall ?? '',
    requiredBySubject: { ...profile.requiredBySubject },
  })
  const [saved, setSaved] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)

  function field(key, value) { setForm((f) => ({ ...f, [key]: value })); setSaved(false); setAutoFilled(false) }

  function subjectGoal(key, raw) {
    setForm((f) => ({
      ...f,
      requiredBySubject: {
        ...f.requiredBySubject,
        [key]: raw === '' ? '' : clamp(raw),
      },
    }))
    setSaved(false)
    setAutoFilled(false)
  }

  function handleSchoolSelect(school) {
    setForm((f) => ({
      ...f,
      schoolName:  school.name,
      programName: school.program,
      requiredOverall: school.teas.overall ?? '',
      requiredBySubject: {
        reading: school.teas.reading ?? school.competitive?.reading ?? '',
        math:    school.teas.math    ?? school.competitive?.math    ?? '',
        science: school.teas.science ?? school.competitive?.science ?? '',
        english: school.teas.english ?? school.competitive?.english ?? '',
      },
    }))
    setSaved(false)
    setAutoFilled(true)
  }

  function handleSave(e) {
    e.preventDefault()
    saveProfile({
      ...form,
      requiredOverall: form.requiredOverall === '' ? null : Number(form.requiredOverall),
      requiredBySubject: Object.fromEntries(
        Object.entries(form.requiredBySubject).map(([k, v]) => [k, v === '' ? null : Number(v)])
      ),
    })
    setSaved(true)
    setAutoFilled(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-5 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-navy tracking-tight text-2xl">School Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your score requirements drive readiness + gap tracking across the app.</p>
        </div>
        <Link to="/" className="text-sm font-bold text-lavender hover:text-lavender-500 shrink-0 mt-1 transition-colors">
          ← Dashboard
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-4">

        {/* School & Program */}
        <div className="bg-white rounded-2xl shadow-card border border-warm-200 p-5">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.14em] mb-4">School &amp; Program</p>
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">School Name</label>
              <SchoolSearch
                value={form.schoolName}
                onChange={(v) => field('schoolName', v)}
                onSelect={handleSchoolSelect}
              />
              <p className="text-[10px] text-slate-400 mt-1.5">
                Type to search — selecting a school auto-fills score requirements.
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Program</label>
              <input
                type="text"
                value={form.programName}
                onChange={(e) => field('programName', e.target.value)}
                placeholder="e.g. Nursing / Associate Degree"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Target Test Date
                <span className="font-normal text-slate-400 ml-1">(optional — enables countdown timer)</span>
              </label>
              <input
                type="date"
                value={form.testDate}
                onChange={(e) => field('testDate', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Score Requirements */}
        <div className="bg-white rounded-2xl shadow-card border border-warm-200 p-5">
          <div className="flex items-start justify-between mb-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.14em]">Required Scores</p>
            {autoFilled && (
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-2 py-0.5">
                Auto-filled · edit freely
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-4">
            These targets power your readiness status and gap indicators. Leave blank if unknown.
          </p>

          {/* Overall */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-lavender-50 border border-lavender-100 mb-4">
            <div>
              <p className="text-sm font-extrabold text-navy">Overall Composite</p>
              <p className="text-xs text-slate-400 mt-0.5">Drives your top-level readiness status</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={form.requiredOverall}
                onChange={(e) => field('requiredOverall', e.target.value === '' ? '' : clamp(e.target.value))}
                placeholder="—"
                className={numInputCls}
              />
              <span className="text-sm font-bold text-slate-500">%</span>
            </div>
          </div>

          {/* By subject */}
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.14em] mb-3">By Subject</p>
          <div className="space-y-2">
            {SUBJECT_FIELDS.map(({ key, label, icon, color }) => (
              <div key={key} className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-warm-200 bg-warm-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{icon}</span>
                  <span className={`text-sm font-bold ${color}`}>{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.requiredBySubject[key] ?? ''}
                    onChange={(e) => subjectGoal(key, e.target.value)}
                    placeholder="—"
                    className={numInputCls}
                  />
                  <span className="text-sm font-bold text-slate-500">%</span>
                </div>
              </div>
            ))}
          </div>

          {autoFilled && (
            <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
              * Requirements are sourced from publicly available admissions data and may have changed.
              Always verify with your school's nursing admissions office.
            </p>
          )}
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 bg-lavender hover:bg-lavender-500 text-white font-bold rounded-xl py-3 text-sm transition-colors shadow-sm"
          >
            Save Profile
          </button>
          {saved && (
            <span className="text-sm font-bold text-success flex items-center gap-1.5 shrink-0">
              ✓ Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
