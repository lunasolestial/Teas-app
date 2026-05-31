# TEAS v7 Study App

React + Tailwind study app for ATI TEAS v7, targeting CPCC nursing program admission.

## Run
```
npm run dev    # dev server at localhost:5173
npm run build  # production build
```

## Stack
- Vite + React 18 + React Router v6
- Tailwind CSS v3
- localStorage only — no backend

## Structure
```
src/
  data/
    subjects.js     # 4 subjects, 12 topics — lessons, key terms, traps, memory tips, video links
    questions.js    # 120 TEAS-style questions (10 per topic) with explanations
  hooks/
    useProgress.js  # localStorage state — quiz history, topic scores, streak
  utils/
    scoring.js      # mastery levels, CPCC readiness, weak/strong topics
  components/
    Layout.jsx      # responsive nav sidebar + mobile header
    ProgressBar.jsx
    MasteryBadge.jsx
  pages/
    Dashboard.jsx   # overall score, subject progress, CPCC readiness, recommendations
    Subjects.jsx    # subject/topic list with mastery
    TopicDetail.jsx # lesson, key terms, traps, memory tips, videos, notes
    Quiz.jsx        # 10-question quiz (by topic / subject / random)
    Results.jsx     # score + full question review
    ProgressTracker.jsx  # all stats, topic mastery, quiz history, recommendations
```

## CPCC Score Goals
- Overall: 80%+  |  Competitive minimum: 75%+
- Reading: 80%  |  Math: 70%  |  Science: 75%  |  English: 75%

## Mastery Scale
90–100% Mastered · 80–89% Strong · 70–79% Light Review · 60–69% Weak · <60% Priority Review

## Subjects & Topics
- **Reading**: Key Ideas & Details, Craft & Structure, Integration of Knowledge
- **Math**: Numbers & Algebra, Measurement & Data
- **Science**: Human A&P, Biology, Chemistry, Scientific Reasoning
- **English**: Conventions, Knowledge of Language, Vocabulary & Writing

## Adding Content
- New questions: add to `src/data/questions.js`, follow the existing object shape
- New topics: add to `src/data/subjects.js` inside the correct subject's `topics` array
