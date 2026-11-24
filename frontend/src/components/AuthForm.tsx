import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { register, signIn } from '../lib/auth'

type AuthMode = 'signin' | 'register'

type AuthFormProps = {
  mode: AuthMode
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const isRegistering = mode === 'register'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)

    try {
      if (isRegistering) {
        const { session } = await register(email, password)
        setMessage(
          session
            ? 'Account created.'
            : 'Account created. Check your email to confirm your account.',
        )
      } else {
        await signIn(email, password)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <h1>{isRegistering ? 'Create your account' : 'Sign in'}</h1>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>

        {isRegistering && (
          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>
        )}

        <button type="submit" disabled={submitting}>
          {submitting
            ? 'Please wait...'
            : isRegistering
              ? 'Create account'
              : 'Sign in'}
        </button>
      </form>

      <p>
        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
        <Link to={isRegistering ? '/sign-in' : '/register'}>
          {isRegistering ? 'Sign in' : 'Register'}
        </Link>
      </p>
    </main>
  )
}
