import { Navigate, Route, Routes } from 'react-router-dom'

import { OnboardingRoute, ProfileRoute, PublicOnlyRoute } from './components/RouteGuards'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import AuthenticatedApp from './pages/AuthenticatedApp'

function App() {
  const { user, profile, setProfile } = useAuth()

  return (
    <Routes>
      <Route
        path="/sign-in"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <OnboardingRoute>
            {user && (
              <ProfileSetupPage user={user} onComplete={setProfile} />
            )}
          </OnboardingRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProfileRoute>
            {profile && <AuthenticatedApp />}
          </ProfileRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App