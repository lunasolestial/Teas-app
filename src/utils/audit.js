// Dev-only question audit. Call runQuestionAudit() in main.jsx (dev mode only).
// Logs per-subject counts, OFF_SPEC questions, and Reading passage coverage.

import { ALL_QUESTIONS, QUIZ_POOL } from '../data/questions'
import { QUESTION_AUDIT } from '../data/questionsAudit'

const SUBJECTS_ORDER = ['reading', 'math', 'science', 'english']

const TOPIC_LABELS = {
  'key-ideas': 'Key Ideas & Details',
  'craft-structure': 'Craft & Structure',
  'integration-knowledge': 'Integration of Knowledge',
  'numbers-algebra': 'Numbers & Algebra',
  'measurement-data': 'Measurement & Data',
  'anatomy-physiology': 'Human A&P',
  'biology': 'Biology',
  'chemistry': 'Chemistry',
  'scientific-reasoning': 'Scientific Reasoning',
  'conventions-english': 'Conventions',
  'knowledge-language': 'Knowledge of Language',
  'vocabulary-writing': 'Vocabulary & Writing',
}

export function runQuestionAudit() {
  if (import.meta.env.MODE !== 'development') return

  const allIds = new Set(ALL_QUESTIONS.map((q) => q.id))
  const poolIds = new Set(QUIZ_POOL.map((q) => q.id))

  console.group("🔍 LI'S TEAS Lab — Question Audit Report")
  console.log(`Total questions (all): ${ALL_QUESTIONS.length}`)
  console.log(`In quiz pool (TEAS-valid): ${QUIZ_POOL.length}`)
  console.log(`Excluded (OFF_SPEC): ${ALL_QUESTIONS.length - QUIZ_POOL.length}`)
  console.log('')

  for (const subject of SUBJECTS_ORDER) {
    const subAll = ALL_QUESTIONS.filter((q) => q.subjectId === subject)
    const subPool = subAll.filter((q) => poolIds.has(q.id))
    const subOff = subAll.filter((q) => !poolIds.has(q.id))

    const styleCheck = subject === 'reading'
      ? ` | passage-based in pool: ${subPool.filter((q) => {
          const a = QUESTION_AUDIT[q.id] || q
          return a.hasPassage === true
        }).length}/${subPool.length}`
      : ''

    console.group(`📚 ${subject.toUpperCase()}  (pool: ${subPool.length} / total: ${subAll.length}${styleCheck})`)

    // Per-topic breakdown
    const topics = [...new Set(subAll.map((q) => q.topicId))]
    for (const topicId of topics) {
      const tAll = subAll.filter((q) => q.topicId === topicId)
      const tPool = tAll.filter((q) => poolIds.has(q.id))
      const tOff = tAll.filter((q) => !poolIds.has(q.id))
      const label = TOPIC_LABELS[topicId] || topicId
      const offNote = tOff.length > 0 ? ` ⚠ ${tOff.length} OFF_SPEC` : ''
      console.log(`  ${label}: ${tPool.length} valid / ${tAll.length} total${offNote}`)
    }

    // OFF_SPEC detail
    if (subOff.length > 0) {
      console.group(`  ⚠ OFF_SPEC (${subOff.length})`)
      for (const q of subOff) {
        const auditEntry = QUESTION_AUDIT[q.id]
        const reason = auditEntry?.offSpecReason || 'No reason recorded'
        const replacement = auditEntry?.replacedBy ? ` → replaced by ${auditEntry.replacedBy}` : ''
        console.log(`  ${q.id}: ${reason}${replacement}`)
      }
      console.groupEnd()
    }

    // Clinical context note for math
    if (subject === 'math') {
      const clinical = subPool.filter((q) => {
        const a = QUESTION_AUDIT[q.id] || {}
        return a.clinicalContext === true
      })
      const pure = subPool.length - clinical.length
      console.log(`  Mix check → pure math: ${pure}  clinical context: ${clinical.length}  (${Math.round((pure / subPool.length) * 100)}% / ${Math.round((clinical.length / subPool.length) * 100)}%)`)
    }

    console.groupEnd()
  }

  // Style contract summary
  console.group('📋 Style Contract Check')
  const readingPool = QUIZ_POOL.filter((q) => q.subjectId === 'reading')
  const passageBased = readingPool.filter((q) => {
    const a = QUESTION_AUDIT[q.id] || q
    return a.hasPassage === true
  })
  console.log(`Reading: ${passageBased.length}/${readingPool.length} passage-based (${Math.round((passageBased.length / readingPool.length) * 100)}%)`)

  const mathPool = QUIZ_POOL.filter((q) => q.subjectId === 'math')
  const clinicalMath = mathPool.filter((q) => (QUESTION_AUDIT[q.id] || {}).clinicalContext)
  console.log(`Math: ${mathPool.length - clinicalMath.length} general / ${clinicalMath.length} clinical (${Math.round(((mathPool.length - clinicalMath.length) / mathPool.length) * 100)}% general)`)

  const scienceNursingQ = QUIZ_POOL.filter((q) => q.subjectId === 'science' && q.question.toLowerCase().includes('what should the nurse'))
  console.log(`Science "what should the nurse do" questions: ${scienceNursingQ.length} (target: 0)`)

  console.groupEnd()
  console.groupEnd()
}