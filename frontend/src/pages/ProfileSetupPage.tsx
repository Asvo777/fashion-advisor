import { useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'

import type { components } from '../api-types'
import { getAccessToken } from '../lib/auth'

type UserProfile = components['schemas']['UserProfile']
type Gender = components['schemas']['Gender']
type BodyType = components['schemas']['BodyType']

type ProfileSetupPageProps = {
  user: User
  onComplete: (profile: UserProfile) => void
}

function ProfileSetupPage({ user, onComplete }: ProfileSetupPageProps) {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [bodyType, setBodyType] = useState<BodyType | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!age || !gender || !bodyType) {
      setError('Please complete every required field')
      return
    }

    setSaving(true)

    try {
      const accessToken = await getAccessToken()
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${user.id}/profile`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            age: Number(age),
            gender,
            body_type: bodyType,
            location_id: null,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(await response.text())
      }

      onComplete(await response.json())
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main>
      <h1>Set up your profile</h1>
      <p>Signed in as {user.email}</p>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Age
          <input
            type="number"
            min={1}
            max={119}
            value={age}
            onChange={(event) => setAge(event.target.value)}
            required
          />
        </label>

        <label>
          Gender
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value as Gender | '')}
            required
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <label>
          Body type
          <select
            value={bodyType}
            onChange={(event) => setBodyType(event.target.value as BodyType | '')}
            required
          >
            <option value="">Select body type</option>
            <option value="RECTANGLE">Rectangle</option>
            <option value="INVERTED_TRIANGLE">Inverted triangle</option>
            <option value="PEAR">Pear</option>
            <option value="APPLE">Apple</option>
            <option value="HOURGLASS">Hourglass</option>
          </select>
        </label>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </main>
  )
}

export default ProfileSetupPage