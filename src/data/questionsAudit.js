// Style audit flags for every question.
// alignmentTag: 'TEAS' = valid for quiz pool | 'OFF_SPEC' = excluded from quiz pool.
// styleChecklistPass: false when a question violates the subject style contract.
// hasPassage: Reading questions must be passage-based.
// clinicalContext: Math questions that use nursing/clinical framing (valid for TEAS, informational only).

// Style contracts:
//   Reading  — MUST be passage-based (quoted text ≥ 2 sentences, or described multi-sentence passage).
//              MUST NOT ask abstract concept questions with no passage anchor.
//   Math     — MAY include clinical math; MUST NOT be all dosage/nursing (mix required).
//   Science  — MUST test foundational science; MUST NOT ask "what should the nurse do."
//   English  — MUST test language conventions; MUST NOT frame as clinical decision-making.

export const QUESTION_AUDIT = {
  // ── Reading: Key Ideas and Details ──────────────────────────────────────
  'r-kid-1': { questionType: 'mcq', subtopic: 'main-idea-identification',       alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-kid-2': { questionType: 'mcq', subtopic: 'inference',                      alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-kid-3': { questionType: 'mcq', subtopic: 'summary',                        alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-kid-4': {
    questionType: 'mcq', subtopic: 'supporting-detail-identification',
    alignmentTag: 'OFF_SPEC', styleChecklistPass: false, hasPassage: false,
    offSpecReason: 'No passage — asks which sentence is a detail in the abstract, not anchored to a text.',
    replacedBy: 'r-kid-p1-2',
  },
  'r-kid-5': { questionType: 'mcq', subtopic: 'signal-words',                   alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-kid-6': { questionType: 'mcq', subtopic: 'explicit-information',           alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-kid-7': {
    questionType: 'mcq', subtopic: 'inference',
    alignmentTag: 'OFF_SPEC', styleChecklistPass: false, hasPassage: false,
    offSpecReason: 'No passage — presents four standalone statements and asks which is an inference without text evidence.',
    replacedBy: 'r-kid-p1-3',
  },
  'r-kid-8': { questionType: 'mcq', subtopic: 'main-idea-identification',       alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-kid-9': { questionType: 'mcq', subtopic: 'signal-words',                   alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-kid-10': {
    questionType: 'mcq', subtopic: 'fact-vs-opinion',
    alignmentTag: 'OFF_SPEC', styleChecklistPass: false, hasPassage: false,
    offSpecReason: 'No passage — presents four decontextualised sentences and asks which is an opinion, not a reading comprehension task.',
    replacedBy: 'r-kid-p2-1',
  },

  // ── Reading: Craft and Structure ────────────────────────────────────────
  'r-cs-1':  { questionType: 'mcq', subtopic: 'author-purpose',                 alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-cs-2':  { questionType: 'mcq', subtopic: 'text-structure-cause-effect',    alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-cs-3':  { questionType: 'mcq', subtopic: 'vocabulary-in-context',          alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-cs-4':  { questionType: 'mcq', subtopic: 'tone-identification',            alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-cs-5':  { questionType: 'mcq', subtopic: 'text-structure-sequence',        alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-cs-6':  {
    questionType: 'mcq', subtopic: 'formal-register',
    alignmentTag: 'OFF_SPEC', styleChecklistPass: false, hasPassage: false,
    offSpecReason: 'No passage — asks student to rank four isolated sentences for formality with no reading context.',
    replacedBy: 'r-cs-p1-2',
  },
  'r-cs-7':  { questionType: 'mcq', subtopic: 'text-structure-compare-contrast', alignmentTag: 'TEAS',    styleChecklistPass: true,  hasPassage: true  },
  'r-cs-8':  {
    questionType: 'mcq', subtopic: 'point-of-view',
    alignmentTag: 'OFF_SPEC', styleChecklistPass: false, hasPassage: false,
    offSpecReason: 'Describes a passage with I/my pronouns but does not show the passage; tests label recognition, not comprehension.',
    replacedBy: 'r-cs-p1-1',
  },
  'r-cs-9':  { questionType: 'mcq', subtopic: 'vocabulary-in-context',          alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-cs-10': {
    questionType: 'mcq', subtopic: 'text-structure-problem-solution',
    alignmentTag: 'OFF_SPEC', styleChecklistPass: false, hasPassage: false,
    offSpecReason: 'No passage — asks which signal phrase indicates problem-solution; tests vocabulary knowledge, not passage comprehension.',
    replacedBy: 'r-cs-p2-1',
  },

  // ── Reading: Integration of Knowledge ──────────────────────────────────
  'r-ik-1':  { questionType: 'mcq', subtopic: 'compare-passages',               alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-ik-2':  { questionType: 'mcq', subtopic: 'graph-reading-bar',              alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-ik-3':  {
    questionType: 'mcq', subtopic: 'primary-secondary-source',
    alignmentTag: 'OFF_SPEC', styleChecklistPass: false, hasPassage: false,
    offSpecReason: 'No passage — presents four abstract definitions and asks which fits "primary source"; no reading context required.',
    replacedBy: 'r-ik-p1-1',
  },
  'r-ik-4':  {
    questionType: 'mcq', subtopic: 'fact-vs-opinion',
    alignmentTag: 'OFF_SPEC', styleChecklistPass: false, hasPassage: false,
    offSpecReason: 'Single-sentence stimulus — not a passage; cannot assess reading comprehension from one claim.',
    replacedBy: 'r-ik-p1-2',
  },
  'r-ik-5':  { questionType: 'mcq', subtopic: 'graph-reading-line',             alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-ik-6':  {
    questionType: 'mcq', subtopic: 'logical-fallacy',
    alignmentTag: 'OFF_SPEC', styleChecklistPass: false, hasPassage: false,
    offSpecReason: 'Single-sentence stimulus without passage context; tests label knowledge, not application to a text.',
    replacedBy: 'r-ik-p2-1',
  },
  'r-ik-7':  { questionType: 'mcq', subtopic: 'compare-passages',               alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-ik-8':  { questionType: 'mcq', subtopic: 'graph-reading-pie',              alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },
  'r-ik-9':  {
    questionType: 'mcq', subtopic: 'argument-evaluation',
    alignmentTag: 'OFF_SPEC', styleChecklistPass: false, hasPassage: false,
    offSpecReason: 'Abstract question about what makes an argument strong — no passage, no specific argument to evaluate.',
    replacedBy: 'r-ik-p2-2',
  },
  'r-ik-10': { questionType: 'mcq', subtopic: 'correlation-causation',          alignmentTag: 'TEAS',     styleChecklistPass: true,  hasPassage: true  },

  // ── Math: Numbers and Algebra ────────────────────────────────────────────
  'm-na-1':  { questionType: 'mcq', subtopic: 'fraction-operations',            alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-na-2':  { questionType: 'mcq', subtopic: 'unit-conversion-weight',         alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: true  },
  'm-na-3':  { questionType: 'mcq', subtopic: 'algebra-linear-equations',       alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-na-4':  { questionType: 'mcq', subtopic: 'percentage-calculation',         alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-na-5':  { questionType: 'mcq', subtopic: 'dosage-calculation-tablets',     alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: true  },
  'm-na-6':  { questionType: 'mcq', subtopic: 'order-of-operations',            alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-na-7':  { questionType: 'mcq', subtopic: 'percentage-calculation',         alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-na-8':  { questionType: 'mcq', subtopic: 'dosage-calculation-liquid',      alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: true  },
  'm-na-9':  { questionType: 'mcq', subtopic: 'fraction-decimal-conversion',    alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-na-10': { questionType: 'mcq', subtopic: 'ratio-proportion',               alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: true  },
  'm-na-11': { questionType: 'mcq', subtopic: 'percent-change',                 alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-na-12': { questionType: 'mcq', subtopic: 'algebra-expressions',            alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },

  // ── Math: Measurement and Data ──────────────────────────────────────────
  'm-md-1':  { questionType: 'mcq', subtopic: 'unit-conversion-volume',         alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-md-2':  { questionType: 'mcq', subtopic: 'statistics-median',              alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-md-3':  { questionType: 'mcq', subtopic: 'statistics-mode',                alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-md-4':  { questionType: 'mcq', subtopic: 'unit-conversion-volume',         alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: true  },
  'm-md-5':  { questionType: 'mcq', subtopic: 'statistics-mean',                alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-md-6':  { questionType: 'mcq', subtopic: 'probability-basic',              alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-md-7':  { questionType: 'mcq', subtopic: 'unit-conversion-length',         alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-md-8':  { questionType: 'mcq', subtopic: 'statistics-range',               alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },
  'm-md-9':  { questionType: 'mcq', subtopic: 'iv-rate-calculation',            alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: true  },
  'm-md-10': { questionType: 'mcq', subtopic: 'unit-conversion-weight',         alignmentTag: 'TEAS',     styleChecklistPass: true,  clinicalContext: false },

  // ── Science: Human A&P ──────────────────────────────────────────────────
  's-ap-1':  { questionType: 'mcq', subtopic: 'cardiovascular-system',          alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-ap-2':  { questionType: 'mcq', subtopic: 'urinary-system',                 alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-ap-3':  { questionType: 'mcq', subtopic: 'nervous-system-autonomic',       alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-ap-4':  { questionType: 'mcq', subtopic: 'respiratory-system',             alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-ap-5':  { questionType: 'mcq', subtopic: 'endocrine-system',               alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-ap-6':  { questionType: 'mcq', subtopic: 'cardiovascular-system',          alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-ap-7':  { questionType: 'mcq', subtopic: 'homeostasis',                    alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-ap-8':  { questionType: 'mcq', subtopic: 'digestive-system',               alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-ap-9':  { questionType: 'mcq', subtopic: 'acid-base-blood-ph',             alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-ap-10': { questionType: 'mcq', subtopic: 'endocrine-system',               alignmentTag: 'TEAS',     styleChecklistPass: true  },

  // ── Science: Biology ────────────────────────────────────────────────────
  's-bio-1': { questionType: 'mcq', subtopic: 'cell-organelles',                alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-bio-2': { questionType: 'mcq', subtopic: 'cell-division-mitosis',          alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-bio-3': { questionType: 'mcq', subtopic: 'protein-synthesis',              alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-bio-4': { questionType: 'mcq', subtopic: 'dna-base-pairing',               alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-bio-5': { questionType: 'mcq', subtopic: 'genetics-mendelian',             alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-bio-6': { questionType: 'mcq', subtopic: 'cell-division-mitosis-phases',   alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-bio-7': { questionType: 'mcq', subtopic: 'cell-organelles',                alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-bio-8': { questionType: 'mcq', subtopic: 'cell-division-meiosis',          alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-bio-9': { questionType: 'mcq', subtopic: 'genetics-mendelian',             alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-bio-10':{ questionType: 'mcq', subtopic: 'cell-transport',                 alignmentTag: 'TEAS',     styleChecklistPass: true  },

  // ── Science: Chemistry ──────────────────────────────────────────────────
  's-chem-1': { questionType: 'mcq', subtopic: 'atomic-structure',              alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-chem-2': { questionType: 'mcq', subtopic: 'ph-scale',                      alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-chem-3': { questionType: 'mcq', subtopic: 'chemical-bonds-ionic',          alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-chem-4': { questionType: 'mcq', subtopic: 'atomic-structure',              alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-chem-5': { questionType: 'mcq', subtopic: 'isotopes',                      alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-chem-6': { questionType: 'mcq', subtopic: 'chemical-bonds-covalent',       alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-chem-7': { questionType: 'mcq', subtopic: 'acid-base-definition',          alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-chem-8': { questionType: 'mcq', subtopic: 'conservation-of-mass',          alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-chem-9': { questionType: 'mcq', subtopic: 'ph-scale',                      alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-chem-10':{ questionType: 'mcq', subtopic: 'acid-base-clinical',            alignmentTag: 'TEAS',     styleChecklistPass: true  },

  // ── Science: Scientific Reasoning ───────────────────────────────────────
  's-sr-1':  { questionType: 'mcq', subtopic: 'experimental-design-groups',     alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-sr-2':  { questionType: 'mcq', subtopic: 'independent-variable',           alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-sr-3':  { questionType: 'mcq', subtopic: 'hypothesis-criteria',            alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-sr-4':  { questionType: 'mcq', subtopic: 'correlation-causation',          alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-sr-5':  { questionType: 'mcq', subtopic: 'hypothesis-format',              alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-sr-6':  { questionType: 'mcq', subtopic: 'conclusion-validity',            alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-sr-7':  { questionType: 'mcq', subtopic: 'controlled-variables',           alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-sr-8':  { questionType: 'mcq', subtopic: 'scientific-method-sequence',     alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-sr-9':  { questionType: 'mcq', subtopic: 'reproducibility',                alignmentTag: 'TEAS',     styleChecklistPass: true  },
  's-sr-10': { questionType: 'mcq', subtopic: 'study-design-blinding',          alignmentTag: 'TEAS',     styleChecklistPass: true  },

  // ── English: Conventions of Standard English ─────────────────────────────
  'e-conv-1': { questionType: 'mcq', subtopic: 'subject-verb-each-every',       alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-conv-2': { questionType: 'mcq', subtopic: 'comma-splice',                  alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-conv-3': { questionType: 'mcq', subtopic: 'apostrophe-its-contraction',    alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-conv-4': { questionType: 'mcq', subtopic: 'fragment-identification',       alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-conv-5': { questionType: 'mcq', subtopic: 'punctuation-colon',             alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-conv-6': { questionType: 'mcq', subtopic: 'pronoun-antecedent-agreement',  alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-conv-7': { questionType: 'mcq', subtopic: 'run-on-sentence',               alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-conv-8': { questionType: 'mcq', subtopic: 'conjunctions-coordinating',     alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-conv-9': { questionType: 'mcq', subtopic: 'punctuation-semicolon',         alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-conv-10':{ questionType: 'mcq', subtopic: 'apostrophe-its-possessive',     alignmentTag: 'TEAS',     styleChecklistPass: true  },

  // ── English: Knowledge of Language ──────────────────────────────────────
  'e-kol-1': { questionType: 'mcq', subtopic: 'conciseness',                    alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-kol-2': { questionType: 'mcq', subtopic: 'parallel-structure',             alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-kol-3': { questionType: 'mcq', subtopic: 'transition-cause-effect',        alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-kol-4': { questionType: 'mcq', subtopic: 'redundancy-identification',      alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-kol-5': { questionType: 'mcq', subtopic: 'transition-contrast',            alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-kol-6': { questionType: 'mcq', subtopic: 'sentence-combining',             alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-kol-7': { questionType: 'mcq', subtopic: 'formal-register',                alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-kol-8': { questionType: 'mcq', subtopic: 'parallel-structure-error',       alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-kol-9': { questionType: 'mcq', subtopic: 'redundancy-phrases',             alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-kol-10':{ questionType: 'mcq', subtopic: 'word-choice-formal',             alignmentTag: 'TEAS',     styleChecklistPass: true  },

  // ── English: Vocabulary and Writing ─────────────────────────────────────
  'e-voc-1': { questionType: 'mcq', subtopic: 'context-clue-example',           alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-voc-2': { questionType: 'mcq', subtopic: 'medical-prefix-brady-tachy',     alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-voc-3': { questionType: 'mcq', subtopic: 'context-clue-antonym',           alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-voc-4': { questionType: 'mcq', subtopic: 'medical-suffix-itis',            alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-voc-5': { questionType: 'mcq', subtopic: 'medical-prefix-hypo-hyper',      alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-voc-6': { questionType: 'mcq', subtopic: 'medical-suffix-ectomy',          alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-voc-7': { questionType: 'mcq', subtopic: 'writing-process-stages',         alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-voc-8': { questionType: 'mcq', subtopic: 'denotation-connotation',         alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-voc-9': { questionType: 'mcq', subtopic: 'medical-prefix-tachy',           alignmentTag: 'TEAS',     styleChecklistPass: true  },
  'e-voc-10':{ questionType: 'mcq', subtopic: 'word-root-ambul',                alignmentTag: 'TEAS',     styleChecklistPass: true  },

  // ── Replacement question audit flags (inline with questionsReading.js) ───
  // These IDs are pre-registered here so the audit counts them correctly.
  'r-kid-p1-1': { questionType: 'mcq', subtopic: 'main-idea-identification',       alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
  'r-kid-p1-2': { questionType: 'mcq', subtopic: 'supporting-detail-identification',alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
  'r-kid-p1-3': { questionType: 'mcq', subtopic: 'inference',                       alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
  'r-kid-p2-1': { questionType: 'mcq', subtopic: 'fact-vs-opinion',                 alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
  'r-cs-p1-1':  { questionType: 'mcq', subtopic: 'point-of-view',                   alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
  'r-cs-p1-2':  { questionType: 'mcq', subtopic: 'tone-identification',              alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
  'r-cs-p2-1':  { questionType: 'mcq', subtopic: 'text-structure-problem-solution',  alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
  'r-ik-p1-1':  { questionType: 'mcq', subtopic: 'primary-secondary-source',         alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
  'r-ik-p1-2':  { questionType: 'mcq', subtopic: 'fact-vs-opinion',                  alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
  'r-ik-p2-1':  { questionType: 'mcq', subtopic: 'logical-fallacy',                  alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
  'r-ik-p2-2':  { questionType: 'mcq', subtopic: 'argument-evaluation',              alignmentTag: 'TEAS', styleChecklistPass: true, hasPassage: true },
}
