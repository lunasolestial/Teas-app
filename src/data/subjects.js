export const CPCC_GOALS = {
  overall: 80,
  competitive: 75,
  reading: 80,
  math: 70,
  science: 75,
  english: 75,
}

export const SUBJECTS = [
  {
    id: 'reading',
    name: 'Reading',
    color: 'blue',
    icon: '📖',
    goal: 80,
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-700',
    badgeClass: 'bg-blue-100 text-blue-800',
    barClass: 'bg-blue-500',
    topics: [
      {
        id: 'key-ideas',
        name: 'Key Ideas and Details',
        subjectId: 'reading',
        description: 'Identify main ideas, supporting details, and draw inferences from text.',
        lesson: `Key Ideas and Details covers your ability to understand what a passage is mainly about and identify evidence that supports that idea.

**Main Idea** is the central point the author wants to communicate. It is broader than any single detail and is supported by most of the passage.

**Supporting Details** are specific facts, examples, or explanations that back up the main idea. They answer who, what, when, where, or how.

**Inference** means reading between the lines — using clues in the text plus your background knowledge to draw a conclusion the author implies but doesn't state outright.

**Summary** is a brief restatement of the most important ideas using your own words.

On the TEAS, passages come from nursing/health topics, science, social studies, and general nonfiction. You will never need outside knowledge — all answers come from the passage.`,
        keyTerms: [
          { term: 'Main idea', definition: 'The central message or point of a passage, broader than any single detail.' },
          { term: 'Supporting detail', definition: 'Specific information that develops or proves the main idea.' },
          { term: 'Inference', definition: 'A conclusion drawn from text clues + logic, not stated directly.' },
          { term: 'Summary', definition: 'A condensed restatement of the key points of a passage.' },
          { term: 'Theme', definition: 'An underlying message about life or human experience.' },
          { term: 'Explicit information', definition: 'Directly stated facts in the passage.' },
          { term: 'Implicit information', definition: 'Information suggested but not directly stated.' },
        ],
        traps: [
          'Choosing an answer that is true but too specific (a supporting detail, not the main idea).',
          'Choosing an answer that sounds good but goes beyond what the passage says (outside knowledge trap).',
          'Confusing a topic sentence with the main idea — the main idea covers the whole passage.',
          'Picking an inference that requires too much assumption beyond what the text provides.',
        ],
        memoryTips: [
          '"Main idea = umbrella" — it covers every paragraph. Details are what get wet under it.',
          'For inference questions, ask: "What must be true based ONLY on what I read?"',
          'If an answer choice mentions something not in the passage at all, eliminate it.',
          'Try to state the main idea in your own words before looking at answer choices.',
        ],
        videos: [
          { id: 'vid-ki-1', channel: 'Nurse Cheung', title: '2025 ATI TEAS 7 Reading – Key Ideas & Details Study Guide (Part 1)', watchTime: '20 min', watchOrder: 1, description: 'Strategies for identifying main idea, supporting details, and making inferences on the TEAS.', embedUrl: 'https://www.youtube.com/embed/loEKzUjiVLQ', youtubeId: 'loEKzUjiVLQ', searchQuery: 'TEAS Reading Key Ideas Details Study Guide Nurse Cheung 2025' },
          { id: 'vid-ki-2', channel: 'Nurse Cheung', title: '2024 ATI TEAS 7 Reading – Key Ideas & Details Study Guide (Part 2)', watchTime: '34 min', watchOrder: 2, description: 'Continued reading comprehension practice with passage analysis and inference strategies for the TEAS.', embedUrl: 'https://www.youtube.com/embed/2FF3stl0oew', youtubeId: '2FF3stl0oew', searchQuery: 'TEAS Reading Key Ideas Details Study Guide Part 2 Nurse Cheung' },
        ],
      },
      {
        id: 'craft-structure',
        name: 'Craft and Structure',
        subjectId: 'reading',
        description: "Analyze author's purpose, text structure, vocabulary in context, and point of view.",
        lesson: `Craft and Structure tests your ability to analyze HOW and WHY an author wrote something — not just WHAT they wrote.

**Author's Purpose** falls into three main categories:
- **Inform/Explain**: presents facts and information (textbooks, news articles)
- **Persuade**: tries to convince the reader of a viewpoint (editorials, opinion pieces)
- **Entertain**: tells a story or creates an emotional response (fiction, narrative essays)

**Text Structure** is how the author organizes information:
- Cause and Effect: explains why something happens
- Compare and Contrast: highlights similarities and differences
- Problem and Solution: presents an issue and a resolution
- Sequence/Chronological: events in time order
- Description: detailed explanation of a topic

**Vocabulary in Context**: figure out what a word means based on the surrounding sentences and paragraph — not memorized definitions.

**Point of View**:
- First person (I/we): narrator is in the story
- Third person limited: narrator knows one character's thoughts
- Third person omniscient: narrator knows all characters' thoughts`,
        keyTerms: [
          { term: "Author's purpose", definition: 'The reason an author writes — to inform, persuade, or entertain.' },
          { term: 'Text structure', definition: 'The organizational pattern of a passage (cause-effect, sequence, etc.).' },
          { term: 'Context clues', definition: 'Words or phrases surrounding an unfamiliar word that hint at its meaning.' },
          { term: 'Tone', definition: "The author's attitude toward the subject (formal, sarcastic, hopeful, etc.)." },
          { term: 'Point of view', definition: 'The perspective from which a story or passage is told.' },
          { term: 'Bias', definition: 'A one-sided perspective that favors one viewpoint over another.' },
          { term: 'Connotation', definition: 'The emotional associations of a word beyond its literal meaning.' },
        ],
        traps: [
          'Confusing the topic of a passage with the author\'s purpose.',
          'Choosing "entertain" just because the passage has a story — check if it\'s mainly trying to inform.',
          'Picking a vocabulary answer based on memorized definitions rather than context.',
          'Missing signal words that reveal text structure (however, therefore, first/then/finally).',
        ],
        memoryTips: [
          'Signal words: "because/so/as a result" = cause-effect; "however/but/unlike" = compare-contrast.',
          'For author\'s purpose: PIE = Persuade, Inform, Entertain.',
          'For vocabulary questions, substitute each answer choice back into the sentence — which one makes the most sense?',
          'Tone clue: look at adjectives and verbs the author chooses — they reveal attitude.',
        ],
        videos: [
          { id: 'vid-cs-1', channel: 'Nurse Cheung', title: 'TEAS Reading Review Series – Author\'s Purpose, Text Structure & Tone', watchTime: '18 min', watchOrder: 1, description: "How to identify author's purpose (PIE), recognize text structure patterns, and analyze tone.", embedUrl: 'https://www.youtube.com/embed/4uCg9sIly9w', youtubeId: '4uCg9sIly9w', searchQuery: 'TEAS Reading Review Series Nurse Cheung author purpose text structure' },
          { id: 'vid-cs-2', channel: 'Nurse Cheung', title: 'ATI TEAS 7 Reading – Craft & Structure Practice', watchTime: '25 min', watchOrder: 2, description: 'Point of view, context vocabulary strategies, and text structure signal words for TEAS Reading.', embedUrl: 'https://www.youtube.com/embed/qUlIJZKO70E', youtubeId: 'qUlIJZKO70E', searchQuery: 'TEAS Reading Craft Structure Nurse Cheung practice' },
        ],
      },
      {
        id: 'integration-knowledge',
        name: 'Integration of Knowledge and Ideas',
        subjectId: 'reading',
        description: 'Evaluate arguments, integrate multiple sources, and assess evidence.',
        lesson: `Integration of Knowledge and Ideas is the most advanced reading skill on the TEAS. It asks you to think critically about what you read.

**Evaluating Arguments**: Can you identify the author's claim? Is the evidence logical and relevant? Are there logical fallacies?

**Primary vs Secondary Sources**:
- Primary: original research, first-hand accounts, raw data
- Secondary: summaries, analyses, or interpretations of primary sources

**Fact vs Opinion**:
- Fact: can be proven true or false
- Opinion: a belief or judgment; often contains words like "should," "best," "worst," "I believe"

**Comparing Multiple Texts**: You may see two short passages and need to identify how they agree, disagree, or complement each other.

**Visual Information**: Tables, graphs, charts, and diagrams may appear. Read the title, axes labels, and legend before answering questions.`,
        keyTerms: [
          { term: 'Argument', definition: 'A claim supported by reasons and evidence.' },
          { term: 'Claim', definition: 'The main point or position the author is arguing for.' },
          { term: 'Evidence', definition: 'Facts, data, or examples used to support a claim.' },
          { term: 'Logical fallacy', definition: 'An error in reasoning that weakens an argument.' },
          { term: 'Primary source', definition: 'An original, first-hand document or data.' },
          { term: 'Secondary source', definition: 'An analysis or interpretation of a primary source.' },
          { term: 'Fact', definition: 'A statement that can be verified as true or false.' },
          { term: 'Opinion', definition: 'A personal belief or judgment that cannot be objectively verified.' },
        ],
        traps: [
          'Treating an opinion stated confidently as a fact.',
          'Choosing evidence that is related to the topic but doesn\'t actually support the specific claim.',
          'Missing the difference between what a source says vs. what it implies.',
          'Ignoring chart/graph labels — always check what the axes represent before answering.',
        ],
        memoryTips: [
          'Opinion red flags: should, must, best, worst, always, never, I believe, I think.',
          'For graph questions, narrate the data in your head: "As X increases, Y decreases."',
          'Ask: "Does the evidence directly support THIS claim, or just something related?"',
          'Compare-passage questions: find one thing they AGREE on and one thing they DIFFER on first.',
        ],
        videos: [
          { id: 'vid-ik-1', channel: 'Nurse Cheung', title: 'TEAS 7 Reading Practice – Knowledge and Ideas', watchTime: '30 min', watchOrder: 1, description: 'How to evaluate arguments, distinguish facts from opinions, and interpret graphs and charts.', embedUrl: 'https://www.youtube.com/embed/j563nXu4WiU', youtubeId: 'j563nXu4WiU', searchQuery: 'TEAS Reading Integration Knowledge Arguments Nurse Cheung' },
          { id: 'vid-ik-2', channel: 'Nurse Cheung', title: 'ATI TEAS Reading v7 – Knowledge and Ideas Guide', watchTime: '22 min', watchOrder: 2, description: 'Primary vs secondary sources, comparing multiple texts, and logical fallacies on the TEAS.', embedUrl: 'https://www.youtube.com/embed/PfChMJu2Yv8', youtubeId: 'PfChMJu2Yv8', searchQuery: 'TEAS Reading Integration Knowledge Ideas Nurse Cheung guide' },
        ],
      },
    ],
  },
  {
    id: 'math',
    name: 'Math',
    color: 'purple',
    icon: '🔢',
    goal: 70,
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-700',
    badgeClass: 'bg-purple-100 text-purple-800',
    barClass: 'bg-purple-500',
    topics: [
      {
        id: 'numbers-algebra',
        name: 'Numbers and Algebra',
        subjectId: 'math',
        description: 'Fractions, decimals, percentages, ratios, proportions, and basic algebra.',
        lesson: `Numbers and Algebra is the largest Math section on TEAS v7. Focus on these core areas:

**Fractions**: Add/subtract (common denominator), multiply (straight across), divide (flip and multiply the second fraction).

**Decimals**: Line up decimal points for addition/subtraction. Multiply normally then count decimal places. To divide, move decimal to make the divisor a whole number.

**Percentages**:
- Percent of a number: multiply by the decimal (30% of 50 = 0.30 × 50 = 15)
- Percent change: (New − Old) ÷ Old × 100
- Convert: percent ↔ decimal (move decimal 2 places); percent ↔ fraction (put over 100)

**Ratios and Proportions**: Set up equal fractions and cross-multiply to solve.

**Algebra**: Solve for x by doing the same operation to both sides. Remember order of operations: PEMDAS (Parentheses, Exponents, Multiply/Divide left-to-right, Add/Subtract left-to-right).

**Dosage Calculations** appear on the TEAS! Use dimensional analysis:
(Desired ÷ Have) × Volume = Dose`,
        keyTerms: [
          { term: 'Numerator', definition: 'The top number of a fraction.' },
          { term: 'Denominator', definition: 'The bottom number of a fraction.' },
          { term: 'Proportion', definition: 'Two ratios set equal to each other.' },
          { term: 'Percent', definition: 'A ratio comparing a number to 100.' },
          { term: 'Variable', definition: 'A letter representing an unknown number.' },
          { term: 'Coefficient', definition: 'The number multiplied by a variable.' },
          { term: 'PEMDAS', definition: 'Order of operations: Parentheses, Exponents, Multiply, Divide, Add, Subtract.' },
          { term: 'Dimensional analysis', definition: 'A method of unit conversion by multiplying by conversion fractions.' },
        ],
        traps: [
          'Forgetting to find a common denominator before adding or subtracting fractions.',
          'Confusing percent increase with the new total (30% increase on 100 = 130, not 30).',
          'Dividing fractions incorrectly — always flip the SECOND fraction and multiply.',
          'Misreading "what percent OF X is Y" — set up Y/X × 100.',
          'Order of operations errors — always resolve parentheses first.',
        ],
        memoryTips: [
          'Fraction division: "Keep, Change, Flip" — keep first fraction, change ÷ to ×, flip second.',
          'Percent to decimal: "Percent has a party and moves 2 places to the left."',
          'Proportion solving: "If two fractions are equal, cross multiply to find the missing value."',
          'PEMDAS memory trick: "Please Excuse My Dear Aunt Sally."',
          'Dosage calc: "Desired over Have times Volume" — D/H × V.',
        ],
        videos: [
          { id: 'vid-na-1', channel: 'The Organic Chemistry Tutor', title: 'Fractions, Mixed Numbers, Decimals & Percents Review', watchTime: '45 min', watchOrder: 1, description: 'Complete walkthrough of fractions, decimals, percentages, ratios, and proportions for TEAS Math.', embedUrl: 'https://www.youtube.com/embed/Vb5c7ay0ziU', youtubeId: 'Vb5c7ay0ziU', searchQuery: 'TEAS Math Fractions Decimals Percentages Organic Chemistry Tutor' },
          { id: 'vid-na-2', channel: 'Nurse Cheung', title: 'Comprehensive 2025 ATI TEAS 7 Math Study Guide', watchTime: '28 min', watchOrder: 2, description: 'Numbers, algebra, and PEMDAS order of operations with TEAS-style practice problems.', embedUrl: 'https://www.youtube.com/embed/tpjx_nm4liY', youtubeId: 'tpjx_nm4liY', searchQuery: 'TEAS Math Numbers Algebra Nurse Cheung' },
          { id: 'vid-na-3', channel: 'RegisteredNurseRN', title: 'Dimensional Analysis for Nurses – Dosage Calculations', watchTime: '20 min', watchOrder: 3, description: 'Dimensional analysis and D/H × V method for nursing dosage calculation problems.', embedUrl: 'https://www.youtube.com/embed/6dyM2puXbgc', youtubeId: '6dyM2puXbgc', searchQuery: 'dosage calculation nursing dimensional analysis' },
        ],
      },
      {
        id: 'measurement-data',
        name: 'Measurement and Data',
        subjectId: 'math',
        description: 'Unit conversions, statistics (mean/median/mode), graphs, and probability.',
        lesson: `Measurement and Data covers real-world math skills nurses use every day.

**Unit Conversions** — know these cold:
- 1 kg = 2.2 lbs
- 1 inch = 2.54 cm
- 1 L = 1,000 mL
- 1 g = 1,000 mg
- 1 tsp = 5 mL; 1 tbsp = 15 mL
- 1 oz = 30 mL
- Metric prefixes: kilo(1000×), centi(÷100), milli(÷1000)

**Statistics**:
- **Mean** (average): sum all values ÷ number of values
- **Median**: middle value when sorted; if even count, average the two middle values
- **Mode**: value that appears most often
- **Range**: highest value − lowest value

**Graphs**: Line graphs show change over time. Bar graphs compare categories. Pie charts show parts of a whole. Always read labels carefully.

**Probability** = number of favorable outcomes ÷ total possible outcomes (expressed as a fraction, decimal, or percent).`,
        keyTerms: [
          { term: 'Mean', definition: 'The arithmetic average of a data set.' },
          { term: 'Median', definition: 'The middle value of an ordered data set.' },
          { term: 'Mode', definition: 'The value that occurs most frequently.' },
          { term: 'Range', definition: 'The difference between the highest and lowest values.' },
          { term: 'Probability', definition: 'The likelihood of an event occurring (0 to 1 or 0% to 100%).' },
          { term: 'Metric prefix', definition: 'A prefix indicating a power of 10 (kilo, centi, milli).' },
          { term: 'Conversion factor', definition: 'A fraction equal to 1 used to change units.' },
        ],
        traps: [
          'Calculating mean when the question asks for median (and vice versa).',
          'Forgetting to sort the data before finding the median.',
          'Confusing mg and mL — they are different units (mass vs volume).',
          'Probability: using the wrong total (must use ALL possible outcomes, not just the ones you want).',
          'Unit conversion: multiplying when you should divide, or vice versa.',
        ],
        memoryTips: [
          '"Mean = math" (you have to DO math to find the average). Median = middle. Mode = most.',
          'King Henry Died By Drinking Cold Milk: Kilo, Hecto, Deca, Base, Deci, Centi, Milli.',
          'For conversions, always set up so unwanted units cancel: (30 mL/1 oz) × (2 oz) = 60 mL.',
          'Probability check: all probabilities in a set must add to 1 (100%).',
        ],
        videos: [
          { id: 'vid-md-1', channel: 'The Organic Chemistry Tutor', title: 'Mean, Median, Mode, and Range – How To Find It!', watchTime: '38 min', watchOrder: 1, description: 'Statistics fundamentals: mean, median, mode, range, and probability with practice problems.', embedUrl: 'https://www.youtube.com/embed/A1mQ9kD-i9I', youtubeId: 'A1mQ9kD-i9I', searchQuery: 'mean median mode range statistics Organic Chemistry Tutor' },
          { id: 'vid-md-2', channel: 'Nurse Cheung', title: '2025 ATI TEAS 7 Math – Standard & Metric Conversions Study Guide', watchTime: '22 min', watchOrder: 2, description: 'Unit conversions (metric, household), reading graphs, and measurement problems for TEAS.', embedUrl: 'https://www.youtube.com/embed/C1tHmhBcLs8', youtubeId: 'C1tHmhBcLs8', searchQuery: 'TEAS Math Measurement Metric Conversions Study Guide Nurse Cheung 2025' },
        ],
      },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    color: 'green',
    icon: '🔬',
    goal: 75,
    bgClass: 'bg-green-50',
    borderClass: 'border-green-200',
    textClass: 'text-green-700',
    badgeClass: 'bg-green-100 text-green-800',
    barClass: 'bg-green-500',
    topics: [
      {
        id: 'anatomy-physiology',
        name: 'Human Anatomy and Physiology',
        subjectId: 'science',
        description: 'Body systems, organ functions, homeostasis, and physiological processes.',
        lesson: `Human A&P is the LARGEST science section on the TEAS. Master all major body systems.

**Cardiovascular System**: Heart pumps blood. Right side = deoxygenated blood to lungs. Left side = oxygenated blood to body. SA node (pacemaker) initiates heartbeat.

**Respiratory System**: Diaphragm contracts to inhale. O2 enters alveoli → blood. CO2 leaves blood → exhaled. Breathing rate is controlled by CO2 levels in the blood.

**Nervous System**: Central (brain + spinal cord) and Peripheral. Neurons transmit impulses via action potentials. Sympathetic = fight-or-flight. Parasympathetic = rest-and-digest.

**Musculoskeletal System**: 206 bones in adults. Skeletal muscle = voluntary. Smooth muscle = involuntary (organs). Cardiac muscle = heart only.

**Digestive System**: Mouth → Esophagus → Stomach → Small intestine (nutrient absorption) → Large intestine (water absorption) → Rectum/Anus.

**Urinary System**: Kidneys filter blood → urine. Nephron = functional unit. ADH controls water reabsorption. Kidneys regulate blood pressure via renin.

**Endocrine System**: Hormones regulate body functions. Key glands: pituitary (master gland), thyroid (metabolism), adrenal (cortisol, adrenaline), pancreas (insulin/glucagon).

**Homeostasis**: The body's tendency to maintain stable internal conditions via negative feedback loops.`,
        keyTerms: [
          { term: 'Homeostasis', definition: 'Maintenance of stable internal body conditions.' },
          { term: 'Negative feedback', definition: 'A mechanism that reverses a change to restore balance.' },
          { term: 'Alveoli', definition: 'Tiny air sacs in the lungs where gas exchange occurs.' },
          { term: 'Nephron', definition: 'The functional filtering unit of the kidney.' },
          { term: 'SA node', definition: 'The sinoatrial node — the heart\'s natural pacemaker.' },
          { term: 'Neuron', definition: 'A nerve cell that transmits electrical impulses.' },
          { term: 'Hormone', definition: 'A chemical messenger secreted by an endocrine gland.' },
          { term: 'Synapse', definition: 'The gap between two neurons where signals are transmitted via neurotransmitters.' },
        ],
        traps: [
          'Confusing systolic (contraction) and diastolic (relaxation) pressure.',
          'Mixing up sympathetic (fight-or-flight) and parasympathetic (rest-digest).',
          'Thinking the left side of the heart pumps to the lungs — it\'s the RIGHT side.',
          'Confusing exocrine (ducts to surface) with endocrine (hormones to blood) glands.',
          'Forgetting that breathing rate is controlled by CO2 levels, not O2 levels.',
        ],
        memoryTips: [
          '"Right side = Refresh" — right heart sends blood to lungs to get refreshed with oxygen.',
          'Sympathetic: think "sprinting" (fight or flight). Parasympathetic: think "peace and rest."',
          'Endocrine glands: "APAT" — Adrenal, Pituitary, Anterior pituitary, Thyroid.',
          'Digestion order: "Every Stomach Should Give Large Rectums" = Esophagus, Stomach, Small intestine, Gut/Large intestine, Rectum.',
        ],
        videos: [
          { id: 'vid-ap-1', channel: 'Nurse Cheung', title: 'Comprehensive 2025 ATI TEAS 7 Science – Anatomy & Physiology Study Guide', watchTime: '35 min', watchOrder: 1, description: 'All major body systems (cardiovascular, respiratory, nervous, digestive) for the TEAS Science section.', embedUrl: 'https://www.youtube.com/embed/C2GygTGx1WM', youtubeId: 'C2GygTGx1WM', searchQuery: 'Comprehensive 2025 TEAS 7 Science Anatomy Physiology Study Guide Nurse Cheung' },
          { id: 'vid-ap-2', channel: 'Nurse Cheung', title: '2025 ATI TEAS 7 Science – Anatomy & Physiology Respiratory System', watchTime: '30 min', watchOrder: 2, description: 'Respiratory system, gas exchange, diaphragm, and breathing mechanics for TEAS Science.', embedUrl: 'https://www.youtube.com/embed/EDLHPIQCx8s', youtubeId: 'EDLHPIQCx8s', searchQuery: '2025 TEAS 7 Science Anatomy Physiology Respiratory System Nurse Cheung' },
          { id: 'vid-ap-3', channel: 'Nurse Cheung', title: '2025 ATI TEAS 7 Science – A&P General Orientation & Body Planes', watchTime: '60 min', watchOrder: 3, description: 'Body planes, cavities, anatomical terms, and directional language for TEAS A&P.', embedUrl: 'https://www.youtube.com/embed/JJbckGFmaGE', youtubeId: 'JJbckGFmaGE', searchQuery: '2025 TEAS 7 Science Anatomy Physiology General Orientation Nurse Cheung' },
        ],
      },
      {
        id: 'biology',
        name: 'Biology',
        subjectId: 'science',
        description: 'Cell biology, genetics, DNA/RNA, mitosis, meiosis, and ecology basics.',
        lesson: `Biology on the TEAS covers cell structure, genetics, and basic life processes.

**Cell Structure**:
- **Nucleus**: contains DNA, controls cell activities
- **Mitochondria**: "powerhouse" — produces ATP via cellular respiration
- **Ribosome**: makes proteins
- **Cell membrane**: controls what enters/leaves (selective permeability)
- **Endoplasmic reticulum**: rough ER (protein synthesis), smooth ER (lipid synthesis)
- **Golgi apparatus**: packages and ships proteins

**Cell Division**:
- **Mitosis**: produces 2 identical diploid cells (growth and repair). Phases: Prophase, Metaphase, Anaphase, Telophase (PMAT).
- **Meiosis**: produces 4 unique haploid cells (sex cells). Two divisions.

**DNA and Protein Synthesis**:
- DNA → RNA (transcription in nucleus) → Protein (translation at ribosome)
- DNA base pairs: A-T, G-C (in DNA); A-U, G-C (in RNA)

**Genetics**:
- Dominant allele (capital letter) masks recessive (lowercase)
- Genotype = genetic makeup; Phenotype = physical expression
- Punnett squares predict offspring ratios`,
        keyTerms: [
          { term: 'Mitosis', definition: 'Cell division producing 2 identical diploid daughter cells.' },
          { term: 'Meiosis', definition: 'Cell division producing 4 haploid sex cells (gametes).' },
          { term: 'DNA', definition: 'Deoxyribonucleic acid — the molecule that carries genetic information.' },
          { term: 'Transcription', definition: 'Copying DNA into mRNA in the nucleus.' },
          { term: 'Translation', definition: 'Using mRNA to build a protein at the ribosome.' },
          { term: 'Dominant allele', definition: 'An allele that is expressed when present (even one copy).' },
          { term: 'Recessive allele', definition: 'An allele expressed only when two copies are present.' },
          { term: 'ATP', definition: 'Adenosine triphosphate — the cell\'s energy currency.' },
        ],
        traps: [
          'Thinking mitosis produces sex cells — that\'s meiosis.',
          'Confusing transcription (DNA→RNA) with translation (RNA→Protein).',
          'RNA uses Uracil (U) instead of Thymine (T) — don\'t forget this difference.',
          'Heterozygous dominant (Aa) shows the same phenotype as homozygous dominant (AA).',
        ],
        memoryTips: [
          'PMAT for mitosis phases: "Poor Men Are Tired."',
          'Mitosis = Making Two (identical); Meiosis = Making Eggs and sperm (sex cells).',
          '"DNA goes to the mall (nucleus), sends a message (mRNA), gets translated at the checkout (ribosome)."',
          'Dominant = capital D = Dominates. Recessive = lowercase r = recedes/hides.',
        ],
        videos: [
          { id: 'vid-bio-1', channel: 'The Organic Chemistry Tutor', title: 'Mitosis vs Meiosis', watchTime: '50 min', watchOrder: 1, description: 'Cell organelles, mitosis vs meiosis, DNA replication, and protein synthesis for the TEAS.', embedUrl: 'https://www.youtube.com/embed/bRcjB11hDCU', youtubeId: 'bRcjB11hDCU', searchQuery: 'cell biology mitosis meiosis TEAS Organic Chemistry Tutor' },
          { id: 'vid-bio-2', channel: 'The Organic Chemistry Tutor', title: 'Transcription and Translation – Protein Synthesis From DNA', watchTime: '28 min', watchOrder: 2, description: 'Genetics fundamentals: Punnett squares, dominant/recessive alleles, and DNA transcription/translation.', embedUrl: 'https://www.youtube.com/embed/8wAwLwJAGHs', youtubeId: '8wAwLwJAGHs', searchQuery: 'TEAS Biology DNA transcription translation Organic Chemistry Tutor' },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        subjectId: 'science',
        description: 'Atomic structure, chemical bonds, pH scale, reactions, and the periodic table.',
        lesson: `Chemistry on the TEAS tests foundational concepts relevant to nursing pharmacology and physiology.

**Atomic Structure**:
- Atom = protons (positive, nucleus) + neutrons (neutral, nucleus) + electrons (negative, orbit)
- Atomic number = number of protons
- Mass number = protons + neutrons
- Isotopes = same element, different number of neutrons

**The Periodic Table**:
- Elements organized by atomic number
- Groups (columns) share chemical properties
- Periods (rows) = number of electron shells
- Metals (left/center), metalloids (staircase), nonmetals (right)

**Chemical Bonds**:
- **Ionic**: electron transfer between metal and nonmetal (NaCl)
- **Covalent**: electron sharing between nonmetals (H₂O)
- **Hydrogen bond**: weak attraction important in DNA and water

**pH Scale**: 0–14. Below 7 = acidic. 7 = neutral. Above 7 = basic (alkaline).
- Blood pH is 7.35–7.45 (slightly basic). This is critical for nursing!
- Acids donate H⁺ ions. Bases accept H⁺ ions.

**Chemical Reactions**: Reactants → Products. Law of Conservation of Mass: atoms are neither created nor destroyed.`,
        keyTerms: [
          { term: 'Atomic number', definition: 'The number of protons in an atom; defines the element.' },
          { term: 'Isotope', definition: 'Atoms of the same element with different numbers of neutrons.' },
          { term: 'Ionic bond', definition: 'A bond formed by the transfer of electrons from metal to nonmetal.' },
          { term: 'Covalent bond', definition: 'A bond formed by sharing electrons between nonmetals.' },
          { term: 'pH scale', definition: 'A scale from 0–14 measuring acidity/basicity; 7 is neutral.' },
          { term: 'Acid', definition: 'A substance that donates H⁺ ions; pH < 7.' },
          { term: 'Base', definition: 'A substance that accepts H⁺ ions; pH > 7.' },
          { term: 'Reactant', definition: 'A starting substance in a chemical reaction.' },
        ],
        traps: [
          'Thinking a lower pH is more basic — lower pH = MORE acidic.',
          'Confusing atomic number (protons) with mass number (protons + neutrons).',
          'Forgetting blood is slightly basic (7.35–7.45), not neutral (7.0).',
          'Thinking isotopes are different elements — they are the same element, just different mass.',
        ],
        memoryTips: [
          'pH below 7 = acid (think vinegar, lemon = sour = acidic). Above 7 = base (baking soda).',
          '"Ionic = I give" — the metal gives away electrons.',
          '"Covalent = COoperating" — atoms share electrons cooperatively.',
          'Atomic number = # of protons = the element\'s "ID number" on the periodic table.',
        ],
        videos: [
          { id: 'vid-chem-1', channel: 'The Organic Chemistry Tutor', title: 'Acids and Bases Review – General Chemistry', watchTime: '42 min', watchOrder: 1, description: 'pH scale, atomic structure, periodic table, ionic vs covalent bonds, and chemical reactions for TEAS.', embedUrl: 'https://www.youtube.com/embed/hmGPK0cuO7o', youtubeId: 'hmGPK0cuO7o', searchQuery: 'TEAS Chemistry pH Atomic Structure Chemical Bonds Organic Chemistry Tutor' },
          { id: 'vid-chem-2', channel: 'Nurse Cheung', title: 'Comprehensive 2026 ATI TEAS 7 – Life & Physical Science Study Guide', watchTime: '25 min', watchOrder: 2, description: 'Acid-base balance, pH and blood pH relevance, and key chemistry concepts used in nursing practice.', embedUrl: 'https://www.youtube.com/embed/TKb8SbmrMFc', youtubeId: 'TKb8SbmrMFc', searchQuery: 'Comprehensive 2026 TEAS 7 Life Physical Science Study Guide Nurse Cheung' },
        ],
      },
      {
        id: 'scientific-reasoning',
        name: 'Scientific Reasoning',
        subjectId: 'science',
        description: 'Scientific method, experimental design, variables, data interpretation.',
        lesson: `Scientific Reasoning tests your ability to think like a scientist — understand how research is designed and evaluated.

**Scientific Method**:
1. Observation / Question
2. Hypothesis (testable, falsifiable prediction)
3. Experiment (test the hypothesis)
4. Data collection and analysis
5. Conclusion (support or refute hypothesis)

**Experimental Design**:
- **Independent variable (IV)**: what the researcher changes/manipulates
- **Dependent variable (DV)**: what is measured/observed
- **Control variable**: factors kept the same to ensure a fair test
- **Control group**: the group that receives no treatment (baseline)
- **Experimental group**: the group that receives the treatment

**Hypothesis format**: "If [IV], then [DV] because [reason]."

**Data Interpretation**:
- Look for trends, not individual data points
- Correlation ≠ causation
- A valid conclusion must be supported by the data presented — no outside assumptions

**Good Science**: Reproducible, peer-reviewed, uses large sample sizes, randomized, blinded when possible.`,
        keyTerms: [
          { term: 'Hypothesis', definition: 'A testable, falsifiable prediction about the relationship between variables.' },
          { term: 'Independent variable', definition: 'The variable deliberately changed by the researcher.' },
          { term: 'Dependent variable', definition: 'The variable measured in response to the independent variable.' },
          { term: 'Control group', definition: 'The group that receives no treatment; used as a baseline.' },
          { term: 'Controlled variables', definition: 'Factors held constant to ensure only one variable is tested.' },
          { term: 'Reproducibility', definition: 'The ability of an experiment to produce the same results when repeated.' },
          { term: 'Correlation', definition: 'A statistical relationship between two variables (does not imply causation).' },
        ],
        traps: [
          'Choosing a conclusion that goes beyond what the data shows.',
          'Confusing correlation with causation — two things happening together doesn\'t mean one causes the other.',
          'Identifying the wrong variable as independent vs dependent.',
          'A hypothesis that is not falsifiable is NOT a scientific hypothesis.',
        ],
        memoryTips: [
          'IV = I manipulate; DV = depends on what I did. "I Do." (IV → DV)',
          'A conclusion must stay within the data: "The data SHOWS that…" — never "This PROVES forever that…"',
          'Control group = the "do nothing" group — it shows what happens without the treatment.',
          'Good hypothesis: testable (can design experiment for it) + falsifiable (could be proven wrong).',
        ],
        videos: [
          { id: 'vid-sr-1', channel: 'Nurse Cheung', title: 'Comprehensive 2025 ATI TEAS 7 Science Scientific Reasoning Study Guide', watchTime: '28 min', watchOrder: 1, description: 'Independent/dependent variables, control groups, hypothesis writing, and data interpretation for TEAS.', embedUrl: 'https://www.youtube.com/embed/aMsfRnZ1yaM', youtubeId: 'aMsfRnZ1yaM', searchQuery: 'scientific method experimental design variables TEAS Nurse Cheung' },
          { id: 'vid-sr-2', channel: 'Nurse Cheung', title: 'TEAS 7 Science – Scientific Reasoning Most Common Questions', watchTime: '20 min', watchOrder: 2, description: 'How to draw valid conclusions, avoid logical errors, and evaluate study designs on the TEAS.', embedUrl: 'https://www.youtube.com/embed/4NCrs6Txmqk', youtubeId: '4NCrs6Txmqk', searchQuery: 'TEAS Science Scientific Reasoning Method Nurse Cheung' },
        ],
      },
    ],
  },
  {
    id: 'english',
    name: 'English',
    color: 'yellow',
    icon: '✍️',
    goal: 75,
    bgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-200',
    textClass: 'text-yellow-700',
    badgeClass: 'bg-yellow-100 text-yellow-800',
    barClass: 'bg-yellow-400',
    topics: [
      {
        id: 'conventions-english',
        name: 'Conventions of Standard English',
        subjectId: 'english',
        description: 'Grammar, punctuation, sentence structure, subject-verb agreement, and mechanics.',
        lesson: `Conventions of Standard English tests grammar and punctuation rules used in formal writing.

**Subject-Verb Agreement**: Singular subjects take singular verbs. Plural subjects take plural verbs.
- "The team IS playing" (team = collective singular)
- "Each of the nurses IS responsible" (each = singular)

**Pronoun-Antecedent Agreement**: A pronoun must match its antecedent in number and gender.
- Wrong: "Everyone should bring their book." → Right: "Everyone should bring his or her book." (though "their" is now widely accepted)

**Punctuation Rules**:
- **Comma**: Before coordinating conjunctions (FANBOYS: For, And, Nor, But, Or, Yet, So) joining two independent clauses.
- **Semicolon**: Joins two independent clauses without a conjunction.
- **Colon**: Introduces a list or explanation after an independent clause.
- **Apostrophe**: Possession (cat's) and contractions (it's = it is). "Its" = possessive, no apostrophe.

**Sentence Errors**:
- **Fragment**: incomplete sentence (missing subject or verb)
- **Run-on**: two independent clauses joined without proper punctuation
- **Comma splice**: two independent clauses joined with only a comma`,
        keyTerms: [
          { term: 'Subject-verb agreement', definition: 'Subjects and verbs must match in number (singular/plural).' },
          { term: 'Fragment', definition: 'An incomplete sentence missing a subject, verb, or complete thought.' },
          { term: 'Run-on sentence', definition: 'Two or more independent clauses improperly joined.' },
          { term: 'Comma splice', definition: 'Two independent clauses joined with only a comma (incorrect).' },
          { term: 'Coordinating conjunction', definition: 'FANBOYS: For, And, Nor, But, Or, Yet, So.' },
          { term: 'Antecedent', definition: 'The noun that a pronoun refers back to.' },
          { term: 'Collective noun', definition: 'A noun referring to a group as a single unit (team, class, staff).' },
        ],
        traps: [
          '"Either/or" and "neither/nor": verb agrees with the CLOSER subject.',
          '"It\'s" = it is (contraction). "Its" = belonging to it (possessive — no apostrophe).',
          'Collective nouns (team, jury, committee) are usually singular in American English.',
          'A phrase between subject and verb can confuse you — cross it out to check agreement.',
        ],
        memoryTips: [
          'FANBOYS = For, And, Nor, But, Or, Yet, So (coordinating conjunctions).',
          '"It\'s" test: replace with "it is." If it makes sense, use it\'s. Otherwise, use its.',
          'For comma splice fix options: add a period, add a semicolon, or add a conjunction.',
          'Fragment check: Can it stand alone as a complete thought with a subject and verb?',
        ],
        videos: [
          { id: 'vid-ce-1', channel: 'Nurse Cheung', title: 'ATI TEAS Version 7 Conventions of English (How to Get the Perfect Score)', watchTime: '40 min', watchOrder: 1, description: 'Subject-verb agreement, comma rules, semicolons, apostrophes, fragments and run-ons for TEAS English.', embedUrl: 'https://www.youtube.com/embed/Prjayot6jPI', youtubeId: 'Prjayot6jPI', searchQuery: 'TEAS English grammar punctuation subject verb agreement Nurse Cheung' },
          { id: 'vid-ce-2', channel: 'Nurse Cheung', title: 'Comprehensive 2026 ATI TEAS 7 – English & Language Usage Study Guide', watchTime: '22 min', watchOrder: 2, description: 'Common grammar traps, FANBOYS conjunctions, pronoun agreement, and sentence structure rules.', embedUrl: 'https://www.youtube.com/embed/b_QfSD-4EHU', youtubeId: 'b_QfSD-4EHU', searchQuery: 'Comprehensive 2026 TEAS 7 English Language Usage Study Guide Nurse Cheung' },
        ],
      },
      {
        id: 'knowledge-language',
        name: 'Knowledge of Language',
        subjectId: 'english',
        description: 'Style, tone, precise word choice, transitions, and revision strategies.',
        lesson: `Knowledge of Language tests your ability to use language effectively — not just correctly, but well.

**Style and Tone**:
- Formal writing uses complete sentences, avoids slang, and maintains consistent tone.
- Informal writing may use contractions and colloquial expressions.
- The TEAS almost always asks about formal, academic writing.

**Conciseness**: Eliminate redundant words. "The reason is because" → "The reason is that" or just "Because." "At this point in time" → "Now."

**Transition Words** signal relationships between ideas:
- Addition: furthermore, moreover, in addition, also
- Contrast: however, nevertheless, on the other hand, yet
- Cause/Effect: therefore, thus, consequently, as a result
- Example: for instance, for example, specifically
- Summary: in conclusion, in summary, to summarize

**Sentence Combining**: Combine choppy sentences using conjunctions, relative clauses, or participial phrases for smoother flow.

**Parallelism**: Items in a list must be in the same grammatical form.
- Wrong: "She likes running, to swim, and dance."
- Right: "She likes running, swimming, and dancing."`,
        keyTerms: [
          { term: 'Conciseness', definition: 'Expressing ideas clearly with no unnecessary words.' },
          { term: 'Parallelism', definition: 'Using the same grammatical structure for items in a list or series.' },
          { term: 'Transition', definition: 'A word or phrase that connects ideas and shows their relationship.' },
          { term: 'Tone', definition: "The author's attitude toward the subject as expressed through word choice." },
          { term: 'Redundancy', definition: 'Unnecessary repetition of the same idea using different words.' },
          { term: 'Revision', definition: 'Improving writing by reorganizing, clarifying, or refining content.' },
          { term: 'Diction', definition: 'Word choice — selecting the most precise word for the context.' },
        ],
        traps: [
          'Choosing "more better" or "most fastest" — never use double comparatives.',
          'Misidentifying the best transition — match the logical relationship, not just the position.',
          'Parallelism errors: mixing verb forms in a list (to run, swimming, danced).',
          'Wordy choices are always wrong on the TEAS — always pick the most concise correct option.',
        ],
        memoryTips: [
          'Redundancy test: "Can I say the same thing with fewer words without losing meaning?"',
          'Parallel structure: all items in a list should use the same -ing, to+verb, or noun form.',
          'Transition logic: contrast = however/but; sequence = then/next; cause = therefore/so.',
          'When revising, ask: "Is this sentence clear? Is it concise? Does it flow with context?"',
        ],
        videos: [
          { id: 'vid-kl-1', channel: 'Nurse Cheung', title: 'ATI TEAS Version 7 – English Knowledge of Language (How to Get the Perfect Score)', watchTime: '20 min', watchOrder: 1, description: 'Conciseness, parallel structure, transition words, and formal vs informal writing style for TEAS.', embedUrl: 'https://www.youtube.com/embed/N2Y4dxB0XyA', youtubeId: 'N2Y4dxB0XyA', searchQuery: 'ATI TEAS Version 7 English Knowledge of Language How to Get Perfect Score Nurse Cheung' },
          { id: 'vid-kl-2', channel: 'Nurse Cheung', title: 'TEAS English – Sentence Structures Review Series', watchTime: '35 min', watchOrder: 2, description: 'In-depth review of parallel structure, redundancy, sentence combining, and choosing precise words.', embedUrl: 'https://www.youtube.com/embed/tJPLhvkzQJE', youtubeId: 'tJPLhvkzQJE', searchQuery: 'TEAS English parallelism transitions sentence structure Nurse Cheung' },
        ],
      },
      {
        id: 'vocabulary-writing',
        name: 'Vocabulary and Writing',
        subjectId: 'english',
        description: 'Context clues, word roots/prefixes/suffixes, synonyms, and writing process.',
        lesson: `Vocabulary on the TEAS tests your ability to figure out word meanings from context — not memorize a word list.

**Context Clues** strategies:
- **Definition**: The word is directly defined. "Hypertension, or high blood pressure, affects millions."
- **Synonym**: A similar word nearby. "The patient was lethargic; she had been fatigued all week."
- **Antonym/Contrast**: An opposite clue. "Unlike her anxious sister, Maria was sanguine about the results."
- **Example**: An example clarifies meaning. "Analgesics, such as ibuprofen and acetaminophen, relieve pain."

**Common Medical Prefixes**:
- a-/an- = without (anemia = without blood)
- brady- = slow (bradycardia = slow heart)
- tachy- = fast (tachycardia = fast heart)
- hypo- = below (hypoglycemia = low blood sugar)
- hyper- = above (hypertension = high blood pressure)
- -itis = inflammation (gastritis = stomach inflammation)
- -ectomy = surgical removal (appendectomy)
- -ology = study of (cardiology)
- -pathy = disease (neuropathy)

**Writing Process**: Prewriting → Drafting → Revising (big picture) → Editing (grammar/mechanics) → Publishing`,
        keyTerms: [
          { term: 'Context clue', definition: 'Information in surrounding text that helps determine a word\'s meaning.' },
          { term: 'Prefix', definition: 'A word part added to the beginning of a root to modify its meaning.' },
          { term: 'Suffix', definition: 'A word part added to the end of a root to modify its meaning.' },
          { term: 'Root word', definition: 'The base of a word that carries its core meaning.' },
          { term: 'Denotation', definition: 'The literal, dictionary definition of a word.' },
          { term: 'Connotation', definition: 'The emotional or cultural associations attached to a word.' },
          { term: 'Synonym', definition: 'A word with the same or similar meaning as another word.' },
          { term: 'Antonym', definition: 'A word with the opposite meaning of another word.' },
        ],
        traps: [
          'Choosing a synonym that fits in general but doesn\'t match the specific context.',
          'Confusing denotation and connotation — "cheap" and "economical" have the same denotation but different connotations.',
          'Missing antonym clues — words like "unlike," "however," "instead" signal contrast (opposite meaning).',
          'Memorized definitions that don\'t match the contextual use — always use the passage.',
        ],
        memoryTips: [
          'Brady = slow (think "Brady Bunch" moves slowly). Tachy = fast (like "tacky" — quickly done).',
          'Hypo = below/under (hypodermic = under skin). Hyper = above/over (hyperactive).',
          '-itis always means inflammation. Whenever you see it, think swelling, redness, pain.',
          'Context clue type = contrast: look for "but, however, unlike, although, yet" near the unknown word.',
        ],
        videos: [
          { id: 'vid-vw-1', channel: 'Nurse Cheung', title: 'ATI TEAS Version 7 – English Vocabulary Acquisition (How to Get the Perfect Score)', watchTime: '25 min', watchOrder: 1, description: 'Context clue strategies and high-yield medical prefixes (brady-, tachy-, hypo-, hyper-) for TEAS English.', embedUrl: 'https://www.youtube.com/embed/2GYUcqPyqMA', youtubeId: '2GYUcqPyqMA', searchQuery: 'ATI TEAS Version 7 English Vocabulary Acquisition How to Get Perfect Score Nurse Cheung' },
          { id: 'vid-vw-2', channel: 'RegisteredNurseRN', title: 'Medical Terminology Prefixes for Nursing', watchTime: '30 min', watchOrder: 2, description: 'Roots, prefixes, suffixes used in nursing (–itis, –ectomy, –ology, –pathy) with practice questions.', embedUrl: 'https://www.youtube.com/embed/uewRr2YU6pQ', youtubeId: 'uewRr2YU6pQ', searchQuery: 'medical terminology prefixes suffixes nursing RegisteredNurseRN' },
        ],
      },
    ],
  },
]

export const getAllTopics = () => SUBJECTS.flatMap((s) => s.topics)
export const getSubjectById = (id) => SUBJECTS.find((s) => s.id === id)
export const getTopicById = (id) => getAllTopics().find((t) => t.id === id)
export const getTopicSubject = (topicId) => SUBJECTS.find((s) => s.topics.some((t) => t.id === topicId))
