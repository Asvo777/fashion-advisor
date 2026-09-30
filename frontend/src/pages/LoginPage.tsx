import { useEffect, useState, type SubmitEvent } from 'react'
import { register, signIn } from '../lib/auth'


function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
        {error && <p role="alert">{error}</p>}

        <h1>Sign In</h1>

        <form
          onSubmit={async (event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const email = formData.get('email') as string
            const password = formData.get('password') as string

            try {
              await signIn(email, password)
            } catch (error) {
              console.error(error)
              setError(error instanceof Error ? error.message : 'Failed to sign in')
            }
          }}
        >
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button type="submit">Sign In</button>
        </form>

        <h1>Register</h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const email = formData.get('email') as string
            const password = formData.get('password') as string

            try {
              await register(email, password)
              setError(null)
              alert('Registration successful! Please check your email to confirm your account.')
            } catch (error) {
              console.error(error)
              setError(error instanceof Error ? error.message : 'Failed to register')
            }
          }}
        >
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
  )
}

export default LoginPage
