import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

type RouteGuardProps = {
  children: ReactNode
}

export function PublicOnlyRoute({ children }: RouteGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

export function ProtectedRoute({ children }: RouteGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />
  }

  return children
}

export function ProfileRoute({ children }: RouteGuardProps) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />
  }

  if (!profile || profile.age === null || profile.gender === null || profile.body_type === null) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

export function OnboardingRoute({ children }: RouteGuardProps) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />
  }

  if (profile && profile.age !== null && profile.gender !== null && profile.body_type !== null) {
    return <Navigate to="/" replace />
  }

  return children
}
