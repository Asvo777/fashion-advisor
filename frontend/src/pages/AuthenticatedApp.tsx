import { useEffect, useState, type SubmitEvent } from 'react'
import type { components } from '../api-types'
import type { User } from '@supabase/supabase-js'
import { signOut } from '../lib/auth'

type ClothingItem = components['schemas']['ClothingItem']
type ClothingItemCreate = components['schemas']['ClothingItemCreate']

function AuthenticatedApp(props: { user: User }) {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [error, setError] = useState<string | null>(null)
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
  const [user, setUser] = useState<User>(props.user)

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

  const handleSignOut = () => {
    signOut()
  }

  return (

    <main>
      <h1>My wardrobe</h1>

      {items.length === 0 ? (
        <p>No clothing items yet.</p>
      ) : (
        <ul>  
          {items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.category}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit}>
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(event) =>
            setForm({ ...form, name: event.target.value })
          }
        />

        <input
          required
          placeholder="Main color"
          value={form.main_color}
          onChange={(event) =>
            setForm({ ...form, main_color: event.target.value })
          }
        />

        <input
          placeholder="Pattern"
          value={form.pattern ?? ''}
          onChange={(event) =>
            setForm({
              ...form,
              pattern: event.target.value || null,
            })
          }
        />

        <select
          value={form.category}
          onChange={(event) =>
            setForm({
              ...form,
              category: event.target.value as ClothingItemCreate['category'],
            })
          }
        >
          <option value="HEAD">Head</option>
          <option value="INNER_TOP">Inner top</option>
          <option value="OUTER_TOP">Outer top</option>
          <option value="BOTTOM">Bottom</option>
          <option value="INNER_FEET">Inner feet</option>
          <option value="OUTER_FEET">Outer feet</option>
          <option value="SPECIAL_ITEM">Special item</option>
        </select>

        <select
          value={form.weather_bias}
          onChange={(event) =>
            setForm({
              ...form,
              weather_bias: event.target.value as ClothingItemCreate['weather_bias'],
            })
          }
        >
          <option value="ANY">Any weather</option>
          <option value="HOT">Hot</option>
          <option value="COLD">Cold</option>
        </select>

        <select
          value={form.size}
          onChange={(event) =>
            setForm({
              ...form,
              size: event.target.value as ClothingItemCreate['size'],
            })
          }
        >
          <option value="SLIM">Slim</option>
          <option value="SMALL">Small</option>
          <option value="PERFECT">Perfect</option>
          <option value="TALL">Tall</option>
          <option value="BAGGY">Baggy</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Add clothing item'}
        </button>
      </form>

      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>
    </main>
  )
}

export default AuthenticatedApp
