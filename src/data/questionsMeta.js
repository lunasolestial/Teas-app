// Schema metadata for all 120 questions.
// Merged with QUESTIONS at runtime via getEnrichedQuestion().
// Fields: difficulty 1-3, skillTag, trapType, isCommonlyMissed, rationale.

export const QUESTION_META = {
  // ── Reading: Key Ideas ──────────────────────────────────────────────────
  'r-kid-1': {
    difficulty: 2, skillTag: 'main-idea', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Option B is the only answer broad enough to cover all three purposes the passage describes — safety, legal protection, and avoiding errors.', whyWrong: 'C and D are true supporting details from the passage but cover only one part of it; A is never stated.', teasConceptTested: 'Main idea identification', simpleExplanation: 'The main idea must act like an umbrella over every paragraph — not just one.', commonTrap: 'Choosing a supporting detail that sounds strong but only covers part of the passage.', memoryTip: 'Before picking an answer, ask: "Does this cover every paragraph?" If not, it\'s a detail.' },
  },
  'r-kid-2': {
    difficulty: 2, skillTag: 'inference', trapType: 'inference_leap', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Cancelled procedures and nurses sent home are both responses to fewer patients — low census is the only inference the text supports.', whyWrong: 'A (fired) requires outside information; C (power outage) is invented; D goes far beyond the passage.', teasConceptTested: 'Inference from context', simpleExplanation: 'What single fact explains both clues in the text?', commonTrap: 'Picking an answer that sounds dramatic rather than one directly supported by the evidence.', memoryTip: 'For inference: list every clue, then ask what single explanation fits them ALL.' },
  },
  'r-kid-3': {
    difficulty: 2, skillTag: 'summary', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Option C covers all three sections of the passage: importance of hand washing, how to do it (WHO protocol), and the compliance problem.', whyWrong: 'A and D are not stated. B focuses only on the WHO section, missing the compliance issue.', teasConceptTested: 'Passage summary', simpleExplanation: 'A summary must include all the main sections — not just the most memorable one.', commonTrap: 'Fixating on the WHO protocol (the most specific part) and ignoring the problem stated at the end.', memoryTip: 'A good summary hits every paragraph — if it skips the ending, it\'s incomplete.' },
  },
  'r-kid-4': {
    difficulty: 2, skillTag: 'supporting-detail', trapType: 'misread',
    isCommonlyMissed: true, commonlyMissedLabel: 'Detail vs. Main Idea',
    rationale: { whyCorrect: 'Option B is a specific statistic (5 mmHg reduction) — a concrete number is almost always a supporting detail, not a main idea.', whyWrong: 'A, C, and D are all broad enough to serve as main ideas for a passage about exercise.', teasConceptTested: 'Supporting detail identification', simpleExplanation: 'Specific numbers and narrow facts are details; broad claims are main ideas.', commonTrap: 'Thinking that a true, well-written sentence must be a main idea — details can sound equally good.', memoryTip: 'Statistics and specific facts = details. Broad claims = main ideas.' },
  },
  'r-kid-5': {
    difficulty: 1, skillTag: 'signal-words', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Despite" is a contrast signal word — the clause that follows will be an unexpected or opposing outcome.', whyWrong: 'A, C, D all require "despite" to function as a causal or definitional connector, which it is not.', teasConceptTested: 'Contrast signal words', simpleExplanation: '"Despite" always introduces something that goes against what came before.', commonTrap: 'Confusing contrast words with cause-effect words — "despite" is not the same as "because."', memoryTip: 'Despite = even though = BUT → always signals a contrast or surprise.' },
  },
  'r-kid-6': {
    difficulty: 2, skillTag: 'explicit-information', trapType: 'inference_leap', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Option B copies the exact words from the passage — explicit details are directly stated, never implied.', whyWrong: 'A, C, and D all add information not in the passage (elderly patients, doctor preferences, fatality).', teasConceptTested: 'Explicit vs implicit information', simpleExplanation: 'Explicit = word-for-word in the text. If you had to think beyond the text, it\'s implicit.', commonTrap: 'Choosing an answer that sounds medically reasonable but was never said in the passage.', memoryTip: 'Explicit = you can underline it in the passage. Can you underline it? If yes, it\'s explicit.' },
  },
  'r-kid-7': {
    difficulty: 2, skillTag: 'inference', trapType: 'inference_leap',
    isCommonlyMissed: true, commonlyMissedLabel: 'Inference vs. Explicit Fact',
    rationale: { whyCorrect: 'Option C draws a logical conclusion (likely infection) from two separate stated facts — that\'s the definition of an inference.', whyWrong: 'A, B, and D are directly stated charted facts — no reasoning is required to accept them.', teasConceptTested: 'Inference vs. stated fact', simpleExplanation: 'If you have to combine two facts to reach the answer, it\'s an inference.', commonTrap: 'Picking a stated fact because it "sounds like" a conclusion, or picking the inference because it feels too obvious.', memoryTip: 'Inference = "2 facts → 1 conclusion." The conclusion isn\'t written — you drew it yourself.' },
  },
  'r-kid-8': {
    difficulty: 2, skillTag: 'main-idea', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Option C encompasses all four topics mentioned (insulin, A1C, diet, exercise) under the umbrella of management.', whyWrong: 'A and D focus on only one aspect; B is not supported by the passage (exercise does not eliminate insulin need).', teasConceptTested: 'Main idea from multiple details', simpleExplanation: 'The main idea covers all the details — whichever answer fits all four topics is correct.', commonTrap: 'Choosing A because A1C was mentioned — it\'s just one of four topics, making it a detail.', memoryTip: 'Count how many passage topics each answer covers. The one that covers them all = main idea.' },
  },
  'r-kid-9': {
    difficulty: 1, skillTag: 'signal-words', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Yet" signals contrast — the high satisfaction is unexpected given the high volume.', whyWrong: 'A and B are possible conclusions but require going beyond the sentence; D is unsupported.', teasConceptTested: 'Contrast signal words', simpleExplanation: '"Yet" always means "but" or "even so" — the second part defies the expectation from the first.', commonTrap: 'Reading "yet" as a time word (like "not yet") rather than a contrast word.', memoryTip: '"Yet" = "but" or "however" — swap it in and the sentence still makes sense.' },
  },
  'r-kid-10': {
    difficulty: 2, skillTag: 'fact-opinion', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Option B uses "should always" — a value judgment that reflects a personal belief, not measurable data.', whyWrong: 'A, C, and D are all verifiable with data or official standards.', teasConceptTested: 'Fact vs. opinion', simpleExplanation: 'If a statement can be proven true or false with data, it\'s a fact. If it\'s a personal value judgment, it\'s an opinion.', commonTrap: 'Thinking a CDC recommendation is an opinion because it says what to do — recommendations backed by data are still facts.', memoryTip: 'Opinion red flags: should, must, best, worst, always, never, "I believe."' },
  },

  // ── Reading: Craft and Structure ───────────────────────────────────────
  'r-cs-1': {
    difficulty: 2, skillTag: 'author-purpose', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Presenting two viewpoints and drawing a balanced conclusion signals the author wants to inform — not push one side.', whyWrong: 'B would require the author to advocate for one side; A and D describe content that isn\'t present.', teasConceptTested: "Author's purpose (PIE)", simpleExplanation: 'Balanced = inform. One-sided = persuade. Story = entertain.', commonTrap: 'Seeing the word "debate" and assuming persuade — if both sides are shown fairly, it\'s inform.', memoryTip: 'PIE: two viewpoints + balanced conclusion = Inform, not Persuade.' },
  },
  'r-cs-2': {
    difficulty: 2, skillTag: 'text-structure', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'The discovery of penicillin (cause) led to a drop in mortality (effect) — classic cause-and-effect structure.', whyWrong: 'Problem-solution would show a problem and then a fix; compare-contrast would highlight differences between two things.', teasConceptTested: 'Cause-and-effect text structure', simpleExplanation: 'One event → one outcome = cause and effect.', commonTrap: 'Calling this problem-solution because infections are a "problem" — but no solution strategy is presented, only the result of discovery.', memoryTip: 'Cause-effect signal: "After X happened, Y changed." Before/after = cause-effect.' },
  },
  'r-cs-3': {
    difficulty: 1, skillTag: 'vocabulary-context', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Bleak" describes a prognosis — a medical outlook that\'s poor or without hope is bleak.', whyWrong: 'Hopeful and improving are opposites of bleak. Uncertain lacks the negativity "bleak" carries.', teasConceptTested: 'Vocabulary in context', simpleExplanation: '"Bleak" consistently means gloomy, discouraging, or without hope across all contexts.', commonTrap: 'Choosing "uncertain" because a prognosis can be uncertain — but bleak means more than uncertain, it means bad.', memoryTip: 'Bleak = "bleak midwinter" = cold, hopeless, dreary. Apply that feeling to the context.' },
  },
  'r-cs-4': {
    difficulty: 3, skillTag: 'tone', trapType: 'misread',
    isCommonlyMissed: true, commonlyMissedLabel: 'Tone Identification',
    rationale: { whyCorrect: '"Unacceptably," "dangerously," and "deserve better" are charged words expressing alarm and advocacy — the author wants change.', whyWrong: 'Objective writing uses neutral language; the strong adjectives here rule out A. Humor is absent; C is wrong.', teasConceptTested: 'Author tone from word choice', simpleExplanation: 'The author\'s word choices reveal their attitude — charged negative words = alarmed and advocating.', commonTrap: 'Picking "objective" because editorials can sound formal — but the word choices reveal a clear emotional stance.', memoryTip: 'Tone lives in the adjectives and verbs. Circle them: are they neutral or emotionally loaded?' },
  },
  'r-cs-5': {
    difficulty: 1, skillTag: 'text-structure', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'First, next, then, finally are sequence signal words indicating events or steps in time order.', whyWrong: 'Cause-effect uses because/therefore; compare-contrast uses however/unlike; problem-solution uses "to address."', teasConceptTested: 'Sequence text structure', simpleExplanation: 'These four words are the clearest signal that the passage is presenting events in order.', commonTrap: 'Thinking "next" could mean cause-effect — it just means what comes after in a sequence.', memoryTip: 'First → Next → Then → Finally = steps in order = sequence/chronological.' },
  },
  'r-cs-6': {
    difficulty: 2, skillTag: 'tone', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Option C uses formal academic language, passive voice citation ("research suggests"), and avoids colloquialisms.', whyWrong: 'A, B, D all use informal language ("really," "pretty," "kind of," "everybody") inappropriate for research writing.', teasConceptTested: 'Formal register', simpleExplanation: 'Formal writing: complete sentences, no slang, evidence-based claims.', commonTrap: 'Choosing B because "it\'s pretty clear" sounds confident — but "pretty" is informal and vague.', memoryTip: 'Formal writing test: Can you find even one slang word or contraction? If yes → informal.' },
  },
  'r-cs-7': {
    difficulty: 1, skillTag: 'text-structure', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Unlike" directly signals contrast — two methods are being compared.', whyWrong: 'Cause-effect requires because/therefore; sequence requires first/then; problem-solution requires a problem then fix.', teasConceptTested: 'Compare-contrast text structure', simpleExplanation: '"Unlike" = contrast = compare-and-contrast structure. Every time.', commonTrap: 'Thinking this is cause-effect because IV vs oral sounds like one causes a different result.', memoryTip: 'Unlike, however, but, whereas, on the other hand → ALL signal compare-contrast.' },
  },
  'r-cs-8': {
    difficulty: 1, skillTag: 'point-of-view', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'I/me/my/mine = first person — the narrator is participating directly in the story.', whyWrong: 'Third person uses he/she/they; second person uses you.', teasConceptTested: 'Point of view identification', simpleExplanation: '"I" = first person. Full stop.', commonTrap: 'Confusing the narrator\'s profession (a nurse — third person role) with the grammatical point of view.', memoryTip: '"I see it with my own eyes" = 1st person. "She saw it with her eyes" = 3rd person.' },
  },
  'r-cs-9': {
    difficulty: 2, skillTag: 'vocabulary-context', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'The contrast with "effective" (positive) and the context of medication cost shows "cheap" means low in cost, not poor quality.', whyWrong: 'Poor quality is the connotation of "cheap" in casual use, but the context here points to cost, not quality.', teasConceptTested: 'Vocabulary in context', simpleExplanation: 'The word "cheap" changes meaning depending on context — here it contrasts with effectiveness, suggesting the cost is low.', commonTrap: 'Using the everyday negative connotation of "cheap" instead of letting the sentence context override it.', memoryTip: 'Always substitute each answer choice back into the sentence. Which one makes the most sense?' },
  },
  'r-cs-10': {
    difficulty: 2, skillTag: 'text-structure', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"To address this issue" directly names a problem and pivots to a solution — the clearest problem-solution signal phrase.', whyWrong: '"However" signals contrast; "therefore" signals result; "in contrast" signals compare-contrast.', teasConceptTested: 'Problem-solution text structure', simpleExplanation: 'Problem-solution requires a problem + a fix. "To address this issue" introduces the fix.', commonTrap: 'Choosing "therefore" (cause-effect) because solutions seem to result from problems — but the structure here is identifying a problem and then a response.', memoryTip: '"To address / to solve / the solution is / in response" = problem-solution.' },
  },

  // ── Reading: Integration of Knowledge ─────────────────────────────────
  'r-ik-1': {
    difficulty: 2, skillTag: 'compare-passages', trapType: 'inference_leap', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Passage A shows vaccines work; Passage B shows they need monitoring — together they support: beneficial but requires care.', whyWrong: 'A and D go against Passage A. C contradicts the elimination of smallpox stated in Passage A.', teasConceptTested: 'Integrating multiple sources', simpleExplanation: 'Find where both passages agree — that overlap is the only defensible combined conclusion.', commonTrap: 'Choosing an answer that only one passage supports, ignoring what the other says.', memoryTip: 'Compare passages: find the OVERLAP (what both say) before picking an answer.' },
  },
  'r-ik-2': {
    difficulty: 2, skillTag: 'graph-reading', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: '1:4 means one nurse per four patients — the largest patient-per-nurse ratio = highest workload.', whyWrong: '1:2 means fewer patients per nurse (lower workload). 1:3 is in between.', teasConceptTested: 'Reading ratio graphs', simpleExplanation: 'Higher second number in a nurse:patient ratio = more patients per nurse = more work.', commonTrap: 'Thinking 1:2 is higher workload because 2 seems "busier" without recognizing the ratio direction.', memoryTip: 'Nurse:patient = 1:4 means 1 nurse covers 4 patients. Bigger second number = harder shift.' },
  },
  'r-ik-3': {
    difficulty: 2, skillTag: 'primary-secondary-source', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'The original journal article reporting clinical trial results is first-hand, uninterpreted data — the definition of a primary source.', whyWrong: 'A textbook summary, meta-analysis, and magazine article all interpret or compile other sources — secondary.', teasConceptTested: 'Primary vs. secondary sources', simpleExplanation: 'Primary = the original study. Secondary = someone discussing or summarizing the original.', commonTrap: 'Thinking a meta-analysis is primary because it sounds like authoritative research — meta-analyses REVIEW other studies.', memoryTip: 'Primary = "I did the experiment." Secondary = "I read about someone\'s experiment."' },
  },
  'r-ik-4': {
    difficulty: 2, skillTag: 'fact-opinion', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'It cites a study and gives a specific percentage (80%) — both are characteristics of a data-supported fact.', whyWrong: 'A logical fallacy requires flawed reasoning; an unsupported inference has no data — neither applies here.', teasConceptTested: 'Fact supported by data', simpleExplanation: 'A fact backed by a cited study with a percentage is still a fact, not an opinion.', commonTrap: 'Thinking "studies show" language makes something an opinion — it actually makes it more factual.', memoryTip: 'Percentages + cited sources = verifiable = fact, not opinion.' },
  },
  'r-ik-5': {
    difficulty: 3, skillTag: 'graph-reading', trapType: 'inference_leap',
    isCommonlyMissed: true, commonlyMissedLabel: 'Graph: Valid Conclusion Only',
    rationale: { whyCorrect: 'Option C only states what the graph shows: fall rates decreased after 2020 — no cause is claimed.', whyWrong: 'B adds a cause (protocol) not shown on the graph. D adds an explanation (less crowded) not in the data.', teasConceptTested: 'Drawing valid conclusions from data', simpleExplanation: 'A graph can only tell you WHAT happened — never WHY it happened.', commonTrap: 'Choosing B because a new protocol "makes sense" as the cause — but the graph doesn\'t say that.', memoryTip: 'Graph conclusions: describe only the trend, never assign a cause. "Rates decreased" not "X caused the decrease."' },
  },
  'r-ik-6': {
    difficulty: 2, skillTag: 'logical-fallacy', trapType: 'inference_leap',
    isCommonlyMissed: true, commonlyMissedLabel: 'Overgeneralization Fallacy',
    rationale: { whyCorrect: '"Everyone knows" is a classic overgeneralization — it presents an absolute claim with zero evidence.', whyWrong: 'A fact requires data; an inference requires explicit text support; a thesis is a supported main argument.', teasConceptTested: 'Logical fallacy identification', simpleExplanation: 'Any claim using "everyone knows," "always," or "obviously" without data is an overgeneralization.', commonTrap: 'Calling this a "thesis" because it seems like a main claim — a thesis must be supported, not just asserted.', memoryTip: '"Everyone knows" = red flag for overgeneralization. No evidence + absolute language = fallacy.' },
  },
  'r-ik-7': {
    difficulty: 2, skillTag: 'compare-passages', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Passage A recommends opioids; Passage B recommends multimodal to reduce opioids — they differ on approach.', whyWrong: 'A is wrong — Passage A supports opioid use for severe pain. C and D are not supported by either passage.', teasConceptTested: 'Comparing two texts', simpleExplanation: 'Ask: "What does each passage recommend?" Then find how those recommendations differ.', commonTrap: 'Saying they agree on something because both discuss pain management — agreeing on the topic ≠ agreeing on the approach.', memoryTip: 'Find the one thing each passage recommends. If they\'re different, you\'ve found the difference.' },
  },
  'r-ik-8': {
    difficulty: 3, skillTag: 'graph-reading', trapType: 'inference_leap', isCommonlyMissed: false,
    rationale: { whyCorrect: '45% is the largest single category shown — calling it the leading cause accurately reflects the data without adding anything.', whyWrong: 'A says incurable (not in the chart). C says all patients will be readmitted (not supported). D dismisses other diseases (not in the data).', teasConceptTested: 'Pie chart interpretation', simpleExplanation: 'The largest slice = the leading cause in this dataset. Nothing more, nothing less.', commonTrap: 'Choosing C because "45% is almost half" — but the chart never says all patients will be readmitted.', memoryTip: 'Pie chart rule: describe the largest slice proportionally. Don\'t extrapolate to causation or outcomes.' },
  },
  'r-ik-9': {
    difficulty: 2, skillTag: 'argument-evaluation', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Argument strength depends on evidence quality and logical connection to the claim — not length, vocabulary, or repetition.', whyWrong: 'Length, vocabulary, and repetition are all surface features that have nothing to do with logical validity.', teasConceptTested: 'Evaluating argument strength', simpleExplanation: 'A strong argument: relevant evidence + logical reasoning + no fallacies. Everything else is window dressing.', commonTrap: 'Choosing "how many times the main idea is repeated" — repetition is emphasis, not evidence.', memoryTip: 'Argument strength = does the evidence actually prove this specific claim? Not how it sounds.' },
  },
  'r-ik-10': {
    difficulty: 3, skillTag: 'correlation-causation', trapType: 'inference_leap', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Night-shift fatigue is a confounding variable that explains both the higher coffee intake and higher error rate — correlation ≠ causation.', whyWrong: 'A (coffee causes errors) assumes causation from correlation. C and D are not supported by the data.', teasConceptTested: 'Correlation vs. causation', simpleExplanation: 'When two things happen together, a third factor (confound) often explains both.', commonTrap: 'Jumping from "they found both together" directly to "one causes the other."', memoryTip: 'Correlation: X and Y rise together. Causation: X directly causes Y. They\'re NOT the same.' },
  },

  // ── Math: Numbers and Algebra ──────────────────────────────────────────
  'm-na-1': {
    difficulty: 2, skillTag: 'fraction-division', trapType: 'calculation_error',
    isCommonlyMissed: true, commonlyMissedLabel: 'Keep-Change-Flip (KCF)',
    rationale: { whyCorrect: '3/4 ÷ 1/2 → Keep 3/4, Change ÷ to ×, Flip 1/2 to 2/1 → 3/4 × 2/1 = 6/4 = 3/2.', whyWrong: 'A (3/8) results from multiplying without flipping. D (1/2) is the divisor itself.', teasConceptTested: 'Fraction division', simpleExplanation: 'To divide fractions: keep the first, flip the second, multiply.', commonTrap: 'Multiplying straight across (3×1 / 4×2 = 3/8) instead of flipping the second fraction first.', memoryTip: 'KCF: Keep → Change ÷ to × → Flip the second fraction. Three steps, always.' },
  },
  'm-na-2': {
    difficulty: 1, skillTag: 'unit-conversion', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: 'To convert lbs to kg, divide by 2.2. 176 ÷ 2.2 = 80 kg.', whyWrong: 'A (387.2) results from multiplying by 2.2 instead of dividing. C and D are off by simple arithmetic errors.', teasConceptTested: 'Lbs to kg conversion', simpleExplanation: 'lbs ÷ 2.2 = kg. kg × 2.2 = lbs.', commonTrap: 'Multiplying by 2.2 instead of dividing — always divide to go from lbs to kg.', memoryTip: 'Heavier unit (lbs) → lighter unit (kg): divide by 2.2. Lighter → heavier: multiply.' },
  },
  'm-na-3': {
    difficulty: 1, skillTag: 'algebra', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: '3x + 7 = 22 → subtract 7 from both sides → 3x = 15 → divide by 3 → x = 5.', whyWrong: 'Common errors: forgetting to subtract 7 first, or dividing before subtracting.', teasConceptTested: 'Solving one-variable equations', simpleExplanation: 'Undo the operations in reverse order: subtract first, then divide.', commonTrap: 'Dividing 22 by 3 before subtracting 7, giving x = 7.33 — always undo addition/subtraction first.', memoryTip: 'Reverse PEMDAS to solve: undo + and − first, then × and ÷.' },
  },
  'm-na-4': {
    difficulty: 1, skillTag: 'percentage', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: '15% = 0.15. 0.15 × 240 = 36.', whyWrong: 'A (24) comes from 10% of 240. C (48) comes from 20% of 240.', teasConceptTested: 'Percent of a number', simpleExplanation: 'Percent → decimal → multiply.', commonTrap: 'Converting 15% to 1.5 instead of 0.15 (forgetting to move the decimal two places left).', memoryTip: 'Percent to decimal: move decimal 2 places LEFT. 15% → 0.15, not 1.5.' },
  },
  'm-na-5': {
    difficulty: 2, skillTag: 'dosage-calculation', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: 'D ÷ H = 500 ÷ 250 = 2 tablets. Only the D/H part is needed when tablets are whole units.', whyWrong: 'A (0.5) results from H ÷ D (inverting the formula).', teasConceptTested: 'Dosage calculation (tablets)', simpleExplanation: 'D/H × Volume. For tablets, Volume = 1 tablet unless stated otherwise.', commonTrap: 'Inverting the fraction (H/D instead of D/H), giving 0.5 instead of 2.', memoryTip: 'D/H × V. Desired on top, Have on bottom. D-H-V: "Definitely Have Volumes."' },
  },
  'm-na-6': {
    difficulty: 2, skillTag: 'order-of-operations', trapType: 'calculation_error',
    isCommonlyMissed: true, commonlyMissedLabel: 'PEMDAS Order',
    rationale: { whyCorrect: 'PEMDAS: 2² = 4 first; 3 × 4 = 12; 4 + 12 − 1 = 15.', whyWrong: 'A (23) comes from ignoring exponent precedence and working left-to-right. C and D reflect other ordering errors.', teasConceptTested: 'Order of operations (PEMDAS)', simpleExplanation: 'Exponents always come before multiplication, addition, or subtraction.', commonTrap: 'Doing 3 × 2 = 6 before squaring, then 6² = 36 — you must square 2 FIRST.', memoryTip: 'Please Excuse My Dear Aunt Sally: P–E–MD–AS. Exponents (E) before Multiply (M).' },
  },
  'm-na-7': {
    difficulty: 2, skillTag: 'percentage', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: '36 ÷ 40 = 0.90 = 90%. The question asks for the percentage of hours worked.', whyWrong: 'A (85%) and D (88%) result from arithmetic errors. C (94%) is too high.', teasConceptTested: 'Percent of total', simpleExplanation: 'Part ÷ Whole × 100 = percent.', commonTrap: 'Calculating 40 − 36 = 4 missed hours, then finding a percentage of those — the question asks for hours worked, not hours missed.', memoryTip: 'Part ÷ Whole = decimal → multiply by 100 for percent. Read the question: "percent worked" not "percent missed."' },
  },
  'm-na-8': {
    difficulty: 2, skillTag: 'dosage-calculation', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: 'D/H × V = 750/250 × 5 = 3 × 5 = 15 mL.', whyWrong: 'A (10 mL) comes from 500/250 × 5 (using wrong desired dose). B and D reflect other arithmetic errors.', teasConceptTested: 'Liquid dosage calculation', simpleExplanation: 'Always use the ORDERED dose (Desired) in the numerator, not the available concentration.', commonTrap: 'Using the available concentration (250 mg/5 mL) as if it\'s 250 mg/mL — check whether volume is per 1 mL or per 5 mL.', memoryTip: 'Write out D/H × V before calculating. Plug in numbers after setting up the formula.' },
  },
  'm-na-9': {
    difficulty: 2, skillTag: 'fraction-decimal', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: '3 ÷ 8 = 0.375. This is a memorization target on the TEAS.', whyWrong: '1/4 = 0.25; 3/4 = 0.75; 5/8 = 0.625 — all common fractions to confuse.', teasConceptTested: 'Fraction-to-decimal conversion', simpleExplanation: 'Divide numerator by denominator: 3 ÷ 8 = 0.375.', commonTrap: 'Confusing 3/8 with 5/8 (0.625) — both have 8 in the denominator.', memoryTip: 'Memorize: 1/8=0.125, 2/8=0.25, 3/8=0.375, 4/8=0.5. Each step adds 0.125.' },
  },
  'm-na-10': {
    difficulty: 2, skillTag: 'ratio-proportion', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: '1:4 drug-to-saline means for every 1 part drug, add 4 parts saline. 50 × 4 = 200 mL saline.', whyWrong: 'B (150) and D (250) reflect miscounting total vs. saline parts. A (12.5) inverts the ratio.', teasConceptTested: 'Drug-to-diluent ratios', simpleExplanation: 'A 1:4 ratio means the SECOND number (4) tells you how many parts of the second substance.', commonTrap: 'Thinking 1:4 means total parts = 4 (so saline = 3) instead of saline = 4 parts.', memoryTip: '1:4 drug:saline = 1 part drug, 4 parts saline. The colon separates the two substances.' },
  },
  'm-na-11': {
    difficulty: 2, skillTag: 'percent-change', trapType: 'calculation_error',
    isCommonlyMissed: true, commonlyMissedLabel: 'Percent Change Formula',
    rationale: { whyCorrect: '(52 − 40) ÷ 40 × 100 = 12/40 × 100 = 30%.', whyWrong: 'A (25%) comes from dividing 12 by 48 (wrong denominator). C (12%) is the raw difference, not the percentage.', teasConceptTested: 'Percent increase/decrease', simpleExplanation: 'Percent change = (New − Old) ÷ Old × 100. Always divide by the ORIGINAL (old) value.', commonTrap: 'Dividing the change (12) by the new value (52) instead of the original (40).', memoryTip: '"Percent change = change over ORIGINAL." Old value always goes in the denominator.' },
  },
  'm-na-12': {
    difficulty: 2, skillTag: 'algebra', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Distribute 2: 2x + 6. Then subtract 4: 2x + 2.', whyWrong: 'B (2x + 10) adds instead of subtracting. C and D reflect partial distribution errors.', teasConceptTested: 'Distributive property', simpleExplanation: 'Distribute the 2 to both terms inside, then combine constants.', commonTrap: 'Only distributing 2 to the x and forgetting to multiply the 3: getting 2x + 3 − 4.', memoryTip: '2(x + 3): the 2 multiplies BOTH the x AND the 3. Then deal with the −4.' },
  },

  // ── Math: Measurement and Data ─────────────────────────────────────────
  'm-md-1': {
    difficulty: 1, skillTag: 'unit-conversion', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: '1 L = 1,000 mL. 2.5 × 1,000 = 2,500 mL.', whyWrong: 'A (250) divides instead of multiplying. C and D are off by decimal placement.', teasConceptTested: 'Liters to milliliters', simpleExplanation: 'Moving from a larger unit (L) to a smaller unit (mL): multiply by 1,000.', commonTrap: 'Dividing by 1,000 instead of multiplying when going from L to mL.', memoryTip: 'L → mL = bigger number. mL → L = smaller number. You\'re going smaller, so multiply.' },
  },
  'm-md-2': {
    difficulty: 2, skillTag: 'median', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Sort: 3, 4, 7, 7, 9. Middle (3rd) value = 7.', whyWrong: 'A (4) is selected if you forget to sort first. D (9) is the maximum, not the median.', teasConceptTested: 'Median calculation', simpleExplanation: 'Sort first, then find the middle. For 5 values, the 3rd is the median.', commonTrap: 'Finding the median of the unsorted list (3rd value of 4, 7, 3, 9, 7 = 3) instead of sorting first.', memoryTip: 'SORT before you FIND. Median without sorting first = wrong answer every time.' },
  },
  'm-md-3': {
    difficulty: 1, skillTag: 'mode', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '98.6°F appears twice; all other values appear once — mode = most frequent value.', whyWrong: 'A, B, D each appear only once — frequency of 1 cannot be the mode when another value appears twice.', teasConceptTested: 'Mode identification', simpleExplanation: 'Mode = the value that appears most often. Count frequency before choosing.', commonTrap: 'Picking the highest or most recent value instead of counting frequency.', memoryTip: 'Mode = Most. Count how many times each value appears. Pick the winner.' },
  },
  'm-md-4': {
    difficulty: 3, skillTag: 'unit-conversion', trapType: 'calculation_error',
    isCommonlyMissed: true, commonlyMissedLabel: 'Multi-Step Unit Conversion',
    rationale: { whyCorrect: '240 + 120 + 180 = 540 mL total. 540 ÷ 30 = 18 oz.', whyWrong: 'A (16) results from arithmetic error in the mL sum. C (20) comes from using 27 mL/oz instead of 30.', teasConceptTested: 'Multi-step unit conversion', simpleExplanation: 'Add all volumes first (in the same unit), then convert. Never convert each item separately if you can avoid it.', commonTrap: 'Converting each fluid item to oz before adding instead of adding mL first then converting — same result but more chances for error.', memoryTip: 'Two-step: (1) add everything in mL, (2) divide total by 30 to get oz.' },
  },
  'm-md-5': {
    difficulty: 3, skillTag: 'mean', trapType: 'calculation_error',
    isCommonlyMissed: true, commonlyMissedLabel: 'Find the Missing Value (Mean)',
    rationale: { whyCorrect: 'Total = 82 × 6 = 492. Sum of 5 known = 413. Missing = 492 − 413 = 79.', whyWrong: 'A (77) and C (81) come from arithmetic errors when summing the known values.', teasConceptTested: 'Working backwards from mean', simpleExplanation: 'Mean × count = total. Total − sum of known = missing value.', commonTrap: 'Adding the 5 values incorrectly: 78+85+90+76+84 — carefully: 78+85=163, +90=253, +76=329, +84=413.', memoryTip: 'Find the TOTAL first (mean × n), then subtract what you have. What\'s left = missing.' },
  },
  'm-md-6': {
    difficulty: 2, skillTag: 'probability', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Total marbles = 3+5+2 = 10. P(blue) = 5/10 = 1/2.', whyWrong: 'C (2/5) would be the probability of green+non-red, not blue. B (1/3) is 3 out of 9, not 5 out of 10.', teasConceptTested: 'Basic probability', simpleExplanation: 'Probability = favorable outcomes ÷ total outcomes. Always count total first.', commonTrap: 'Using 5/8 (blue/non-green) instead of 5/10 (blue/total) — total must include ALL marbles.', memoryTip: 'P = what I want ÷ everything. Count EVERYTHING in the denominator.' },
  },
  'm-md-7': {
    difficulty: 2, skillTag: 'unit-conversion', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: '5 ft 6 in = 66 inches. 66 × 2.54 = 167.64 cm.', whyWrong: 'A (157.48) uses 62 inches (5 ft 2 in). B uses 65 inches. D rounds to a convenient number.', teasConceptTested: 'Feet-inches to cm conversion', simpleExplanation: 'Convert everything to inches first, then multiply by 2.54.', commonTrap: 'Converting 5 feet to inches (60) but forgetting to add the 6 extra inches.', memoryTip: 'Step 1: feet × 12 + extra inches = total inches. Step 2: total inches × 2.54 = cm.' },
  },
  'm-md-8': {
    difficulty: 1, skillTag: 'range', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Range = highest − lowest = 91 − 55 = 36.', whyWrong: 'A (26) = 81 − 55 (using second-highest instead of highest). B (31) = 86 − 55 (using wrong high value).', teasConceptTested: 'Range calculation', simpleExplanation: 'Range = max − min. Find the two extreme values first.', commonTrap: 'Using the second-highest value (85 or 91 confusion) rather than the actual maximum.', memoryTip: 'Range: circle the biggest number and the smallest number. Subtract. Done.' },
  },
  'm-md-9': {
    difficulty: 2, skillTag: 'measurement', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: '480 mL ÷ 60 mL/hr = 8 hours.', whyWrong: 'A (6 hrs) = 360/60. B (7 hrs) = 420/60. These use the wrong dividend.', teasConceptTested: 'IV rate time calculation', simpleExplanation: 'Time = Volume ÷ Rate. Divide total volume by hourly rate.', commonTrap: 'Multiplying instead of dividing (480 × 60 = 28,800 — obviously wrong, use unit sense).', memoryTip: 'Rate × Time = Volume → rearrange: Time = Volume ÷ Rate. Think "how many 60s fit in 480?"' },
  },
  'm-md-10': {
    difficulty: 1, skillTag: 'unit-conversion', trapType: 'calculation_error', isCommonlyMissed: false,
    rationale: { whyCorrect: '3,500 ÷ 1,000 = 3.5 kg.', whyWrong: 'A (0.35) divides by 10,000. C (35) divides by 100. D (350) divides by 10.', teasConceptTested: 'Grams to kilograms', simpleExplanation: '1 kg = 1,000 g. To go from g to kg, divide by 1,000.', commonTrap: 'Moving the decimal one place instead of three (÷10 instead of ÷1000).', memoryTip: 'Kilo = 1,000. Divide by 1,000 = move decimal 3 places left. 3,500 → 3.500 → 3.5.' },
  },

  // ── Science: A&P ──────────────────────────────────────────────────────
  's-ap-1': {
    difficulty: 3, skillTag: 'cardiovascular', trapType: 'rule_confusion',
    isCommonlyMissed: true, commonlyMissedLabel: 'Left vs. Right Heart',
    rationale: { whyCorrect: 'The LEFT ventricle pumps oxygenated blood into the aorta and out to the body — it\'s the most muscular chamber.', whyWrong: 'The right ventricle pumps deoxygenated blood to the LUNGS. The atria receive blood, they don\'t pump to the body.', teasConceptTested: 'Cardiac chambers and circulation', simpleExplanation: 'Right side → lungs (to get oxygen). Left side → body (to deliver oxygen).', commonTrap: 'Choosing "right ventricle" because it sounds like it does the main pumping work — the left ventricle is the powerhouse.', memoryTip: '"Right side Refreshes" (sends blood to lungs to be refreshed). "Left side Launches" (launches blood to the body).' },
  },
  's-ap-2': {
    difficulty: 1, skillTag: 'urinary-system', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'The nephron is the functional (working) unit of the kidney — it filters blood and produces urine.', whyWrong: 'Insulin is made by the pancreas. Nutrient absorption is in the small intestine. Heart rate is regulated by the SA node.', teasConceptTested: 'Nephron function', simpleExplanation: 'Nephron = kidney\'s filter. Every other answer describes a different organ\'s job.', commonTrap: 'Confusing the kidney\'s role (filter blood) with the liver\'s role (detoxify blood).', memoryTip: 'Nephron → kidney → filter → urine. "Nephro" = kidney in Greek.' },
  },
  's-ap-3': {
    difficulty: 2, skillTag: 'nervous-system', trapType: 'rule_confusion',
    isCommonlyMissed: true, commonlyMissedLabel: 'Sympathetic vs. Parasympathetic',
    rationale: { whyCorrect: 'Sympathetic nervous system = fight-or-flight: heart rate up, pupils dilate, blood to muscles.', whyWrong: 'Parasympathetic = rest-and-digest (opposite). Somatic controls voluntary movement. CNS is the structural term, not a functional division.', teasConceptTested: 'Autonomic nervous system divisions', simpleExplanation: 'Sympathetic = stress response. Parasympathetic = calm response. They are opposites.', commonTrap: 'Choosing "central nervous system" because it sounds like the most important one — but CNS is a structural category, not a fight-or-flight mechanism.', memoryTip: 'Sympathetic = Sprinting (fight-or-flight). Parasympathetic = Peace (rest-and-digest).' },
  },
  's-ap-4': {
    difficulty: 1, skillTag: 'respiratory-system', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Alveoli are the tiny air sacs where O₂ enters the blood and CO₂ exits — gas exchange only occurs here.', whyWrong: 'Bronchi are airways that carry air; trachea is the windpipe; pleura is the membrane around the lungs.', teasConceptTested: 'Gas exchange location', simpleExplanation: 'Gas exchange = alveoli only. Everything else just moves air toward them.', commonTrap: 'Choosing bronchi because they\'re also in the lungs — but bronchi are just tubes, not exchange surfaces.', memoryTip: 'Alveoli = air balloons where the swap happens. Gas exchange = alveoli. Period.' },
  },
  's-ap-5': {
    difficulty: 1, skillTag: 'endocrine-system', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Insulin (from pancreatic beta cells) binds cell receptors to allow glucose uptake, lowering blood sugar.', whyWrong: 'Glucagon RAISES blood sugar (opposite). Cortisol raises blood sugar. Thyroxine controls metabolism rate, not blood glucose.', teasConceptTested: 'Insulin function', simpleExplanation: 'Insulin = the key that unlocks cells to let glucose in, lowering blood sugar.', commonTrap: 'Confusing insulin (lowers sugar) with glucagon (raises sugar) — both come from the pancreas.', memoryTip: '"Insulin = In" — insulin moves glucose INTO cells. Glucagon = "Go" glucose — sends it out to blood.' },
  },
  's-ap-6': {
    difficulty: 2, skillTag: 'cardiovascular', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'The SA node generates the electrical impulse that triggers each heartbeat — it\'s the pacemaker.', whyWrong: 'Red blood cells are made in bone marrow. Lymph filtration is the spleen/lymph nodes. Breathing rate is the brainstem.', teasConceptTested: 'SA node / cardiac pacemaker', simpleExplanation: 'SA node = the heart\'s built-in pacemaker, located in the right atrium.', commonTrap: 'Confusing the SA node (electrical signal) with the AV node (which relays but doesn\'t initiate).', memoryTip: 'SA node: S = Start. It Starts every heartbeat. Located in the Right Atrium.' },
  },
  's-ap-7': {
    difficulty: 1, skillTag: 'homeostasis', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Homeostasis = the body\'s tendency to maintain stable internal conditions (temperature, pH, glucose) via feedback mechanisms.', whyWrong: 'Cell division is mitosis/meiosis. Food breakdown is digestion. Immune response is immunity — all different systems.', teasConceptTested: 'Homeostasis definition', simpleExplanation: 'Homeostasis: the body keeping everything balanced automatically.', commonTrap: 'Confusing homeostasis with any other regulatory process — homeostasis is the UMBRELLA concept for all of them.', memoryTip: 'Homeo = same, stasis = standing still → homeostasis = keeping conditions the same.' },
  },
  's-ap-8': {
    difficulty: 2, skillTag: 'digestive-system', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'The small intestine (especially the jejunum with its villi) is the site of most nutrient absorption.', whyWrong: 'Stomach = protein digestion begins. Large intestine = water absorption. Esophagus = just a tube.', teasConceptTested: 'Digestive absorption site', simpleExplanation: 'Small intestine = nutrients absorbed. Large intestine = water absorbed. Easy to mix up.', commonTrap: 'Choosing the stomach because food goes there first and gets broken down — but absorption mostly happens in the small intestine.', memoryTip: '"Small intestine = Small molecules (nutrients) absorbed." Large intestine = Large water molecules.' },
  },
  's-ap-9': {
    difficulty: 2, skillTag: 'acid-base', trapType: 'rule_confusion',
    isCommonlyMissed: true, commonlyMissedLabel: 'Normal Blood pH Range',
    rationale: { whyCorrect: 'Normal arterial blood pH is 7.35–7.45 — slightly alkaline. This is a critical nursing fact.', whyWrong: 'Below 7.35 = acidosis; above 7.45 = alkalosis. Neither is "normal."', teasConceptTested: 'Blood pH / acid-base balance', simpleExplanation: 'Blood is slightly basic — 7.35 to 7.45. Not neutral (7.0) and not strongly basic.', commonTrap: 'Choosing 7.00–7.20 because blood feels like it should be near neutral — but normal blood is always slightly above 7.', memoryTip: '"7.35 to 7.45" — memorize these two numbers. Below 7.35 = acid trouble. Above 7.45 = base trouble.' },
  },
  's-ap-10': {
    difficulty: 2, skillTag: 'endocrine-system', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Adrenal medulla releases epinephrine (adrenaline) during acute stress → triggers sympathetic fight-or-flight.', whyWrong: 'Insulin is from the pancreas. Cortisol is from the adrenal CORTEX (not medulla). Testosterone is from the gonads.', teasConceptTested: 'Adrenal medulla hormones', simpleExplanation: 'Adrenal gland has two parts: cortex (cortisol) and medulla (epinephrine). Medulla = emergency response.', commonTrap: 'Choosing cortisol because it\'s the "stress hormone" — but cortisol is adrenal CORTEX, not medulla.', memoryTip: '"Medulla = adrenaline = emergency." Cortex = cortisol = chronic stress. Middle vs outer layer.' },
  },

  // ── Science: Biology ───────────────────────────────────────────────────
  's-bio-1': {
    difficulty: 1, skillTag: 'cell-organelles', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Mitochondria perform cellular respiration, converting glucose + O₂ into ATP — the cell\'s usable energy.', whyWrong: 'Nucleus = DNA control center. Ribosome = protein builder. Golgi = protein packager.', teasConceptTested: 'Mitochondria function', simpleExplanation: 'Mitochondria = powerhouse = ATP factory.', commonTrap: 'Choosing nucleus because it "controls" everything — but the nucleus doesn\'t make energy.', memoryTip: '"Mighty mitochondria make ATP." M = M = M.' },
  },
  's-bio-2': {
    difficulty: 2, skillTag: 'mitosis', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Mitosis produces 2 daughter cells that are diploid (2n) and genetically identical to the parent.', whyWrong: 'Producing haploid or unique cells describes meiosis. Producing 4 cells also describes meiosis.', teasConceptTested: 'Mitosis outcome', simpleExplanation: 'Mitosis = 2 identical diploid cells. Meiosis = 4 unique haploid cells.', commonTrap: 'Choosing "4 diploid cells" — 4 cells is always meiosis; mitosis always produces exactly 2.', memoryTip: 'Mitosis = Making Two identical copies. Meiosis = Making sex cells (4, unique).' },
  },
  's-bio-3': {
    difficulty: 2, skillTag: 'protein-synthesis', trapType: 'rule_confusion',
    isCommonlyMissed: true, commonlyMissedLabel: 'Transcription → Translation Order',
    rationale: { whyCorrect: 'DNA → mRNA (transcription in nucleus) → protein (translation at ribosome) is the central dogma of molecular biology.', whyWrong: 'All other options reverse the sequence, skip mRNA, or swap transcription/translation.', teasConceptTested: 'Central dogma / protein synthesis', simpleExplanation: 'DNA makes mRNA (transcription), mRNA makes protein (translation). The steps go in only one direction.', commonTrap: 'Reversing transcription and translation — translation is the LAST step (protein made at ribosome), not the first.', memoryTip: 'DNA → mRNA → Protein. "Transcription = Typing" (copying). "Translation = Translating" (into a different language = protein).' },
  },
  's-bio-4': {
    difficulty: 2, skillTag: 'dna-structure', trapType: 'rule_confusion',
    isCommonlyMissed: true, commonlyMissedLabel: 'A-T in DNA, A-U in RNA',
    rationale: { whyCorrect: 'In DNA: A pairs with T, and G pairs with C. This is one of the most fundamental rules of molecular biology.', whyWrong: 'U (Uracil) replaces T only in RNA. G-C is correct for guanine-cytosine, but the question asks about adenine.', teasConceptTested: 'DNA base pairing rules', simpleExplanation: 'DNA: A-T and G-C. RNA: A-U and G-C. Uracil only appears in RNA.', commonTrap: 'Choosing U because you remembered RNA uses Uracil — but the question specifies DNA, where Thymine (T) pairs with A.', memoryTip: '"AT the DNA level" (A pairs with T). In RNA, T gets replaced by U. Read carefully: DNA or RNA?' },
  },
  's-bio-5': {
    difficulty: 2, skillTag: 'genetics', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Bb is heterozygous dominant — one dominant allele (B) is enough to express the dominant phenotype (brown eyes).', whyWrong: 'Blue eyes (bb) requires TWO recessive alleles. Green and mixed are not part of this simple Mendelian model.', teasConceptTested: 'Dominant/recessive genotype-phenotype', simpleExplanation: 'Even one capital letter = dominant trait expressed in the phenotype.', commonTrap: 'Thinking Bb might produce a "mixed" or "blend" phenotype — simple dominance means the capital letter always wins.', memoryTip: 'One B is enough. Capital = Dominates. Bb = brown. Only bb = blue.' },
  },
  's-bio-6': {
    difficulty: 2, skillTag: 'mitosis', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'PMAT: Prophase → Metaphase → Anaphase → Telophase. This is the correct order every time.', whyWrong: 'All other options scramble the phase order — PMAT never starts with Metaphase or Anaphase.', teasConceptTested: 'Mitosis phases (PMAT)', simpleExplanation: 'Mitosis phases always go P-M-A-T in that exact order.', commonTrap: 'Confusing Metaphase (chromosomes align at middle) and Anaphase (chromosomes pulled apart) — Meta before Ana always.', memoryTip: '"Poor Men Are Tired" = Prophase, Metaphase, Anaphase, Telophase.' },
  },
  's-bio-7': {
    difficulty: 1, skillTag: 'cell-organelles', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Ribosomes read mRNA and link amino acids together to build proteins — translation happens here.', whyWrong: 'Nucleus = DNA storage. Vacuole = storage. Lysosome = waste digestion.', teasConceptTested: 'Ribosome function', simpleExplanation: 'Ribosome = protein factory. It reads the mRNA and builds the protein.', commonTrap: 'Choosing nucleus because DNA is involved in protein production — but the ribosome does the actual building.', memoryTip: 'Ribosome = Reads mRNA = builds proteins. "R = Reader and builder."' },
  },
  's-bio-8': {
    difficulty: 2, skillTag: 'meiosis', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Meiosis produces 4 genetically unique haploid cells (gametes) through two rounds of division.', whyWrong: '2 identical diploid cells = mitosis (not meiosis). Chromosome duplication without dividing = S phase, not meiosis.', teasConceptTested: 'Meiosis vs. mitosis differences', simpleExplanation: 'Meiosis = 4 unique haploid sex cells. Mitosis = 2 identical diploid cells.', commonTrap: 'Choosing "2 identical diploid cells" because it sounds like normal cell division — but meiosis is specifically for sex cells.', memoryTip: 'Meiosis → sperm and egg → sex cells → haploid (half the chromosomes) → 4 cells.' },
  },
  's-bio-9': {
    difficulty: 1, skillTag: 'genetics', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Phenotype = observable traits (what you can see or measure about an organism).', whyWrong: 'Genotype = genetic makeup (letters). Allele = one form of a gene. Chromosome = structure holding DNA.', teasConceptTested: 'Phenotype vs. genotype', simpleExplanation: 'Phenotype = what you can observe. Genotype = the letters (genetic code).', commonTrap: 'Confusing genotype and phenotype — remember: PHENotype = PHENomenal appearance (what you can see).', memoryTip: 'PHENotype = PHENomenal (visible). GENotype = GENetic code (letters).' },
  },
  's-bio-10': {
    difficulty: 2, skillTag: 'cell-transport', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Active transport moves substances against the concentration gradient (low → high) and requires ATP energy.', whyWrong: 'Diffusion and facilitated diffusion both move WITH the gradient (high → low) and require no energy.', teasConceptTested: 'Active vs. passive transport', simpleExplanation: 'Going uphill (against gradient) requires energy = active transport. Going downhill = passive.', commonTrap: 'Choosing facilitated diffusion because it uses proteins — but it still goes with the gradient and needs no energy.', memoryTip: '"Active = energy needed = against the gradient." Think of pushing uphill — that\'s active transport.' },
  },

  // ── Science: Chemistry ─────────────────────────────────────────────────
  's-chem-1': {
    difficulty: 1, skillTag: 'atomic-structure', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Atomic number = number of protons. This is the unique identifier of each element on the periodic table.', whyWrong: 'Neutrons determine isotope; electrons alone don\'t define the element; protons+neutrons = mass number.', teasConceptTested: 'Atomic number definition', simpleExplanation: 'Atomic number = protons. Change the protons = different element.', commonTrap: 'Confusing atomic number (protons) with mass number (protons + neutrons).', memoryTip: '"Atomic number = # of protons = the element\'s ID number." Proton count = identity.' },
  },
  's-chem-2': {
    difficulty: 2, skillTag: 'pH-scale', trapType: 'rule_confusion',
    isCommonlyMissed: true, commonlyMissedLabel: 'pH Direction (Low = Acidic)',
    rationale: { whyCorrect: 'pH 3 is well below 7 — the lower the pH, the more acidic. pH 0 is the most acidic possible.', whyWrong: '"Weakly acidic" (C) would be around pH 5–6. "Strongly basic" requires pH well above 7.', teasConceptTested: 'pH scale interpretation', simpleExplanation: 'Below 7 = acid. Far below 7 = strongly acidic. pH 3 is close to 0 on a 0–14 scale = strongly acidic.', commonTrap: 'Thinking pH 3 is weakly acidic because 3 is a small number — but on the pH scale, 3 is very far from neutral (7), meaning strongly acidic.', memoryTip: '"Lower pH = more acidic." pH 3 is 4 units below neutral (7) — that\'s a strong acid.' },
  },
  's-chem-3': {
    difficulty: 1, skillTag: 'chemical-bonds', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'NaCl = sodium (metal) and chlorine (nonmetal). Metal + nonmetal = ionic bond (electron transfer).', whyWrong: 'Covalent bonds form between two nonmetals. Metallic bonds are in metals only. Hydrogen bonds are weak intermolecular attractions.', teasConceptTested: 'Ionic bond identification', simpleExplanation: 'Metal + nonmetal = ionic. Two nonmetals = covalent.', commonTrap: 'Choosing covalent because NaCl dissolves in water (like many covalent compounds do) — solubility ≠ bond type.', memoryTip: '"Ionic = I give." Metal gives an electron to nonmetal. Na gives to Cl → NaCl.' },
  },
  's-chem-4': {
    difficulty: 1, skillTag: 'atomic-structure', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'The nucleus contains protons (positive) and neutrons (neutral) — both are subatomic particles in the nucleus.', whyWrong: 'Electrons orbit the nucleus in shells — they are NOT in the nucleus.', teasConceptTested: 'Atomic nucleus contents', simpleExplanation: 'Nucleus = protons + neutrons. Electrons orbit outside.', commonTrap: 'Including electrons in the nucleus because atoms contain all three particles — electrons orbit the nucleus, they\'re not inside it.', memoryTip: '"Nucleus = hard core = protons + neutrons. Electrons orbit around it like planets orbit the sun."' },
  },
  's-chem-5': {
    difficulty: 2, skillTag: 'isotopes', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Carbon-12 and Carbon-14 are both carbon (same protons = same atomic number) but have different mass numbers — different neutrons.', whyWrong: 'Different protons = different elements. Mass numbers differ (12 vs 14) so they\'re not the same.', teasConceptTested: 'Isotope definition', simpleExplanation: 'Isotopes = same element (same protons), different mass (different neutrons).', commonTrap: 'Thinking different mass numbers mean different protons — mass number = protons + neutrons, not protons alone.', memoryTip: '"Isotopes are the same element with a different weight class" — same proton number, different neutrons.' },
  },
  's-chem-6': {
    difficulty: 1, skillTag: 'chemical-bonds', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'H₂O: hydrogen (nonmetal) + oxygen (nonmetal) = covalent bond (electron sharing).', whyWrong: 'Ionic requires a metal. Metallic bonds occur in pure metals. Van der Waals are intermolecular, not intramolecular.', teasConceptTested: 'Covalent bond identification', simpleExplanation: 'Two nonmetals sharing electrons = covalent bond.', commonTrap: 'Confusing the hydrogen BONDS between water molecules (intermolecular) with the O-H covalent bond WITHIN the molecule.', memoryTip: '"Covalent = COoperating" — nonmetals share (cooperate). H₂O = two nonmetals = covalent.' },
  },
  's-chem-7': {
    difficulty: 2, skillTag: 'acid-base', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'An acid donates H⁺ ions (protons) AND has pH below 7 — both conditions must be true.', whyWrong: 'B is wrong because it says pH > 7 (that\'s a base). A describes a base (accepts H⁺). D (pH = 7) is neutral.', teasConceptTested: 'Acid definition', simpleExplanation: 'Acid = donates H⁺ = pH < 7. Base = accepts H⁺ = pH > 7.', commonTrap: 'Choosing B (donates H⁺, pH > 7) because the first part is correct but the pH direction is wrong.', memoryTip: '"Acid = Add H⁺" (donates). Base = "Bye-Bye H⁺" (accepts). Acid = pH below 7.' },
  },
  's-chem-8': {
    difficulty: 2, skillTag: 'chemical-reactions', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Law of Conservation of Mass: atoms are neither created nor destroyed — total mass of reactants = total mass of products.', whyWrong: 'Mass is never created or destroyed in a chemical reaction. Products don\'t weigh more; energy release doesn\'t remove mass.', teasConceptTested: 'Conservation of mass', simpleExplanation: 'Before = after. Atoms rearrange but never appear or disappear.', commonTrap: 'Thinking energy release reduces mass — at the chemical level tested on the TEAS, mass is conserved.', memoryTip: '"Atoms are never born or killed in a chemical reaction — they just change partners." Mass in = mass out.' },
  },
  's-chem-9': {
    difficulty: 1, skillTag: 'pH-scale', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'pH 9 is above the neutral point (7) — any pH above 7 is basic (alkaline).', whyWrong: 'pH 2 and 5 are below 7 = acidic. pH 7 = neutral.', teasConceptTested: 'Basic vs. acidic pH values', simpleExplanation: 'Above 7 = base/alkaline. Below 7 = acid.', commonTrap: 'Overthinking — just check if the number is above or below 7.', memoryTip: '7 is the middle. Higher = base. Lower = acid. pH 9 > 7 = base.' },
  },
  's-chem-10': {
    difficulty: 2, skillTag: 'acid-base', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Blood pH below 7.35 = acidosis — the blood is more acidic than normal.', whyWrong: 'Alkalosis = pH above 7.45. Homeostasis = the general balance. Neutrality = pH exactly 7.0 (not physiological).', teasConceptTested: 'Acidosis vs. alkalosis', simpleExplanation: 'Below 7.35 = acidosis. Above 7.45 = alkalosis. Normal = 7.35–7.45.', commonTrap: 'Confusing acidosis with alkalosis — remember: acid = below, alka = above.', memoryTip: '"AciDosis = Down" (pH goes below 7.35). AlKAlosis = higher (pH goes above 7.45).' },
  },

  // ── Science: Scientific Reasoning ─────────────────────────────────────
  's-sr-1': {
    difficulty: 2, skillTag: 'experimental-design', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'The sugar pill group receives no active treatment — it\'s the baseline the medication group is compared against = control group.', whyWrong: 'The independent variable is the medication (what\'s being tested). The dependent variable is blood pressure.', teasConceptTested: 'Control group identification', simpleExplanation: 'Control group = gets no treatment. Used to compare against the group that does get treatment.', commonTrap: 'Confusing "control group" with "controlled variables" — they\'re different concepts.', memoryTip: 'Control group = the "do nothing" group. No treatment = control.' },
  },
  's-sr-2': {
    difficulty: 2, skillTag: 'variables', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'The researcher changes the amount of sleep — what the researcher manipulates = independent variable.', whyWrong: 'Test scores are measured (dependent variable). The students are the subjects. The type of test is a controlled variable.', teasConceptTested: 'Independent variable identification', simpleExplanation: 'IV = what the researcher changes. DV = what changes as a result.', commonTrap: 'Choosing test scores because they seem like the "main thing" — but test scores are MEASURED, not manipulated.', memoryTip: '"I Do." IV = I manipulate. DV = Depends on what I did.' },
  },
  's-sr-3': {
    difficulty: 2, skillTag: 'hypothesis', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'A hypothesis must be testable (you can design an experiment) and falsifiable (it could be proven wrong).', whyWrong: 'A can\'t be proven before testing (circular). B is an opinion. D sets an arbitrary threshold not required.', teasConceptTested: 'Valid hypothesis criteria', simpleExplanation: 'Good hypothesis: specific, testable, falsifiable.', commonTrap: 'Thinking a hypothesis needs to be based on existing proof — it just needs to be testable.', memoryTip: 'Hypothesis rule: "Can I test it? Could it be wrong?" Yes to both = valid.' },
  },
  's-sr-4': {
    difficulty: 3, skillTag: 'correlation-causation', trapType: 'inference_leap',
    isCommonlyMissed: true, commonlyMissedLabel: 'Classic Correlation ≠ Causation',
    rationale: { whyCorrect: 'Hot weather causes both more ice cream consumption AND more swimming (which increases drowning risk) — a confounding variable explains both.', whyWrong: 'A (ice cream causes drowning) is the classic correlation-causation error this question is designed to trap.', teasConceptTested: 'Correlation vs. causation / confounding variable', simpleExplanation: 'When two things rise together, a third hidden factor (confound) often causes both.', commonTrap: 'Option A — it SEEMS logical because the correlation is real, but correlation is not causation.', memoryTip: 'Correlation trap: two rising trends + a lurking third factor = confounding variable, not causation.' },
  },
  's-sr-5': {
    difficulty: 2, skillTag: 'hypothesis', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Option C names an IV (30 min exercise), a DV (resting heart rate), and a timeframe (8 weeks) — it\'s specific and testable.', whyWrong: 'A, B, and D are vague value judgments with no measurable variables or testable prediction.', teasConceptTested: 'Testable hypothesis format', simpleExplanation: '"If [IV], then [DV] will change in this way over this timeframe" = good hypothesis.', commonTrap: 'Choosing A because it sounds like a widely accepted health fact — but a hypothesis must be a testable prediction, not a general belief.', memoryTip: 'A testable hypothesis has: specific IV + specific DV + measurable outcome. Look for all three.' },
  },
  's-sr-6': {
    difficulty: 2, skillTag: 'conclusion', trapType: 'inference_leap', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Option B states only what the data shows: an association between the protocol and fewer infections. No causal claim is made.', whyWrong: 'A uses "eliminates all infections forever" — absolute language beyond the data. C/D are not in the data at all.', teasConceptTested: 'Valid scientific conclusions', simpleExplanation: 'Valid conclusion = only what the data directly shows. No stronger language than the data supports.', commonTrap: 'Choosing "proves" or "eliminates all" language because 15 vs 3 infections seems like strong evidence.', memoryTip: '"The data shows an association" = valid. "This proves" or "always" = overstating the data.' },
  },
  's-sr-7': {
    difficulty: 2, skillTag: 'variables', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Room temperature, lighting, and time of day are kept constant to prevent them from affecting the results = controlled variables.', whyWrong: 'Independent variable is what changes. Dependent variable is what\'s measured. Hypotheses are predictions.', teasConceptTested: 'Controlled variables', simpleExplanation: 'Controlled variables = factors held constant so only one thing changes at a time.', commonTrap: 'Confusing "controlled variables" (kept constant) with "control GROUP" (receives no treatment).', memoryTip: '"Controlled variables" = variables you CONTROL by holding constant. Control GROUP = who gets no treatment.' },
  },
  's-sr-8': {
    difficulty: 1, skillTag: 'scientific-method', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Scientific method: Observation → Question → Hypothesis → Experiment → Analysis → Conclusion. Experiment comes after hypothesis.', whyWrong: 'Observation and questioning come before hypothesis. Literature review is part of background, not after hypothesis.', teasConceptTested: 'Scientific method sequence', simpleExplanation: 'You form a hypothesis, then design an experiment to test it.', commonTrap: 'Placing literature review after hypothesis — reviewing literature actually happens before forming the hypothesis.', memoryTip: 'Steps: Observe → Ask → Hypothesize → Experiment → Analyze → Conclude. Hypothesis comes third.' },
  },
  's-sr-9': {
    difficulty: 1, skillTag: 'scientific-method', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Reproducibility = same results when repeated by independent researchers = cornerstone of valid science.', whyWrong: 'Biased = systematically skewed. Anecdotal = personal story, not data. Controlled = variables held constant.', teasConceptTested: 'Reproducibility', simpleExplanation: 'If other labs can repeat it and get the same answer, the results are reproducible.', commonTrap: 'Choosing "controlled" because controlling variables is part of good experiments — but the question asks about being able to replicate results.', memoryTip: '"Can someone else repeat this and get the same result?" Yes = reproducible.' },
  },
  's-sr-10': {
    difficulty: 2, skillTag: 'study-design', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Double-blind = BOTH participants AND the researchers conducting the study are unaware of treatment assignment.', whyWrong: 'Single-blind = only participants don\'t know. The statistician can know for data analysis.', teasConceptTested: 'Double-blind study design', simpleExplanation: 'Double-blind: two groups don\'t know → both participants AND researchers are blinded.', commonTrap: 'Choosing "only the participants" — that\'s single-blind. Double means BOTH sides are blinded.', memoryTip: '"Double = two groups blinded." Participants + researchers = double. Just participants = single.' },
  },

  // ── English: Conventions ───────────────────────────────────────────────
  'e-conv-1': {
    difficulty: 2, skillTag: 'subject-verb-agreement', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Each" is always singular — it takes a singular verb ("has"). "Each of the nurses HAS completed."', whyWrong: 'A and C use the plural verb "have" which is incorrect with "each." D incorrectly forms the subject.', teasConceptTested: 'Subject-verb agreement with "each"', simpleExplanation: '"Each" = singular = always uses "has," "is," "was" — never "have," "are," "were."', commonTrap: 'Being distracted by the plural noun "nurses" after "of" — the subject is "each," not "nurses."', memoryTip: '"Each" is singular. Cross out "of the nurses" and what\'s left is "Each has" — that sounds right.' },
  },
  'e-conv-2': {
    difficulty: 3, skillTag: 'comma-splice', trapType: 'rule_confusion',
    isCommonlyMissed: true, commonlyMissedLabel: 'Comma Splice vs. Correct Comma',
    rationale: { whyCorrect: 'Option C joins two complete sentences with only a comma — no conjunction, no semicolon. That\'s a comma splice.', whyWrong: 'A uses a comma + "and" (FANBOYS) correctly. B uses a semicolon correctly. D uses a subordinating clause.', teasConceptTested: 'Comma splice identification', simpleExplanation: 'Two independent clauses + only a comma = comma splice. The comma needs help (a conjunction or semicolon).', commonTrap: 'Thinking option A is wrong because it uses a comma before "and" — that\'s actually correct with FANBOYS joining two independent clauses.', memoryTip: '"Comma + FANBOYS = OK. Comma alone joining two complete sentences = comma splice."' },
  },
  'e-conv-3': {
    difficulty: 2, skillTag: 'apostrophe', trapType: 'rule_confusion',
    isCommonlyMissed: true, commonlyMissedLabel: "It's vs. Its",
    rationale: { whyCorrect: '"Patient\'s" = singular possessive (correct). The apostrophe in B is used correctly for possession.', whyWrong: 'C uses "it\'s" (= "it is") where the possessive "its" is needed. D uses "Its" correctly but starts with no subject.', teasConceptTested: "Apostrophe: it's vs. its", simpleExplanation: "It's = it is. Its = belonging to it. No apostrophe for possessive 'its.'", commonTrap: "Adding an apostrophe to 'its' because 'patient's' has one — 'its' as a possessive pronoun never takes an apostrophe.", memoryTip: "Test: replace 'it's' with 'it is.' If it makes sense, use it's. If not, use its (no apostrophe)." },
  },
  'e-conv-4': {
    difficulty: 2, skillTag: 'fragment', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Running down the hallway toward the patient room" has no subject performing the action — it\'s a phrase, not a sentence.', whyWrong: 'A, C, D are all complete sentences with subjects and predicates that express complete thoughts.', teasConceptTested: 'Sentence fragment identification', simpleExplanation: 'A fragment is missing a subject, a verb, or both — it can\'t stand alone.', commonTrap: 'Thinking -ing words make a sentence — "running" without a subject doing the running = fragment.', memoryTip: 'Fragment test: Who is doing what? If you can\'t answer "who," there\'s no subject = fragment.' },
  },
  'e-conv-5': {
    difficulty: 2, skillTag: 'punctuation', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'A colon introduces a list after a complete independent clause — "The doctor ordered three things" is complete, then the colon introduces the list.', whyWrong: 'B uses a comma instead of a colon. C puts the colon right after the verb (not after a complete clause). D uses a semicolon incorrectly.', teasConceptTested: 'Colon use', simpleExplanation: 'Colon rule: the words before the colon must form a complete sentence.', commonTrap: 'Placing a colon directly after a verb ("ordered:") — the clause before the colon must be complete.', memoryTip: '"The doctor ordered three things: [list]." Before the colon = complete sentence. After = the list.' },
  },
  'e-conv-6': {
    difficulty: 3, skillTag: 'pronoun-agreement', trapType: 'rule_confusion',
    isCommonlyMissed: true, commonlyMissedLabel: '"Every" + Singular Pronoun',
    rationale: { whyCorrect: '"Every nurse" is singular — the traditional formal standard requires a singular pronoun "his or her."', whyWrong: 'A (their) uses a plural pronoun for a singular antecedent. C (our) makes no logical sense. D has a grammar error.', teasConceptTested: 'Pronoun-antecedent agreement', simpleExplanation: '"Every" is always singular. In formal TEAS writing, singular antecedents require singular pronouns.', commonTrap: 'Choosing "their" because it sounds natural in everyday speech — on the TEAS, formal standard grammar applies.', memoryTip: '"Every/each/either/neither" = singular. Use his or her (formal TEAS answer) even though "their" is common in daily use.' },
  },
  'e-conv-7': {
    difficulty: 2, skillTag: 'run-on', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"The medication was due the nurse forgot to administer it" — two complete sentences with no punctuation or conjunction between them.', whyWrong: 'A uses a comma + "so" (FANBOYS) correctly. B uses a period correctly. D uses a subordinating clause correctly.', teasConceptTested: 'Run-on sentence identification', simpleExplanation: 'Run-on = two independent clauses fused together with no punctuation at all.', commonTrap: 'Confusing run-on with comma splice — run-on has NO punctuation; comma splice has a comma but needs more.', memoryTip: 'Run-on: read aloud. If you need to breathe before "the nurse" but there\'s nothing there — run-on.' },
  },
  'e-conv-8': {
    difficulty: 2, skillTag: 'conjunctions', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Because" is a subordinating conjunction (it creates a dependent clause) — it\'s not part of FANBOYS.', whyWrong: 'And, But, and Or are all in FANBOYS (For, And, Nor, But, Or, Yet, So).', teasConceptTested: 'Coordinating vs. subordinating conjunctions', simpleExplanation: 'FANBOYS = For And Nor But Or Yet So. Because is subordinating — it makes one clause depend on another.', commonTrap: 'Including "because" in FANBOYS because it\'s a common joining word — but because creates dependency, not equal coordination.', memoryTip: 'F-A-N-B-O-Y-S: count the letters. "Because" starts with B but it\'s not "But." Learn the list cold.' },
  },
  'e-conv-9': {
    difficulty: 2, skillTag: 'punctuation', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'A semicolon can join two independent clauses without a conjunction — both sides of B are complete sentences.', whyWrong: 'A is a comma splice. C is a run-on. D\'s second clause has no subject after "and."', teasConceptTested: 'Semicolon use', simpleExplanation: 'Semicolon = two independent clauses, no conjunction needed.', commonTrap: 'Choosing A because a comma + nothing seems like it should work — but two complete sentences need more than just a comma.', memoryTip: 'Semicolon test: both sides must be complete sentences. Replace semicolon with a period — do both work? Yes = semicolon OK.' },
  },
  'e-conv-10': {
    difficulty: 2, skillTag: 'apostrophe', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: "Option A: 'It's the hospital's policy' = 'It is the hospital's policy' — correct use of it's (contraction).", whyWrong: "B uses 'it's' where possessive 'its' is needed. C starts with 'Its' (possessive) but the sentence needs 'It's' (It is). D same error.", teasConceptTested: "It's vs. its in context", simpleExplanation: "Substitute 'it is.' If the sentence still makes sense, use it's (apostrophe). If not, use its.", memoryTip: "'It's' = contraction = 'it is.' Test every single time: say 'it is' out loud. Does it work?" },
  },

  // ── English: Knowledge of Language ────────────────────────────────────
  'e-kol-1': {
    difficulty: 2, skillTag: 'conciseness', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Option B conveys the complete meaning in 9 words. A, C, and D all use 15–20+ words to say the same thing.', whyWrong: 'A ("due to the fact that") is a classic wordy phrase. C and D add passive voice and extra clauses that add no meaning.', teasConceptTested: 'Sentence conciseness', simpleExplanation: 'The correct answer on the TEAS is always the shortest version that preserves full meaning.', commonTrap: 'Choosing a longer answer because it sounds more "professional" — the TEAS always rewards brevity.', memoryTip: '"Due to the fact that" = "Because." If you can replace 5 words with 1, do it.' },
  },
  'e-kol-2': {
    difficulty: 2, skillTag: 'parallel-structure', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Hardworking, detail-oriented, and a good communicator" — all adjective phrases (adjective, adjective-noun phrase) = parallel.', whyWrong: 'A mixes adjective + adjective + noun phrase. B and D mix adjectives with verb phrases.', teasConceptTested: 'Parallel structure in a list', simpleExplanation: 'All items in a list must use the same grammatical form — adjective, adjective, adjective.', commonTrap: 'Choosing B because "communicates well" sounds natural — but mixing an adjective with a verb phrase breaks parallelism.', memoryTip: 'Circle the grammatical form of each item. They must all match: -ing/-ing/-ing or adj/adj/adj.' },
  },
  'e-kol-3': {
    difficulty: 2, skillTag: 'transitions', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Consequently" means "as a result" — studying caused passing. This is a cause-effect relationship.', whyWrong: '"However" signals contrast. "In contrast" signals contrast. "Nevertheless" means "despite this" = contrast.', teasConceptTested: 'Cause-effect transition words', simpleExplanation: 'The relationship here is: studying caused passing = cause-effect = "consequently" or "therefore."', commonTrap: 'Choosing "nevertheless" because it sounds academic — but nevertheless means the opposite happened despite something else.', memoryTip: 'Transition logic: A caused B = therefore/consequently. A but B anyway = nevertheless/however.' },
  },
  'e-kol-4': {
    difficulty: 3, skillTag: 'redundancy', trapType: 'misread',
    isCommonlyMissed: true, commonlyMissedLabel: 'Both Options Are Redundant',
    rationale: { whyCorrect: '"Physician doctor" = redundant (a physician IS a doctor). "Orally by mouth" = redundant (oral means by mouth). Both B and C.', whyWrong: 'A is not redundant — "at noon" is precise and adds information. Choosing just B or just C misses the full answer.', teasConceptTested: 'Identifying redundancy', simpleExplanation: 'Both B and C contain redundancy — the answer is D (both of the above).', commonTrap: 'Stopping at B and selecting it without checking C, missing that two options are both correct.', memoryTip: 'When you find one redundancy, always check if there are more. Read every option before selecting.' },
  },
  'e-kol-5': {
    difficulty: 2, skillTag: 'transitions', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"However" signals contrast — the second clause introduces an unexpected negative (nausea) after a positive (reduces fever).', whyWrong: '"Therefore" and "consequently" both signal cause-effect, which would mean nausea is caused by reducing fever — not what\'s being said.', teasConceptTested: 'Contrast transition words', simpleExplanation: 'Benefit ; however , side effect = contrast. "However" bridges a positive with a negative.', commonTrap: 'Choosing "furthermore" because it seems like you\'re adding more information — but "furthermore" adds more of the same, not a contrast.', memoryTip: '"However" = but. Benefit BUT side effect = contrast = however.' },
  },
  'e-kol-6': {
    difficulty: 2, skillTag: 'sentence-structure', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Option B uses "because" to show a causal relationship between the two ideas in one clean, complete sentence.', whyWrong: 'A creates a comma splice. C creates a fragment ("Never having had surgery before" alone). D is wordy and awkward.', teasConceptTested: 'Sentence combining', simpleExplanation: 'The best combination shows the relationship between ideas while avoiding fragments, run-ons, and wordiness.', commonTrap: 'Choosing D because "and also" feels like a connection — but it\'s redundant and doesn\'t show WHY she was anxious.', memoryTip: '"Because" = the best connector when one clause explains why the other happened.' },
  },
  'e-kol-7': {
    difficulty: 2, skillTag: 'register', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Verbalized discomfort" and "declined medication administration at 1400" use precise clinical language and military time — appropriate for a nursing report.', whyWrong: 'A, C, D use informal language (really, kind of, stuff, didn\'t) inappropriate for clinical documentation.', teasConceptTested: 'Clinical/formal register', simpleExplanation: 'Nursing documentation = formal, objective, precise. No slang, no vague words, specific times.', commonTrap: 'Choosing C because it\'s simple and clear — but "2 pm" is informal; clinical documents use 1400.', memoryTip: 'Clinical chart note test: specific words + objective language + time in military = correct.' },
  },
  'e-kol-8': {
    difficulty: 2, skillTag: 'parallel-structure', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"To run, swimming, and cycling" mixes an infinitive (to run) with gerunds (swimming, cycling) — a parallelism error.', whyWrong: 'A uses all gerunds (-ing). B uses all past tense verbs. D uses all adjectives — all parallel.', teasConceptTested: 'Parallelism error identification', simpleExplanation: 'All items in a list must match: all -ing, all to+verb, or all the same tense.', commonTrap: 'Missing that "to run" and "swimming" are different forms — to run (infinitive) vs. swimming (gerund).', memoryTip: 'Circle the form of each list item. If you see "to ___" mixed with "___ing" = parallelism error.' },
  },
  'e-kol-9': {
    difficulty: 2, skillTag: 'redundancy', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: '"End result" (results are ends), "unexpected surprise" (surprises are unexpected), "final conclusion" (conclusions are final) — all three are redundant.', whyWrong: 'Each phrase repeats the same meaning in two words. Option D (all of the above) captures all three.', teasConceptTested: 'Redundant phrases', simpleExplanation: 'These are classic redundant pairs — the second word already means the first.', commonTrap: 'Not recognizing that "final conclusion" is redundant because it sounds formal and acceptable in everyday speech.', memoryTip: '"End result" — can a result not be an end? No. Remove "end." Same test for all three.' },
  },
  'e-kol-10': {
    difficulty: 1, skillTag: 'word-choice', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Numerous" is the formal, academic equivalent of "a lot of" — precise and appropriate for professional writing.', whyWrong: '"Heaps of," "tons of," and "plenty" are all informal/colloquial and inappropriate for academic writing.', teasConceptTested: 'Formal word choice', simpleExplanation: 'For formal writing, always choose the most precise, professional word.', commonTrap: 'Choosing "plenty" because it doesn\'t sound as extreme as "heaps" or "tons" — but it\'s still informal.', memoryTip: '"Numerous" = formal. "A lot of" = informal. Learn the formal equivalents: numerous, significant, substantial.' },
  },

  // ── English: Vocabulary and Writing ───────────────────────────────────
  'e-voc-1': {
    difficulty: 1, skillTag: 'context-clues', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: 'The example clue "such as ibuprofen" given to manage pain directly defines analgesic = pain reliever.', whyWrong: 'An antibiotic fights infections, not pain. Anti-inflammatory is one mechanism of ibuprofen, not the definition of analgesic.', teasConceptTested: 'Example context clue', simpleExplanation: '"Such as ibuprofen, to manage pain" tells you exactly what an analgesic does.', commonTrap: 'Choosing "anti-inflammatory" because ibuprofen is an anti-inflammatory — but analgesic specifically means pain-relieving, which is broader.', memoryTip: 'Analgesic = "without pain" (an- = without, -alge = pain). The example in the sentence confirms it.' },
  },
  'e-voc-2': {
    difficulty: 2, skillTag: 'medical-prefixes', trapType: 'rule_confusion',
    isCommonlyMissed: true, commonlyMissedLabel: 'Brady- vs. Tachy- Prefix',
    rationale: { whyCorrect: '"Brady-" means slow. Bradycardia = slow heart rate (below 60 bpm).', whyWrong: '"Fast" = tachy- (tachycardia). "Normal" is no prefix. "Irregular" uses arrhythmia or a different prefix.', teasConceptTested: 'Brady- prefix meaning', simpleExplanation: 'Brady- = slow. Tachy- = fast. These are the two most tested cardiac prefixes.', commonTrap: 'Confusing brady- (slow) with tachy- (fast) — they\'re opposites and both appear on the TEAS.', memoryTip: '"Brady Bunch" moves slowly (brady = slow). "Tachy" sounds like "tacky" = rushing = fast.' },
  },
  'e-voc-3': {
    difficulty: 2, skillTag: 'context-clues', trapType: 'misread',
    isCommonlyMissed: true, commonlyMissedLabel: 'Antonym Context Clue',
    rationale: { whyCorrect: 'The antonym clue "unlike her energetic behavior" signals lethargic = the opposite of energetic = abnormally drowsy/sluggish.', whyWrong: 'Energetic and anxious are not what "unlike energetic" points to. Confused doesn\'t match the energy contrast.', teasConceptTested: 'Antonym context clue', simpleExplanation: '"Unlike her energetic behavior" = contrast clue = lethargic must mean the opposite of energetic.', commonTrap: 'Choosing "confused" because lethargic patients often seem confused — but the passage\'s contrast clue points to sluggishness, not confusion.', memoryTip: '"Unlike" = antonym clue. Whatever comes after is the opposite of the unknown word.' },
  },
  'e-voc-4': {
    difficulty: 1, skillTag: 'medical-suffixes', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"-itis" always means inflammation. Gastritis = stomach inflammation. Appendicitis = appendix inflammation.', whyWrong: 'Removal = -ectomy. Study of = -ology. Disease = -pathy.', teasConceptTested: '-itis suffix meaning', simpleExplanation: 'Every "-itis" word means inflammation of something.', commonTrap: 'Confusing -itis with -pathy — both involve problems with an organ but -itis = inflammation specifically.', memoryTip: '"-itis" = inflammation. Think appendicitis (swollen appendix). The suffix never changes.' },
  },
  'e-voc-5': {
    difficulty: 2, skillTag: 'medical-prefixes', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Hypo-" means below or under. Hypoglycemia = blood sugar below normal range.', whyWrong: '"Above/excessive" = hyper-. "Within" = intra-. "Fast" = tachy-.', teasConceptTested: 'Hypo- prefix meaning', simpleExplanation: 'Hypo- = under/below. Hyper- = over/above. These two are always tested as a pair.', commonTrap: 'Confusing hypo- and hyper- — they sound similar but mean opposite directions.', memoryTip: '"HYPOdermic = under the skin." Hypo = under/below. Hyper = over/above (hyperactive = over-active).' },
  },
  'e-voc-6': {
    difficulty: 1, skillTag: 'medical-suffixes', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: '"-ectomy" means surgical removal. Appendectomy = removal of the appendix.', whyWrong: 'Inflammation = -itis. Study of = -ology. Disease = -pathy.', teasConceptTested: '-ectomy suffix meaning', simpleExplanation: 'Any word ending in -ectomy describes removing a body part surgically.', commonTrap: 'Confusing -ectomy (remove) with -otomy (cut into, not remove) — -ectomy specifically means removal.', memoryTip: '"-ECtomy = Eliminate (remove)." Appendectomy, tonsillectomy, mastectomy — all removals.' },
  },
  'e-voc-7': {
    difficulty: 2, skillTag: 'writing-process', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Writing process order: Prewriting → Drafting → Revising → Editing. This is the standard, tested sequence.', whyWrong: 'Starting with drafting (A) skips planning. Editing before revising (C) means fixing grammar before improving content.', teasConceptTested: 'Writing process stages', simpleExplanation: 'Plan → Write → Improve content → Fix grammar. That order always.', commonTrap: 'Swapping revising and editing — revise (big picture) comes before editing (grammar details).', memoryTip: '"Prewrite → Draft → Revise (big) → Edit (small)." R before E: Revise is bigger work, comes first.' },
  },
  'e-voc-8': {
    difficulty: 2, skillTag: 'connotation', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Economical" carries a positive connotation (wise, resourceful). "Cheap" carries a negative connotation (stingy, low-quality).', whyWrong: 'They\'re not interchangeable in context — connotation matters. "Neither" avoids the question.', teasConceptTested: 'Denotation vs. connotation', simpleExplanation: 'Same literal meaning, different emotional feeling. Context determines which word to use.', commonTrap: 'Choosing C ("interchangeable") because they technically mean the same thing — but connotation differences make them not interchangeable in practice.', memoryTip: '"Economical" = smart with money (+). "Cheap" = stingy/low quality (−). Same denotation, opposite connotation.' },
  },
  'e-voc-9': {
    difficulty: 1, skillTag: 'medical-prefixes', trapType: 'rule_confusion', isCommonlyMissed: false,
    rationale: { whyCorrect: 'Tachy- = fast + -cardia = heart → tachycardia = abnormally fast heart rate (>100 bpm).', whyWrong: '"Slow breathing" = bradypnea. "Irregular rhythm" = arrhythmia. "Low blood pressure" = hypotension.', teasConceptTested: 'Tachy- prefix application', simpleExplanation: 'Break it apart: tachy- (fast) + -cardia (heart) = fast heart.', commonTrap: 'Applying "fast" to breathing instead of heart rate — -cardia always means heart.', memoryTip: '"-cardia = heart." Tachy-cardia = fast-heart. Brady-cardia = slow-heart.' },
  },
  'e-voc-10': {
    difficulty: 1, skillTag: 'word-roots', trapType: 'misread', isCommonlyMissed: false,
    rationale: { whyCorrect: '"Ambul-" means to walk. Ambulatory = able to walk independently.', whyWrong: '"Requiring an ambulance" is a tempting trap — ambulances share the root but the word ambulatory specifically means walking ability.', teasConceptTested: 'Latin root "ambul-"', simpleExplanation: 'Ambulatory = can walk. The root "ambul-" = to walk, from Latin ambulare.', commonTrap: 'Choosing "requiring an ambulance" because both ambulatory and ambulance share the "ambul-" root — but the word means able to WALK, not needing transport.', memoryTip: '"Ambul-" = walk. Ambulatory = walks on their own. Ambulance = originally a "walking hospital" (historical origin).' },
  },
}

import { QUESTION_AUDIT } from './questionsAudit'

// Merges educational metadata + audit flags onto a question object.
// Replacement questions carry all fields inline so the merge is a no-op for them.
export function getEnrichedQuestion(q) {
  const meta = QUESTION_META[q.id] || {}
  const audit = QUESTION_AUDIT[q.id] || {}
  return { ...q, ...meta, ...audit }
}
