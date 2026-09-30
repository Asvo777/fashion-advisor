import { useEffect, useState, type SubmitEvent } from 'react'
import type { components } from './api-types'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import AuthenticatedApp from './pages/AuthenticatedApp'
import LoginPage from './pages/LoginPage'

type ClothingItem = components['schemas']['ClothingItem']
type ClothingItemCreate = components['schemas']['ClothingItemCreate']


function App() {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ClothingItemCreate>({
    user_id: 'PUT_YOUR_USER_ID_HERE',
    category: 'INNER_TOP',
    name: '',
    main_color: '',
    pattern: null,
    weather_bias: 'ANY',
    size: 'PERFECT',
    is_available: true,
  })

  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/clothing-items')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load clothing items')
        }

        return response.json()
      })
      .then(setItems)
      .catch((error: Error) => setError(error.message))
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (error) {
    return <p>{error}</p>
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/clothing-items',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        },
      )

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const createdItem: ClothingItem = await response.json()

      setItems((currentItems) => [...currentItems, createdItem])

      setForm((currentForm) => ({
        ...currentForm,
        name: '',
        main_color: '',
        pattern: null,
      }))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not save item')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return <LoginPage />
  }
  return (
    <AuthenticatedApp user={user} />
  )
}

export default App
