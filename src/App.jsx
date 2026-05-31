import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FocusModeProvider } from './contexts/FocusMode'
import Layout from './components/Layout'
import SplashScreen from './components/SplashScreen'
import OnboardingModal, { useOnboarding } from './components/OnboardingModal'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import TopicDetail from './pages/TopicDetail'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import ProgressTracker from './pages/ProgressTracker'
import VideoHub from './pages/VideoHub'
import Review from './pages/Review'
import ClipsPage from './pages/ClipsPage'
import SchoolProfile from './pages/SchoolProfile'
import StudyStudio from './pages/StudyStudio'

// Show splash once per browser session
const SPLASH_KEY = 'teas_splash_shown'
const showSplash = !sessionStorage.getItem(SPLASH_KEY)
if (showSplash) sessionStorage.setItem(SPLASH_KEY, '1')

function AppContent() {
  const [splashDone, setSplashDone] = useState(!showSplash)
  const { needsOnboarding } = useOnboarding()
  const [onboardingOpen, setOnboardingOpen] = useState(false)

  // Open onboarding only after splash has finished
  function handleSplashDone() {
    setSplashDone(true)
    if (needsOnboarding) setOnboardingOpen(true)
  }

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      {splashDone && onboardingOpen && (
        <OnboardingModal onClose={() => setOnboardingOpen(false)} />
      )}

      <Layout>
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/subjects"  element={<Subjects />} />
          <Route path="/subjects/:subjectId" element={<Subjects />} />
          <Route path="/topic/:topicId"      element={<TopicDetail />} />
          <Route path="/videos"    element={<VideoHub />} />
          <Route path="/quiz"      element={<Quiz />} />
          <Route path="/results"   element={<Results />} />
          <Route path="/progress"  element={<ProgressTracker />} />
          <Route path="/review"    element={<Review />} />
          <Route path="/clips"     element={<ClipsPage />} />
          <Route path="/school"    element={<SchoolProfile />} />
          <Route path="/studio"    element={<StudyStudio />} />
        </Routes>
      </Layout>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <FocusModeProvider>
        <AppContent />
      </FocusModeProvider>
    </BrowserRouter>
  )
}
