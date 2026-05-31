import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSchoolProfile, DEFAULT_PROFILE } from '../hooks/useSchoolProfile'

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

  function field(key, value) { setForm((f) => ({ ...f, [key]: value })); setSaved(false) }

  function subjectGoal(key, raw) {
    setForm((f) => ({
      ...f,
      requiredBySubject: {
        ...f.requiredBySubject,
        [key]: raw === '' ? '' : clamp(raw),
      },
    }))
    setSaved(false)
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
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => field('schoolName', e.target.value)}
                placeholder="e.g. Central Piedmont Community College"
                className={inputCls}
              />
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
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.14em] mb-1">Required Scores</p>
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
                placeholder="80"
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
        </div>

        {/* CPCC defaults reference */}
        <div className="bg-warm-50 border border-warm-200 rounded-2xl px-4 py-3.5 flex items-start gap-3">
          <span className="text-base mt-0.5">🏫</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-600">CPCC Nursing Defaults</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Overall 80% · Reading 80% · Math 70% · Science 75% · English 75%
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setForm({
                schoolName:        DEFAULT_PROFILE.schoolName,
                programName:       DEFAULT_PROFILE.programName,
                testDate:          DEFAULT_PROFILE.testDate,
                requiredOverall:   DEFAULT_PROFILE.requiredOverall,
                requiredBySubject: { ...DEFAULT_PROFILE.requiredBySubject },
              })
              setSaved(false)
            }}
            className="text-xs font-bold text-lavender hover:text-lavender-500 whitespace-nowrap transition-colors"
          >
            Apply
          </button>
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
