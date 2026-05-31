/**
 * AI client — all calls route through the local proxy at /api/ai.
 * The API key is NEVER exposed to the browser.
 *
 * Dev:  Vite proxies /api → http://localhost:3001  (vite.config.js)
 * Prod: deploy server/index.js behind the same origin or a reverse-proxy.
 *
 * All AI content is calibrated to ATI TEAS 7 exam style by the server-side
 * system prompt. Do not add subject matter guidance here — add it in server/index.js.
 */

const AI_ENDPOINT = '/api/ai'

async function post(task, payload = {}) {
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, payload }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error ?? `AI proxy returned ${res.status}`)
  }

  return data // { result: object, usage: object }
}

// ─────────────────────────────────────────────────────────────────────────────
// generateNotebookFromTranscript
//
// Converts a video transcript or raw study notes into a structured TEAS notebook.
// Practice questions use the upgraded schema with difficulty, options, and
// structured rationale (whyCorrect / whyWrong / commonTrap / memoryTip).
//
// @param {string} transcriptText  - raw transcript or notes to process
// @param {{ subjectId, topicId, videoId }} context
//
// @returns {{
//   mainIdea: string,
//   recapOneMinute: string,
//   whereItFits: string,
//   keyTerms: Array<{ term: string, meaning: string }>,
//   mustKnowFacts: string[],
//   writeInNotebook: string[],
//   diagramSuggestions: string[],
//   memoryTricks: string[],
//   commonTraps: string[],
//   practiceQuestions: Array<{
//     questionType: 'multiple_choice' | 'multiple_select' | 'supply_answer',
//     difficulty: 1 | 2 | 3,
//     question: string,
//     options: string[],
//     correctIndex: number,
//     rationale: {
//       whyCorrect: string,
//       whyWrong: string,
//       commonTrap: string,
//       memoryTip: string,
//     },
//     teasConceptTested: string,
//   }>,
//   confuseWith: Array<{ conceptA: string, conceptB: string, difference: string }>
// }}
// ─────────────────────────────────────────────────────────────────────────────
export async function generateNotebookFromTranscript(transcriptText, context = {}) {
  const { subjectId = '', topicId = '', videoId = '' } = context
  const { result } = await post('generateNotebookFromTranscript', {
    transcriptText,
    subjectId,
    topicId,
    videoId,
  })
  return result
}

// ─────────────────────────────────────────────────────────────────────────────
// generateTEASQuestions
//
// Generates standalone ATI TEAS 7 questions for a given topic on demand.
// All questions follow the TEAS 7 calibration: concise stems, realistic
// distractors, structured rationale, appropriate difficulty distribution.
//
// @param {{
//   subjectId: string,
//   topicId: string,
//   topicName: string,
//   count?: number,           // default 5
//   difficultyProfile?:       // default 'balanced'
//     'balanced' | 'foundation' | 'challenging' | 'spaced',
//   questionTypes?:           // default ['multiple_choice']
//     Array<'multiple_choice' | 'multiple_select' | 'supply_answer' | 'hot_spot' | 'ordered_response'>,
//   excludeQuestionIds?: string[],
// }} options
//
// @returns {Array<{
//   id: string,
//   questionType: string,
//   difficulty: 1 | 2 | 3,
//   subjectId: string,
//   topicId: string,
//   question: string,
//   passage: string | null,
//   options: string[],
//   correctIndex: number | null,
//   correctIndices: number[] | null,
//   correctAnswer: string | null,
//   correctOrder: number[] | null,
//   correctDescription: string | null,
//   rationale: {
//     whyCorrect: string,
//     whyWrong: string,
//     commonTrap: string,
//     memoryTip: string,
//   },
//   teasConceptTested: string,
//   skillArea: string,
//   isCommonlyMissed: boolean,
//   tags: string[],
// }>}
// ─────────────────────────────────────────────────────────────────────────────
export async function generateTEASQuestions({
  subjectId,
  topicId,
  topicName,
  count = 5,
  difficultyProfile = 'balanced',
  questionTypes = ['multiple_choice'],
  excludeQuestionIds = [],
} = {}) {
  const { result } = await post('generateTEASQuestions', {
    subjectId,
    topicId,
    topicName,
    count,
    difficultyProfile,
    questionTypes,
    excludeQuestionIds,
  })
  // Server returns a JSON array directly
  return Array.isArray(result) ? result : []
}

// ─────────────────────────────────────────────────────────────────────────────
// explainClip
//
// Explains a saved study clip in ATI TEAS 7 context. Returns a structured
// breakdown including concept identification, trap analysis, memory tip, and
// a single practice question that directly tests the clip's concept.
//
// @param {{
//   content: string,
//   type: string,
//   timestampSeconds?: number,
//   userCaption?: string,
//   transcriptText?: string,
// }} clip
//
// @returns {{
//   clipSummary: string,
//   keyTakeaway: string,
//   teasConceptTested: string,
//   difficulty: 1 | 2 | 3,
//   commonTrap: string,
//   memoryTip: string,
//   whereItFits: string,
//   practiceQuestion: {
//     question: string,
//     options: string[],
//     correctIndex: number,
//     rationale: string,
//   },
// }}
// ─────────────────────────────────────────────────────────────────────────────
export async function explainClip({ content, type, timestampSeconds, userCaption, transcriptText }) {
  const { result } = await post('explainClip', {
    content,
    type,
    timestampSeconds,
    userCaption,
    transcriptText,
  })
  return result
}
