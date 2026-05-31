// Prewritten AI-style helper content per topic.
// Structure makes it easy to swap in real API calls later —
// just replace the static strings with fetch() results.

export const AI_CONTENT = {
  'key-ideas': {
    simplify: `This section tests whether you can find the main point of a passage and tell it apart from specific details. The main idea is the broadest statement that covers the whole passage — not any single fact. Inferences are conclusions you draw from clues in the text combined with logic, never requiring outside knowledge.`,
    nursingNewbie: `Think of it like a diagnosis: the main idea is the diagnosis (the big picture), and the supporting details are the symptoms that led you there. You never diagnose based on one symptom alone — and you never pick a main idea that only covers one paragraph. If it's too specific, it's a supporting detail.`,
    notebookKeys: [
      'Main idea = the broadest statement that covers the ENTIRE passage',
      'Supporting details answer: who, what, when, where, or how — they support the main idea',
      'Inference = logical conclusion drawn from text clues — NEVER requires outside knowledge',
      'Summary = restating the most important ideas in your own words (brief, no new info)',
      'Trap #1: A supporting detail sounds great but only covers part of the passage',
      'Trap #2: An answer that goes beyond the text (you added info not there) = wrong',
      'Signal words: "yet," "despite," "however" = contrast is coming; "because," "so" = cause-effect',
      'Strategy: state the main idea in your own words BEFORE looking at answer choices',
    ],
    diagramsToDraw: [
      'Umbrella diagram: write main idea on top, list 3 supporting details hanging below',
      'Inference triangle: two text facts at the base → logical conclusion at the top',
    ],
    mustKnowFacts: [
      'All TEAS answers come from the passage — never use outside knowledge',
      'The main idea must cover every paragraph, not just one section',
      '"Despite," "yet," "however" signal the next part is unexpected or contrasting',
      'A detail that is true but too specific = supporting detail, not main idea',
      'For inference: ask "What MUST be true based ONLY on what I read?"',
    ],
  },

  'craft-structure': {
    simplify: `Craft and Structure tests how and why an author wrote something — not just what they wrote. You'll identify whether a passage is meant to persuade, inform, or entertain (PIE), recognize how a passage is organized, and figure out what words mean from surrounding context — not memorized definitions.`,
    nursingNewbie: `As a nurse, you write different things for different purposes: a chart note informs, an incident report documents a problem, an advocacy letter persuades. TEAS reading is the same — you have to figure out what the author is trying to DO with the passage. Once you know the purpose, everything else makes more sense.`,
    notebookKeys: [
      "Author's purpose = PIE: Persuade (argue), Inform (explain), Entertain (story/emotion)",
      'Cause-effect signal words: because, so, as a result, therefore, due to',
      'Compare-contrast signal words: however, but, unlike, although, on the other hand',
      'Sequence signal words: first, next, then, finally, after, before',
      'Problem-solution signal words: to address this, the solution is, in response',
      'Vocabulary in context: substitute each answer choice into the sentence — pick what fits',
      'Tone = author\'s attitude revealed by word choice (alarmed, hopeful, critical, neutral)',
      'Point of view: I/we = 1st person; he/she/they = 3rd person limited or omniscient',
    ],
    diagramsToDraw: [
      'PIE circle: three sections labeled Persuade / Inform / Entertain with 1 example each',
      'Text structure signal word chart: 5 types across the top, signal words listed below each',
    ],
    mustKnowFacts: [
      'If a passage has two viewpoints and draws a balanced conclusion — purpose is INFORM',
      'Vocabulary context: always use the surrounding sentence, not memorized definitions',
      '"Unlike," "however," "but" = contrast clues — meaning is opposite of the familiar word',
      '"Because," "therefore," "as a result" = cause-effect clues',
      'Tone is revealed by the adjectives and verbs the author chooses — not the topic itself',
    ],
  },

  'integration-knowledge': {
    simplify: `This is the critical thinking section. You'll decide whether evidence actually supports a claim, identify primary versus secondary sources, distinguish facts from opinions, and sometimes compare two short passages side by side. Every answer must come directly from the text or data shown.`,
    nursingNewbie: `Imagine reading a research article about a new medication. You need to ask: is this the original study (primary) or someone's summary of it (secondary)? Does this evidence actually prove what the author says, or are they jumping to conclusions? That's exactly what this section tests — the same skills you'll use reading clinical research as a nurse.`,
    notebookKeys: [
      'Primary source = original first-hand data (a clinical trial report, raw survey data)',
      'Secondary source = summary, analysis, or interpretation of a primary source',
      'Fact = verifiable as true or false; Opinion = personal judgment (look for: should, best, worst, always, never)',
      'Correlation ≠ causation — two things happening together does NOT prove one causes the other',
      'For graphs: read the TITLE, axis labels, and legend BEFORE answering any question',
      'Valid conclusion: stays within the data shown — never adds outside information',
      'Logical fallacy: overgeneralization ("everyone knows…"), false cause, ad hominem',
      'Compare-passage strategy: find one thing they AGREE on + one thing they DIFFER on first',
    ],
    diagramsToDraw: [
      'T-chart: Fact on left side / Opinion on right side — list 3 examples of each',
      'Source pyramid: Primary sources at bottom (most reliable) → Secondary → Tertiary at top',
    ],
    mustKnowFacts: [
      'Opinion red flags: should, must, best, worst, always, never, "I believe," "I think"',
      'A graph question: narrate the trend in your head before choosing an answer',
      '"The data shows X increased" is a valid conclusion; "Therefore X always increases" is not',
      'When comparing passages, look for where they overlap and where they conflict',
      'Strong argument: the evidence must directly support THIS specific claim, not just be related to it',
    ],
  },

  'numbers-algebra': {
    simplify: `Numbers and Algebra covers the core math you need for nursing: fractions, decimals, percentages, ratios, proportions, basic algebra, and dosage calculations. The key is knowing your rules cold — especially Keep-Change-Flip for fractions and D/H × V for dosage math.`,
    nursingNewbie: `Dosage calculations are THE most important nursing math skill — if you give the wrong dose, you harm a patient. The good news: all dosage problems use the same formula: Desired ÷ Have × Volume. Every problem. And fractions/percentages show up in every lab result and medication order you'll ever read. This section is directly life-applicable.`,
    notebookKeys: [
      'Fraction division: Keep the first, Change ÷ to ×, Flip the second (KCF)',
      'Percent to decimal: move the decimal 2 places LEFT (30% = 0.30)',
      'Percent of a number: multiply by the decimal (15% of 240 = 0.15 × 240 = 36)',
      'Percent change: (New − Old) ÷ Old × 100',
      'Dosage formula: D/H × V = dose (Desired ÷ Have × Volume)',
      'PEMDAS: Parentheses → Exponents → Multiply/Divide (L→R) → Add/Subtract (L→R)',
      'Proportion: set two fractions equal and cross-multiply to find the missing value',
      'Cross-multiply check: a/b = c/d means a×d = b×c',
    ],
    diagramsToDraw: [
      'KCF fraction division example: 3/4 ÷ 1/2 → 3/4 × 2/1 = 6/4 = 3/2',
      'Dosage triangle: D on top, H and V on bottom — cover what you want to find',
    ],
    mustKnowFacts: [
      '176 lbs ÷ 2.2 = 80 kg (always divide lbs by 2.2 to get kg)',
      'Percent INCREASE: answer is original + the increase (100 + 30% = 130, not 30)',
      'Order of operations: resolve ALL parentheses first, then exponents',
      '0.375 = 3/8 (common TEAS fraction-decimal conversion)',
      'A 1:4 ratio means 1 part drug + 4 parts diluent — the diluent multiplier is 4',
    ],
  },

  'measurement-data': {
    simplify: `Measurement and Data covers the real-world math nurses use daily: unit conversions (metric and household), statistics (mean/median/mode), reading graphs, and basic probability. Memorize the key conversion factors cold — you'll be timed on the TEAS.`,
    nursingNewbie: `Every day as a nurse you'll convert mL to oz, kg to lbs, and mg to g. You'll calculate a patient's average pain score over a shift or figure out how long an IV bag will last. This isn't abstract math — it's the exact math you'll use in clinical practice, starting day one.`,
    notebookKeys: [
      '1 kg = 2.2 lbs | 1 inch = 2.54 cm | 1 L = 1,000 mL | 1 g = 1,000 mg',
      '1 tsp = 5 mL | 1 tbsp = 15 mL | 1 oz = 30 mL | 1 cup = 240 mL',
      'Mean = sum of all values ÷ number of values (arithmetic average)',
      'Median = middle value when sorted; if even count → average the two middle values',
      'Mode = value that appears most often (can have more than one)',
      'Range = highest value − lowest value',
      'Probability = favorable outcomes ÷ total possible outcomes',
      'Metric prefix mnemonic: King Henry Died By Drinking Cold Milk (K H D B D C M)',
    ],
    diagramsToDraw: [
      'Metric staircase: Kilo → Hecto → Deca → Base → Deci → Centi → Milli (each step × or ÷ 10)',
      'Conversion reference card: 7 key conversions in a table (memorize all 7)',
    ],
    mustKnowFacts: [
      '"Mean = do Math, Median = Middle, Mode = Most frequent"',
      'Always SORT the data before finding median — unsorted = wrong answer',
      'mg and mL are DIFFERENT units — mass vs volume, do not confuse them',
      'All probabilities in a set must add up to 1.0 (100%)',
      '480 mL ÷ 60 mL/hr = 8 hours for an IV bag — a common TEAS word problem type',
    ],
  },

  'anatomy-physiology': {
    simplify: `Human A&P is the largest science section on the TEAS. You need to know all major body systems and their functions. Focus most on cardiovascular, respiratory, nervous, digestive, urinary, and endocrine systems. Homeostasis and negative feedback loop concepts appear on nearly every TEAS.`,
    nursingNewbie: `Think of the body like a hospital with specialized departments: the heart is transport, the lungs are the air filtration unit, the kidneys are waste management, the brain is administration. Each "department" has a job, and homeostasis is the hospital's policy to keep everything running at normal levels. When something goes wrong, the body triggers a negative feedback loop — like a thermostat turning on when it's too cold.`,
    notebookKeys: [
      'Right heart → lungs (deoxygenated blood); Left heart → body (oxygenated blood)',
      'SA node = heart\'s natural pacemaker, located in the right atrium',
      'Gas exchange occurs in the ALVEOLI (tiny air sacs) — O₂ in, CO₂ out',
      'Breathing rate is controlled by CO₂ levels in the blood, NOT O₂ levels',
      'Nephron = functional unit of the kidney; filters blood and makes urine',
      'Sympathetic = fight-or-flight (heart rate ↑, pupils dilate); Parasympathetic = rest-digest',
      'Insulin (pancreas) lowers blood sugar; Glucagon raises blood sugar',
      'Homeostasis = maintaining stable internal conditions via negative feedback loops',
    ],
    diagramsToDraw: [
      'Heart diagram: label 4 chambers, SA node, aorta, pulmonary artery — draw blood flow arrows',
      'Body systems table: 8 systems | main organ | primary function — 2 columns, 8 rows',
    ],
    mustKnowFacts: [
      'Normal blood pH = 7.35–7.45 (slightly basic; below 7.35 = acidosis, above 7.45 = alkalosis)',
      'Small intestine = site of most nutrient absorption (not the stomach, not the large intestine)',
      'Epinephrine (adrenaline) comes from the adrenal MEDULLA',
      'ADH (antidiuretic hormone) controls water reabsorption in the kidney',
      'Pituitary gland = "master gland" — controls most other endocrine glands',
    ],
  },

  'biology': {
    simplify: `TEAS Biology covers cell structure and organelles, cell division (mitosis vs. meiosis), protein synthesis (DNA→RNA→protein), and basic genetics (dominant/recessive, Punnett squares). The most commonly tested concepts are PMAT phases of mitosis and the central dogma of molecular biology.`,
    nursingNewbie: `Every single process in your body runs on proteins — enzymes, hormones, antibodies. DNA is the master blueprint (locked in the nucleus), mRNA is a copy sent to the factory floor (ribosome), and the ribosome assembles the protein. It's like ordering a custom part: DNA = original design, mRNA = the order form, ribosome = the manufacturer.`,
    notebookKeys: [
      'Mitosis: produces 2 IDENTICAL diploid cells (growth and repair) — PMAT phases',
      'Meiosis: produces 4 UNIQUE haploid sex cells (egg/sperm) — 2 rounds of division',
      'PMAT: Prophase → Metaphase → Anaphase → Telophase ("Poor Men Are Tired")',
      'Protein synthesis: DNA → mRNA (transcription in nucleus) → protein (translation at ribosome)',
      'DNA base pairs: A-T and G-C | RNA uses U (Uracil) instead of T (Thymine)',
      'Dominant allele (capital letter) is expressed even with one copy; recessive needs two copies',
      'Genotype = genetic makeup (letters); Phenotype = observable trait (eye color, height)',
      'Mitochondria = powerhouse, makes ATP via cellular respiration',
    ],
    diagramsToDraw: [
      'PMAT cycle: draw a circle divided into 4 phases, label what happens in each',
      'Punnett square: Bb × Bb cross — fill in all 4 boxes and label genotype/phenotype ratios',
    ],
    mustKnowFacts: [
      'Mitosis ≠ meiosis: Mitosis = Making Two identical; Meiosis = Making eggs/sperm',
      'RNA has Uracil (U), not Thymine (T) — this is a very common TEAS trap',
      'Ribosome = protein factory (reads mRNA and builds the protein)',
      'Heterozygous Bb (dominant + recessive) shows the DOMINANT phenotype',
      'Golgi apparatus = packages and ships proteins after the ribosome makes them',
    ],
  },

  'chemistry': {
    simplify: `TEAS Chemistry covers atomic structure (protons/neutrons/electrons), the periodic table basics, chemical bonds (ionic vs. covalent), the pH scale, and the law of conservation of mass. The pH scale is especially important for nursing — blood pH (7.35–7.45) appears on nearly every TEAS.`,
    nursingNewbie: `As a nurse, you'll constantly monitor a patient's acid-base balance through blood pH. A patient in acidosis (pH below 7.35) may have respiratory problems (breathing off excess CO₂). Alkalosis (pH above 7.45) can cause muscle spasms and confusion. Understanding pH at the chemical level makes you a better nurse — it's not just test prep.`,
    notebookKeys: [
      'Atomic number = number of protons (this is the element\'s unique "ID number")',
      'Mass number = protons + neutrons (isotopes have same protons, different neutrons)',
      'Electrons are NEGATIVE, orbit the nucleus in shells',
      'Ionic bond: metal GIVES electron to nonmetal (Na gives Cl → NaCl = table salt)',
      'Covalent bond: nonmetals SHARE electrons (H₂O, CO₂)',
      'pH scale: 0 (most acidic) to 14 (most basic); 7 = neutral; blood = 7.35–7.45',
      'Acid donates H⁺ ions (pH < 7); Base accepts H⁺ ions (pH > 7)',
      'Law of Conservation of Mass: total mass of reactants = total mass of products',
    ],
    diagramsToDraw: [
      'Atom diagram: nucleus (protons + neutrons) in center, electrons orbiting around it',
      'pH number line: 0-6 = acid | 7 = neutral | 8-14 = base — mark blood pH at 7.4',
    ],
    mustKnowFacts: [
      'pH 3 is MORE acidic than pH 5 — lower pH = more acidic (common confusion)',
      'Isotopes are the same element with different neutron counts (same atomic number)',
      'Normal blood pH = 7.35–7.45 (slightly basic, NOT neutral)',
      '"Ionic = I give" — the metal gives away electrons to become stable',
      '"Covalent = COoperating" — atoms share electrons between themselves',
    ],
  },

  'scientific-reasoning': {
    simplify: `Scientific Reasoning tests whether you can think like a scientist: identify variables correctly, evaluate whether a hypothesis is testable, draw only conclusions supported by the data, and recognize the difference between correlation and causation. This section rewards careful, logical thinking.`,
    nursingNewbie: `Every nursing intervention should be based on evidence — not tradition or assumption. When a study claims "Drug X reduces infections," you need to ask: was there a control group? What did they actually measure? Could something else explain the results? That's scientific reasoning — and it's what separates evidence-based nursing from guesswork.`,
    notebookKeys: [
      'Independent variable (IV) = what the researcher CHANGES/manipulates',
      'Dependent variable (DV) = what the researcher MEASURES (depends on the IV)',
      'Control group = receives NO treatment; serves as the baseline comparison',
      'Controlled variables = factors kept the SAME across all groups for a fair test',
      'Valid hypothesis: must be TESTABLE (can design an experiment) + FALSIFIABLE (could be wrong)',
      'Correlation ≠ causation — a confounding variable may explain both trends',
      'Valid conclusion: only says what the DATA shows — never goes beyond it',
      '"Double-blind" = neither participants NOR researchers know who got the treatment',
    ],
    diagramsToDraw: [
      'Scientific method flowchart: Observation → Question → Hypothesis → Experiment → Data → Conclusion',
      'Experiment diagram: label IV, DV, control group, experimental group, and controlled variables',
    ],
    mustKnowFacts: [
      'IV = "I change it"; DV = "it Depends on what I changed" — remember: "I Do"',
      'A hypothesis that cannot be tested or cannot be proven wrong is NOT scientific',
      'Control group ≠ controlled variables: control group is a group; controlled variables are factors',
      'Classic correlation trap: ice cream sales and drowning rates — both rise in summer (confound = heat)',
      '"Reproducible" = other researchers can get the same results — cornerstone of valid science',
    ],
  },

  'conventions-english': {
    simplify: `Conventions tests grammar and punctuation rules for formal writing. The biggest areas: subject-verb agreement (tricky collective nouns and "each"), comma splices and run-ons, apostrophe rules (it's vs its), and sentence fragments. Know FANBOYS cold — those 7 conjunctions (For, And, Nor, But, Or, Yet, So) appear constantly.`,
    nursingNewbie: `Clear writing saves lives in nursing. A poorly written order, a vague chart note, or a misplaced comma can cause serious errors. When you write "The nurse administered the wrong medication, the patient was harmed" — that comma splice creates ambiguity. This section trains you to write with the precision that clinical documentation demands.`,
    notebookKeys: [
      'FANBOYS = For, And, Nor, But, Or, Yet, So (coordinating conjunctions)',
      '"Each," "every," "either," "neither" are always SINGULAR → use singular verb',
      'It\'s = it is (contraction) | Its = belonging to it (possessive — NO apostrophe)',
      'Comma splice = two independent clauses joined with ONLY a comma (incorrect)',
      'Run-on = two independent clauses with NO punctuation between them',
      'Fragment = incomplete sentence — missing subject, verb, or complete thought',
      'Semicolon joins two independent clauses without a conjunction',
      'Colon introduces a list ONLY after a complete independent clause',
    ],
    diagramsToDraw: [
      'Three ways to fix a comma splice: (1) period | (2) semicolon | (3) comma + FANBOYS',
      'It\'s vs Its decision tree: Can I replace it with "it is"? Yes → use it\'s | No → use its',
    ],
    mustKnowFacts: [
      '"Either/or" and "neither/nor": the verb agrees with the CLOSER subject',
      'Collective nouns (team, jury, committee, staff) are SINGULAR in American English',
      'Cross out prepositional phrases between subject and verb to check agreement correctly',
      'A phrase starting with "-ing" alone (no subject) = fragment',
      'Semicolon rule: both sides must be independent clauses (complete sentences)',
    ],
  },

  'knowledge-language': {
    simplify: `Knowledge of Language tests your ability to use language effectively — not just correctly. You'll choose the most concise version of a sentence, identify parallel structure errors, pick the right transition word for a logical relationship, and recognize redundant or overly wordy phrases. The TEAS always prefers clear, concise, formal language.`,
    nursingNewbie: `In clinical documentation, every extra word is a risk. "The patient was experiencing a very great deal of pain in their head area" should be "The patient reported severe headache." Conciseness and precision aren't just style preferences — they're patient safety skills. This section trains exactly that.`,
    notebookKeys: [
      'Parallel structure: all items in a list must use the same grammatical form',
      'Wrong: "She likes running, to swim, and dance" → Right: "running, swimming, dancing"',
      'Transition: contrast = however/nevertheless/yet | cause-effect = therefore/consequently/thus',
      'Transition: addition = furthermore/moreover | example = for instance/specifically',
      'Redundancy: "end result," "unexpected surprise," "final conclusion" — all redundant',
      'Conciseness: always pick the option that says the same thing in fewer words',
      'Formal register: avoid slang, contractions, and vague words in academic writing',
      '"A lot of" → "numerous" | "Due to the fact that" → "Because"',
    ],
    diagramsToDraw: [
      'Parallel structure repair: write a broken example, then the corrected version beneath it',
      'Transition word chart: 4 categories (contrast, cause-effect, addition, sequence) × 3 words each',
    ],
    mustKnowFacts: [
      'Never use double comparatives: "more better" or "most fastest" are always wrong',
      'The most concise answer that preserves all meaning is always correct on the TEAS',
      '"However" = contrast; "Therefore" = cause-effect; don\'t swap these',
      'Redundancy test: "Can I delete this word/phrase without losing meaning?" Yes = delete it',
      'Formal writing avoids: really, pretty, kind of, a lot, stuff, things, you know',
    ],
  },

  'vocabulary-writing': {
    simplify: `TEAS Vocabulary doesn't require memorizing a word list — it tests whether you can figure out word meanings from context clues in the passage. You also need to know the most common medical prefixes and suffixes (brady-, tachy-, hypo-, hyper-, -itis, -ectomy, -ology). Knowing these roots makes unknown medical terms guessable.`,
    nursingNewbie: `You will see thousands of medical terms you've never encountered before as a nursing student. The good news: almost every medical word is built from a small set of Latin and Greek roots. Hypo = low, hyper = high, brady = slow, tachy = fast. Once you know these, "bradycardia" (slow heart), "hypertension" (high blood pressure), and "hypoglycemia" (low blood sugar) become instantly readable — no memorization needed.`,
    notebookKeys: [
      'Context clue types: Definition ("X, or..."), Synonym (similar word nearby), Antonym (opposite clue), Example ("such as...")',
      'Antonym clue signal words: but, however, unlike, although, instead, yet',
      'Brady- = slow | Tachy- = fast | Hypo- = below/under | Hyper- = above/over',
      'A-/An- = without (anemia = without blood) | -itis = inflammation | -ectomy = surgical removal',
      '-ology = study of | -pathy = disease | -algia = pain | -plasty = surgical repair',
      'Denotation = literal dictionary definition | Connotation = emotional associations',
      'Writing process: Prewriting → Drafting → Revising (big picture) → Editing (grammar)',
      'For vocabulary questions: substitute each answer choice back into the sentence',
    ],
    diagramsToDraw: [
      'Medical root tree: write the root in the center, branch out to 3 words using it',
      'Vocabulary context clue diagram: unknown word in center → circle the 4 types of clues around it',
    ],
    mustKnowFacts: [
      '"Cheap" and "economical" have the same denotation but different connotations ("economical" is positive)',
      'Tachycardia = fast heart (>100 bpm) | Bradycardia = slow heart (<60 bpm)',
      'Hypoglycemia = low blood sugar | Hyperglycemia = high blood sugar',
      'Ambulatory = able to walk (from "ambul-" = to walk)',
      'Analgesic = pain reliever (analgesia = without pain sensation)',
    ],
  },
}

export function getAIContent(topicId) {
  return AI_CONTENT[topicId] || null
}
