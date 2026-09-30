import { useEffect, useState } from 'react'
import type { components } from './api-types'
import type { User } from '@supabase/supabase-js'
import { getAccessToken } from './lib/auth'
import { supabase } from './lib/supabase'
import AuthenticatedApp from './pages/AuthenticatedApp'
import LoginPage from './pages/LoginPage'
import ProfileSetupPage from './pages/ProfileSetupPage'

type UserProfile = components['schemas']['UserProfile']

function App() {
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [checkingProfile, setCheckingProfile] = useState(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setProfile(null)
    })

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error.message)
        return
      }

      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    async function loadProfile() {
      setCheckingProfile(true)

      try {
        const accessToken = await getAccessToken()
        const response = await fetch('http://127.0.0.1:8000/api/users', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(await response.text())
        }

        setProfile(await response.json())
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Could not load profile',
        )
      } finally {
        setCheckingProfile(false)
      }
    }

    loadProfile()
  }, [user])

  if (error) {
    return <p>{error}</p>
  }

  if (!user) {
    return <LoginPage />
  }

  if (checkingProfile || !profile) {
    return <p>Loading your profile...</p>
  }

  if (profile.age === null || profile.gender === null || profile.body_type === null) {
    return (
      <ProfileSetupPage
        user={user}
        onComplete={setProfile}
      />
    )
  }

  return (
    <AuthenticatedApp />
  )
}

export default App
