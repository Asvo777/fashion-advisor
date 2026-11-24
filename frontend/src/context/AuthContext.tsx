import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'

import type { components } from '../api-types'
import { getAccessToken } from '../lib/auth'
import { supabase } from '../lib/supabase'

type UserProfile = components['schemas']['UserProfile']

type AuthContextValue = {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  setProfile: (profile: UserProfile) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (!nextSession) {
        setProfile(null)
      }
    })

    supabase.auth.getSession().then(({ data: { session: nextSession } }) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setProfile(null)
      setLoading(false)
      return
    }

    let active = true

    async function loadProfile() {
      setLoading(true)

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

        if (active) {
          setProfile(await response.json())
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProfile().catch(() => {
      if (active) {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [session])

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        profile,
        loading,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
